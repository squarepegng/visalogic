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
      
      // Paystack stores our passed metadata inside custom_fields or directly on metadata depending on initialization structure.
      // We check both places to safely extract the userId.
      let userId = event.data.metadata?.userId;
      if (!userId && event.data.metadata?.custom_fields) {
         const userField = event.data.metadata.custom_fields.find((f: any) => f.variable_name === 'userid' || f.variable_name === 'userId');
         if (userField) userId = userField.value;
      }
      
      if (!userId) {
        console.error('No userId found in Paystack metadata for email:', email);
        console.log('Raw metadata:', JSON.stringify(event.data.metadata));
        // Fallback: If metadata is totally missing, try finding the user by email via Auth Admin (Legacy Support)
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const user = users.find(u => u.email === email);
        if (user) {
           userId = user.id;
        } else {
           return NextResponse.json({ error: 'Missing userId in metadata and email not found' }, { status: 400 });
        }
      }

      // Upsert the user's profile
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: userId,
          stripe_subscription_status: 'active',
          stripe_customer_id: customerCode
        }, { onConflict: 'id' });
        
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
