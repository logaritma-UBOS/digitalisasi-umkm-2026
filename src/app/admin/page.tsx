'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Loader2, Users, Download, Lock, RefreshCw, Pencil, Trash2, X, Send, CheckSquare, FileText, Plus } from 'lucide-react';

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

  const [editingPeserta, setEditingPeserta] = useState<Peserta | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk tambah manual
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPeserta, setNewPeserta] = useState({ nama_lengkap: '', nama_usaha: '', email: '', no_whatsapp: '' });
  const [isAdding, setIsAdding] = useState(false);

  // State untuk bulk select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkSending, setIsBulkSending] = useState(false);

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
        setSelectedIds([]); // Reset selection on refresh
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus peserta ini? Data tidak bisa dikembalikan.')) return;
    
    try {
      const res = await fetch(`/api/admin/peserta?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        setPeserta(prev => prev.filter(p => p.id !== id));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      } else {
        alert('Gagal menghapus peserta. Coba lagi.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  const handleSendWA = async (p: Peserta) => {
    if (!window.confirm(`Kirim pesan WA undangan grup ke ${p.nama_lengkap}?`)) return;
    
    try {
      const res = await fetch('/api/admin/send-wa', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ target: p.no_whatsapp, namaLengkap: p.nama_lengkap }),
      });
      if (res.ok) {
        alert(`Pesan WA berhasil dikirim ke ${p.nama_lengkap}!`);
      } else {
        alert('Gagal mengirim pesan WA. Pastikan nomor Fonnte aktif.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim pesan.');
    }
  };

  // Handler untuk fitur Bulk
  const handleBulkSend = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Kirim pesan WA secara otomatis ke ${selectedIds.length} peserta terpilih?\n\n(Proses ini memakan waktu sekitar 1 detik per pesan untuk menghindari blokir WhatsApp)`)) return;

    setIsBulkSending(true);
    const targets = peserta.filter(p => selectedIds.includes(p.id));

    try {
      const res = await fetch('/api/admin/send-wa-bulk', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ targets }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || `Berhasil mengirim pesan ke ${selectedIds.length} peserta!`);
        setSelectedIds([]); // Kosongkan seleksi setelah sukses
      } else {
        alert(data.message || 'Gagal mengirim pesan massal.');
      }
    } catch (err) {
      alert('Terjadi kesalahan sistem saat mengirim pesan massal.');
    } finally {
      setIsBulkSending(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === peserta.length && peserta.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(peserta.map(p => p.id)); // Select all
    }
  };

  const handleResetKuis = async () => {
    if (!window.confirm('PERINGATAN!\n\nApakah Anda yakin ingin MENGHAPUS SEMUA DATA KUIS? (Tenang, Data pendaftar UMKM asli tidak akan terhapus).')) return;
    
    try {
      const res = await fetch('/api/kuis', {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        alert('Data Kuis berhasil dibersihkan! Tampilan Live Leaderboard kini kembali kosong.');
      } else {
        alert('Gagal membersihkan data kuis.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mereset kuis.');
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeserta) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/peserta', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify(editingPeserta),
      });

      if (res.ok) {
        setPeserta(prev => prev.map(p => p.id === editingPeserta.id ? editingPeserta : p));
        setEditingPeserta(null);
      } else {
        const err = await res.json();
        alert(err.message || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/peserta', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify(newPeserta),
      });

      if (res.ok) {
        await fetchPeserta(password); // Refresh data
        setShowAddModal(false);
        setNewPeserta({ nama_lengkap: '', nama_usaha: '', email: '', no_whatsapp: '' });
      } else {
        const err = await res.json();
        alert(err.message || 'Gagal menambahkan peserta');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsAdding(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Daftar Peserta Sharing UMKM 2026", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Total Terdaftar: ${peserta.length} Peserta`, 14, 22);

    const tableData = peserta.map((p, i) => [
      i + 1,
      p.nama_lengkap,
      p.nama_usaha,
      p.no_whatsapp,
      new Date(p.created_at).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['No', 'Nama Lengkap', 'Nama Usaha', 'No WhatsApp', 'Waktu Daftar']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
    });

    doc.save('Data_Peserta_UMKM_2026.pdf');
  };

  const downloadCSV = () => {
    // FIX: Gunakan titik koma (;) agar otomatis dibaca rapi oleh Excel Indonesia
    const headers = ['Nama Lengkap;Nama Usaha;Email;No WhatsApp;Waktu Daftar'];
    const csvRows = peserta.map(p => {
      const date = new Date(p.created_at).toLocaleString('id-ID');
      return `"${p.nama_lengkap}";"${p.nama_usaha}";"${p.email}";"${p.no_whatsapp}";"${date}"`;
    });
    
    // FIX: Tambahkan BOM (\uFEFF) agar karakter UTF-8 dibaca sempurna oleh Excel
    const csvContent = "\uFEFF" + [headers, ...csvRows].join('\n');
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Data Peserta UMKM 2026</h1>
            <p className="text-gray-500 text-sm">Real-time tersinkronisasi dengan database Supabase</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            {/* Tombol Bulk Action muncul jika ada yang di centang */}
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkSend}
                disabled={isBulkSending}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white shadow-lg transition-all flex items-center gap-2 animate-in fade-in slide-in-from-right-4"
                title="Kirim ke semua yang dipilih"
              >
                {isBulkSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span className="font-semibold text-sm">Kirim ke {selectedIds.length} Orang</span>
              </button>
            )}

            <div className="bg-blue-50 px-5 py-3 rounded-2xl flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Terdaftar</p>
                <p className="text-2xl font-bold text-blue-700 leading-none">{peserta.length}</p>
              </div>
            </div>
            
            <button 
              onClick={handleResetKuis}
              className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center gap-2 border border-red-100 shadow-sm"
              title="Reset Data Kuis"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden md:inline font-semibold text-sm pr-1">Reset Kuis</span>
            </button>

            <button 
              onClick={() => fetchPeserta(password)}
              disabled={loading}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow-lg transition-colors flex items-center gap-2"
              title="Tambah Peserta Manual"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline font-medium text-sm pr-1">Tambah Peserta</span>
            </button>

            <button 
              onClick={downloadPDF}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-xl text-white shadow-lg transition-colors flex items-center gap-2"
              title="Download PDF"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden md:inline font-medium text-sm pr-1">Export PDF</span>
            </button>

            <button 
              onClick={downloadCSV}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-xl text-white shadow-lg transition-colors flex items-center gap-2"
              title="Download Excel / CSV"
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
                  <th className="p-5 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={peserta.length > 0 && selectedIds.length === peserta.length}
                      onChange={toggleSelectAll}
                      title="Pilih Semua"
                    />
                  </th>
                  <th className="p-5 text-sm font-semibold text-gray-600 w-16">No</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Nama Lengkap</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Nama Usaha</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Email & WhatsApp</th>
                  <th className="p-5 text-sm font-semibold text-gray-600">Waktu Pendaftaran</th>
                  <th className="p-5 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {peserta.map((p, index) => (
                  <tr key={p.id} className={`transition-colors group ${selectedIds.includes(p.id) ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-5 text-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
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
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleSendWA(p)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Kirim Pesan WA (Pancingan)"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingPeserta(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {peserta.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-500">
                      Belum ada pendaftar sejauh ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingPeserta && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Edit Data Peserta</h3>
              <button 
                onClick={() => setEditingPeserta(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingPeserta.nama_lengkap}
                  onChange={(e) => setEditingPeserta({...editingPeserta, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Usaha</label>
                <input
                  type="text"
                  required
                  value={editingPeserta.nama_usaha}
                  onChange={(e) => setEditingPeserta({...editingPeserta, nama_usaha: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={editingPeserta.email}
                  onChange={(e) => setEditingPeserta({...editingPeserta, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={editingPeserta.no_whatsapp}
                  onChange={(e) => setEditingPeserta({...editingPeserta, no_whatsapp: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPeserta(null)}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                Tambah Peserta
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newPeserta.nama_lengkap}
                  onChange={(e) => setNewPeserta({...newPeserta, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Usaha</label>
                <input
                  type="text"
                  required
                  value={newPeserta.nama_usaha}
                  onChange={(e) => setNewPeserta({...newPeserta, nama_usaha: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                  placeholder="Misal: Toko Berkah"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (Opsional)</label>
                <input
                  type="email"
                  value={newPeserta.email}
                  onChange={(e) => setNewPeserta({...newPeserta, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                  placeholder="budi@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={newPeserta.no_whatsapp}
                  onChange={(e) => setNewPeserta({...newPeserta, no_whatsapp: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                  placeholder="0812..."
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 py-3 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
