import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    if (!message) {
      return NextResponse.json({ error: 'Message content is required. Please check your settings.' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      return NextResponse.json({ error: 'Twilio setup incomplete on server.' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const twilioMsg = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    return NextResponse.json({ success: true, messageId: twilioMsg.sid });
  } catch (error: any) {
    console.error("Twilio Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
