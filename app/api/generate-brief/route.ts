import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/system-prompts';
import { ContentExtractor } from '@/lib/content-extractor';

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
    let sourceInfo = '';
    
    try {
      switch (inputType) {
        case 'url':
          // Validate URL format
          if (!ContentExtractor.validateUrl(content)) {
            throw new Error('Please enter a valid URL (e.g., https://example.com/article)');
          }
          
          sourceInfo = `Source: ${ContentExtractor.getDomainFromUrl(content)}`;
          processedContent = await ContentExtractor.extractFromUrl(content);
          break;
          
        case 'youtube':
          if (!ContentExtractor.isYouTubeUrl(content)) {
            throw new Error('Please enter a valid YouTube URL');
          }
          
          sourceInfo = 'Source: YouTube Video';
          processedContent = await ContentExtractor.extractFromYouTube(content);
          break;
          
        case 'upload':
          // Content is already text, just validate length
          if (content.length > 30000) {
            return NextResponse.json(
              { error: 'Content exceeds maximum length limit (30,000 characters)' },
              { status: 400 }
            );
          }
          
          if (content.length < 100) {
            return NextResponse.json(
              { error: 'Content too short. Please provide at least 100 characters for meaningful summarization.' },
              { status: 400 }
            );
          }
          
          sourceInfo = 'Source: Direct Input';
          processedContent = content;
          break;
      }
    } catch (error) {
      console.error(`Error processing ${inputType}:`, error);
      return NextResponse.json(
        { error: `Failed to process ${inputType}: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Validate processed content
    if (!processedContent || processedContent.trim().length < 50) {
      return NextResponse.json(
        { error: 'Insufficient content extracted. Please try a different source or check if the content is accessible.' },
        { status: 400 }
      );
    }

    // Generate summary using AI
    const summary = await generateSummary({
      content: processedContent,
      mode,
      inputType,
      sourceInfo
    });

    // Log successful request
    console.log('Summary generated:', {
      mode,
      inputType,
      originalWords: summary.originalWordCount,
      summaryWords: summary.summaryWordCount,
      reduction: summary.reductionPercentage,
      processingTime: summary.processingTime,
      source: sourceInfo
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
      audience: getAudienceForMode(mode),
      sourceInfo
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

async function generateSummary(request: {
  content: string;
  mode: string;
  inputType: string;
  sourceInfo: string;
}) {
  const startTime = Date.now();

  try {
    const prompt = buildPrompt(request.content, request.mode, request.sourceInfo);
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

function buildPrompt(content: string, mode: string, sourceInfo: string): string {
  const systemPrompt = getSystemPrompt(mode);
  return `${systemPrompt}\n\n${sourceInfo}\n\nContent to summarize:\n\n${content}`;
}

async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('AI service is not configured. Please contact support.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    // Use gemini-1.5-flash for free tier
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