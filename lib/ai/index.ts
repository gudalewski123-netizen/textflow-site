import { deepseek } from './deepseek';
import { aiProviders, getActiveProviders, getBestProvider, AIProviderConfig } from './config';

export type { AIMessage, AIMessageRequest, AIResponse } from './deepseek';

export interface SMSGenerationOptions {
  incomingMessage: string;
  conversationHistory?: string[];
  businessContext?: string;
  customerName?: string;
  tone?: 'professional' | 'friendly' | 'concerned';
  provider?: string;
}

export class AIService {
  async generateSMSResponse(options: SMSGenerationOptions): Promise<{
    response: string;
    provider: string;
    realAI: boolean;
    error?: string;
  }> {
    const providers = getActiveProviders();
    
    if (providers.length === 0) {
      // No AI providers configured, return mock
      const mockResponse = await deepseek.generateSMSResponse(options);
      return {
        response: mockResponse.content,
        provider: 'deepseek',
        realAI: false,
        error: 'No AI providers configured. Set API keys for real AI responses.',
      };
    }

    const providerId = options.provider || getBestProvider() || 'deepseek';
    const provider = aiProviders[providerId];

    if (!provider?.enabled) {
      // Fallback to mock
      const mockResponse = await deepseek.generateSMSResponse(options);
      return {
        response: mockResponse.content,
        provider: providerId,
        realAI: false,
        error: `Provider ${providerId} is not enabled or configured.`,
      };
    }

    try {
      // Currently only DeepSeek is implemented
      // In the future, add OpenAI, Anthropic, etc.
      if (providerId === 'deepseek') {
        const result = await deepseek.generateSMSResponse(options);
        return {
          response: result.content,
          provider: 'deepseek',
          realAI: deepseek.canMakeRealCalls(),
        };
      }

      // Fallback to mock for other providers (not yet implemented)
      const mockResponse = await deepseek.generateSMSResponse(options);
      return {
        response: `[Provider ${providerId} not yet implemented] ${mockResponse.content}`,
        provider: providerId,
        realAI: false,
        error: `Provider ${providerId} integration not yet implemented.`,
      };
    } catch (error: any) {
      console.error(`AI generation failed for provider ${providerId}:`, error);
      
      // Fallback to mock
      const mockResponse = await deepseek.generateSMSResponse(options);
      return {
        response: `[AI Error - Using Mock] ${mockResponse.content}`,
        provider: providerId,
        realAI: false,
        error: error.message,
      };
    }
  }

  async generateCampaignMessage(options: {
    campaignType: 'welcome' | 'followup' | 'promotion' | 'support';
    businessContext: string;
    targetAudience?: string;
    tone?: 'professional' | 'friendly' | 'urgent';
  }): Promise<{ message: string; provider: string; realAI: boolean }> {
    // Mock implementation for now
    let message = '';
    
    switch (options.campaignType) {
      case 'welcome':
        message = `Welcome to ${options.businessContext}! Thanks for signing up. We're excited to have you on board. How can we help you get started?`;
        break;
      case 'followup':
        message = `Hope you're enjoying ${options.businessContext}! Just checking in to see if you have any questions or need assistance.`;
        break;
      case 'promotion':
        message = `Special offer from ${options.businessContext}! Get 20% off your next order. Use code: SPRING20. Limited time offer.`;
        break;
      case 'support':
        message = `Hi from ${options.businessContext} support! We noticed you had some questions. How can we help resolve your issue?`;
        break;
    }

    return {
      message,
      provider: 'mock',
      realAI: false,
    };
  }

  getAvailableProviders(): AIProviderConfig[] {
    return getActiveProviders();
  }

  isAIEnabled(): boolean {
    return getActiveProviders().length > 0;
  }
}

export const aiService = new AIService();