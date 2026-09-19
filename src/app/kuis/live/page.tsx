'use client';

import { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Crown, Timer, Medal } from 'lucide-react';

interface LeaderboardEntry {
  nama: string;
  score: number;
  time: number;
}

export default function KuisLiveLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/kuis');
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Auto refresh setiap 3 detik
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col p-8 overflow-hidden text-slate-100 font-sans relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px]"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
            Live Leaderboard
          </h1>
          <p className="text-slate-400 text-lg mt-2 font-medium">Kuis Spesial: Digitalisasi UMKM 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Auto Update</span>
            <span className="text-sm text-slate-400 font-medium flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        {loading && leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 text-xl font-medium animate-pulse">Menunggu data peserta...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl w-full">
            <Trophy className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-500">Belum ada peserta yang selesai</h2>
            <p className="text-slate-600 mt-2 text-lg">Ayo, jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {leaderboard.map((entry, index) => {
              // Animasi list berdasarkan index
              const delay = index * 100;
              
              let rankStyle = "bg-slate-900/80 border-slate-800 text-slate-300";
              let icon = <span className="text-2xl font-bold text-slate-500 w-8 text-center">{index + 1}</span>;

              if (index === 0) {
                rankStyle = "bg-gradient-to-r from-yellow-900/40 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)] scale-105 z-10 my-6";
                icon = <Crown className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />;
              } else if (index === 1) {
                rankStyle = "bg-gradient-to-r from-slate-800 to-slate-700/30 border-slate-400/50";
                icon = <Medal className="w-8 h-8 text-slate-300" />;
              } else if (index === 2) {
                rankStyle = "bg-gradient-to-r from-amber-900/40 to-amber-700/20 border-amber-600/40";
                icon = <Medal className="w-8 h-8 text-amber-600" />;
              }

              return (
                <div 
                  key={entry.nama + index}
                  className={`flex items-center justify-between p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 ${rankStyle}`}
                  style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12">
                      {icon}
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold tracking-tight ${index === 0 ? 'text-yellow-400' : 'text-slate-100'}`}>
                      {entry.nama}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Skor</p>
                      <p className={`text-3xl font-black ${index === 0 ? 'text-yellow-400' : 'text-slate-100'}`}>
                        {entry.score}
                      </p>
                    </div>
                    
                    <div className="w-[1px] h-12 bg-slate-700"></div>
                    
                    <div className="w-24">
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 flex items-center justify-end gap-1">
                        <Timer className="w-3 h-3" /> Waktu
                      </p>
                      <p className={`text-xl font-bold font-mono ${index === 0 ? 'text-yellow-200' : 'text-slate-300'}`}>
                        {(entry.time / 1000).toFixed(2)}s
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-slate-600 text-sm font-medium">Buka <span className="text-blue-400 font-bold">logaritma.id/kuis</span> untuk bergabung!</p>
      </div>
    </main>
  );
}
