import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Fonnte bisa mengirim webhook dalam format JSON atau FormData
    let body: any;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    }

    const sender = body.sender;
    const messageText = (body.message || '').toString().trim().toLowerCase();

    // Jika pesan mengandung kata "hadir"
    if (messageText.includes('hadir')) {
      const fonnteToken = process.env.FONNTE_TOKEN;
      const replyMessage = `Terima kasih atas konfirmasinya! 🎉\n\nBerikut adalah link Grup WhatsApp resmi peserta Sharing UMKM:\n👉 https://chat.whatsapp.com/Fkn3RcnNI8nBUqUQ0ErhJA\n\nSilakan klik link di atas dan sampai jumpa di dalam grup!`;

      // Tembak kembali API Fonnte untuk membalas
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': fonnteToken || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: sender,
          message: replyMessage,
          countryCode: '62',
        }),
      });
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
