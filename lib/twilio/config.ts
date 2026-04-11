export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || '',
};

export const twilioConnectConfig = {
  clientId: process.env.TWILIO_CONNECT_CLIENT_ID || '',
  clientSecret: process.env.TWILIO_CONNECT_CLIENT_SECRET || '',
  redirectUri: process.env.TWILIO_CONNECT_REDIRECT_URI || 'http://localhost:3000/api/twilio/connect/callback',
};

export function isTwilioConfigured() {
  return twilioConfig.accountSid && twilioConfig.authToken;
}

export function isTwilioConnectConfigured() {
  return twilioConnectConfig.clientId && twilioConnectConfig.clientSecret && twilioConnectConfig.redirectUri;
}