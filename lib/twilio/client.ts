

import { twilioConfig, isTwilioConfigured } from './config';

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface PhoneNumberPurchase {
  areaCode: string;
  capabilities?: {
    sms: boolean;
    voice: boolean;
  };
}

export interface UserBalance {
  userId: string;
  credits: number;
  accountSid?: string;
}

class TwilioClient {
  private client: any;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      throw new Error('TwilioClient should only be used server-side');
    }
  }

  private async init() {
    if (!isTwilioConfigured()) {
      throw new Error('Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    }

    if (this.initialized) return;

    try {
      // Dynamic import to avoid build-time errors
      const twilioModule = await import('twilio');
      // Handle both default and named exports
      const twilioClient = twilioModule.default || twilioModule;
      this.client = twilioClient(twilioConfig.accountSid, twilioConfig.authToken);
      this.initialized = true;
      console.log('Twilio client initialized');
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error);
      // Don't throw - allow mock mode to work
      this.initialized = false;
    }
  }

  async sendSMS({ to, body, from }: SMSMessage) {
    await this.init();
    
    try {
      const message = await this.client.messages.create({
        body,
        from: from || twilioConfig.phoneNumber || twilioConfig.messagingServiceSid,
        to,
      });
      
      console.log(`✅ SMS sent to ${to}: ${message.sid}`);
      return { success: true, messageSid: message.sid, price: message.price };
    } catch (error: any) {
      console.error(`❌ Failed to send SMS to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async purchasePhoneNumber(areaCode: string) {
    await this.init();
    
    try {
      const availableNumbers = await this.client.availablePhoneNumbers('US')
        .local
        .list({ areaCode, limit: 5 });

      if (availableNumbers.length === 0) {
        throw new Error(`No phone numbers available in area code ${areaCode}`);
      }

      const phoneNumber = availableNumbers[0];
      const purchasedNumber = await this.client.incomingPhoneNumbers.create({
        phoneNumber: phoneNumber.phoneNumber,
        smsApplicationSid: process.env.TWILIO_SMS_APP_SID,
        voiceApplicationSid: process.env.TWILIO_VOICE_APP_SID,
      });

      console.log(`✅ Purchased phone number: ${purchasedNumber.phoneNumber}`);
      return { 
        success: true, 
        phoneNumber: purchasedNumber.phoneNumber,
        sid: purchasedNumber.sid,
        monthlyCost: 1.00 // Default $1/month for numbers
      };
    } catch (error: any) {
      console.error('Failed to purchase phone number:', error.message);
      return { success: false, error: error.message };
    }
  }

  async checkBalance(accountSid: string) {
    await this.init();
    
    try {
      const balanceData = await this.client.balance.fetch();
      const account = await this.client.api.accounts(accountSid).fetch();
      
      return {
        balance: parseFloat(balanceData.balance),
        currency: balanceData.currency,
        accountType: account.type,
        status: account.status,
      };
    } catch (error: any) {
      console.error('Failed to check balance:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendBulkSMS(messages: SMSMessage[]) {
    await this.init();
    
    const results = [];
    for (const msg of messages) {
      const result = await this.sendSMS(msg);
      results.push(result);
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }
}

export const twilio = new TwilioClient();