import { createClient } from '@supabase/supabase-js';

// Menggunakan Service Role Key untuk bypass RLS dan Insert Data dari API.
// PERINGATAN: Jangan pernah mengekspos SERVICE_ROLE_KEY ke sisi client (browser).
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseUrl = rawUrl.trim().replace(/\/+$/, '');
const supabaseServiceKey = rawKey.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are missing');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
