

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIMessageRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  context?: {
    businessName?: string;
    conversationHistory?: string[];
    customerInfo?: {
      name?: string;
      previousOrders?: string[];
      preferences?: Record<string, any>;
    };
  };
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;
  metadata?: {
    model: string;
    provider: string;
    timestamp: string;
  };
}

class DeepSeekClient {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com';

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ DEEPSEEK_API_KEY not found. Using mock responses for development.');
    }
    
    this.apiKey = apiKey || '';
  }

  private isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  async generateMessage(request: AIMessageRequest): Promise<AIResponse> {
    // If not configured, return mock response for development
    if (!this.isConfigured()) {
      console.log('🚧 DeepSeek not configured. Returning mock AI response.');
      return this.getMockResponse(request);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || 'deepseek-chat',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
        metadata: {
          model: data.model,
          provider: 'deepseek',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to call DeepSeek API:', error);
      // Fallback to mock response
      return this.getMockResponse(request);
    }
  }

  /**
   * Generate AI-powered SMS response based on conversation context
   */
  async generateSMSResponse(opts: {
    incomingMessage: string;
    conversationHistory?: string[];
    businessContext?: string;
    customerName?: string;
    tone?: 'professional' | 'friendly' | 'concerned';
  }): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(opts);
    
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Customer message: "${opts.incomingMessage}"`,
      },
    ];

    return this.generateMessage({
      messages,
      temperature: 0.7,
      max_tokens: 300, // SMS-friendly length
    });
  }

  private buildSystemPrompt(opts: {
    businessContext?: string;
    customerName?: string;
    tone?: 'professional' | 'friendly' | 'concerned';
    conversationHistory?: string[];
  }): string {
    const businessInfo = opts.businessContext 
      ? `Business context: ${opts.businessContext}\n`
      : "You're assisting a business with SMS communications.\n";

    const customerInfo = opts.customerName
      ? `Customer name: ${opts.customerName}\n`
      : '';

    const history = opts.conversationHistory && opts.conversationHistory.length > 0
      ? `Conversation history:\n${opts.conversationHistory.map((msg, i) => `  ${i+1}. ${msg}`).join('\n')}\n`
      : '';

    const tonePrompt = opts.tone 
      ? `Use a ${opts.tone} tone. `
      : 'Use a professional and helpful tone. ';

    return `
You are an AI assistant for SMS messaging. Your primary goal is to help businesses communicate effectively with customers via text message.

${businessInfo}${customerInfo}${history}
${tonePrompt}
Guidelines:
1. Keep responses concise (SMS-friendly, under 160 characters preferred)
2. Be clear and direct
3. If unsure, ask clarifying questions
4. Avoid markdown or formatting
5. For service issues, show empathy
6. For sales inquiries, be helpful but not pushy
7. Always be professional and respectful

Respond directly to the customer's message below.
`;
  }

  private getMockResponse(request: AIMessageRequest): AIResponse {
    console.log('🎭 Returning mock AI response. Set DEEPSEEK_API_KEY for real responses.');

    // Generate context-aware mock responses
    const lastUserMessage = request.messages
      .filter(m => m.role === 'user')
      .pop()?.content || '';

    let mockResponse = '';

    if (lastUserMessage.toLowerCase().includes('price') || lastUserMessage.toLowerCase().includes('cost')) {
      mockResponse = 'Our pricing starts at $99/month. Would you like me to send you the full pricing details?';
    } else if (lastUserMessage.toLowerCase().includes('support') || lastUserMessage.toLowerCase().includes('help')) {
      mockResponse = 'I\'d be happy to help! Can you describe the issue you\'re experiencing?';
    } else if (lastUserMessage.toLowerCase().includes('thanks') || lastUserMessage.toLowerCase().includes('thank you')) {
      mockResponse = 'You\'re welcome! Is there anything else I can help you with today?';
    } else if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
      mockResponse = 'Hello! How can I assist you today?';
    } else {
      mockResponse = 'Thanks for your message! I\'ll get back to you with more information shortly.';
    }

    return {
      content: `🤖 [Mock AI Response] ${mockResponse}\n\n[Note: Set DEEPSEEK_API_KEY environment variable for real AI responses]`,
      metadata: {
        model: 'deepseek-chat',
        provider: 'deepseek',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Check if the client can make real API calls
   */
  canMakeRealCalls(): boolean {
    return this.isConfigured();
  }
}

export const deepseek = new DeepSeekClient();