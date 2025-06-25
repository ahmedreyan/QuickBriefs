import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';
import pdf from 'pdf-parse';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface SummaryRequest {
  content: string;
  mode: 'business' | 'student' | 'genZ';
  inputType: 'url' | 'youtube' | 'upload';
}

interface SummaryResponse {
  summary: string;
  mode: string;
  inputType: string;
  wordCount: number;
  timestamp: string;
  audience: string;
  processingTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get user from Supabase auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content, mode, inputType }: SummaryRequest = await request.json();

    // Validate input
    if (!content || !mode) {
      return NextResponse.json(
        { error: 'Content and mode are required' },
        { status: 400 }
      );
    }

    // Validate mode
    const validModes = ['business', 'student', 'genZ'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid summary mode' },
        { status: 400 }
      );
    }

    // Process content based on input type
    let processedContent = content;
    let originalUrl = '';
    
    try {
      if (inputType === 'url') {
        processedContent = await processUrlContent(content);
        originalUrl = content;
      } else if (inputType === 'youtube') {
        processedContent = await processYouTubeContent(content);
        originalUrl = content;
      } else if (inputType === 'upload') {
        processedContent = await processUploadContent(content);
      }
    } catch (error) {
      console.error('Content processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process content' },
        { status: 400 }
      );
    }

    // Content length validation
    if (processedContent.length > 50000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length limit' },
        { status: 400 }
      );
    }

    // Build prompt based on mode
    const prompt = buildPrompt(processedContent, mode);

    // Generate summary using OpenAI
    const summary = await generateSummaryWithOpenAI(prompt);
    
    const processingTime = Date.now() - startTime;
    const wordCount = summary.split(' ').length;
    const timestamp = new Date().toISOString();

    // Save to Supabase
    try {
      await supabase.from('briefs').insert([
        {
          user_id: user.id,
          input_url: originalUrl || null,
          input_type: inputType,
          summary_mode: mode,
          summary_text: summary,
          word_count: wordCount,
          processing_time: processingTime,
          created_at: timestamp
        }
      ]);
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails - user still gets their summary
    }

    const response: SummaryResponse = {
      summary,
      mode,
      inputType,
      wordCount,
      timestamp,
      audience: getAudienceForMode(mode),
      processingTime
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style, nav, header, footer, aside').remove();
    
    // Try to find main content
    let content = '';
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      'main',
      '.article-body'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim();
        break;
      }
    }
    
    // Fallback to body if no main content found
    if (!content) {
      content = $('body').text().trim();
    }
    
    // Clean up the text
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    if (content.length < 100) {
      throw new Error('Could not extract sufficient content from URL');
    }
    
    return content;
  } catch (error) {
    throw new Error(`Failed to process URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processYouTubeContent(url: string): Promise<string> {
  try {
    // Extract video ID from URL
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Get transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript available for this video');
    }
    
    // Combine transcript text
    const content = transcript
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (content.length < 100) {
      throw new Error('Transcript too short to summarize');
    }
    
    return content;
  } catch (error) {
    throw new Error(`Failed to process YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processUploadContent(content: string): Promise<string> {
  try {
    // Check if content looks like base64 PDF
    if (content.startsWith('data:application/pdf;base64,')) {
      const base64Data = content.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const data = await pdf(buffer);
      return data.text.trim();
    }
    
    // Otherwise treat as plain text
    return content.trim();
  } catch (error) {
    throw new Error(`Failed to process upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function buildPrompt(content: string, mode: string): string {
  const prompts = {
    business: `Analyze this content from a business perspective and create a focused summary. Highlight key strategic insights, market implications, and actionable takeaways. Focus on business value, ROI considerations, and practical applications. Deliver insights in a professional, executive-summary style. Keep it concise and under 250 words.

Content to analyze:
${content}`,

    student: `Break down this content into clear, educational points perfect for studying. Focus on core concepts, key learnings, and academic relevance. Present information in a structured, easy-to-understand format ideal for study and retention. Include main ideas, important facts, and learning objectives. Keep it under 250 words.

Content to summarize:
${content}`,

    genZ: `Give me a Gen Z-style TLDR of this content. Use current slang, casual tone, and relatable examples. Keep it real, engaging, and straight to the point. Make complex ideas accessible without losing key information. No cap, make it actually useful and not cringe. Keep it under 250 words.

Content to break down:
${content}`
  };

  return prompts[mode as keyof typeof prompts];
}

async function generateSummaryWithOpenAI(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content?.trim();
    
    if (!summary) {
      throw new Error('No summary generated');
    }

    return summary;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate summary with AI');
  }
}

function getAudienceForMode(mode: string): string {
  const audiences = {
    business: "business professionals",
    student: "students",
    genZ: "Gen Z"
  };
  
  return audiences[mode as keyof typeof audiences] || "general";
}

// Handle CORS for future frontend integrations
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}