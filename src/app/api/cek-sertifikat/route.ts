import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ message: 'Nomor WhatsApp diperlukan' }, { status: 400 });
    }

    // Format nomor HP (hapus spasi, +, dll)
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 8) {
       return NextResponse.json({ message: 'Nomor WhatsApp tidak valid' }, { status: 400 });
    }

    let searchPhones = [cleanPhone];
    
    // Algoritma Smart Matching
    if (cleanPhone.startsWith('08')) {
      searchPhones.push('628' + cleanPhone.substring(2));
    } else if (cleanPhone.startsWith('628')) {
      searchPhones.push('08' + cleanPhone.substring(3));
    }

    // Gunakan query OR dengan ilike agar tangguh terhadap spasi/karakter tak terlihat di database
    const orQuery = searchPhones.map(p => `no_whatsapp.ilike.%${p}%`).join(',');

    const { data, error } = await supabaseAdmin
      .from('peserta')
      .select('nama_lengkap, nama_usaha')
      .neq('nama_usaha', '__KUIS__')
      .neq('nama_usaha', '__KUIS_STATE__')
      .or(orQuery)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: 'Nomor Anda belum terdaftar di sistem acara.' }, { status: 404 });
    }

    // Cek apakah punya flag ||HADIR
    const isHadir = String(data.nama_usaha).includes('||HADIR');

    if (!isHadir) {
      return NextResponse.json({ 
        message: 'Mohon maaf, sertifikat hanya dapat diunduh oleh peserta yang tercatat HADIR di lokasi acara.' 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      nama_lengkap: data.nama_lengkap 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
