import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { tokens } = await request.json();
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'No tokens provided' },
        { status: 400 }
      );
    }

    // Create OAuth2 client with the provided tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials(tokens);

    // Create calendar client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    console.log('Successfully fetched', events.length, 'events from Google Calendar');
    return NextResponse.json(events);
    
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}