import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Content length validation
    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content exceeds maximum length limit' },
        { status: 400 }
      );
    }

    // Generate mock summary (replace with actual AI service)
    const summary = generateMockSummary(mode);
    
    const processingTime = Date.now() - startTime;
    const wordCount = summary.split(' ').length;
    const timestamp = new Date().toISOString();

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

function generateMockSummary(mode: string): string {
  const mockSummaries = {
    business: "This comprehensive business analysis reveals significant market opportunities with projected 35% revenue growth potential. Key strategic advantages include advanced AI integration, scalable infrastructure, and competitive positioning. Critical success factors encompass team development, technology optimization, and customer acquisition strategies. Risk mitigation involves diversified approaches and phased implementation. Investment requirements total $50K with 6-month ROI timeline. Market analysis indicates substantial gap opportunities. Recommendation: proceed with pilot program validation before full deployment. Expected outcomes include enhanced operational efficiency, reduced costs, and improved customer satisfaction driving sustainable competitive advantage.",
    student: "The fundamental concepts center on systematic learning methodologies and knowledge retention strategies. Primary principles include active recall techniques, spaced repetition systems, and interleaved practice approaches. Research demonstrates distributed practice sessions enhance long-term memory consolidation by 40%. Essential techniques involve mental model construction, connecting new information to existing knowledge frameworks, and regular self-assessment protocols. Study methodology emphasizes comprehension over memorization, with practical applications in academic environments. Evidence supports multi-modal learning for enhanced understanding. Students should implement strategies gradually, prioritizing consistency over intensity for optimal results and sustainable academic improvement.",
    genZ: "Okay so this content is actually pretty fire and breaks down some complex stuff in a way that makes sense. The main points hit different because they're actually practical and not just theoretical nonsense. Key insights are giving major value - we're talking about real strategies that actually work in the real world, not just textbook theory. The approach is lowkey genius because it focuses on what matters most and cuts through all the fluff. No cap, this is the kind of content that actually helps you level up your game. The practical applications are chef's kiss because they're immediately actionable and don't require a PhD to understand."
  };
  
  return mockSummaries[mode as keyof typeof mockSummaries] || mockSummaries.business;
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