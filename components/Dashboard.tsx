
import React, { useEffect, useState } from 'react';
import { AppView, User, Appointment, ChatMessage, Payment } from '../types';
import { Icons } from '../constants';
import { subscribeToAppointments, subscribeToAllMessages, subscribeToMessages, subscribeToPayments, subscribeToPatients } from '../services/firebaseService';

interface DashboardProps {
  setView: (view: AppView) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patientsCount, setPatientsCount] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const isAdmin = user.role === 'admin';

  // Real-time Data Subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribeAppt = subscribeToAppointments((data) => {
        setAppointments(data);
        setLoading(false);
    }, user.uid, user.role);

    const unsubscribePay = subscribeToPayments((data) => {
        setPayments(data);
    }, user.uid, user.role);

    let unsubscribeMsg = () => {};
    let unsubscribePatients = () => {};

    if (isAdmin) {
        unsubscribeMsg = subscribeToAllMessages((msgs) => {
            const unreadCount = msgs.filter(m => !m.isRead && m.role === 'patient').length;
            setUnreadMessages(unreadCount);
        });
        unsubscribePatients = subscribeToPatients((data) => {
            setPatientsCount(data.length);
        });
    } else {
        if (user.uid) {
            unsubscribeMsg = subscribeToMessages(user.uid, (msgs) => {
                const unreadCount = msgs.filter(m => !m.isRead && m.role === 'admin').length;
                setUnreadMessages(unreadCount);
            });
        }
    }
    
    return () => {
        unsubscribeAppt();
        unsubscribeMsg();
        unsubscribePay();
        if(isAdmin) unsubscribePatients();
    };
  }, [user.uid, user.role, isAdmin]);

  // Derived Data
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  
  // Earnings Calculation (Approved Payments)
  const dailyEarnings = payments
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  
  const displayList = isAdmin ? appointments.slice(0, 5) : appointments;
  const nextAppt = appointments.find(a => a.status === 'confirmed' && new Date(a.date) >= new Date());

  // --- UI COMPONENTS ---

  const WaveChart = () => (
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
              <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{stroke: 'none', fill: 'url(#gradientWave)'}}></path>
              <defs>
                  <linearGradient id="gradientWave" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor:'currentColor', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'currentColor', stopOpacity:0}} />
                  </linearGradient>
              </defs>
          </svg>
      </div>
  );

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold animate-pulse">Veriler Güncelleniyor...</p>
          </div>
      );
  }

  // --- ADMIN DASHBOARD ---
  if (isAdmin) {
      return (
        <div className="space-y-8 animate-fade-in pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Genel Bakış</h1>
                    <p className="text-slate-500 font-medium mt-1">Hoş geldin, <span className="text-slate-900 font-bold">{user.name}</span>. İşte kliniğin durumu.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sistem Aktif</span>
                </div>
            </div>

            {/* 1. KEY METRICS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {/* Card 1 */}
                 <div onClick={() => setView(AppView.PATIENTS)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform cursor-pointer group">
                     <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                             <Icons.Users />
                         </div>
                         <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full">+12%</span>
                     </div>
                     <div className="text-3xl font-black text-slate-800">{patientsCount}</div>
                     <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Toplam Hasta</div>
                 </div>

                 {/* Card 2 */}
                 <div onClick={() => setView(AppView.APPOINTMENTS)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform cursor-pointer group">
                     <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                             <Icons.Calendar />
                         </div>
                         <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">{pendingAppointments.length} Onay</span>
                     </div>
                     <div className="text-3xl font-black text-slate-800">{appointments.length}</div>
                     <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Bu Ay Randevu</div>
                 </div>

                 {/* Card 3 */}
                 <div onClick={() => setView(AppView.DOCTOR_CHAT)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform cursor-pointer group">
                     <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <Icons.MessageCircle />
                         </div>
                         {unreadMessages > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">{unreadMessages} Yeni</span>}
                     </div>
                     <div className="text-3xl font-black text-slate-800">{unreadMessages}</div>
                     <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Okunmamış Mesaj</div>
                 </div>

                 {/* Card 4 */}
                 <div onClick={() => setView(AppView.APPLICATIONS)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform cursor-pointer group">
                     <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                             <Icons.Grid />
                         </div>
                     </div>
                     <div className="text-3xl font-black text-slate-800">8</div>
                     <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Aktif İşlem</div>
                 </div>
            </div>

            {/* 2. FINANCIAL HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* BLACK CARD: Revenue */}
                <div className="lg:col-span-2 bg-[#0f172a] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-amber-500 shadow-2xl shadow-slate-900/20 border border-slate-800 group min-h-[320px] flex flex-col justify-between">
                     {/* Background Effects */}
                     <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                     <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                     <div className="text-amber-500/20"><WaveChart /></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Canlı Ciro</span>
                             </div>
                             <h3 className="text-5xl md:text-6xl font-black text-white tracking-tight">₺{dailyEarnings.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</h3>
                             <p className="text-slate-400 font-medium text-sm mt-2">Bu ayın onaylanan toplam ödeme tutarı.</p>
                         </div>
                         <div className="flex flex-col gap-2">
                             <button onClick={() => setView(AppView.PAYMENTS)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold backdrop-blur-md border border-white/10 transition-all flex items-center gap-2">
                                 <Icons.Wallet />
                                 Detaylar
                             </button>
                             <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                                 <Icons.Download />
                                 Rapor Al
                             </button>
                         </div>
                     </div>
                     
                     {/* Mini Stats in Black Card */}
                     <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                         <div>
                             <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Bekleyen</p>
                             <p className="text-white font-bold text-lg">₺45.000</p>
                         </div>
                         <div>
                             <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Giderler</p>
                             <p className="text-white font-bold text-lg">₺12.500</p>
                         </div>
                         <div>
                             <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Net Kar</p>
                             <p className="text-emerald-400 font-bold text-lg">+%18</p>
                         </div>
                     </div>
                </div>

                {/* LIGHT CARD: Quick Actions */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Icons.Activity /> Hızlı İşlemler
                        </h3>
                        <div className="space-y-3">
                            <button onClick={() => setView(AppView.APPOINTMENTS)} className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-left transition-colors group border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                        <Icons.Plus />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">Randevu Ekle</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Manuel Kayıt</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => setView(AppView.PERSONNEL)} className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-left transition-colors group border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                        <Icons.Users />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">Personel Yönetimi</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">İzin & Vardiya</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => setView(AppView.PATIENTS)} className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-left transition-colors group border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                                        <Icons.Search />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">Hasta Sorgula</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Detaylı Arama</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. RECENT ACTIVITY TABLE */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800">Son Randevu Hareketleri</h3>
                    <button onClick={() => setView(AppView.APPOINTMENTS)} className="text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors uppercase tracking-wider">Tümünü Gör</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="p-4 rounded-l-xl">Müşteri</th>
                                <th className="p-4">İşlem</th>
                                <th className="p-4">Tarih</th>
                                <th className="p-4 rounded-r-xl text-right">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayList.map(apt => (
                                <tr key={apt.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                                                {apt.patientName.charAt(0)}
                                            </div>
                                            {apt.patientName}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{apt.type}</td>
                                    <td className="p-4 text-sm text-slate-500 font-mono">{apt.date} • {apt.time}</td>
                                    <td className="p-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                                            apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                            apt.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                            {apt.status === 'confirmed' ? 'Onaylı' : apt.status === 'pending' ? 'Bekliyor' : 'Diğer'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
  }

  // --- PATIENT DASHBOARD ---
  return (
    <div className="space-y-8 animate-fade-in pb-12">
        
        {/* 1. WELCOME HERO with UV Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-pink-500/30 overflow-hidden group">
                {/* Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                        <Icons.Sparkles /> <span>Aesthetix Güzellik Merkezi</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Merhaba, {user.name} <span className="opacity-80 font-light">Bugün harika görünüyorsun!</span>
                    </h1>
                    <p className="text-pink-100 text-lg font-medium max-w-xl leading-relaxed mb-8">
                        Cilt bakım rutininizi takip etmek ve yeni randevular oluşturmak için buradayız.
                    </p>
                    
                    <button onClick={() => setView(AppView.APPOINTMENTS)} className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                        <Icons.Calendar /> Hemen Randevu Al
                    </button>
                </div>
            </div>

            {/* Right Side: UV & Weather Widget */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -z-10 opacity-60"></div>
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">☀️</span>
                            <div>
                                <div className="text-xl font-black text-slate-800">24°C</div>
                                <div className="text-xs font-bold text-slate-400 uppercase">İstanbul</div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">
                            Güneşli
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                <span>UV İndeksi</span>
                                <span className="text-orange-500">Yüksek (6)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="w-[60%] h-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">Güneş koruyucu (SPF 50) sürmeden dışarı çıkmayın.</p>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs font-bold">💧</div>
                                 <div>
                                     <div className="text-xs font-bold text-slate-600">Su İhtiyacı</div>
                                     <div className="text-[10px] text-slate-400">Bugün 1.5L daha içmelisin</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. NEXT APPOINTMENT & JOURNEY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* VIP TICKET: Next Appointment */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col relative group">
                <div className="p-8 pb-0">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Sıradaki Randevu</p>
                             <h3 className="text-2xl font-black text-slate-800">
                                 {nextAppt ? nextAppt.type : 'Planlı Randevu Yok'}
                             </h3>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100">
                            <Icons.Activity />
                        </div>
                    </div>
                </div>
                
                {nextAppt ? (
                    <div className="flex-1 p-8 pt-0 flex flex-col justify-end relative">
                         <div className="flex gap-8 mb-6">
                             <div>
                                 <p className="text-[10px] uppercase text-slate-400 font-bold">Tarih</p>
                                 <p className="text-lg font-bold text-slate-800">{new Date(nextAppt.date).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] uppercase text-slate-400 font-bold">Saat</p>
                                 <p className="text-lg font-bold text-slate-800">{nextAppt.time}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] uppercase text-slate-400 font-bold">Uzman</p>
                                 <p className="text-lg font-bold text-slate-800">Dr. Zeynep</p>
                             </div>
                         </div>
                         <div className="w-full border-t-2 border-dashed border-slate-200 pt-4 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400">Bilet ID: #8823</span>
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Onaylandı</span>
                         </div>
                         
                         {/* Circle Cutouts for Ticket Effect */}
                         <div className="absolute left-[-15px] bottom-[50px] w-8 h-8 bg-[#f8fafc] rounded-full"></div>
                         <div className="absolute right-[-15px] bottom-[50px] w-8 h-8 bg-[#f8fafc] rounded-full"></div>
                    </div>
                ) : (
                    <div className="flex-1 p-8 pt-0 flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500 text-sm mb-6">Kendinizi şımartmanın tam zamanı. Hemen bir bakım planlayın.</p>
                        <button onClick={() => setView(AppView.APPOINTMENTS)} className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl transition-colors">
                            + Randevu Oluştur
                        </button>
                    </div>
                )}
            </div>

            {/* ACTIVE TREATMENT PROGRESS (Applications) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-black text-slate-800">Aktif İşlemlerim</h3>
                     <button onClick={() => setView(AppView.APPLICATIONS)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                         <Icons.ChevronRight />
                     </button>
                </div>
                
                <div className="space-y-4">
                     {/* Mock Data 1 */}
                     <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                         <div className="flex justify-between items-center mb-3">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg font-bold group-hover:bg-pink-500 group-hover:text-white transition-colors">L</div>
                                 <div>
                                     <h4 className="font-bold text-slate-800 text-sm">Lazer Epilasyon</h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase">Tüm Vücut</p>
                                 </div>
                             </div>
                             <span className="text-sm font-bold text-slate-600">3/8</span>
                         </div>
                         <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-pink-500 w-[37%] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                         </div>
                     </div>

                     {/* Mock Data 2 */}
                     <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group opacity-70 hover:opacity-100">
                         <div className="flex justify-between items-center mb-3">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">H</div>
                                 <div>
                                     <h4 className="font-bold text-slate-800 text-sm">Hydrafacial</h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase">Yüz Bakımı</p>
                                 </div>
                             </div>
                             <span className="text-sm font-bold text-green-600">Tamamlandı</span>
                         </div>
                         <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-full rounded-full"></div>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* 3. QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setView(AppView.DOCTOR_CHAT)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icons.MessageCircle />
                </div>
                <div className="font-bold text-slate-800">Asistana Sor</div>
                <div className="text-[10px] text-slate-400 mt-1">7/24 Destek</div>
            </button>

            <button onClick={() => setView(AppView.WELLNESS)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <Icons.Heart />
                </div>
                <div className="font-bold text-slate-800">Bakım Rutinim</div>
                <div className="text-[10px] text-slate-400 mt-1">İpuçları & Öneriler</div>
            </button>

            <button onClick={() => setView(AppView.PAYMENTS)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group text-left">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Icons.Wallet />
                </div>
                <div className="font-bold text-slate-800">Ödemeler</div>
                <div className="text-[10px] text-slate-400 mt-1">Faturalar & Dekont</div>
            </button>
            
            <button onClick={() => setView(AppView.CONSULTATION)} className="bg-slate-900 p-6 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all group text-left relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black z-0"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-4 text-xl border border-white/10">
                        <Icons.Camera />
                    </div>
                    <div className="font-bold text-white">AI Analiz</div>
                    <div className="text-[10px] text-slate-400 mt-1">Cilt Taraması Yap</div>
                </div>
            </button>
        </div>
    </div>
  );
};

export default Dashboard;
