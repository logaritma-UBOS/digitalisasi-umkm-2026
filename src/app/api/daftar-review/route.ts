import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const nama_pemilik = formData.get('nama_pemilik') as string;
    const no_whatsapp = formData.get('no_whatsapp') as string;
    const nama_usaha = formData.get('nama_usaha') as string;
    const kategori_usaha = formData.get('kategori_usaha') as string;
    const alamat = formData.get('alamat') as string;
    const jenis_peliputan = formData.get('jenis_peliputan') as string;
    const menu_jagoan = formData.get('menu_jagoan') as string;
    const keunikan_usaha = formData.get('keunikan_usaha') as string;
    const sosmed = formData.get('sosmed') as string;
    
    // Extract file
    const bukti_subscribe = formData.get('bukti_subscribe') as File;

    if (!nama_pemilik || !no_whatsapp || !nama_usaha || !kategori_usaha || !alamat || !jenis_peliputan || !menu_jagoan || !keunikan_usaha || !sosmed || !bukti_subscribe) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    let bukti_subscribe_url = '';

    // Upload file to Supabase Storage if it exists and is a File
    if (bukti_subscribe && typeof bukti_subscribe !== 'string') {
      const bytes = await bukti_subscribe.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileExt = bukti_subscribe.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('bukti_subscribe')
        .upload(fileName, buffer, {
          contentType: bukti_subscribe.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return NextResponse.json({ message: 'Gagal mengunggah file bukti' }, { status: 500 });
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('bukti_subscribe')
        .getPublicUrl(fileName);
        
      bukti_subscribe_url = publicUrl;
    }

    // Insert to database
    const { error: insertError } = await supabaseAdmin
      .from('pendaftaran_review')
      .insert([
        {
          nama_pemilik,
          no_whatsapp,
          nama_usaha,
          kategori_usaha,
          alamat,
          jenis_peliputan,
          menu_jagoan,
          keunikan_usaha,
          sosmed,
          bukti_subscribe_url
        }
      ]);

    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json({ message: 'Gagal menyimpan data ke database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Pendaftaran berhasil' }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
