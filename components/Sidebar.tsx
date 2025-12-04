
import React from 'react';
import { MessageSquare, CalendarPlus, Activity, Sparkles, UserCheck, Hexagon, Fingerprint } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onAdminLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onAdminLogin }) => {
  const menuItems = [
    { id: AppView.APPOINTMENTS, label: 'Randevu', icon: CalendarPlus },
    { id: AppView.TREATMENTS, label: 'Hizmetler', icon: Sparkles },
    { id: AppView.CONTACT, label: 'Uzmanlar', icon: UserCheck },
    { id: AppView.CHAT, label: 'Güzellik Asistanı', icon: MessageSquare },
  ];

  return (
    <div className="h-full flex items-center py-6 pl-6 shrink-0 relative z-50 pointer-events-none">
      <div className="w-[88px] lg:w-72 h-[94%] glass-panel rounded-[2.5rem] flex flex-col relative overflow-hidden pointer-events-auto transition-all duration-500 shadow-2xl shadow-pink-200/60 ring-1 ring-white/50">
        
        {/* Brand Section */}
        <div className="pt-10 pb-10 flex flex-col items-center justify-center gap-5">
           <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse-slow"></div>
            <div className="relative w-14 h-14 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500 border border-white/20">
              <Hexagon className="text-white w-7 h-7 fill-white/10" strokeWidth={2.5} />
            </div>
          </div>
          <div className="hidden lg:block text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Aesthetix<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Pro</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-2.5">Beauty & Care</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-3 flex flex-col justify-center">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`group relative w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-300 ${
                  isActive ? 'bg-slate-900 shadow-lg shadow-slate-900/20 scale-100' : 'hover:bg-white/80 hover:scale-[1.02]'
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-pink-600 group-hover:bg-white shadow-sm'
                }`}>
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`text-sm font-bold transition-colors hidden lg:block ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                   <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-pink-400 hidden lg:block shadow-[0_0_12px_rgba(236,72,153,1)] animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Login */}
        <div className="p-4 mt-auto">
           <button 
             onClick={onAdminLogin}
             className="w-full flex items-center gap-3 p-2 rounded-[2rem] hover:bg-white transition-all group border border-transparent hover:border-slate-100 hover:shadow-lg"
           >
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shrink-0 border-2 border-white group-hover:border-pink-100 transition-colors flex items-center justify-center">
                  <Fingerprint className="text-slate-400 w-5 h-5 group-hover:text-pink-500 transition-colors" />
             </div>
             <div className="hidden lg:flex flex-col items-start min-w-0">
                 <span className="text-xs font-extrabold text-slate-800">Personel</span>
                 <span className="text-[10px] text-slate-400 font-bold">Giriş Yap</span>
             </div>
           </button>
        </div>
      </div>
    </div>
  );
};