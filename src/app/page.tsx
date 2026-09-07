'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Calendar, MapPin, Clock } from 'lucide-react';

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

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 border border-white">
        
        {/* Left Side - Invitation Detail (Hero) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Subtle overlay pattern/glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-blue-200 font-medium tracking-widest text-xs md:text-sm mb-3 uppercase">Undangan Eksklusif</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Digitalisasi<br/>UMKM 2026</h1>
            <p className="text-blue-100/90 mb-8 leading-relaxed text-sm md:text-base font-light">
              Mari bergabung bersama ratusan pelaku UMKM lainnya dalam transformasi digital terbesar tahun ini. Tingkatkan omzet dan perluas pasar Anda ke level selanjutnya!
            </p>

            <div className="space-y-5 text-sm md:text-base">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <Calendar className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <p className="font-semibold tracking-wide">Senin, 21 Sept 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <p className="font-semibold tracking-wide">09:00 - 15:00 WIB</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <p className="font-semibold tracking-wide">Grand Ballroom Hotel</p>
                  <p className="text-blue-200/80 text-xs mt-0.5">Tersedia opsi via Zoom Meeting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-14 bg-white flex flex-col justify-center">
          {status === 'success' ? (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Pendaftaran Berhasil!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Terima kasih telah mendaftar. Tiket eksklusif dan pesan konfirmasi telah dikirim ke nomor WhatsApp Anda.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-semibold transition-colors"
              >
                Daftar Peserta Lain
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Reservasi Tiket</h2>
                <p className="text-gray-500 text-sm md:text-base">Silakan lengkapi data diri dan usaha Anda di bawah ini untuk mengamankan kursi.</p>
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4 md:space-y-0 md:flex md:gap-5">
                  <div className="w-full">
                    <label htmlFor="namaLengkap" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="namaLengkap"
                      name="namaLengkap"
                      required
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="Sesuai KTP"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="namaUsaha" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nama Usaha
                    </label>
                    <input
                      type="text"
                      id="namaUsaha"
                      name="namaUsaha"
                      required
                      value={formData.namaUsaha}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800"
                      placeholder="Merek / Toko Anda"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="noWhatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="noWhatsapp"
                    name="noWhatsapp"
                    required
                    value={formData.noWhatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="Contoh: 08123456789"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 ml-1">E-Ticket akan dikirimkan ke nomor ini.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Mengamankan Kursi...
                      </>
                    ) : (
                      'Konfirmasi Kehadiran'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
