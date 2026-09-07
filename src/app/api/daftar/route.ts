import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper untuk format nomor ke standar internasional (62)
function formatWhatsAppNumber(phone: string): string {
  let formatted = phone.replace(/\D/g, ''); // Hapus semua karakter non-digit
  
  if (formatted.startsWith('0')) {
    formatted = '62' + formatted.substring(1);
  } else if (formatted.startsWith('8')) {
    formatted = '62' + formatted;
  }
  
  return formatted;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaLengkap, namaUsaha, email, noWhatsapp } = body;

    // 1. Validasi Input Dasar
    if (!namaLengkap || !namaUsaha || !email || !noWhatsapp) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // 2. Format No WA
    const formattedWA = formatWhatsAppNumber(noWhatsapp);

    // 3. Simpan ke Supabase menggunakan supabaseAdmin (Service Role)
    const { data: peserta, error: dbError } = await supabaseAdmin
      .from('peserta')
      .insert([
        {
          nama_lengkap: namaLengkap,
          nama_usaha: namaUsaha,
          email: email,
          no_whatsapp: formattedWA,
        },
      ])
      .select()
      .single();

    // 4. Handle Error Database (Contoh: Duplikat Email)
    if (dbError) {
      if (dbError.code === '23505') { // Postgres unique violation error code
        return NextResponse.json(
          { message: 'Email sudah terdaftar.' },
          { status: 409 }
        );
      }
      console.error('Supabase Error:', dbError);
      return NextResponse.json(
        { message: 'Gagal menyimpan data ke database' },
        { status: 500 }
      );
    }

    // 5. Kirim Pesan Konfirmasi via Fonnte
    const fonnteToken = process.env.FONNTE_TOKEN;
    const message = `Halo *${namaLengkap}*,\n\nTerima kasih telah mendaftar di acara *Digitalisasi UMKM 2026*!\n\nNama Usaha: ${namaUsaha}\nEmail: ${email}\n\nKami akan mengirimkan informasi selanjutnya melalui WhatsApp ini. Sampai jumpa pada tanggal 21 September 2026!\n\nSalam,\nPanitia Digitalisasi UMKM 2026`;

    try {
      const fonnteResponse = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': fonnteToken || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: formattedWA,
          message: message,
          countryCode: '62',
        }),
      });

      if (!fonnteResponse.ok) {
        console.error('Fonnte API Error:', await fonnteResponse.text());
        // Catatan: Walaupun gagal kirim WA, pendaftaran di database tetap berhasil
      }
    } catch (fonnteErr) {
      console.error('Failed to call Fonnte:', fonnteErr);
    }

    // 6. Return response sukses
    return NextResponse.json(
      { message: 'Pendaftaran berhasil', data: peserta },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
