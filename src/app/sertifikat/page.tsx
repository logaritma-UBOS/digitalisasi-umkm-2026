'use client';

import { useState, useRef } from 'react';
import { Search, Loader2, Download, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

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
    <main className={`min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden ${poppins.className}`}>

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
          className={`w-[1123px] h-[794px] bg-[#fcfbf8] relative overflow-hidden flex flex-col shadow-2xl border-[24px] border-[#3b0764] ${poppins.className}`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Top Left "20 26" Box */}
          <div className="absolute top-0 left-0 w-[200px] h-[380px] bg-[#3b0764] overflow-hidden flex flex-col items-center pt-12 z-0 rounded-br-[40px]">
            {/* Topo lines SVG */}
            <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full opacity-20 z-0">
              <path d="M-50,50 Q50,-20 150,50 T350,50" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-50,80 Q50,10 150,80 T350,80" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-50,110 Q50,40 150,110 T350,110" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,200 C80,100 120,300 250,200" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,230 C80,130 120,330 250,230" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,260 C80,160 120,360 250,260" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,290 C80,190 120,390 250,290" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <span className="text-white font-black text-[100px] leading-[0.85] z-10">20</span>
            <span className="text-white font-black text-[100px] leading-[0.85] z-10">26</span>
          </div>

          {/* Bottom Right Vertical Box */}
          <div className="absolute bottom-0 right-0 w-[160px] h-[380px] bg-[#3b0764] overflow-hidden flex items-center justify-center z-0 rounded-tl-[40px]">
            <svg viewBox="0 0 160 400" className="absolute inset-0 w-full h-full opacity-20 z-0">
              <path d="M-50,50 Q50,-20 150,50 T350,50" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-50,80 Q50,10 150,80 T350,80" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,200 C80,100 120,300 250,200" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M-20,230 C80,130 120,330 250,230" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            <span className="text-white font-black text-[54px] tracking-widest z-10" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              SHARING UMKM
            </span>
          </div>

          {/* Top Right Geometric Shapes */}
          <div className="absolute top-[40px] right-0 grid grid-cols-3 w-[180px] h-[240px] z-0 opacity-100">
            <div className="bg-[#7e22ce] rounded-br-full"></div>
            <div className="bg-[#3b0764] rounded-bl-full"></div>
            <div className="bg-[#c026d3] rounded-tl-full"></div>
            
            <div className="bg-[#a21caf] rounded-tr-full"></div>
            <div className="bg-[#7e22ce] rounded-full scale-75"></div>
            <div className="bg-[#3b0764] rounded-br-full"></div>
            
            <div className="bg-[#c026d3] rounded-bl-full"></div>
            <div className="bg-[#a21caf] rounded-tl-full"></div>
            <div className="bg-[#7e22ce] rounded-tr-full"></div>
            
            <div className="bg-[#3b0764] rounded-br-full"></div>
            <div className="bg-[#c026d3] rounded-bl-full"></div>
            <div className="bg-[#a21caf] rounded-tl-full"></div>
          </div>

          {/* Bottom Left Geometric Shapes */}
          <div className="absolute bottom-[40px] left-[176px] grid grid-cols-3 w-[180px] h-[180px] z-0 opacity-100">
            <div className="bg-[#3b0764] rounded-tr-full"></div>
            <div className="bg-[#7e22ce] rounded-bl-full"></div>
            <div className="bg-[#c026d3] rounded-br-full"></div>
            
            <div className="bg-[#a21caf] rounded-tl-full"></div>
            <div className="bg-[#3b0764] rounded-tr-full"></div>
            <div className="bg-[#7e22ce] rounded-bl-full"></div>
            
            <div className="bg-[#c026d3] rounded-br-full"></div>
            <div className="bg-[#a21caf] rounded-tl-full"></div>
            <div className="bg-[#3b0764] rounded-tr-full"></div>
          </div>

          {/* Logo Section */}
          <div className="absolute top-[40px] left-[220px] z-10 flex items-center gap-4">
             <img src="/logo-sharing-umkm.jpg" className="w-[70px] h-[70px] object-contain rounded-full shadow-sm" />
             <div className="text-left leading-tight">
                <p className="text-[14px] font-black text-[#3b0764]">DIGITALISASI UMKM</p>
                <p className="text-[12px] font-bold text-gray-500">KOTA BEKASI 2026</p>
             </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="relative z-10 flex flex-col items-center justify-start w-full h-full px-[180px] pt-[60px] pb-[40px]">
            <h1 className="text-[90px] font-black text-[#3b0764] tracking-tight mb-0 capitalize" style={{ letterSpacing: '-0.02em' }}>
              Sertifikat
            </h1>
            
            <p className="text-[15px] font-bold text-[#3b0764] tracking-widest mb-6">
              Nomor : 042/Pan-SharingUMKM/IX/2026
            </p>
            
            <p className="text-[18px] text-gray-700 font-medium mb-2">
              Diberikan Kepada:
            </p>
            
            <div className="w-full border-b-[3px] border-[#3b0764] mb-4 flex justify-center pb-2">
              <h2 className="text-[52px] font-black text-[#3b0764] capitalize truncate px-8 max-w-[700px]">
                {namaPeserta}
              </h2>
            </div>
            
            <p className="text-[18px] text-gray-700 font-medium mb-1">
              Sebagai :
            </p>
            
            <p className="text-[28px] font-black text-[#3b0764] mb-4">
              Peserta
            </p>
            
            <p className="text-[14px] text-gray-700 max-w-[650px] leading-[1.6] font-medium text-center">
              Acara Edukasi dan Bimbingan Teknis <strong className="text-[#3b0764]">"Sharing UMKM: Dari Manual Ke Digital - Solusi Anti Ribet Catat Keuangan & Tarik Pembeli"</strong> yang diselenggarakan di Aula Kantor DPD PKS Kalimalang pada tanggal 21 September 2026.
            </p>

            {/* Signatures */}
            <div className="flex justify-between w-full max-w-[650px] mt-auto pt-6 z-10 px-4">
              <div className="text-center w-64">
                <p className="text-[14px] font-bold text-[#3b0764] mb-16">Ketua Pelaksana</p>
                <p className="font-bold text-[16px] text-[#3b0764] border-b-[2px] border-[#3b0764] pb-1 inline-block px-4">Wendi Suwandana</p>
              </div>
              
              <div className="text-center w-64">
                <p className="text-[14px] font-bold text-[#3b0764] mb-16">Pemateri Ahli</p>
                <p className="font-bold text-[16px] text-[#3b0764] border-b-[2px] border-[#3b0764] pb-1 inline-block px-4">Logaritma Team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
