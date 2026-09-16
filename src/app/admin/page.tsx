'use client';

import { useState } from 'react';
import { Loader2, Users, Download, Lock, RefreshCw } from 'lucide-react';

interface Peserta {
  id: string;
  nama_lengkap: string;
  nama_usaha: string;
  email: string;
  no_whatsapp: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPeserta = async (pass: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/peserta', {
        headers: { 'x-admin-password': pass },
      });

      if (res.ok) {
        const result = await res.json();
        setPeserta(result.data);
        setIsAuthenticated(true);
      } else {
        setErrorMsg('Password salah atau akses ditolak!');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPeserta(password);
  };

  const downloadCSV = () => {
    const headers = ['Nama Lengkap,Nama Usaha,Email,No WhatsApp,Waktu Daftar'];
    const csvRows = peserta.map(p => {
      const date = new Date(p.created_at).toLocaleString('id-ID');
      return `"${p.nama_lengkap}","${p.nama_usaha}","${p.email}","${p.no_whatsapp}","${date}"`;
    });
    
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Data_Peserta_UMKM_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-center text-gray-500 mb-8 text-sm">Masukkan password untuk melihat data peserta UMKM 2026</p>
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-widest text-gray-800"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Data Peserta UMKM 2026</h1>
            <p className="text-gray-500 text-sm">Real-time tersinkronisasi dengan database Supabase</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 px-5 py-3 rounded-2xl flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Terdaftar</p>
                <p className="text-2xl font-bold text-blue-700 leading-none">{peserta.length}</p>
              </div>
            </div>
            <button 
              onClick={() => fetchPeserta(password)}
              disabled={loading}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={downloadCSV}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white shadow-lg transition-colors flex items-center gap-2"
              title="Download CSV / Excel"
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline font-medium text-sm pr-1">Export Excel</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 text-sm font-semibold text-gray-600">No</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Nama Lengkap</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Nama Usaha</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Email & WhatsApp</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Waktu Pendaftaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {peserta.map((p, index) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5 text-sm text-gray-500">{index + 1}</td>
                    <td className="p-5">
                      <p className="font-semibold text-gray-800">{p.nama_lengkap}</p>
                    </td>
                    <td className="p-5 text-sm text-gray-600">{p.nama_usaha}</td>
                    <td className="p-5">
                      <p className="text-sm font-medium text-gray-800">{p.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.no_whatsapp}</p>
                    </td>
                    <td className="p-5 text-sm text-gray-500">
                      {new Date(p.created_at).toLocaleString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
                {peserta.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
                      Belum ada pendaftar sejauh ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
