import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'adminlog2026';

export async function GET(request: Request) {
  try {
    if (request.headers.get('x-admin-password') !== getAdminPassword()) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('peserta')
      .select('*')
      .neq('nama_usaha', '__KUIS__')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (request.headers.get('x-admin-password') !== getAdminPassword()) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

    const { error } = await supabaseAdmin.from('peserta').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: 'Berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (request.headers.get('x-admin-password') !== getAdminPassword()) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const body = await request.json();
    const { id, nama_lengkap, nama_usaha, email, no_whatsapp } = body;
    
    if (!id) return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });

    const cleanWhatsapp = no_whatsapp ? no_whatsapp.replace(/\D/g, '') : undefined;

    const { error } = await supabaseAdmin.from('peserta').update({
      nama_lengkap,
      nama_usaha,
      email,
      no_whatsapp: cleanWhatsapp
    }).eq('id', id);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Email sudah terdaftar (Duplikat)' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Berhasil diperbarui' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (request.headers.get('x-admin-password') !== getAdminPassword()) {
      return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
    }

    const body = await request.json();
    const { nama_lengkap, nama_usaha, email, no_whatsapp } = body;
    
    if (!nama_lengkap || !nama_usaha || !no_whatsapp) {
      return NextResponse.json({ message: 'Data belum lengkap' }, { status: 400 });
    }

    const cleanWhatsapp = no_whatsapp.replace(/\D/g, '');

    const { data, error } = await supabaseAdmin.from('peserta').insert([{
      nama_lengkap,
      nama_usaha,
      email: email || `${cleanWhatsapp}@noemail.com`, // fallback for unique constraint if email is empty
      no_whatsapp: cleanWhatsapp
    }]).select();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Email atau WA sudah terdaftar (Duplikat)' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Peserta berhasil ditambahkan', data: data[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menambah data' }, { status: 500 });
  }
}
