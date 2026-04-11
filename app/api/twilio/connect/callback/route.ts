import { NextRequest, NextResponse } from 'next/server';
import { twilioConnect } from '@/lib/twilio/connect';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json(
        { error: `Twilio Connect failed: ${error}` },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    const connectToken = await twilioConnect.exchangeCodeForToken(code);

    // Here you would typically:
    // 1. Store the token securely (encrypted in database)
    // 2. Associate it with the user's session/account
    // 3. Set up any necessary session state

    return NextResponse.json({
      success: true,
      message: 'Twilio account connected successfully',
      accountSid: connectToken.accountSid,
      expiresAt: connectToken.expiresAt,
      scopes: connectToken.scopes,
      // In production, don't return the auth token to client
      // authToken: connectToken.authToken
    });

  } catch (error: any) {
    console.error('Twilio Connect callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process Twilio Connect callback' },
      { status: 500 }
    );
  }
}