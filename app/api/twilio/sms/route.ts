import { NextRequest, NextResponse } from 'next/server';
import { twilio } from '@/lib/twilio/client';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { to, body, clientId } = await request.json();
    
    if (!to || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, body' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    
    // If clientId is provided, check balance and deduct cost
    if (clientId) {
      if (!supabase) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        );
      }

      // Check client balance
      const { data: client, error: clientError } = await supabase
        .from('client_accounts')
        .select('balance, phone_number')
        .eq('id', clientId)
        .single();

      if (clientError || !client) {
        return NextResponse.json(
          { error: 'Client account not found' },
          { status: 404 }
        );
      }

      // SMS cost: $0.0189 (your marked-up price)
      const smsCost = 0.0189;
      
      if (client.balance < smsCost) {
        return NextResponse.json(
          { error: 'Insufficient balance to send SMS' },
          { status: 400 }
        );
      }

      // Send SMS
      const result = await twilio.sendSMS({ to, body });
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      // Deduct cost from balance
      const newBalance = Number(client.balance) - smsCost;
      
      const { error: updateError } = await supabase
        .from('client_accounts')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (updateError) {
        console.error('Error updating balance:', updateError);
      }

      // Record SMS usage
      const { error: usageError } = await supabase
        .from('sms_usage')
        .insert([{
          client_id: clientId,
          message_sid: result.messageSid,
          from_number: client.phone_number || '',
          to_number: to,
          body: body,
          message_type: 'outbound',
          cost: 0.01, // Twilio cost
          your_price: 0.0189, // Your price
          twilio_price: 0.01, // Actual Twilio cost
          status: 'sent'
        }]);

      if (usageError) {
        console.error('Error recording SMS usage:', usageError);
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('client_transactions')
        .insert([{
          client_id: clientId,
          type: 'sms_charge',
          amount: -smsCost,
          description: `SMS to ${to}`,
          twilio_message_sid: result.messageSid,
          status: 'completed'
        }]);

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      return NextResponse.json({
        success: true,
        messageSid: result.messageSid,
        price: smsCost,
        newBalance: newBalance,
        message: 'SMS sent successfully'
      });
    } else {
      // No clientId - use original behavior (mock mode)
      const result = await twilio.sendSMS({ to, body });
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        messageSid: result.messageSid,
        price: result.price,
        message: 'SMS sent successfully'
      });
    }
  } catch (error: any) {
    console.error('Twilio SMS API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}