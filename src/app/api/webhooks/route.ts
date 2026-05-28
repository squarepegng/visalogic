import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(text).digest('hex');
    
    if (hash !== req.headers.get('x-paystack-signature')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(text);

    if (event.event === 'charge.success') {
      // Here we will update Supabase to unlock the user's dashboard!
      console.log('Payment successful for:', event.data.customer.email);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
