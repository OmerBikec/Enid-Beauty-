
import React from 'react';
import { LayoutDashboard, Users, Calendar, LogOut, ShieldCheck, ChevronRight, Activity, Settings, PieChart, Grid } from 'lucide-react';
import { AdminView } from '../types';

interface AdminSidebarProps {
  currentView: AdminView;
  onChangeView: (view: AdminView) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const navItems = [
    { id: AdminView.DASHBOARD, label: 'Genel Bakış', icon: PieChart },
    { id: AdminView.APPOINTMENTS, label: 'Randevular', icon: Calendar },
    { id: AdminView.PERSONNEL, label: 'Personel', icon: Users },
  ];
  // Note: AdminSidebar is mostly for fallback or mobile specific views in current App logic, 
  // Main Navigation.tsx handles the primary sidebar for both roles now.
  // But updating this for consistency if used independently.

  return (
    <div className="w-20 md:w-72 h-full flex flex-col shrink-0 relative z-50">
        <div className="h-full bg-white border-r border-slate-200 flex flex-col shadow-xl shadow-slate-200/50">
            
            <div className="p-8 flex items-center justify-center md:justify-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
                <ShieldCheck className="text-white w-6 h-6" strokeWidth={2} />
                </div>
                <div className="hidden md:block">
                <h1 className="text-sm font-bold text-slate-800 tracking-wide">YÖNETİCİ</h1>
                <p className="text-[10px] text-purple-600 uppercase tracking-widest font-bold">Portal Erişimi</p>
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-1">
                <p className="hidden md:block px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menü</p>
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                        isActive
                            ? 'bg-purple-50 border-purple-100 text-purple-700 shadow-sm'
                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'group-hover:text-purple-500 transition-colors'}`} />
                        <span className="hidden md:block font-bold text-sm flex-1 text-left">{item.label}</span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 hidden md:block"></div>}
                    </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100">
                <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="hidden md:block text-sm">Çıkış Yap</span>
                </button>
            </div>
        </div>
    </div>
  );
};