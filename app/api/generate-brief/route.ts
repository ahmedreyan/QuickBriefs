import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';

interface SummaryRequest {
  content: string;
  mode: 'business' | 'student' | 'code' | 'genZ';
  inputType: 'url' | 'youtube' | 'upload';
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
          processedContent = await GeminiService.extractFromUrl(content);
          break;
        case 'youtube':
          processedContent = await GeminiService.extractFromYouTube(content);
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

    // Generate summary using Gemini
    const summary = await GeminiService.generateSummary({
      content: processedContent,
      mode,
      inputType
    });

    // Log successful request (in production, use proper logging service)
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
      summary: summary.tldr,
      keyPoints: summary.keyPoints,
      tldr: summary.tldr,
      originalWordCount: summary.originalWordCount,
      summaryWordCount: summary.summaryWordCount,
      reductionPercentage: summary.reductionPercentage,
      mode: summary.mode,
      inputType,
      processingTime: summary.processingTime,
      timestamp: summary.timestamp,
      audience: this.getAudienceForMode(mode)
    });

  } catch (error) {
    console.error('Error generating brief:', error);
    
    // Return appropriate error message
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = this.getErrorStatusCode(errorMessage);

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    );
  }
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