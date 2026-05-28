import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // We need this to bypass RLS and update the user
);

export async function POST(req: Request) {
  try {
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
      
      // Update the user's profile in Supabase to unlock the dashboard
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
          stripe_subscription_status: 'active', // Re-using this column name for simplicity
          stripe_customer_id: customerCode
        })
        .eq('email', email);
        
      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      
      console.log('Successfully unlocked dashboard for:', email);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
