import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature (placeholder - you'll need your actual webhook secret)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.log('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log('Received Razorpay webhook:', event.event);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log('Payment captured:', payment.id);
  
  // Here you would:
  // 1. Update user credits in Supabase
  // 2. Send confirmation email
  // 3. Update analytics
  
  // Example structure:
  // const { user_id } = payment.notes;
  // await supabase
  //   .from('user_credits')
  //   .update({ 
  //     credits_purchased: credits_purchased + payment.amount / 50, // $0.50 per credit
  //     subscription_status: 'active'
  //   })
  //   .eq('user_id', user_id);
}

async function handleSubscriptionActivated(subscription: any) {
  console.log('Subscription activated:', subscription.id);
  
  // Here you would:
  // 1. Update user subscription status in Supabase
  // 2. Grant unlimited access
  // 3. Send welcome email
  
  // Example structure:
  // const { user_id } = subscription.notes;
  // await supabase
  //   .from('user_credits')
  //   .update({ 
  //     subscription_status: 'premium',
  //     subscription_id: subscription.id
  //   })
  //   .eq('user_id', user_id);
}

async function handleSubscriptionCancelled(subscription: any) {
  console.log('Subscription cancelled:', subscription.id);
  
  // Here you would:
  // 1. Update user subscription status
  // 2. Set end date for access
  // 3. Send cancellation confirmation
  
  // Example structure:
  // await supabase
  //   .from('user_credits')
  //   .update({ 
  //     subscription_status: 'cancelled',
  //     subscription_end_date: new Date(subscription.current_end * 1000)
  //   })
  //   .eq('subscription_id', subscription.id);
}

// Handle CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-razorpay-signature',
    },
  });
}