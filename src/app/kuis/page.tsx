'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, Loader2 } from 'lucide-react';

const QUIZ_DATA = [
  {
    question: "Apa keuntungan utama mencatat keuangan usaha secara digital (menggunakan aplikasi) dibandingkan manual di buku?",
    options: [
      "A. Membuat data lebih mudah hilang jika HP rusak",
      "B. Riwayat transaksi otomatis terekap, transparan, & mudah dievaluasi",
      "C. Membutuhkan waktu yang lebih lama setiap harinya",
      "D. Hanya bisa diakses oleh akuntan profesional"
    ],
    correctAnswer: 1, // Index B
    explanation: "Pencatatan digital mengotomatisasi hitungan laba-rugi, meminimalisir 'human error' (salah hitung), dan memudahkan evaluasi kesehatan bisnis secara real-time kapan pun."
  },
  {
    question: "Platform manakah yang saat ini terbukti paling efektif dan gratis bagi UMKM untuk membangun interaksi langsung (engagement) dengan pembeli?",
    options: [
      "A. Membagikan brosur kertas di lampu merah",
      "B. Memasang spanduk besar di pinggir jalan",
      "C. Memanfaatkan Sosial Media (TikTok, Instagram, WhatsApp)",
      "D. Membayar iklan mahal di stasiun televisi"
    ],
    correctAnswer: 2, // Index C
    explanation: "Sosial media adalah jalur distribusi gratis tercepat saat ini. Dengan algoritma yang tepat, UMKM bisa menjangkau jutaan calon pembeli potensial tanpa biaya iklan sama sekali."
  },
  {
    question: "Apa langkah fundamental pertama yang paling krusial sebelum memutuskan untuk mem-viralkan produk UMKM kita di internet?",
    options: [
      "A. Membeli perlengkapan kamera dan HP mahal",
      "B. Meminjam uang dalam jumlah besar ke bank untuk modal",
      "C. Merapikan pencatatan dasar, stok barang, & kualitas layanan pelanggan",
      "D. Menggaji artis / influencer terkenal untuk promosi besar-besaran"
    ],
    correctAnswer: 2, // Index C
    explanation: "Digitalisasi sifatnya melipatgandakan apa yang sudah ada. Jika dasar usahanya berantakan (stok kosong/layanan lambat), viral justru akan mempercepat hancurnya reputasi bisnis."
  },
  {
    question: "Jika toko Anda mulai sepi pembeli karena banyak saingan baru, strategi digital apa yang paling efektif dan minim biaya untuk segera dilakukan?",
    options: [
      "A. Menurunkan harga sampai rugi agar jadi yang paling murah",
      "B. Marah-marah di sosial media menyalahkan keadaan",
      "C. Menganalisa riwayat data penjualan untuk membuat paket promo (bundling) yang menarik sasaran",
      "D. Langsung menutup toko dan berganti jualan produk lain"
    ],
    correctAnswer: 2, // Index C
    explanation: "Data digital adalah raja. Dari catatan penjualan, Anda bisa menganalisa produk mana yang kurang laku dan menggabungkannya (bundling) dengan produk terlaris sebagai strategi promo baru."
  },
  {
    question: "Banyak UMKM merasa aplikasi kasir (POS) itu ribet. Padahal, 'manfaat rahasia' terbesar dari aplikasi digital ini bagi seorang Bos/Pemilik usaha adalah...",
    options: [
      "A. Membuat toko terlihat keren di mata pelanggan",
      "B. Pemilik bisa memantau kebocoran stok dan omset harian secara real-time dari rumah",
      "C. Agar kasir ada kerjaan tambahan saat toko sedang sepi",
      "D. Supaya bisa terhindar dari razia petugas pajak"
    ],
    correctAnswer: 1, // Index B
    points: 100,
    explanation: "Aplikasi kasir memberikan kebebasan. Pemilik tidak perlu lagi datang setiap malam hanya untuk menghitung laci uang, karena semua transaksi dan sisa stok terlacak akurat secara real-time di HP."
  },
  {
    question: "[Tes Psikologis 1] Jika Anda baru mulai berjualan online seminggu dan belum ada satupun pesanan, apa reaksi mental pertama Anda?",
    options: [
      "A. Menyimpulkan bahwa jualan online itu bohong/penipuan",
      "B. Langsung banting harga jual rugi agar cepat laku",
      "C. Menganalisa ulang foto produk, deskripsi, dan meracik promo baru",
      "D. Menyerah dan kembali fokus offline saja"
    ],
    correctAnswer: 2, // Index C
    points: 50,
    explanation: "Mental pebisnis sejati tidak cepat panik. Tidak ada sukses instan; semuanya butuh tes dan perbaikan strategi berkala. (Skor +50)"
  },
  {
    question: "[Tes Psikologis 2] Ada toko sebelah yang meniru persis produk Anda, bahkan berani menjual dengan harga jauh lebih murah. Sikap Anda?",
    options: [
      "A. Mendatangi tokonya dan melabrak mereka karena mencuri ide",
      "B. Membalas dendam dengan ikut banting harga lebih parah",
      "C. Pasrah karena tidak mau ribut dan memilih diam",
      "D. Fokus berinovasi memberikan 'Pelayanan/Value Ekstra' yang tidak bisa mereka tiru"
    ],
    correctAnswer: 3, // Index D
    points: 75,
    explanation: "Produk dan harga mudah ditiru, tapi keramahan, integritas, dan 'Ikatan Emosional' dengan pelanggan adalah benteng yang mustahil dikalahkan pesaing. (Skor +75)"
  },
  {
    question: "[Tes Psikologis 3] Jika tiba-tiba Anda mendapat keuntungan bersih (profit) 5x lipat dari biasanya bulan ini, apa insting pertama Anda?",
    options: [
      "A. Langsung DP motor/mobil baru sebagai 'self-reward' / penghargaan diri",
      "B. Menahan keinginan konsumtif dan memutar mayoritas uangnya kembali untuk modal/iklan",
      "C. Mentraktir teman-teman agar terlihat sukses",
      "D. Dibiarkan menumpuk di rekening pribadi bercampur dengan uang belanja dapur"
    ],
    correctAnswer: 1, // Index B
    points: 80,
    explanation: "Kemampuan menunda kepuasan (Delayed Gratification) adalah penentu umur bisnis. Profit tak terduga adalah bensin roket untuk membesarkan kerajaan bisnis Anda, bukan untuk gaya hidup semata. (Skor +80)"
  }
];

export default function KuisUMKM() {
  const [nama, setNama] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isWaitingHost, setIsWaitingHost] = useState(false);

  useEffect(() => {
    if (!isWaitingHost) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/kuis-state');
        const data = await res.json();
        if (data.status === 'STARTED') {
          setStarted(true);
          setStartTime(data.startTime || Date.now());
          setIsWaitingHost(false);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isWaitingHost]);

  const handleJoinRoom = async () => {
    if (!nama.trim()) return alert('Mohon isi nama Anda terlebih dahulu!');
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/kuis-state');
      const data = await res.json();
      if (data.status === 'STARTED') {
        setStarted(true);
        setStartTime(data.startTime || Date.now());
      } else {
        setIsWaitingHost(true);
      }
    } catch (e) {
      setIsWaitingHost(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedIdx(index);
    setIsAnswered(true);

    if (index === QUIZ_DATA[currentQ].correctAnswer) {
      // Tambahkan poin dinamis jika ada, kalau tidak default 100
      setScore(prev => prev + (QUIZ_DATA[currentQ].points || 100));
    }
  };

  const handleNext = async () => {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      // Kuis Selesai
      setIsSubmitting(true);
      const timeTaken = Date.now() - startTime;
      const finalScore = score; // BUG FIXED: Score is already calculated accurately during handleAnswer
      
      try {
        await fetch('/api/kuis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, score: finalScore, time: timeTaken })
        });
      } catch (e) {
        console.error('Failed to save score');
      }
      
      setShowResult(true);
      setIsSubmitting(false);
    }
  };

  if (isWaitingHost) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 animate-in fade-in zoom-in duration-500 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bersiaplah, {nama}!</h1>
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">
            Menunggu operator memulai kuis... Pastikan mata Anda fokus ke layar proyektor di depan!
          </p>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Kuis UMKM</h1>
          <p className="text-gray-500 mb-8 leading-relaxed text-center text-sm">
            Tulis nama Anda untuk memperebutkan peringkat 3 besar di layar proyektor!
          </p>
          
          <div className="mb-6">
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan Nama Anda..."
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center font-semibold text-gray-800"
            />
          </div>

          <button 
            onClick={handleJoinRoom}
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Siap Ikut Kuis!'}
          </button>
        </div>
      </main>
    );
  }

  if (showResult) {
    // Hitung poin maksimal secara dinamis
    const maxScore = QUIZ_DATA.reduce((sum, q) => sum + (q.points || 100), 0);
    const isPerfect = score === maxScore;
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center border border-gray-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className={`w-12 h-12 ${isPerfect ? 'text-yellow-500' : 'text-blue-500'}`} />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-2">{score}</h2>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">Skor Akhir: {nama}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            Skor dan waktu pengerjaan Anda telah dikirim ke sistem. Silakan lihat layar proyektor di depan untuk melihat posisi peringkat Anda!
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all mb-3"
          >
            Kembali
          </button>
        </div>
      </main>
    );
  }

  const q = QUIZ_DATA[currentQ];

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 animate-in slide-in-from-right-8 duration-300">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
            Kasus {currentQ + 1} / {QUIZ_DATA.length}
          </span>
          <span className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            Skor: {score}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-snug">
          {q.question}
        </h2>

        <div className="space-y-3 mb-8">
          {q.options.map((opt, idx) => {
            let btnStyle = "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200";
            
            if (isAnswered) {
              if (idx === q.correctAnswer) {
                btnStyle = "bg-green-50 border-green-500 text-green-700 ring-4 ring-green-500/10";
              } else if (idx === selectedIdx) {
                btnStyle = "bg-red-50 border-red-500 text-red-700 ring-4 ring-red-500/10";
              } else {
                btnStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${btnStyle}`}
              >
                <div className="flex items-start justify-between">
                  <span className="leading-relaxed">{opt}</span>
                  {isAnswered && idx === q.correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 ml-3" />}
                  {isAnswered && idx === selectedIdx && idx !== q.correctAnswer && <XCircle className="w-6 h-6 text-red-600 shrink-0 ml-3" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mb-8 p-5 bg-blue-50/80 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-sm font-bold text-blue-800 mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Kunci Jawaban
            </p>
            <p className="text-sm text-blue-700 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!isAnswered || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
            isAnswered 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Mengirim Data...' : (currentQ === QUIZ_DATA.length - 1 ? 'Kirim & Lihat Hasil' : 'Lanjut ke Kasus Berikutnya')}
          {!isSubmitting && isAnswered && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </main>
  );
}
