


import React, { useState } from 'react';
import { AppView, User } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: User;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen, user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Define all items with allowed roles
  const allNavItems = [
    { view: AppView.DASHBOARD, label: 'Panel', icon: Icons.Dashboard, roles: ['admin', 'patient'] },
    { view: AppView.APPOINTMENTS, label: 'Randevular', icon: Icons.Calendar, roles: ['admin', 'patient'] },
    { view: AppView.APPLICATIONS, label: 'Uygulamalar', icon: Icons.Grid, roles: ['admin', 'patient'] }, // EKLENDİ
    { view: AppView.PATIENTS, label: 'Müşteriler', icon: Icons.Users, roles: ['admin'] },
    { view: AppView.DOCTOR_CHAT, label: 'Mesajlar', icon: Icons.Chat, roles: ['patient', 'admin'] },
    { view: AppView.CONSULTATION, label: 'AI Asistan', icon: Icons.MessageCircle, roles: ['patient'] },
    { view: AppView.DOCUMENTS, label: 'Kayıtlarım', icon: Icons.FileText, roles: ['patient', 'admin'] },
    { view: AppView.PAYMENTS, label: 'Ödemeler', icon: Icons.Wallet, roles: ['patient', 'admin'] },
    { view: AppView.TREATMENTS, label: 'Hizmetler', icon: Icons.Pill, roles: ['patient', 'admin'] },
    { view: AppView.PERSONNEL, label: 'Ekip', icon: Icons.Briefcase, roles: ['admin'] },
    { view: AppView.WELLNESS, label: 'Bakım İpuçları', icon: Icons.Heart, roles: ['patient'] },
  ];

  // Filter based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 md:hidden transition-opacity duration-500 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 md:relative md:inset-auto md:h-full
        bg-white/80 md:bg-white/60 backdrop-blur-3xl border-r md:border border-white/50
        md:rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)]
        transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isCollapsed ? 'w-[100px]' : 'w-[280px]'}
        flex flex-col justify-between overflow-hidden
      `}>
        
        {/* Collapse Toggle (Desktop) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 bg-white border border-slate-100 text-slate-400 hover:text-primary-600 p-2 rounded-full shadow-lg shadow-slate-200/50 z-50 transition-all hover:scale-110 hover:rotate-180 active:scale-95"
        >
          {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
        </button>

        <div className="flex flex-col h-full relative p-6">
          
          {/* Logo Area */}
          <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} transition-all duration-300`}>
             <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 flex-shrink-0 relative overflow-hidden group cursor-pointer hover:shadow-primary-500/50 transition-shadow ring-4 ring-white/50">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                 <Icons.Activity />
             </div>
             {!isCollapsed && (
                 <div className="animate-fade-in select-none">
                    <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">Aesthetix<span className="text-primary-500">.</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Beauty & Care</p>
                 </div>
             )}
             
             {/* Mobile Close Button */}
             <button onClick={() => setIsMobileOpen(false)} className="md:hidden ml-auto p-2 text-slate-400 hover:text-slate-800 bg-slate-50 rounded-lg">
               <Icons.ChevronLeft />
             </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide -mx-2 px-2 pb-6">
            {!isCollapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 opacity-80 pl-2 mt-2">Ana Menü</p>}
            
            {navItems.map((item) => {
               const isActive = currentView === item.view;
               return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`
                    w-full flex items-center p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-1' 
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 hover:shadow-sm hover:translate-x-1'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <span className={`
                    text-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative z-10
                    ${isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-500'}
                  `}>
                    <item.icon />
                  </span>
                  
                  {!isCollapsed && (
                    <span className="ml-3.5 text-sm font-bold truncate animate-fade-in relative z-10">{item.label}</span>
                  )}
                  
                  {/* Glow Effect for Active Item */}
                  {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  )}
                  
                  {isActive && !isCollapsed && (
                    <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(244,114,182,0.8)] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="pt-4 border-t border-slate-100/50 mt-auto">
            <div className={`
                w-full flex items-center p-2 rounded-2xl transition-all duration-200 group
                ${isCollapsed ? 'justify-center' : 'bg-slate-50/50 hover:bg-white border border-slate-100/50 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50'}
            `}>
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 p-0.5 shadow-md group-hover:shadow-lg transition-shadow">
                   <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=fff&color=db2777&font-size=0.33`}
                    alt="User" 
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                   />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
              </div>
              
              {!isCollapsed && (
                 <div className="ml-3 text-left overflow-hidden animate-fade-in flex-1">
                     <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-600 transition-colors">{user.name} {user.surname.charAt(0)}.</p>
                     <p className="text-[10px] text-slate-400 font-medium truncate">{user.role === 'admin' ? 'Yönetici' : 'Değerli Müşterimiz'}</p>
                 </div>
              )}

              {!isCollapsed && (
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Çıkış Yap">
                   <Icons.LogOut />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;