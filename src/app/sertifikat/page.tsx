'use client';

import { useState, useRef } from 'react';
import { Search, Loader2, Download, AlertCircle, Award, CheckCircle2, ChevronLeft } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';

export default function SertifikatPage() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [namaPeserta, setNamaPeserta] = useState('');
  
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/cek-sertifikat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setNamaPeserta(data.nama_lengkap);
        setStatus('success');
      } else {
        setErrorMessage(data.message || 'Gagal mengecek data');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan koneksi');
      setStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(certificateRef.current, { 
        quality: 1.0,
        pixelRatio: 2 // Resolusi tinggi untuk cetak
      });
      const link = document.createElement('a');
      link.download = `Sertifikat_SharingUMKM_${namaPeserta.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Gagal mengunduh sertifikat. Coba gunakan browser Chrome/Safari.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Tombol Kembali */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm">
        <ChevronLeft className="w-5 h-5" /> Kembali
      </Link>

      <div className="max-w-xl w-full z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Portal E-Sertifikat</h1>
          <p className="text-slate-500 text-lg">Masukkan nomor WhatsApp yang Anda gunakan saat mendaftar acara Sharing UMKM.</p>
        </div>

        {status === 'error' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in shake duration-300">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 font-medium">{errorMessage}</p>
          </div>
        )}

        {status !== 'success' && (
          <div className="bg-white p-3 sm:p-2 rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <form onSubmit={handleCek} className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0">
              <div className="flex-1 flex items-center w-full bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
                <div className="pl-4 pr-2 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="flex-1 py-4 px-2 outline-none text-gray-800 bg-transparent font-medium w-full min-w-0"
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading' || !phone.trim()}
                className="w-full sm:w-auto shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 sm:py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_15px_-5px_rgba(37,99,235,0.4)]"
              >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek Sertifikat'}
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Sertifikat Ditemukan!</h2>
            <p className="text-slate-600 mb-8">Halo <strong className="text-blue-700">{namaPeserta}</strong>, sertifikat Anda sudah siap diunduh.</p>
            
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isDownloading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              {isDownloading ? 'Memproses Gambar...' : 'Download Sertifikat (Resolusi Tinggi)'}
            </button>
            <button 
              onClick={() => { setStatus('idle'); setPhone(''); }}
              className="mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              Cek nomor lain
            </button>
          </div>
        )}
      </div>

      {/* Hidden Certificate Template for HTML-to-Image (Fixed A4 Landscape proportion 1123x794 px) */}
      <div className="fixed top-[200%] pointer-events-none">
        <div 
          ref={certificateRef}
          className="w-[1123px] h-[794px] bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden border-[16px] border-double border-blue-900 flex flex-col items-center text-center font-sans"
        >
          {/* Header Graphic */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-700 to-indigo-900 shadow-xl"></div>
          
          <Award className="w-24 h-24 text-yellow-500 drop-shadow-md mb-6 mt-16 z-10" />
          
          <h1 className="text-[54px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-700 tracking-[0.2em] uppercase mb-2 z-10">
            Sertifikat Penghargaan
          </h1>
          
          <p className="text-2xl text-blue-800/80 tracking-widest mb-16 z-10 uppercase font-semibold">
            Diberikan dengan penuh rasa bangga kepada:
          </p>
          
          <h2 className="text-[68px] font-bold text-slate-900 mb-8 font-serif italic border-b-[3px] border-slate-300 pb-4 px-24 z-10">
            {namaPeserta}
          </h2>
          
          <p className="text-3xl text-slate-700 max-w-4xl leading-snug z-10 font-medium">
            Atas partisipasi dan antusiasmenya sebagai <strong className="text-blue-800 font-bold">PESERTA</strong> dalam acara<br/>
            <span className="text-blue-900 font-bold mt-2 inline-block">"Sharing UMKM: Dari Manual ke Digital"</span><br/>
            <span className="text-2xl text-slate-500">Solusi Anti Ribet Catat Keuangan & Tarik Pembeli</span>
          </p>
          
          <p className="text-2xl text-slate-500 mt-10 font-semibold z-10">Bekasi, 21 September 2026</p>
          
          {/* Signatures */}
          <div className="flex justify-between w-full max-w-4xl mt-auto pt-8 mb-12 z-10">
            <div className="text-center">
              <div className="w-64 h-32 border-b-2 border-slate-400 relative">
                 {/* Fake Signature Vector could go here, for now empty space for actual signature */}
              </div>
              <p className="font-bold text-2xl text-slate-800 mt-4">Ketua Pelaksana</p>
            </div>
            <div className="text-center">
              <div className="w-64 h-32 border-b-2 border-slate-400 relative">
              </div>
              <p className="font-bold text-2xl text-slate-800 mt-4">Pemateri Ahli</p>
            </div>
          </div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-tr-full opacity-50 -z-0"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-tl-full opacity-50 -z-0"></div>
        </div>
      </div>

    </main>
  );
}
