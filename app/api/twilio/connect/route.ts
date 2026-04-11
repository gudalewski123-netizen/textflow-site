import { NextRequest, NextResponse } from 'next/server';
import { twilioConnect } from '@/lib/twilio/connect';

export async function GET(request: NextRequest) {
  try {
    if (!twilioConnect.isConfigured()) {
      return NextResponse.json(
        { error: 'Twilio Connect is not configured. Set TWILIO_CONNECT_CLIENT_ID and TWILIO_CONNECT_CLIENT_SECRET.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    const authUrl = twilioConnect.getAuthorizationUrl(state || undefined);
    
    return NextResponse.json({
      success: true,
      authorizationUrl: authUrl,
      configured: true,
      message: 'Redirect user to this URL to connect their Twilio account'
    });

  } catch (error: any) {
    console.error('Twilio Connect authorization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}