'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react';

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
  }
];

export default function KuisUMKM() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedIdx(index);
    setIsAnswered(true);

    if (index === QUIZ_DATA[currentQ].correctAnswer) {
      setScore(prev => prev + 100);
    }
  };

  const handleNext = () => {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Kuis Spesial UMKM</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Uji seberapa siap Anda membawa bisnis dari sistem manual menuju era digital! Mari jawab 3 studi kasus krusial ini.
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Mulai Kuis Sekarang
          </button>
        </div>
      </main>
    );
  }

  if (showResult) {
    const isPerfect = score === QUIZ_DATA.length * 100;
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center border border-gray-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className={`w-12 h-12 ${isPerfect ? 'text-yellow-500' : 'text-blue-500'}`} />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-800 mb-2">{score}</h2>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">Total Skor Anda</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isPerfect 
              ? "Luar Biasa! Anda sudah memiliki mindset digitalisasi yang sangat matang. Bisnis Anda siap meroket! 🚀" 
              : "Kerja bagus! Anda sudah di jalur yang tepat. Mari kita perdalam lagi ilmu digitalisasinya di sesi materi hari ini! 💡"}
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all mb-3"
          >
            Ulangi Kuis
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
          disabled={!isAnswered}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
            isAnswered 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQ === QUIZ_DATA.length - 1 ? 'Lihat Total Skor' : 'Lanjut ke Kasus Berikutnya'}
          {isAnswered && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </main>
  );
}
