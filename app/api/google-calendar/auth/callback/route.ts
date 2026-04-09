import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Callback endpoint called');
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=auth_failed', request.url));
    }
    
    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/calendar?error=no_code', request.url));
    }

    console.log('Client configured, exchanging code for tokens...');
    console.log('Client ID present:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('Client secret present:', !!process.env.GOOGLE_CLIENT_SECRET);

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://textflow-dashboard.vercel.app/api/google-calendar/auth/callback'
    );

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', Object.keys(tokens));
    
    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=no_user', request.url));
    }
    
    // Save tokens to google_calendar_tokens table
    const { error: dbError } = await supabase
      .from('google_calendar_tokens')
      .upsert({
        user_id: user.id,
        tokens: tokens,
        updated_at: new Date().toISOString()
      });
    
    if (dbError) {
      console.error('Failed to save tokens:', dbError);
      return NextResponse.redirect(new URL('/dashboard/calendar?error=db_failed', request.url));
    }
    
    // We have the tokens! That's what matters for calendar access
    console.log('Google Calendar connected successfully! Tokens saved for user:', user.id);
    
    // Redirect to calendar page with success
    return NextResponse.redirect(new URL('/dashboard/calendar?success=connected', request.url));

  } catch (error) {
    console.error('Google Calendar callback error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.redirect(new URL('/dashboard/calendar?error=callback_failed', request.url));
  }
}