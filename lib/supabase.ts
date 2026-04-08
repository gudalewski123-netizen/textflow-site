import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server-side Supabase client (for API routes)
// Uses service role key for server-side operations
// Note: This is only available in server-side environments (API routes, server components)
// For client components, use createSupabaseBrowserClient instead

export function createSupabaseServerClient() {
  // Only run this on the server
  if (typeof window !== 'undefined') {
    console.warn('createSupabaseServerClient called in browser environment. Use createSupabaseBrowserClient instead.')
    return null
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:')
    console.error('URL:', supabaseUrl ? '✓' : '✗')
    console.error('Key:', supabaseKey ? '✓' : '✗')
    return null
  }
  
  return createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
}

// Check if user is authenticated
export async function getUser() {
  const supabase = createSupabaseBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}