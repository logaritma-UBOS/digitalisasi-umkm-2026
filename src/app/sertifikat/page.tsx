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
          className="w-[1123px] h-[794px] bg-white relative overflow-hidden flex flex-col items-center text-center font-sans shadow-2xl"
        >
          {/* GEOMETRIC HEADER (Reference Image 2) */}
          <svg width="100%" height="320" viewBox="0 0 1123 320" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[320px] z-0">
            {/* Geometric Polygons Pattern */}
            <polygon points="0,0 400,0 500,280 0,320" fill="#e11d48" /> {/* Red */}
            <polygon points="300,0 800,0 650,320 400,280" fill="#0ea5e9" /> {/* Light Blue */}
            <polygon points="700,0 1123,0 1123,240 600,320" fill="#0d9488" /> {/* Teal */}
            <polygon points="900,0 1123,0 1123,120" fill="#facc15" /> {/* Yellow */}
            <polygon points="0,0 250,0 200,180 0,120" fill="#be123c" /> {/* Darker Red */}
            <polygon points="800,0 950,0 900,100 850,50" fill="#14b8a6" /> {/* Lighter Teal */}
            
            {/* Curved White Bottom Overlay */}
            <path d="M0,280 C350,80 750,80 1123,220 L1123,320 L0,320 Z" fill="#ffffff" />
          </svg>

          {/* LOGO (Reference Image 3) */}
          <img 
            src="/logo-sharing-umkm.jpg" 
            alt="Logo UMKM" 
            className="absolute top-12 left-16 w-[120px] h-[120px] object-contain rounded-full shadow-md z-10 border-4 border-white bg-white"
          />

          {/* TEXT CONTENT */}
          <div className="z-10 mt-[170px] flex flex-col items-center w-full px-20">
            <h1 className="text-[68px] font-medium text-slate-900 tracking-[0.25em] mb-1 uppercase">
              SERTIFIKAT
            </h1>
            
            <p className="text-[17px] text-slate-700 tracking-wider mb-12 font-medium">
              NOMOR: 001/UMKM-DIGITAL/IX/2026
            </p>
            
            <p className="text-[20px] font-bold text-slate-800 tracking-widest mb-6 uppercase">
              Sertifikat Ini Diberikan Kepada
            </p>
            
            <h2 className="text-[60px] font-bold text-teal-600 mb-6 border-b-2 border-slate-300 pb-2 px-20 capitalize">
              {namaPeserta}
            </h2>
            
            <p className="text-[22px] font-medium text-slate-600 tracking-wide mb-4 uppercase">
              Atas Partisipasinya Sebagai <span className="font-black text-slate-900">PESERTA</span>
            </p>
            
            <p className="text-[17px] text-slate-500 max-w-4xl leading-relaxed font-medium uppercase px-12">
              Pada Kegiatan <strong className="text-slate-600">Bimbingan Teknis "Sharing UMKM: Dari Manual Ke Digital"</strong><br/>
              Solusi Anti Ribet Catat Keuangan & Tarik Pembeli<br/>
              Yang Dilaksanakan Pada Senin, 21 September 2026 Pukul 08.30 - 11.30 WIB.
            </p>
          </div>
          
          {/* SIGNATURES */}
          <div className="flex justify-between w-full max-w-[900px] mt-auto pb-12 z-10 px-8">
            <div className="text-center w-72">
              <p className="text-[17px] text-slate-500 mb-20">Ketua Pelaksana</p>
              <div className="border-b-[1px] border-slate-400 mx-auto w-full relative">
                 {/* Empty space for actual signature */}
              </div>
              <p className="font-bold text-[18px] text-slate-700 mt-2">Wendi Suwandana</p>
            </div>
            
            <div className="text-center w-72">
              <p className="text-[17px] text-slate-500 mb-1">Bekasi, 21 September 2026</p>
              <p className="text-[17px] text-slate-500 mb-12">Pemateri Ahli</p>
              <div className="border-b-[1px] border-slate-400 mx-auto w-full relative">
              </div>
              <p className="font-bold text-[18px] text-slate-700 mt-2">Logaritma Team</p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
