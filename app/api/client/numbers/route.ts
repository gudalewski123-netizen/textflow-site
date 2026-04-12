import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

// GET: List client's phone numbers
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

    // Get client's phone numbers
    const { data: numbers, error } = await supabase
      .from('client_phone_numbers')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client numbers:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: numbers || []
    });

  } catch (error: any) {
    console.error('Unexpected error in client numbers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Purchase a new phone number for client
export async function POST(request: NextRequest) {
  try {
    const { userId, areaCode } = await request.json();
    
    if (!userId || !areaCode) {
      return NextResponse.json(
        { error: 'userId and areaCode are required' },
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

    // Check client exists
    const { data: client, error: clientError } = await supabase
      .from('client_accounts')
      .select('id, balance')
      .eq('id', userId)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client account not found' },
        { status: 404 }
      );
    }

    // Check if client has enough balance for number purchase ($1/month)
    if (client.balance < 1.00) {
      return NextResponse.json(
        { error: 'Insufficient balance. Minimum $1.00 required for phone number purchase.' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Twilio API to purchase number
    // For now, simulate purchase
    const mockPhoneNumber = `+1${areaCode}555${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Deduct $1 from balance for phone number
    const newBalance = client.balance - 1.00;
    
    const { error: updateError } = await supabase
      .from('client_accounts')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', client.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return NextResponse.json(
        { error: 'Failed to deduct balance' },
        { status: 500 }
      );
    }

    // Add phone number to client
    const { data: newNumber, error: numberError } = await supabase
      .from('client_phone_numbers')
      .insert([{
        client_id: client.id,
        phone_number: mockPhoneNumber,
        area_code: areaCode,
        status: 'active',
        monthly_cost: 1.00,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (numberError) {
      console.error('Error adding phone number:', numberError);
      return NextResponse.json(
        { error: 'Failed to add phone number' },
        { status: 500 }
      );
    }

    // Record transaction
    await supabase
      .from('client_transactions')
      .insert([{
        client_id: client.id,
        type: 'phone_number_purchase',
        amount: 1.00,
        description: `Phone number purchase: ${mockPhoneNumber}`,
        status: 'completed'
      }]);

    return NextResponse.json({
      success: true,
      message: 'Phone number purchased successfully',
      data: {
        phoneNumber: mockPhoneNumber,
        areaCode,
        monthlyCost: 1.00,
        newBalance
      }
    });

  } catch (error: any) {
    console.error('Unexpected error in purchase number:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}