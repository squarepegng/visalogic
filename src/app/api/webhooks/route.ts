import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder' // Initialize inside the handler to prevent build crashes!
    );

    const text = await req.text();
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(text).digest('hex');
    
    if (hash !== req.headers.get('x-paystack-signature')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(text);

    // When a subscription is successfully charged
    if (event.event === 'charge.success') {
      const email = event.data.customer.email;
      const customerCode = event.data.customer.customer_code;
      const userId = event.data.metadata?.userId;
      
      if (!userId) {
        console.error('No userId found in Paystack metadata for email:', email);
        return NextResponse.json({ error: 'Missing userId in metadata' }, { status: 400 });
      }

      // Upsert the user's profile: If they don't have a profile row yet, this creates it and sets them to active!
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: userId,
          stripe_subscription_status: 'active',
          stripe_customer_id: customerCode,
          google_review_link: null
        });
        
      if (error) {
        console.error('Supabase upsert error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      
      console.log(`Successfully unlocked dashboard for: ${email} (ID: ${userId})`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
