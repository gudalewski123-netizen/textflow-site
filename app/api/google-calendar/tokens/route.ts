import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Create supabase client with service role (bypasses RLS)
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('google_calendar_tokens')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching tokens:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tokens' },
        { status: 500 }
      );
    }

    if (!profile?.google_calendar_tokens) {
      return NextResponse.json(
        { error: 'No calendar tokens found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ tokens: profile.google_calendar_tokens });
    
  } catch (error) {
    console.error('Error in tokens endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}