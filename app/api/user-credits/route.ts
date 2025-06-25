import { NextRequest, NextResponse } from 'next/server';

// Mock user credits data (in production, this would come from Supabase)
const userCredits = new Map([
  ['user_1', { used: 2, total: 3, subscription: 'free', lastReset: new Date().toDateString() }],
  ['user_2', { used: 45, total: -1, subscription: 'premium', lastReset: null }],
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_1'; // Default for demo

    const credits = userCredits.get(userId) || {
      used: 0,
      total: 3,
      subscription: 'free',
      lastReset: new Date().toDateString()
    };

    // Check if daily reset is needed for free users
    if (credits.subscription === 'free') {
      const today = new Date().toDateString();
      if (credits.lastReset !== today) {
        credits.used = 0;
        credits.lastReset = today;
        userCredits.set(userId, credits);
      }
    }

    return NextResponse.json({
      used: credits.used,
      total: credits.total,
      remaining: credits.total === -1 ? 'unlimited' : Math.max(0, credits.total - credits.used),
      subscription: credits.subscription,
      resetTime: credits.subscription === 'free' ? 'daily' : 'none'
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
    const currentUserId = userId || 'user_1';

    if (action === 'use_credit') {
      const credits = userCredits.get(currentUserId) || {
        used: 0,
        total: 3,
        subscription: 'free',
        lastReset: new Date().toDateString()
      };

      // Check if user has available credits
      if (credits.subscription === 'free' && credits.used >= credits.total) {
        return NextResponse.json(
          { error: 'Daily credit limit exceeded' },
          { status: 403 }
        );
      }

      // Increment used credits (except for unlimited premium users)
      if (credits.subscription !== 'premium') {
        credits.used += 1;
        userCredits.set(currentUserId, credits);
      }

      return NextResponse.json({
        success: true,
        used: credits.used,
        total: credits.total,
        remaining: credits.total === -1 ? 'unlimited' : Math.max(0, credits.total - credits.used)
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