import { NextRequest, NextResponse } from 'next/server';

// Since the service is now completely free, this endpoint returns unlimited usage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';

    // Return unlimited usage for all users since the service is free
    return NextResponse.json({
      used: 0,
      total: -1, // -1 indicates unlimited
      remaining: 'unlimited',
      subscription: 'free',
      resetTime: 'none',
      message: 'QuickBriefs.ai is completely free with unlimited usage!'
    });

  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (action === 'use_credit') {
      // Since the service is free, always allow usage
      return NextResponse.json({
        success: true,
        used: 0,
        total: -1,
        remaining: 'unlimited',
        message: 'Summary generated successfully! QuickBriefs.ai is free to use.'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating user credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}