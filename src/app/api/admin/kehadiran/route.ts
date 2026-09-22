import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'adminlog2026';

export async function POST(request: Request) {
  try {
    if (request.headers.get('x-admin-password') !== getAdminPassword()) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const { id, currentNamaUsaha, isHadir } = await request.json();
    
    if (!id || currentNamaUsaha === undefined) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    // Bersihkan flag lama jika ada, lalu tambahkan jika isHadir true
    const baseUsaha = String(currentNamaUsaha).replace('||HADIR', '');
    const newNamaUsaha = isHadir ? `${baseUsaha}||HADIR` : baseUsaha;

    const { error } = await supabaseAdmin.from('peserta').update({
      nama_usaha: newNamaUsaha
    }).eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, newNamaUsaha }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui kehadiran' }, { status: 500 });
  }
}
