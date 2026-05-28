import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // We pull these from Vercel Environment Variables for security
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      return NextResponse.json({ error: 'Twilio setup incomplete on server.' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: "Thanks for choosing us! We'd love if you could leave a quick 5-star review here: https://g.page/r/example/review",
      from: twilioPhone,
      to: phoneNumber,
    });

    return NextResponse.json({ success: true, messageId: message.sid });
  } catch (error: any) {
    console.error("Twilio Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
