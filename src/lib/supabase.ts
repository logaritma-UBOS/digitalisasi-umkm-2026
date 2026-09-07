import { createClient } from '@supabase/supabase-js';

// Menggunakan Service Role Key untuk bypass RLS dan Insert Data dari API.
// PERINGATAN: Jangan pernah mengekspos SERVICE_ROLE_KEY ke sisi client (browser).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are missing');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
