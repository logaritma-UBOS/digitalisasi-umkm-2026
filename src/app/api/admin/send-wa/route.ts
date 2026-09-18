import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const passwordHeader = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminlog2026';
    
    if (passwordHeader !== adminPassword) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const body = await request.json();
    const { target, namaLengkap } = body;

    if (!target) {
      return NextResponse.json({ message: 'Target nomor kosong' }, { status: 400 });
    }

    const fonnteToken = process.env.FONNTE_TOKEN;
    const message = `Halo *${namaLengkap}*, ini dari Panitia Sharing UMKM 2026.\n\nKami melihat beberapa kendala sistem sebelumnya. Bagi Bapak/Ibu yang belum bergabung ke Grup WhatsApp resmi acara, silakan balas pesan ini dengan kata:\n\n*HADIR*\n\nAgar sistem kami bisa segera mengirimkan link grupnya. Terima kasih!`;

    const fonnteResponse = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: target,
        message: message,
        countryCode: '62',
      }),
    });

    if (!fonnteResponse.ok) {
      throw new Error('Fonnte API Error');
    }

    return NextResponse.json({ message: 'Pesan berhasil dikirim' }, { status: 200 });
  } catch (error) {
    console.error('Send WA API Error:', error);
    return NextResponse.json({ message: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
