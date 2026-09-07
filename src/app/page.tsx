'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Digitalisasi UMKM 2026</h1>
          <p className="text-blue-100">21 September 2026</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-gray-600 mb-6">
                Terima kasih telah mendaftar. Pesan konfirmasi telah dikirim ke nomor WhatsApp Anda.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Daftar Peserta Lain
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Form Pendaftaran</h2>
                <p className="text-gray-500 text-sm mt-1">Lengkapi data diri dan usaha Anda di bawah ini.</p>
              </div>

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="namaLengkap"
                    name="namaLengkap"
                    required
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label htmlFor="namaUsaha" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Usaha / UMKM
                  </label>
                  <input
                    type="text"
                    id="namaUsaha"
                    name="namaUsaha"
                    required
                    value={formData.namaUsaha}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="Contoh: Kopi Kenangan"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label htmlFor="noWhatsapp" className="block text-sm font-medium text-gray-700 mb-1.5">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="noWhatsapp"
                    name="noWhatsapp"
                    required
                    value={formData.noWhatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="Contoh: 08123456789"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Gunakan format 08x atau 628x.</p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    'Daftar Sekarang'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
