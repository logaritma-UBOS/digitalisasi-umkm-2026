'use client';

import { useState } from 'react';
import { Poppins } from 'next/font/google';
import { Loader2, UploadCloud, CheckCircle2, PlayCircle, MapPin, User, Camera, Star } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export default function DaftarReviewPage() {
  const [formData, setFormData] = useState({
    nama_pemilik: '',
    no_whatsapp: '',
    nama_usaha: '',
    kategori_usaha: '',
    alamat: '',
    jenis_peliputan: '',
    menu_jagoan: '',
    keunikan_usaha: '',
    sosmed: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMsg('Ukuran file maksimal 5MB');
        return;
      }
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Mohon unggah bukti subscribe');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      submitData.append('bukti_subscribe', file);

      const res = await fetch('/api/daftar-review', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.message || 'Gagal mengirim pendaftaran');
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan koneksi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className={`min-h-screen bg-slate-50 flex items-center justify-center p-4 ${poppins.className}`}>
        <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Terima kasih sudah mendaftarkan usaha Anda! Tim kami akan meninjau data yang masuk. Jika usaha Anda terpilih untuk batch tayang minggu ini, kami akan langsung menghubungi via WhatsApp untuk teknis peliputan.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors shadow-md"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#f8f9fa] py-12 px-4 ${poppins.className}`}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
            <PlayCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Pendaftaran Liputan & Review Usaha
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              "kita mulai."
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Halo Bapak/Ibu pejuang UMKM! Formulir ini dibuat khusus untuk mendata usaha rekan-rekan yang siap kami review dan promosikan di channel YouTube "kita mulai.". Tim kami akan mengurasi profil usaha yang masuk dan menghubungi Anda untuk jadwal penayangan.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-red-500 to-orange-400"></div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">
            
            {/* Section 1: Data Pemilik & Usaha */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg"><User className="w-5 h-5 text-blue-600" /></div>
                <h2 className="text-xl font-bold text-gray-800">1. Data Pemilik & Usaha</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nama Pemilik <span className="text-red-500">*</span></label>
                  <input type="text" name="nama_pemilik" required value={formData.nama_pemilik} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Sesuai KTP/Panggilan" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nomor WhatsApp Aktif <span className="text-red-500">*</span></label>
                  <input type="tel" name="no_whatsapp" required value={formData.no_whatsapp} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Contoh: 08123456789 (Untuk koordinasi tim)" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nama Brand/Usaha <span className="text-red-500">*</span></label>
                  <input type="text" name="nama_usaha" required value={formData.nama_usaha} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Contoh: Ayam Bakar Pak Kumis" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Kategori Usaha <span className="text-red-500">*</span></label>
                  <select name="kategori_usaha" required value={formData.kategori_usaha} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                    <option value="" disabled>Pilih Kategori...</option>
                    <option value="Kuliner">Kuliner</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Jasa">Jasa</option>
                    <option value="Fashion & Kriya">Fashion & Kriya</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 2: Lokasi & Skema Review */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg"><MapPin className="w-5 h-5 text-orange-600" /></div>
                <h2 className="text-xl font-bold text-gray-800">2. Lokasi & Skema Review</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Alamat / Kota Usaha <span className="text-red-500">*</span></label>
                <textarea name="alamat" required value={formData.alamat} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none" placeholder="Tuliskan alamat lengkap agar mudah memetakan lokasi liputan langsung..." />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">Jenis Peliputan yang Memungkinkan <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-colors bg-white">
                    <input type="radio" name="jenis_peliputan" value="Siap dikunjungi / liputan langsung ke lokasi (Onsite)" onChange={handleChange} required className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                    <span className="text-gray-700 font-medium leading-tight">Siap dikunjungi / liputan langsung ke lokasi (Onsite)</span>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-colors bg-white">
                    <input type="radio" name="jenis_peliputan" value="Kirim sampel produk untuk di-review tim (khusus makanan tahan lama/produk fisik)" onChange={handleChange} required className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                    <span className="text-gray-700 font-medium leading-tight">Kirim sampel produk untuk di-review tim (khusus makanan tahan lama/produk fisik)</span>
                  </label>
                  <label className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-colors bg-white">
                    <input type="radio" name="jenis_peliputan" value="Wawancara / Bedah bisnis online (Zoom/Video Call)" onChange={handleChange} required className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                    <span className="text-gray-700 font-medium leading-tight">Wawancara / Bedah bisnis online (Zoom/Video Call)</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Section 3: Daya Tarik Usaha */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg"><Star className="w-5 h-5 text-purple-600" /></div>
                <h2 className="text-xl font-bold text-gray-800">3. Daya Tarik Usaha (Untuk Bahan Cerita Konten)</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Produk / Menu Jagoan <span className="text-red-500">*</span></label>
                <input type="text" name="menu_jagoan" required value={formData.menu_jagoan} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Apa menu/produk yang paling laris dan wajib dicoba?" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Keunikan Usaha <span className="text-red-500">*</span></label>
                <textarea name="keunikan_usaha" required value={formData.keunikan_usaha} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none" placeholder="Apa yang membedakan produk Anda dari kompetitor sejenis?" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Akun Media Sosial Usaha <span className="text-red-500">*</span></label>
                <input type="text" name="sosmed" required value={formData.sosmed} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Link Instagram / TikTok / Google Maps" />
              </div>
            </section>

            {/* Section 4: Bukti Dukungan */}
            <section className="space-y-6 bg-gray-50 -mx-6 md:-mx-10 px-6 md:px-10 py-8 border-y border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg"><Camera className="w-5 h-5 text-red-600" /></div>
                <h2 className="text-xl font-bold text-gray-800">4. Bukti Dukungan (Syarat Kurasi)</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6">Syarat wajib untuk lolos tahap seleksi awal.</p>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Bukti Sudah Subscribe Channel "kita mulai." <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-500 mb-2">Unggah screenshot bukti subscribe YouTube & follow medsos kami.</p>
                
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl hover:border-red-400 transition-colors bg-white overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    {filePreview ? (
                      <div className="space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={filePreview} alt="Preview" className="max-h-40 rounded-lg mx-auto shadow-sm" />
                        <p className="text-sm text-green-600 font-semibold">{file?.name}</p>
                        <p className="text-xs text-gray-400">Klik atau drag untuk mengganti gambar</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-semibold text-gray-700">Pilih File Screenshot</p>
                        <p className="text-xs text-gray-400 mt-1">Maksimal 5MB (JPG, PNG)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Mengirim Data...
                </>
              ) : (
                'Daftarkan Usaha Saya Sekarang'
              )}
            </button>
            
          </form>
        </div>
      </div>
    </main>
  );
}
