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
        plan: "PLN_gacsnk3x4ak6mzr", // Auto-generated Paystack Plan (ReviewMantis Pro)
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visalogic-flax.vercel.app'}/dashboard?success=true`,
        metadata: {
          custom_fields: [
            {
              display_name: "Action",
              variable_name: "action",
              value: "subscription_payment"
            }
          ]
        }
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
