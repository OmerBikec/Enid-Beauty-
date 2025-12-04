
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { Staff } from '../types';
import { subscribeToStaff, addStaff, deleteStaff } from '../services/firebaseService';

const Personnel: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '', role: 'Doktor', phone: '', status: 'active'
  });

  useEffect(() => {
    const unsubscribe = subscribeToStaff((data) => {
        setStaffList(data);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Bu personeli silmek istediğinize emin misiniz?')) {
        await deleteStaff(id);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaff.name && newStaff.phone) {
        await addStaff(newStaff as Staff);
        setShowForm(false);
        setNewStaff({ name: '', role: 'Doktor', phone: '', status: 'active' });
    }
  };

  if (loading) {
     return <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       {/* Page Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ekip Yönetimi</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Klinik kadrosunu ve yetkilendirmeleri yönetin.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 transition-all font-bold hover:-translate-y-1 active:scale-95 group"
        >
          <div className="bg-white/20 rounded-full p-1"><Icons.Plus /></div>
          <span>Personel Ekle</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-8 rounded-[2.5rem] shadow-2xl border border-white/60 animate-slide-up mb-10 relative z-10 max-w-4xl mx-auto md:mx-0 bg-white/80">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center"><Icons.Users /></span>
                Yeni Personel Kaydı
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ad Soyad</label>
                    <input 
                        value={newStaff.name} 
                        onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all" 
                        required 
                        placeholder="Örn: Dr. Ali Veli"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon</label>
                    <input 
                        value={newStaff.phone} 
                        onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all" 
                        required 
                        placeholder="05XX..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Unvan / Rol</label>
                    <div className="relative">
                        <select 
                            value={newStaff.role}
                            onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none appearance-none transition-all cursor-pointer"
                        >
                            <option value="Doktor">Doktor</option>
                            <option value="Estetisyen">Estetisyen</option>
                            <option value="Asistan">Asistan</option>
                            <option value="Sekreter">Sekreter</option>
                            <option value="Yönetici">Yönetici</option>
                        </select>
                        <div className="absolute right-6 top-5 pointer-events-none text-gray-400">
                             <Icons.ChevronDown /> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors">Vazgeç</button>
                <button type="submit" className="px-10 py-3 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 font-bold shadow-xl shadow-pink-600/30 transition-all hover:-translate-y-1">Kaydet</button>
            </div>
        </form>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {staffList.map((person, idx) => (
            <div 
                key={person.id} 
                className="glass-card rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center relative overflow-hidden bg-white border border-slate-100 animate-slide-up"
                style={{animationDelay: `${idx * 0.1}s`}}
            >
                {/* ID Badge Style Decoration */}
                <div className="absolute top-0 w-32 h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-b-xl"></div>
                
                <button 
                    onClick={() => handleDelete(person.id)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                    <Icons.Trash />
                </button>

                <div className="relative mt-4 mb-6">
                    <div className="w-24 h-24 rounded-[2rem] p-1 bg-white shadow-xl shadow-slate-200 ring-1 ring-slate-100 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${person.name}&background=f8fafc&color=334155&font-size=0.33`} 
                            alt={person.name} 
                            className="w-full h-full object-cover rounded-[1.8rem]" 
                        />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase border-2 border-white shadow-sm ${person.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {person.status === 'active' ? 'Aktif' : 'İzinde'}
                    </div>
                </div>
                
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight text-center">{person.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-6">{person.role}</p>
                
                <div className="w-full pt-6 border-t border-slate-50 space-y-3">
                    <a href={`tel:${person.phone}`} className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all group/btn">
                        <Icons.Phone />
                        <span>{person.phone}</span>
                    </a>
                    <button className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl border border-slate-100 text-slate-400 text-sm font-bold hover:border-pink-200 hover:text-pink-600 transition-all">
                        <Icons.MessageCircle />
                        <span>Mesaj Gönder</span>
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Personnel;
