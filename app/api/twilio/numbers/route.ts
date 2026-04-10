import { NextRequest, NextResponse } from 'next/server';
import { twilio } from '@/lib/twilio/client';

export async function POST(request: NextRequest) {
  try {
    const { areaCode } = await request.json();
    
    if (!areaCode || areaCode.length !== 3) {
      return NextResponse.json(
        { error: 'Valid 3-digit area code required' },
        { status: 400 }
      );
    }

    const result = await twilio.purchasePhoneNumber(areaCode);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      phoneNumber: result.phoneNumber,
      sid: result.sid,
      monthlyCost: result.monthlyCost,
      message: 'Phone number purchased successfully'
    });
  } catch (error: any) {
    console.error('Twilio number purchase error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to purchase phone number' },
      { status: 500 }
    );
  }
}