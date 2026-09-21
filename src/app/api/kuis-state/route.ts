import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: Ambil status kuis saat ini
export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from('peserta')
      .select('*')
      .eq('nama_usaha', '__KUIS_STATE__')
      .limit(1)
      .single();

    if (!data) {
      return NextResponse.json({ status: 'WAITING', startTime: 0 }, { status: 200 });
    }

    return NextResponse.json({ 
      status: data.no_whatsapp, 
      startTime: Number(data.email) || 0 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'WAITING', startTime: 0 }, { status: 200 });
  }
}

// POST: Update status kuis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status, startTime } = body;

    // Hapus state lama (karena tidak ada ID yang pasti, pendekatan paling aman adalah replace)
    await supabaseAdmin.from('peserta').delete().eq('nama_usaha', '__KUIS_STATE__');
    
    // Insert state baru
    const { error } = await supabaseAdmin.from('peserta').insert([{
      nama_lengkap: 'KUIS_GLOBAL_STATE',
      nama_usaha: '__KUIS_STATE__',
      email: String(startTime || Date.now()),
      no_whatsapp: status // 'WAITING' atau 'STARTED'
    }]);

    if (error) throw error;

    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal update status' }, { status: 500 });
  }
}
