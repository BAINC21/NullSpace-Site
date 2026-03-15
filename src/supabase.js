import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xjntewsqkpsggpmljfri.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbnRld3Nxa3BzZ2dwbWxqZnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDgzODMsImV4cCI6MjA4OTE4NDM4M30.lkCx4sv9h9PpjZwdDnp2ztnCMrUNPOo8Xt-hnEE9BEY'

const isConfigured = SUPABASE_URL && !SUPABASE_URL.includes('YOUR_PROJECT_ID') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
