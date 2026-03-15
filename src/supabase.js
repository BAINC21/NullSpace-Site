import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════
//  SUPABASE CONFIG
//  Replace these with your own Supabase project values.
//  Find them at: https://supabase.com → Your Project → Settings → API
// ═══════════════════════════════════════════════════
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'

// Only create a real client if configured, otherwise export null
const isConfigured = SUPABASE_URL && !SUPABASE_URL.includes('YOUR_PROJECT_ID') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
