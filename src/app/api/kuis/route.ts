import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { nama, score, time } = await request.json();
    if (!nama) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });

    // HACK: Kita simpan skor di tabel peserta agar tidak perlu repot membuat tabel baru di Supabase.
    // Kita tandai dengan nama_usaha = '__KUIS__'
    await supabaseAdmin.from('peserta').insert({
      nama_lengkap: nama.substring(0, 50),
      nama_usaha: '__KUIS__',
      email: `kuis_${Date.now()}_${Math.random().toString(36).substring(7)}@kuis.id`,
      no_whatsapp: `${score}|${time}`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Score Error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan skor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Ambil semua record kuis
    const { data } = await supabaseAdmin
      .from('peserta')
      .select('nama_lengkap, no_whatsapp')
      .eq('nama_usaha', '__KUIS__');

    if (!data) return NextResponse.json({ leaderboard: [] });

    const leaderboard = data.map(d => {
      const [scoreStr, timeStr] = (d.no_whatsapp || '0|0').split('|');
      return {
        nama: d.nama_lengkap,
        score: parseInt(scoreStr) || 0,
        time: parseInt(timeStr) || 0
      };
    });

    // Urutkan: Skor tertinggi di atas. Jika skor sama, Waktu tercepat (paling kecil) di atas.
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    });

    return NextResponse.json({ leaderboard: leaderboard.slice(0, 10) }, { status: 200 });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil skor' }, { status: 500 });
  }
}
