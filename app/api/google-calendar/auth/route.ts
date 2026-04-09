import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'https://textflow-dashboard.vercel.app/api/google-calendar/auth/callback';
    
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID not configured');
    }

    // Manually construct OAuth URL to ensure exact parameters
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    console.log('Generated OAuth URL:', authUrl.toString());
    
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('Google Calendar auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google Calendar OAuth' },
      { status: 500 }
    );
  }
}