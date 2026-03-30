import { createClient } from '@supabase/supabase-js';

// Fallback values for AI Studio preview, environment variables for Vercel deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crnqkftjrdywfpsohtwh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_sM4IuY_xerR79YP8AdE7eQ_kqYQc5a9';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Key must be provided in environment variables or as fallbacks.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
