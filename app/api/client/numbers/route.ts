import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { twilioConfig, isTwilioConfigured } from '@/lib/twilio/config';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check Twilio configuration
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'Twilio is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }
    
    if (!body.areaCode) {
      return NextResponse.json(
        { error: 'areaCode is required' },
        { status: 400 }
      );
    }

    // Check if client exists and has sufficient balance
    const { data: client, error: clientError } = await supabase
      .from('client_accounts')
      .select('id, balance, phone_number')
      .eq('id', body.clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client account not found' },
        { status: 404 }
      );
    }

    // Check if client already has a phone number
    if (client.phone_number) {
      return NextResponse.json(
        { error: 'Client already has a phone number' },
        { status: 400 }
      );
    }

    // Phone number cost: $2.00 (your marked-up price)
    const numberCost = 2.00;
    
    if (client.balance < numberCost) {
      return NextResponse.json(
        { error: 'Insufficient balance for phone number purchase' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Purchase phone number from Twilio
    // 2. Create Twilio sub-account for client
    // 3. Assign number to sub-account
    
    // For now, we'll simulate the purchase
    const mockPhoneNumber = `+1${body.areaCode}5551234`;
    
    // Deduct cost from balance
    const newBalance = Number(client.balance) - numberCost;
    
    const { error: updateError } = await supabase
      .from('client_accounts')
      .update({ 
        balance: newBalance,
        phone_number: mockPhoneNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.clientId);

    if (updateError) {
      console.error('Error updating client account:', updateError);
      return NextResponse.json(
        { error: 'Failed to purchase phone number' },
        { status: 500 }
      );
    }

    // Record phone number purchase
    const { error: numberError } = await supabase
      .from('client_phone_numbers')
      .insert([{
        client_id: body.clientId,
        phone_number: mockPhoneNumber,
        twilio_sid: `PN${Date.now()}`,
        area_code: body.areaCode,
        capabilities: body.capabilities || { sms: true, voice: false },
        monthly_cost: 1.00, // Your cost from Twilio
        status: 'active'
      }]);

    if (numberError) {
      console.error('Error recording phone number:', numberError);
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('client_transactions')
      .insert([{
        client_id: body.clientId,
        type: 'number_fee',
        amount: -numberCost,
        description: `Phone number purchase: ${mockPhoneNumber}`,
        status: 'completed'
      }]);

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number purchased successfully',
      data: {
        phoneNumber: mockPhoneNumber,
        areaCode: body.areaCode,
        cost: numberCost,
        newBalance: newBalance
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