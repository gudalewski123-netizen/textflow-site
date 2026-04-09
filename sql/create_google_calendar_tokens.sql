-- Create simple google_calendar_tokens table
CREATE TABLE IF NOT EXISTS public.google_calendar_tokens (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tokens JSONB NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.google_calendar_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Users can view their own tokens
CREATE POLICY "Users can view own tokens" ON public.google_calendar_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own tokens
CREATE POLICY "Users can update own tokens" ON public.google_calendar_tokens
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own tokens
CREATE POLICY "Users can insert own tokens" ON public.google_calendar_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policy (for service role)
CREATE POLICY "Service role full access" ON public.google_calendar_tokens
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );