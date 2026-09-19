'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Calendar, MapPin, Clock, Lock } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaUsaha: '',
    email: '',
    noWhatsapp: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/daftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar');
      }

      setStatus('success');
      setFormData({
        namaLengkap: '',
        namaUsaha: '',
        email: '',
        noWhatsapp: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/50 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-200/40 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row z-10 relative">
        
        {/* Left Side - Invitation Detail (Hero) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl md:rounded-r-none md:rounded-l-[2rem] p-8 md:p-12 pb-16 md:pb-12 flex flex-col justify-center text-white relative overflow-hidden shadow-xl">
          {/* Subtle overlay pattern/glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-blue-200 font-medium tracking-widest text-xs md:text-sm mb-3 uppercase drop-shadow-sm">Undangan Eksklusif</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight drop-shadow-sm">Sharing UMKM</h1>
            
            {/* TWEAK 2: Warna Aksen Emas Pastel & Italic untuk Tema */}
            <h2 className="text-lg md:text-xl font-medium text-yellow-300/90 italic mb-6 leading-snug drop-shadow-md">
              "Dari Manual ke Digital: Solusi Anti Ribet Catat Keuangan & Tarik Pembeli"
            </h2>
            
            <p className="text-blue-50/90 mb-8 leading-relaxed text-sm md:text-base font-light">
              Mari bergabung bersama ratusan pelaku UMKM lainnya dalam transformasi digital terbesar tahun ini. Tingkatkan omset dan perluas pasar Anda ke level selanjutnya!
            </p>

            {/* TWEAK 3: Spacing & Jarak Ikon Diperlonggar */}
            <div className="space-y-6 text-sm md:text-base mt-8">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-full bg-white/15 shadow-inner flex items-center justify-center shrink-0 backdrop-blur-md">
                  <Calendar className="w-5 h-5 text-blue-50" />
                </div>
                <div>
                  <p className="font-semibold tracking-wide">Senin, 21 Sept 2026</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-full bg-white/15 shadow-inner flex items-center justify-center shrink-0 backdrop-blur-md">
                  <Clock className="w-5 h-5 text-blue-50" />
                </div>
                <div>
                  <p className="font-semibold tracking-wide">08:30 - 11:30 WIB</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-full bg-white/15 shadow-inner flex items-center justify-center shrink-0 backdrop-blur-md">
                  <MapPin className="w-5 h-5 text-blue-50" />
                </div>
                <div>
                  <a href="https://maps.app.goo.gl/GFPoSw99EN58zva16?g_st=aw" target="_blank" rel="noopener noreferrer" className="group cursor-pointer block">
                    <p className="font-semibold tracking-wide group-hover:underline transition-all">Aula Kantor DPD PKS Kalimalang</p>
                    <p className="text-blue-200/80 text-[13px] mt-1 group-hover:text-blue-100 transition-all flex items-center gap-1">Lihat di Google Maps &rarr;</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section (TWEAK 1: Overlap Transition & Rounded Corners) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-14 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.1)] z-20 relative -mt-8 md:mt-0 md:-ml-8 flex flex-col justify-center border border-white">
          <div className="animate-in fade-in zoom-in duration-500 text-center py-10">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Pendaftaran Ditutup</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Mohon maaf, kuota peserta untuk acara Sharing UMKM telah terpenuhi dan pendaftaran resmi ditutup.
            </p>
            <div className="inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl">
              Terima kasih atas antusiasme Anda!
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
