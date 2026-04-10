import { NextRequest, NextResponse } from 'next/server';
import { twilio } from '@/lib/twilio/client';

export async function POST(request: NextRequest) {
  try {
    const { to, body } = await request.json();
    
    if (!to || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, body' },
        { status: 400 }
      );
    }

    const result = await twilio.sendSMS({ to, body });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageSid: result.messageSid,
      price: result.price,
      message: 'SMS sent successfully'
    });
  } catch (error: any) {
    console.error('Twilio SMS API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}