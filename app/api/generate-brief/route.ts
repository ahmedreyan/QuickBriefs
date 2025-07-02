import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/system-prompts';

interface SummaryRequest {
  content: string;
  mode: 'business' | 'student' | 'code' | 'genZ';
  inputType: 'url' | 'youtube' | 'upload';
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { content, mode, inputType }: SummaryRequest = await request.json();

    // Validate input
    if (!content || !mode) {
      return NextResponse.json(
        { error: 'Content and mode are required' },
        { status: 400 }
      );
    }

    // Validate mode
    const validModes = ['business', 'student', 'code', 'genZ'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid summary mode' },
        { status: 400 }
      );
    }

    // Validate input type
    const validInputTypes = ['url', 'youtube', 'upload'];
    if (!validInputTypes.includes(inputType)) {
      return NextResponse.json(
        { error: 'Invalid input type' },
        { status: 400 }
      );
    }

    // Process content based on input type
    let processedContent = content;
    
    try {
      switch (inputType) {
        case 'url':
          // Validate URL format
          new URL(content);
          processedContent = await extractFromUrl(content);
          break;
        case 'youtube':
          processedContent = await extractFromYouTube(content);
          break;
        case 'upload':
          // Content is already text, just validate length
          if (content.length > 30000) {
            return NextResponse.json(
              { error: 'Content exceeds maximum length limit (30,000 characters)' },
              { status: 400 }
            );
          }
          processedContent = content;
          break;
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to process ${inputType}: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Generate summary using AI
    const summary = await generateSummary({
      content: processedContent,
      mode,
      inputType
    });

    // Log successful request
    console.log('Summary generated:', {
      mode,
      inputType,
      originalWords: summary.originalWordCount,
      summaryWords: summary.summaryWordCount,
      reduction: summary.reductionPercentage,
      processingTime: summary.processingTime
    });

    return NextResponse.json({
      success: true,
      summary: summary.summary,
      originalWordCount: summary.originalWordCount,
      summaryWordCount: summary.summaryWordCount,
      reductionPercentage: summary.reductionPercentage,
      mode: summary.mode,
      inputType,
      processingTime: summary.processingTime,
      timestamp: summary.timestamp,
      audience: getAudienceForMode(mode)
    });

  } catch (error) {
    console.error('Error generating brief:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = getErrorStatusCode(errorMessage);

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    );
  }
}

async function extractFromUrl(url: string): Promise<string> {
  try {
    // For demo purposes, we'll simulate content extraction
    // In production, you'd use a web scraping service
    return `This is extracted content from the URL: ${url}. 

In a real implementation, this would contain the actual article content scraped from the webpage. The content would include the main article text, headlines, and relevant information while filtering out navigation, ads, and other non-content elements.

For now, this is a placeholder that demonstrates the URL processing functionality. The AI will still generate a meaningful summary based on this simulated content extraction.

Key points that would typically be extracted:
- Article headline and subheadings
- Main body paragraphs
- Important quotes or statistics
- Author and publication information
- Publication date and source

This simulated content allows the summarization feature to work while the actual web scraping implementation is being developed.`;
  } catch (error) {
    throw new Error('Failed to extract content from URL. Please check the URL and try again.');
  }
}

async function extractFromYouTube(url: string): Promise<string> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL format');
    }

    // For demo purposes, simulate transcript extraction
    return `This is a simulated transcript from YouTube video: ${videoId}

In a real implementation, this would contain the actual video transcript obtained through the YouTube API or transcript extraction services.

Sample transcript content:
"Welcome to today's video where we'll be discussing important topics and sharing valuable insights. Throughout this presentation, we'll cover key concepts, practical applications, and real-world examples that you can apply immediately.

The main points we'll address include strategic thinking, implementation methodologies, and best practices for achieving optimal results. We'll also explore common challenges and provide actionable solutions.

By the end of this video, you'll have a comprehensive understanding of the subject matter and practical tools you can use in your own projects and initiatives."

This simulated transcript allows the AI to generate meaningful summaries while the actual YouTube API integration is being implemented.`;
  } catch (error) {
    throw new Error('Failed to extract YouTube transcript. Please check the URL and try again.');
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

async function generateSummary(request: {
  content: string;
  mode: string;
  inputType: string;
}) {
  const startTime = Date.now();

  try {
    const prompt = buildPrompt(request.content, request.mode);
    const aiResponse = await callGeminiAPI(prompt);
    const summary = parseAIResponse(aiResponse);

    // Calculate metrics
    const originalWordCount = countWords(request.content);
    const summaryWordCount = countWords(summary);
    const reductionPercentage = Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100);
    const processingTime = Date.now() - startTime;

    return {
      summary,
      originalWordCount,
      summaryWordCount,
      reductionPercentage,
      mode: request.mode,
      processingTime,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error(getErrorMessage(error));
  }
}

function buildPrompt(content: string, mode: string): string {
  const systemPrompt = getSystemPrompt(mode);
  return `${systemPrompt}\n\nContent to summarize:\n\n${content}`;
}

async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('AI service is not configured. Please contact support.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    // Fixed: Use gemini-1.5-flash for free tier instead of gemini-pro
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Increased for longer paragraph responses
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again with shorter content');
    }
    
    throw error;
  }
}

function parseAIResponse(response: GeminiResponse): string {
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('No response generated from AI service');
  }

  const text = response.candidates[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Empty response from AI service');
  }

  // Return the full text as paragraphs (no parsing needed for paragraph format)
  return text.trim();
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return 'AI service configuration error. Please contact support.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again with shorter content.';
    }
    if (error.message.includes('quota')) {
      return 'Service temporarily unavailable. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

function getAudienceForMode(mode: string): string {
  const audiences = {
    business: "business professionals",
    student: "students",
    code: "developers",
    genZ: "Gen Z"
  };
  
  return audiences[mode as keyof typeof audiences] || "general";
}

function getErrorStatusCode(errorMessage: string): number {
  if (errorMessage.includes('API key') || errorMessage.includes('configuration')) {
    return 500; // Server configuration error
  }
  if (errorMessage.includes('timeout')) {
    return 408; // Request timeout
  }
  if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
    return 429; // Too many requests
  }
  if (errorMessage.includes('too long') || errorMessage.includes('invalid')) {
    return 400; // Bad request
  }
  return 500; // Default server error
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