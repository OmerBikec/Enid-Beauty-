import React, { useState } from 'react';
import { Users, Calendar, DollarSign, Activity, UserPlus, Trash2, Settings, TrendingUp, MoreHorizontal, Search, Filter, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Appointment, Personnel, DashboardStats, AdminView } from '../types';

interface AdminAreaProps {
  currentView: AdminView;
  appointments: Appointment[];
  personnel: Personnel[];
  stats: DashboardStats;
  onAddPersonnel: (p: Personnel) => void;
  onRemovePersonnel: (id: string) => void;
}

export const AdminArea: React.FC<AdminAreaProps> = ({ 
  currentView,
  appointments, 
  personnel, 
  stats,
  onAddPersonnel,
  onRemovePersonnel
}) => {
  const [newPersonnel, setNewPersonnel] = useState<Partial<Personnel>>({ name: '', role: '', department: '' });

  const handleAddPersonnel = () => {
    if (newPersonnel.name && newPersonnel.role && newPersonnel.department) {
      onAddPersonnel({
        id: Date.now().toString(),
        name: newPersonnel.name,
        role: newPersonnel.role,
        department: newPersonnel.department,
        image: `https://ui-avatars.com/api/?name=${newPersonnel.name}&background=random`
      });
      setNewPersonnel({ name: '', role: '', department: '' });
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <div className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden group animate-slide-up" style={{animationDelay: delay}}>
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10 text-slate-800`}>
                    <Icon size={22} className="opacity-80" />
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-green-100">
                    <TrendingUp size={12} /> +12%
                </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">{value}</div>
            <div className="text-sm font-bold text-slate-400 tracking-wide">{title}</div>
        </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 pb-10">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Hasta" value={stats.totalPatients.toLocaleString()} icon={Users} colorClass="bg-blue-500" delay="0.1s" />
        <StatCard title="Bugün Randevu" value={stats.todayAppointments} icon={Calendar} colorClass="bg-purple-500" delay="0.2s" />
        <StatCard title="Net Kazanç" value={`${(stats.earnings / 1000).toFixed(1)}K`} icon={DollarSign} colorClass="bg-teal-500" delay="0.3s" />
        <StatCard title="Aktif Tedavi" value={stats.activeTreatments} icon={Activity} colorClass="bg-rose-500" delay="0.4s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] animate-slide-up bg-white" style={{animationDelay: '0.5s'}}>
           <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-extrabold text-xl text-slate-800">Haftalık Performans</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Gelir Analitiği</p>
                </div>
                <button className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl text-slate-600 transition-colors font-bold">
                    Bu Hafta <ChevronDown size={14} />
                </button>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-4 px-2">
             {[45, 70, 40, 90, 60, 95, 75].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end cursor-pointer">
                 <div className="w-full relative h-full flex items-end">
                    <div 
                        style={{height: `${h}%`}} 
                        className="w-full bg-slate-100 rounded-xl relative transition-all duration-500 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-200"
                    ></div>
                 </div>
                 <span className="text-[10px] text-slate-400 font-bold uppercase group-hover:text-indigo-600">{['Pt','Sa','Ça','Pe','Cu','Ct','Pz'][i]}</span>
               </div>
             ))}
           </div>
        </div>
        
        {/* Recent Activity List */}
        <div className="glass-card p-8 rounded-[3rem] flex flex-col animate-slide-up bg-white" style={{animationDelay: '0.6s'}}>
          <h3 className="font-extrabold text-xl text-slate-800 mb-6">Son İşlemler</h3>
          <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                   <Clock size={18} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="text-sm font-bold text-slate-800 truncate">Randevu Oluşturuldu</div>
                   <div className="text-[10px] text-slate-400 font-bold">Dr. Ahmet Yılmaz • 10 dk önce</div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-4 rounded-[2rem] bg-white">
        <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Hasta Ara..." 
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors">
                <Filter size={14} /> Filtre
            </button>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest pl-8">Hasta Bilgisi</th>
                <th className="p-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Şikayet</th>
                <th className="p-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Tarih</th>
                <th className="p-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Durum</th>
                <th className="p-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right pr-8">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Calendar size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">Kayıtlı randevu bulunamadı.</p>
                    </td>
                  </tr>
              ) : (
                appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6 pl-8">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-100">
                              {apt.patientName.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{apt.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{apt.tcNo}</div>
                          </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-slate-600 text-xs bg-slate-100 px-3 py-1.5 rounded-lg">{apt.type}</span>
                    </td>
                    <td className="p-6 font-bold text-slate-500 text-sm">{new Date(apt.date).toLocaleDateString('tr-TR')}</td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Beklemede
                      </span>
                    </td>
                    <td className="p-6 text-right pr-8">
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPersonnel = () => (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="glass-card p-10 rounded-[3rem] bg-white relative overflow-hidden">
         <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative z-10">
            <div className="space-y-6 w-full max-w-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <UserPlus size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">Personel Ekle</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                        type="text" 
                        placeholder="Ad Soyad"
                        value={newPersonnel.name}
                        onChange={e => setNewPersonnel({...newPersonnel, name: e.target.value})}
                        className="bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-100"
                    />
                    <input 
                        type="text" 
                        placeholder="Unvan"
                        value={newPersonnel.role}
                        onChange={e => setNewPersonnel({...newPersonnel, role: e.target.value})}
                        className="bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-100"
                    />
                    <input 
                        type="text" 
                        placeholder="Departman"
                        value={newPersonnel.department}
                        onChange={e => setNewPersonnel({...newPersonnel, department: e.target.value})}
                        className="bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>
            <button 
                onClick={handleAddPersonnel}
                className="bg-slate-900 text-white p-4 md:px-8 md:py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
            >
                <CheckCircle2 size={20} />
                <span className="hidden md:inline">Kaydet</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {personnel.map((p, idx) => (
          <div key={p.id} className="glass-card p-6 rounded-[2.5rem] flex items-center gap-5 group hover:bg-white hover:scale-[1.02] transition-all duration-300 animate-slide-up" style={{animationDelay: `${idx * 0.1}s`}}>
            <div className="relative">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-2xl bg-slate-100 object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-base truncate">{p.name}</div>
              <div className="text-xs font-bold text-indigo-600 mb-0.5">{p.role}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.department}</div>
            </div>
            <button onClick={() => onRemovePersonnel(p.id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-10 relative z-10 custom-scrollbar">
      <div className="max-w-[1600px] mx-auto pt-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                {currentView === AdminView.DASHBOARD && 'Genel Bakış'}
                {currentView === AdminView.APPOINTMENTS && 'Randevular'}
                {currentView === AdminView.PERSONNEL && 'Personel'}
            </h2>
            <p className="text-slate-500 font-medium">Yönetim Paneli v2.0</p>
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
             <Settings size={22} />
          </button>
        </div>
        
        {currentView === AdminView.DASHBOARD && renderDashboard()}
        {currentView === AdminView.APPOINTMENTS && renderAppointments()}
        {currentView === AdminView.PERSONNEL && renderPersonnel()}
      </div>
    </div>
  );
};