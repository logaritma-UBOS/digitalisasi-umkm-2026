import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const no_whatsapp = body.no_whatsapp?.trim();
    
    if (!no_whatsapp) {
      return NextResponse.json({ message: 'Nomor WhatsApp wajib diisi' }, { status: 400 });
    }

    // Cari peserta berdasarkan nomor WhatsApp secara spesifik
    const { data, error } = await supabaseAdmin
      .from('peserta')
      .select('nama_lengkap, nama_usaha, created_at')
      .eq('no_whatsapp', no_whatsapp)
      .maybeSingle(); 

    if (data) {
      return NextResponse.json({ data }, { status: 200 });
    }

    return NextResponse.json({ message: 'Nomor Anda tidak terdaftar. Pastikan nomor yang dimasukkan sama persis dengan saat mendaftar.' }, { status: 404 });
  } catch (error) {
    console.error('Cek Tiket Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem, silakan coba lagi' }, { status: 500 });
  }
}
