-- Add google_calendar_tokens column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS google_calendar_tokens JSONB;

-- Add google_calendar_email column for tracking which Google account is connected
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS google_calendar_email TEXT;