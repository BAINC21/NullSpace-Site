import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════
//  SUPABASE CONFIG
//  Replace these with your own Supabase project values.
//  Find them at: https://supabase.com → Your Project → Settings → API
// ═══════════════════════════════════════════════════
const SUPABASE_URL = xjntewsqkpsggpmljfri
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbnRld3Nxa3BzZ2dwbWxqZnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDgzODMsImV4cCI6MjA4OTE4NDM4M30.lkCx4sv9h9PpjZwdDnp2ztnCMrUNPOo8Xt-hnEE9BEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
