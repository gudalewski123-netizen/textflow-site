import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      incomingMessage,
      conversationHistory,
      businessContext,
      customerName,
      tone,
      provider,
    } = data;

    if (!incomingMessage) {
      return NextResponse.json(
        { error: 'Missing required field: incomingMessage' },
        { status: 400 }
      );
    }

    const result = await aiService.generateSMSResponse({
      incomingMessage,
      conversationHistory,
      businessContext,
      customerName,
      tone,
      provider,
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      provider: result.provider,
      realAI: result.realAI,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI SMS generation error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate AI response',
        success: false,
        response: 'Sorry, I encountered an error generating a response. Please try again.',
        provider: 'error',
        realAI: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return AI configuration status
  const availableProviders = aiService.getAvailableProviders();
  const isEnabled = aiService.isAIEnabled();

  return NextResponse.json({
    aiEnabled: isEnabled,
    availableProviders,
    defaultProvider: 'deepseek',
    instructions: 'POST to /api/ai/sms with { incomingMessage, conversationHistory?, businessContext?, customerName?, tone?, provider? }',
  });
}