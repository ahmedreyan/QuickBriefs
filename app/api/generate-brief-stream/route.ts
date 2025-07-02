import { NextRequest } from 'next/server';

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
  try {
    const { content, mode, inputType }: SummaryRequest = await request.json();

    // Validate input
    if (!content || !mode) {
      return new Response(
        JSON.stringify({ error: 'Content and mode are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate mode
    const validModes = ['business', 'student', 'code', 'genZ'];
    if (!validModes.includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid summary mode' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate input type
    const validInputTypes = ['url', 'youtube', 'upload'];
    if (!validInputTypes.includes(inputType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input type' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Process content based on input type
    let processedContent = content;
    
    try {
      switch (inputType) {
        case 'url':
          new URL(content);
          processedContent = await extractFromUrl(content);
          break;
        case 'youtube':
          processedContent = await extractFromYouTube(content);
          break;
        case 'upload':
          if (content.length > 30000) {
            return new Response(
              JSON.stringify({ error: 'Content exceeds maximum length limit (30,000 characters)' }),
              { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
          processedContent = content;
          break;
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: `Failed to process ${inputType}: ${error instanceof Error ? error.message : 'Unknown error'}` }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial status
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Processing content...' 
          })}\n\n`));

          // Generate summary
          const summary = await generateSummary({
            content: processedContent,
            mode,
            inputType
          });

          // Stream TL;DR with typing effect
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'tldr_start',
            message: 'Generating summary...'
          })}\n\n`));

          await streamText(controller, encoder, summary.tldr, 'tldr');

          // Stream key points
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'keypoints_start',
            message: 'Extracting key points...'
          })}\n\n`));

          for (let i = 0; i < summary.keyPoints.length; i++) {
            await streamText(controller, encoder, summary.keyPoints[i], 'keypoint', i);
          }

          // Send final metadata
          const originalWordCount = countWords(processedContent);
          const summaryWordCount = countWords(summary.tldr + ' ' + summary.keyPoints.join(' '));
          const reductionPercentage = Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100);

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete',
            metadata: {
              originalWordCount,
              summaryWordCount,
              reductionPercentage,
              mode,
              inputType,
              timestamp: new Date().toISOString(),
              audience: getAudienceForMode(mode)
            }
          })}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error',
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error in streaming endpoint:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function streamText(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  text: string,
  type: 'tldr' | 'keypoint',
  index?: number
) {
  const words = text.split(' ');
  let currentText = '';
  
  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i];
    
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
      type: type === 'tldr' ? 'tldr_chunk' : 'keypoint_chunk',
      text: currentText,
      index: index,
      isComplete: i === words.length - 1
    })}\n\n`));
    
    // Add delay for typing effect (faster for better UX)
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

async function extractFromUrl(url: string): Promise<string> {
  try {
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
  try {
    const prompt = buildPrompt(request.content, request.mode);
    const aiResponse = await callGeminiAPI(prompt);
    const summary = parseAIResponse(aiResponse);

    return {
      tldr: summary.tldr,
      keyPoints: summary.keyPoints,
      mode: request.mode
    };
  } catch (error) {
    console.error('AI API Error:', error);
    throw new Error(getErrorMessage(error));
  }
}

function buildPrompt(content: string, mode: string): string {
  const prompts = {
    business: `You are a sharp business analyst. Analyze the following content and provide a summary in this EXACT format:

**TL;DR:** [2-3 sentence paragraph with key business insights, strategic implications, and actionable takeaways]

**Key Points:**
• [Strategic insight or market opportunity]
• [Actionable recommendation with business impact]
• [Financial/operational implication]
• [Risk assessment or competitive advantage]
• [Implementation priority or next steps]

Focus on: ROI, market positioning, competitive advantages, strategic decisions, and business value. Be direct, data-driven, and executive-ready.`,

    student: `You are a friendly study buddy. Break down the following content into an easy-to-understand summary in this EXACT format:

**TL;DR:** [2-3 sentences explaining the main concept in simple, clear language that's perfect for studying]

**Key Points:**
• [Main concept explained simply]
• [Important fact or principle to remember]
• [Practical application or example]
• [Connection to broader topic or field]
• [Study tip or memory aid]

Focus on: core concepts, learning objectives, practical examples, and study-friendly explanations.`,

    code: `You are a patient coding mentor. Explain the following technical content in this EXACT format:

**TL;DR:** [2-3 sentences explaining what the code/concept does in plain English, focusing on the "why" and "how"]

**Key Points:**
• [What this code/concept actually does]
• [How it works (simplified explanation)]
• [When and why you'd use it]
• [Common gotchas or important details]
• [Best practices or next steps]

Focus on: practical understanding, real-world applications, simplified explanations, and actionable insights.`,

    genZ: `You're the coolest tech friend who explains things without being cringe. Break down this content in this EXACT format:

**TL;DR:** [2-3 sentences that hit different - explain the main vibe in a way that actually makes sense, no cap]

**Key Points:**
• [Main point that actually slaps]
• [Something that's lowkey important to know]
• [Real talk about why this matters]
• [The tea on how to use this info]
• [Final thoughts that are chef's kiss]

Focus on: being real, practical value, current vibes, and making complex stuff actually understandable. Keep it authentic but informative.`
  };

  const basePrompt = prompts[mode as keyof typeof prompts] || prompts.business;
  return `${basePrompt}\n\nContent to summarize:\n\n${content}`;
}

async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('AI service is not configured. Please contact support.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
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
          maxOutputTokens: 1024,
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

function parseAIResponse(response: GeminiResponse): { tldr: string; keyPoints: string[] } {
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('No response generated from AI service');
  }

  const text = response.candidates[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Empty response from AI service');
  }

  // Parse the structured response
  const tldrMatch = text.match(/\*\*TL;DR:\*\*\s*(.*?)(?=\*\*Key Points:\*\*)/s);
  const keyPointsMatch = text.match(/\*\*Key Points:\*\*\s*(.*?)$/s);

  if (!tldrMatch || !keyPointsMatch) {
    return fallbackParsing(text);
  }

  const tldr = tldrMatch[1].trim();
  const keyPointsText = keyPointsMatch[1].trim();
  
  const keyPoints = keyPointsText
    .split(/[•\-\*]\s*/)
    .filter(point => point.trim().length > 0)
    .map(point => point.trim())
    .slice(0, 5);

  return {
    tldr: tldr || 'Summary generated successfully.',
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Key insights extracted from content.']
  };
}

function fallbackParsing(text: string): { tldr: string; keyPoints: string[] } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const tldr = sentences.slice(0, 2).join('. ').trim() + '.';
  
  const bulletPoints = text.match(/[•\-\*\d+\.]\s*[^\n•\-\*\d+\.]+/g) || [];
  const keyPoints = bulletPoints
    .map(point => point.replace(/^[•\-\*\d+\.]\s*/, '').trim())
    .filter(point => point.length > 10)
    .slice(0, 5);

  return {
    tldr: tldr || 'Content summarized successfully.',
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Key insights extracted from the provided content.']
  };
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

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}