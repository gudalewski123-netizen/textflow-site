import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { ClientAccount } from '@/lib/database.types';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user exists in auth.users
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(
      body.userId
    );

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if client account already exists
    const { data: existingAccount } = await supabase
      .from('client_accounts')
      .select('id')
      .eq('id', body.userId)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Client account already exists' },
        { status: 409 }
      );
    }

    // Create client account with default values
    const clientData: Partial<ClientAccount> = {
      id: body.userId,
      company_name: body.companyName || '',
      timezone: body.timezone || 'UTC',
      balance: 0.00,
      currency: 'USD',
      billing_status: 'active'
    };

    const { data: newAccount, error: insertError } = await supabase
      .from('client_accounts')
      .insert([clientData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating client account:', insertError);
      return NextResponse.json(
        { error: 'Failed to create client account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Client account created successfully',
      data: newAccount
    });

  } catch (error: any) {
    console.error('Unexpected error in create client account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    // Get client account
    const { data: account, error } = await supabase
      .from('client_accounts')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Client account not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching client account:', error);
      return NextResponse.json(
        { error: 'Failed to fetch client account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: account
    });

  } catch (error: any) {
    console.error('Unexpected error in get client account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}