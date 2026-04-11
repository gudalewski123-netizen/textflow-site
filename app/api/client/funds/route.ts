import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

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
    if (!body.clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }
    
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }
    
    if (!body.stripePaymentId) {
      return NextResponse.json(
        { error: 'stripePaymentId is required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from('client_accounts')
      .select('id, balance')
      .eq('id', body.clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client account not found' },
        { status: 404 }
      );
    }

    // Add funds to balance
    const newBalance = Number(client.balance) + Number(body.amount);
    
    const { error: updateError } = await supabase
      .from('client_accounts')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.clientId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return NextResponse.json(
        { error: 'Failed to add funds' },
        { status: 500 }
      );
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('client_transactions')
      .insert([{
        client_id: body.clientId,
        type: 'deposit',
        amount: body.amount,
        description: `Funds deposit via Stripe`,
        stripe_payment_id: body.stripePaymentId,
        status: 'completed'
      }]);

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Don't fail the whole request - just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Funds added successfully',
      data: {
        newBalance,
        amountAdded: body.amount
      }
    });

  } catch (error: any) {
    console.error('Unexpected error in add funds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}