import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Paystack Initialize Transaction API
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: 2900 * 100, // $29 (or NGN equivalent, Paystack takes lowest denomination)
        // plan: "PLN_xxxxx" // In the future, we will attach a specific subscription plan code here
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visalogic-flax.vercel.app'}/dashboard?success=true`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error) {
    return NextResponse.json({ error: 'Error initializing Paystack checkout' }, { status: 500 });
  }
}
