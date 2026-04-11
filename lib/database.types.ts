// Database types for client billing and Twilio integration

export interface ClientAccount {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Twilio sub-account info
  twilio_sub_account_sid?: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string; // Encrypted
  phone_number?: string;
  
  // Billing info
  balance: number;
  currency: string;
  billing_status: 'active' | 'suspended' | 'closed';
  
  // Business info
  company_name?: string;
  timezone: string;
}

export interface ClientTransaction {
  id: string;
  client_id: string;
  created_at: string;
  
  // Transaction details
  type: 'deposit' | 'sms_charge' | 'number_fee' | 'refund';
  amount: number;
  description?: string;
  
  // Reference info
  stripe_payment_id?: string;
  twilio_message_sid?: string;
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface ClientPhoneNumber {
  id: string;
  client_id: string;
  created_at: string;
  
  // Twilio number info
  phone_number: string;
  twilio_sid: string;
  area_code: string;
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms?: boolean;
  };
  monthly_cost: number;
  
  // Status
  status: 'active' | 'pending' | 'suspended' | 'released';
}

export interface SMSUsage {
  id: string;
  client_id: string;
  created_at: string;
  
  // Message details
  message_sid: string;
  from_number: string;
  to_number: string;
  body: string;
  message_type: 'outbound' | 'inbound';
  
  // Cost tracking
  cost: number; // $0.01 per SMS base cost
  your_price: number; // $0.015 charged to client
  twilio_price: number; // Actual Twilio cost
  
  // Status
  status: 'sent' | 'delivered' | 'failed' | 'undelivered';
}

// Response types
export interface ClientWithBalance {
  id: string;
  company_name?: string;
  balance: number;
  currency: string;
  phone_number?: string;
  billing_status: string;
}

export interface TransactionResponse {
  id: string;
  type: string;
  amount: number;
  description?: string;
  created_at: string;
  status: string;
}

// API Request types
export interface CreateClientAccountRequest {
  company_name?: string;
  timezone?: string;
  initial_balance?: number;
}

export interface AddFundsRequest {
  amount: number;
  stripe_payment_id: string;
  description?: string;
}

export interface PurchaseNumberRequest {
  area_code: string;
  capabilities?: {
    sms?: boolean;
    voice?: boolean;
    mms?: boolean;
  };
}

// Pricing configuration
export const PRICING = {
  SMS_COST: 0.01, // Twilio cost per SMS
  SMS_MARKUP: 0.0089, // Your markup per SMS
  SMS_TOTAL: 0.0189, // Client price per SMS
  
  NUMBER_MONTHLY_COST: 1.00, // Twilio cost per number
  NUMBER_MARKUP: 1.00, // Your markup per number
  NUMBER_TOTAL: 2.00, // Client price per number
  
  CURRENCY: 'USD',
} as const;