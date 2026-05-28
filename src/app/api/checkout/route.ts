     1|import { NextResponse } from 'next/server';
     2|import Stripe from 'stripe';
     3|
     4|const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     5|  apiVersion: '2026-05-27.dahlia',
     6|});
     7|
     8|export async function POST(req: Request) {
     9|  try {
    10|    const { email, userId } = await req.json();
    11|
    12|    if (!email || !userId) {
    13|      return NextResponse.json({ error: 'User data required' }, { status: 400 });
    14|    }
    15|
    16|    const session = await stripe.checkout.sessions.create({
    17|      payment_method_types: ['card'],
    18|      line_items: [
    19|        {
    20|          price_data: {
    21|            currency: 'usd',
    22|            product_data: {
    23|              name: 'ReviewMantis Pro',
    24|              description: 'Unlimited automated Google Review requests via SMS',
    25|            },
    26|            unit_amount: 2900, // $29.00
    27|            recurring: {
    28|              interval: 'month',
    29|            },
    30|          },
    31|          quantity: 1,
    32|        },
    33|      ],
    34|      mode: 'subscription',
    35|      success_url: `https://visalogic-flax.vercel.app/dashboard?paid=true`,
    36|      cancel_url: `https://visalogic-flax.vercel.app/dashboard?canceled=true`,
    37|      customer_email: email,
    38|      client_reference_id: userId,
    39|    });
    40|
    41|    return NextResponse.json({ url: session.url });
    42|  } catch (error: any) {
    43|    console.error("Stripe Checkout Error:", error);
    44|    return NextResponse.json({ error: error.message }, { status: 500 });
    45|  }
    46|}
    47|