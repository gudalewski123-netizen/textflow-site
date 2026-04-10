import { NextRequest, NextResponse } from 'next/server';
import { twilio } from '@/lib/twilio/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountSid = searchParams.get('accountSid');
    
    if (!accountSid) {
      return NextResponse.json(
        { error: 'Missing accountSid parameter' },
        { status: 400 }
      );
    }

    const balance = await twilio.checkBalance(accountSid);
    
    if (!balance || 'error' in balance) {
      return NextResponse.json(
        { error: balance?.error || 'Failed to check balance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: balance.balance,
      currency: balance.currency,
      accountType: balance.accountType,
      status: balance.status,
      message: 'Balance fetched successfully'
    });
  } catch (error: any) {
    console.error('Twilio balance check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check balance' },
      { status: 500 }
    );
  }
}