import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from('client_accounts')
      .select('*')
      .eq('id', userId)
      .single();

    if (clientError && clientError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching client account:', clientError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // If client doesn't exist, create one
    if (!client) {
      const { data: newClient, error: createError } = await supabase
        .from('client_accounts')
        .insert([{
          id: userId,
          balance: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating client account:', createError);
        return NextResponse.json(
          { error: 'Failed to create client account' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...newClient,
          smsCredits: Math.floor(newClient.balance / 0.0189), // $0.0189 per SMS
          smsRate: 0.0189
        }
      });
    }

    // Return existing client
    return NextResponse.json({
      success: true,
      data: {
        ...client,
        smsCredits: Math.floor(client.balance / 0.0189), // $0.0189 per SMS
        smsRate: 0.0189
      }
    });

  } catch (error: any) {
    console.error('Unexpected error in client account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}