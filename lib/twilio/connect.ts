

import { twilioConfig } from './config';

export interface TwilioConnectConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface ConnectToken {
  accountSid: string;
  authToken: string;
  expiresAt: Date;
  scopes: string[];
  userIdentity?: string;
}

export class TwilioConnectClient {
  private static instance: TwilioConnectClient;
  
  private constructor() {}
  
  static getInstance(): TwilioConnectClient {
    if (!TwilioConnectClient.instance) {
      TwilioConnectClient.instance = new TwilioConnectClient();
    }
    return TwilioConnectClient.instance;
  }

  getConnectConfig(): TwilioConnectConfig {
    return {
      clientId: process.env.TWILIO_CONNECT_CLIENT_ID || '',
      clientSecret: process.env.TWILIO_CONNECT_CLIENT_SECRET || '',
      redirectUri: process.env.TWILIO_CONNECT_REDIRECT_URI || 'http://localhost:3000/api/twilio/connect/callback',
      scopes: [
        'accounts',
        'messages',
        'phone_numbers',
        'usage',
        'balance'
      ],
    };
  }

  isConfigured(): boolean {
    const config = this.getConnectConfig();
    return !!(config.clientId && config.clientSecret && config.redirectUri);
  }

  getAuthorizationUrl(state?: string): string {
    const config = this.getConnectConfig();
    const baseUrl = 'https://connect.twilio.com/oauth/authorize';
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      ...(state && { state })
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<ConnectToken> {
    const config = this.getConnectConfig();
    
    const response = await fetch('https://connect.twilio.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Twilio Connect token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      accountSid: data.account_sid,
      authToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: data.scope.split(' '),
      userIdentity: data.user_identity
    };
  }

  async validateToken(token: ConnectToken): Promise<boolean> {
    try {
      // Quick check if token is expired
      if (token.expiresAt < new Date()) {
        return false;
      }

      // Optional: Make a test API call to validate
      const testResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${token.accountSid}/Balance.json`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${token.accountSid}:${token.authToken}`).toString('base64')}`
          }
        }
      );

      return testResponse.ok;
    } catch {
      return false;
    }
  }
}

const twilioConnect = TwilioConnectClient.getInstance();
export { twilioConnect };