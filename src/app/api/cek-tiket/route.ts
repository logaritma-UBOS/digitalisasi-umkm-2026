import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let phoneInput = body.no_whatsapp?.trim().replace(/\D/g, ''); // Bersihkan karakter non-angka (seperti spasi, +, -)
    
    if (!phoneInput) {
      return NextResponse.json({ message: 'Nomor WhatsApp wajib diisi' }, { status: 400 });
    }

    // Algoritma Smart Matching: Jika ketik awalan 0, cari juga awalan 62. Dan sebaliknya.
    let alternatePhone = '';
    if (phoneInput.startsWith('0')) {
      alternatePhone = '62' + phoneInput.substring(1);
    } else if (phoneInput.startsWith('62')) {
      alternatePhone = '0' + phoneInput.substring(2);
    }

    // Bangun Query Pencarian
    let query = supabaseAdmin
      .from('peserta')
      .select('nama_lengkap, nama_usaha, created_at');

    if (alternatePhone) {
      query = query.or(`no_whatsapp.eq.${phoneInput},no_whatsapp.eq.${alternatePhone}`);
    } else {
      query = query.eq('no_whatsapp', phoneInput);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (data) {
      return NextResponse.json({ data }, { status: 200 });
    }

    return NextResponse.json({ message: 'Waduh, Nomor Anda tidak terdaftar. Pastikan nomor yang dimasukkan benar.' }, { status: 404 });
  } catch (error) {
    console.error('Cek Tiket Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan sistem, silakan coba lagi' }, { status: 500 });
  }
}
