-- Client billing and Twilio sub-account schema
-- Run this in your Supabase SQL editor

-- Clients table (extends auth.users)
CREATE TABLE IF NOT EXISTS client_accounts (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Twilio sub-account info
    twilio_sub_account_sid TEXT UNIQUE,
    twilio_account_sid TEXT,
    twilio_auth_token TEXT, -- Encrypted in production
    phone_number TEXT,
    
    -- Billing info
    balance DECIMAL(10, 4) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    billing_status TEXT DEFAULT 'active' CHECK (billing_status IN ('active', 'suspended', 'closed')),
    
    -- Business info
    company_name TEXT,
    timezone TEXT DEFAULT 'UTC',
    
    PRIMARY KEY (id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS client_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc' NOW()),
    
    -- Transaction details
    type TEXT CHECK (type IN ('deposit', 'sms_charge', 'number_fee', 'refund')),
    amount DECIMAL(10, 4),
    description TEXT,
    
    -- Reference info
    stripe_payment_id TEXT,
    twilio_message_sid TEXT,
    
    -- Status
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    INDEX idx_client_transactions_client_id (client_id),
    INDEX idx_client_transactions_created_at (created_at)
);

-- Phone numbers table
CREATE TABLE IF NOT EXISTS client_phone_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc' NOW()),
    
    -- Twilio number info
    phone_number TEXT UNIQUE,
    twilio_sid TEXT UNIQUE,
    area_code TEXT,
    capabilities JSONB DEFAULT '{"sms": true, "voice": false}'::jsonb,
    monthly_cost DECIMAL(5, 2) DEFAULT 1.00,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'released')),
    
    INDEX idx_client_phone_numbers_client_id (client_id),
    INDEX idx_client_phone_numbers_status (status)
);

-- SMS usage tracking
CREATE TABLE IF NOT EXISTS sms_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc' NOW()),
    
    -- Message details
    message_sid TEXT UNIQUE,
    from_number TEXT,
    to_number TEXT,
    body TEXT,
    message_type TEXT CHECK (message_type IN ('outbound', 'inbound')),
    
    -- Cost tracking
    cost DECIMAL(5, 4) DEFAULT 0.0100, -- $0.01 per SMS base cost
    your_price DECIMAL(5, 4) DEFAULT 0.0150, -- $0.015 charged to client
    twilio_price DECIMAL(5, 4) DEFAULT 0.0100, -- Actual Twilio cost
    
    -- Status
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'undelivered')),
    
    INDEX idx_sms_usage_client_id (client_id),
    INDEX idx_sms_usage_created_at (created_at)
);

-- Enable Row Level Security
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Clients can only see their own data
CREATE POLICY "Users can view own account" ON client_accounts
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON client_transactions
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can view own phone numbers" ON client_phone_numbers
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can view own SMS usage" ON sms_usage
    FOR SELECT USING (auth.uid() = client_id);

-- Admin can see all (using service role key)
CREATE POLICY "Service role full access" ON client_accounts
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON client_transactions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON client_phone_numbers
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access" ON sms_usage
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert sample data for testing
INSERT INTO client_accounts (id, company_name, balance)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Test Client Inc', 100.00)
ON CONFLICT (id) DO NOTHING;