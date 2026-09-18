import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const rawBody = await request.text();
    
    let messageText = '';
    let sender = '';

    if (contentType.includes('application/json')) {
      try {
        const json = JSON.parse(rawBody);
        messageText = (json.message || '').toString().toLowerCase();
        sender = json.sender;
      } catch(e) {}
    } else {
      const params = new URLSearchParams(rawBody);
      messageText = (params.get('message') || '').toString().toLowerCase();
      sender = params.get('sender') || '';
    }

    // 1. Cek apakah ini balasan HADIR untuk UMKM
    if (messageText.includes('hadir')) {
      const fonnteToken = process.env.FONNTE_TOKEN;
      const replyMessage = `Terima kasih atas konfirmasinya! 🎉\n\nBerikut adalah link Grup WhatsApp resmi peserta Sharing UMKM:\n👉 https://chat.whatsapp.com/Fkn3RcnNI8nBUqUQ0ErhJA\n\nSilakan klik link di atas dan sampai jumpa di dalam grup!`;

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
      
      return NextResponse.json({ status: 'success', handledBy: 'UMKM_Proxy' }, { status: 200 });
    }

    // 2. FORWARD / TERUSKAN ke sistem lama jika bukan kata 'hadir'
    // Ini menjaga agar bot/sistem lama Anda (ubos-a43h) tetap hidup 100%
    const oldSystemUrl = 'https://ubos-a43h.vercel.app/api/webhooks/fonnte';
    
    if (oldSystemUrl) {
      await fetch(oldSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        body: rawBody,
      });
    }

    return NextResponse.json({ status: 'forwarded' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Proxy Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
