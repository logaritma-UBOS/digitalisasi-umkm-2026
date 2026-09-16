import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const passwordHeader = request.headers.get('x-admin-password');
    // Prioritaskan dari env Vercel, jika tidak ada gunakan yang disepakati
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminlog2026';

    if (passwordHeader !== adminPassword) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    // Mengambil data dari Supabase, diurutkan dari yang terbaru
    const { data, error } = await supabaseAdmin
      .from('peserta')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data peserta' },
      { status: 500 }
    );
  }
}
