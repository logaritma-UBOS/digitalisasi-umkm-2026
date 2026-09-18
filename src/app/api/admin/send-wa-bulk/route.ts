import { NextResponse } from 'next/server';

// Fungsi jeda pintar (delay) untuk menghindari rate limit Fonnte
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const passwordHeader = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminlog2026';
    
    if (passwordHeader !== adminPassword) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const body = await request.json();
    const { targets } = body;

    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ message: 'Target kosong' }, { status: 400 });
    }

    const fonnteToken = process.env.FONNTE_TOKEN;
    let successCount = 0;

    // Looping pengiriman dengan jeda agar aman dari banned (Anti-Spam)
    for (const p of targets) {
      const target = p.no_whatsapp;
      const namaLengkap = p.nama_lengkap;

      const message = `Halo *${namaLengkap}*, ini dari Panitia Sharing UMKM 2026.\n\nKami melihat beberapa kendala sistem sebelumnya. Bagi Bapak/Ibu yang belum bergabung ke Grup WhatsApp resmi acara, silakan balas pesan ini dengan kata:\n\n*HADIR*\n\nAgar sistem kami bisa segera mengirimkan link grupnya. Terima kasih!`;

      try {
        const response = await fetch('https://api.fonnte.com/send', {
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

        if (response.ok) {
          successCount++;
        }
        
        // Jeda 1 detik setiap pengiriman pesan
        await delay(1000);
      } catch (err) {
        console.error(`Gagal kirim ke ${target}`, err);
      }
    }

    return NextResponse.json({ message: `Berhasil kirim ke ${successCount} peserta` }, { status: 200 });
  } catch (error) {
    console.error('Bulk WA API Error:', error);
    return NextResponse.json({ message: 'Gagal mengirim pesan massal' }, { status: 500 });
  }
}
