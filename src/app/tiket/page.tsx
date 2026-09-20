'use client';

import { useState, useRef } from 'react';
import { Loader2, Search, CheckCircle2, XCircle, Ticket, MapPin, Calendar, Clock, DownloadCloud } from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

export default function CekTiket() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [peserta, setPeserta] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/cek-tiket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_whatsapp: phone })
      });
      
      const result = await res.json();
      
      if (res.ok && result.data) {
        setPeserta(result.data);
        setStatus('found');
      } else {
        setErrorMsg(result.message || 'Data tidak ditemukan');
        setStatus('not-found');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi internet');
      setStatus('not-found');
    }
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    
    try {
      // Menggunakan html-to-image yang lebih stabil untuk vektor/SVG & bayangan
      const dataUrl = await toPng(ticketRef.current, { 
        quality: 1.0,
        pixelRatio: 2, // Resolusi HD (Retina)
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      const safeName = peserta.nama_lengkap.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `E-Ticket_UMKM_${safeName}.png`;
      link.click();
    } catch (e: any) {
      console.error(e);
      alert("Sistem gagal meng-convert gambar (" + e.message + "). Silakan screenshot manual.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ornamen Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/50 blur-[100px]"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-200/40 blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        {/* Header E-Ticket */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30 rotate-3 transition-transform hover:rotate-0">
            <Ticket className="w-10 h-10 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">Cek Status E-Ticket</h1>
          <p className="text-gray-500 text-sm px-4 leading-relaxed">
            Masukkan Nomor WhatsApp yang Anda gunakan saat mendaftar acara Sharing UMKM 2026.
          </p>
        </div>

        {/* Kotak Pencarian Mobile-First */}
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
              {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek Status'}
            </button>
          </form>
        </div>

        {/* Kartu Hasil: Terdaftar (Visible UI - Mobile Friendly) */}
        {status === 'found' && peserta && (
          <div className="animate-in zoom-in duration-300">
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/5 border border-blue-100 relative overflow-hidden mb-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="w-10 h-10 text-green-500 drop-shadow-sm" />
                  <div>
                    <h3 className="font-extrabold text-green-600 text-lg leading-tight uppercase tracking-wider">Terdaftar Resmi</h3>
                    <p className="text-xs text-gray-400 font-medium">Data diverifikasi oleh sistem</p>
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Peserta</p>
                    <p className="text-2xl font-extrabold text-gray-800 tracking-tight">{peserta.nama_lengkap}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Usaha / Bisnis</p>
                    <p className="text-lg font-bold text-blue-600">{peserta.nama_usaha}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Senin, 21 September 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span>08:30 - 11:30 WIB</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="leading-snug">Aula Kantor DPD PKS Kalimalang, Bekasi</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] disabled:opacity-70"
            >
              {isDownloading ? <Loader2 className="w-6 h-6 animate-spin" /> : <DownloadCloud className="w-6 h-6" />}
              {isDownloading ? 'Memproses E-Card...' : 'Download E-Card (Kartu VIP)'}
            </button>
          </div>
        )}

        {/* Kartu Hasil: Tidak Ditemukan */}
        {status === 'not-found' && (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border border-red-50 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="font-extrabold text-gray-800 text-xl mb-2">Waduh, Data Tidak Ditemukan!</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">{errorMsg}</p>
            <Link href="/">
              <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl transition-all">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        )}

      </div>

      {/* HIDDEN ATM CARD TEMPLATE (Only for Download Image) */}
      {status === 'found' && peserta && (
        <div className="fixed top-[200%] left-[200%] pointer-events-none">
          <div 
            ref={ticketRef}
            className="w-[1011px] h-[638px] rounded-[40px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-16 relative overflow-hidden flex flex-col justify-between shadow-2xl"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Background Ornaments / Glow */}
            <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-blue-600/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent opacity-50 border-[2px] border-white/20 rounded-[40px]"></div>

            {/* Top Section */}
            <div className="flex justify-between items-start z-10 w-full">
              <div>
                <h2 className="text-[40px] font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 uppercase leading-none">
                  Sharing UMKM 2026
                </h2>
                <p className="text-blue-400/80 tracking-[0.3em] text-xl mt-3 uppercase font-bold">Official E-Ticket VIP</p>
              </div>
              <div className="flex items-center gap-6">
                {/* Contactless Icon */}
                <svg className="w-14 h-14 text-slate-300/80 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.007v.008H12v-.008z" />
                </svg>
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 font-black px-8 py-3 rounded-2xl text-2xl tracking-[0.2em] shadow-lg border-2 border-yellow-200/50">
                  VIP
                </div>
              </div>
            </div>

            {/* Middle Section: Fake EMV Chip */}
            <div className="z-10 mt-6">
              <div className="w-28 h-20 rounded-xl border-2 border-yellow-600/50 bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute w-full h-[2px] bg-yellow-700/30 top-1/2"></div>
                <div className="absolute h-full w-[2px] bg-yellow-700/30 left-1/3"></div>
                <div className="absolute h-full w-[2px] bg-yellow-700/30 right-1/3"></div>
                <div className="w-14 h-10 border-2 border-yellow-700/40 rounded-md"></div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end z-10 w-full mt-auto">
              <div className="space-y-8">
                <div>
                  <p className="text-slate-400/80 text-lg font-bold tracking-[0.3em] uppercase mb-2">Cardholder Name</p>
                  <p className="text-5xl font-black tracking-widest uppercase text-white drop-shadow-md truncate max-w-[600px]">
                    {peserta.nama_lengkap}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400/80 text-lg font-bold tracking-[0.3em] uppercase mb-2">Business Type</p>
                  <p className="text-3xl font-bold text-cyan-400 tracking-wider truncate max-w-[600px]">
                    {peserta.nama_usaha}
                  </p>
                </div>
              </div>
              
              {/* Event Info */}
              <div className="text-right border-l-4 border-slate-700/50 pl-10 space-y-4 pb-2">
                <p className="text-2xl font-bold text-slate-300 tracking-wider">21 SEPT 2026</p>
                <p className="text-2xl font-bold text-slate-300 tracking-wider">08:30 WIB</p>
                <p className="text-xl font-black text-blue-400 tracking-[0.2em] uppercase mt-6 bg-blue-900/40 px-4 py-2 rounded-lg border border-blue-500/30">
                  DPD PKS Kalimalang
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
