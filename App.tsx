




import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import AIConsultation from './components/AIConsultation';
import Wellness from './components/Wellness';
import Treatments from './components/Treatments';
import Personnel from './components/Personnel';
import Patients from './components/Patients';
import DoctorChat from './components/DoctorChat';
import LandingPage from './components/LandingPage';
import Payments from './components/Payments'; 
import Documents from './components/Documents'; 
import Applications from './components/Applications'; // EKLENDİ
import Auth from './components/Auth';
import { AppView, User } from './types';
import { Icons } from './constants';
import { subscribeToAuth, logoutUser } from './services/firebaseService';

function App() {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for Firebase Auth State Changes with Safety Timeout
  useEffect(() => {
     let isMounted = true;
     
     // 1. Firebase Listener
     const unsubscribe = subscribeToAuth((userData) => {
         if (!isMounted) return;
         setUser(userData);
         if (userData) {
             if (currentView === AppView.LANDING || currentView === AppView.LOGIN || currentView === AppView.REGISTER || currentView === AppView.ADMIN_LOGIN || currentView === AppView.ADMIN_REGISTER) {
                 setView(AppView.DASHBOARD);
             }
         }
         setAuthLoading(false);
     });

     // 2. Safety Timeout (Force app to load if Firebase is stuck)
     const safetyTimer = setTimeout(() => {
         if (isMounted && authLoading) {
             console.warn("⚠️ Firebase yanıt vermedi, Demo modunda açılıyor.");
             setAuthLoading(false);
         }
     }, 2500); // 2.5 saniye sonra zorla aç

     return () => {
         isMounted = false;
         clearTimeout(safetyTimer);
         unsubscribe();
     };
  }, [currentView, authLoading]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setView(AppView.LANDING);
  };

  if (authLoading) {
      return (
          <div className="h-full w-full flex items-center justify-center bg-[#F9FAFB] fixed inset-0 z-50">
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="relative">
                      <div className="w-16 h-16 border-4 border-pink-200 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-pink-600 font-bold tracking-wider animate-pulse text-sm">Aesthetix Yükleniyor...</p>
              </div>
          </div>
      );
  }

  // If not authenticated, show public pages or auth pages
  if (!user) {
     if (currentView === AppView.LOGIN || currentView === AppView.REGISTER || currentView === AppView.ADMIN_LOGIN || currentView === AppView.ADMIN_REGISTER) {
         return <Auth currentView={currentView} setView={setView} onLogin={handleLogin} />;
     }
     return <LandingPage setView={setView} />;
  }

  // Authenticated Application Layout
  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setView} user={user} />;
      case AppView.APPOINTMENTS:
        return <Appointments user={user} />;
      case AppView.CONSULTATION:
        return <AIConsultation />;
      case AppView.DOCTOR_CHAT:
        return <DoctorChat user={user} />;
      case AppView.WELLNESS:
        return <Wellness />;
      case AppView.TREATMENTS:
        return <Treatments />;
      case AppView.PERSONNEL:
        return <Personnel />;
      case AppView.PATIENTS:
        return <Patients />;
      case AppView.PAYMENTS: 
        return <Payments user={user} />;
      case AppView.DOCUMENTS:
        return <Documents />;
      case AppView.APPLICATIONS: // EKLENDİ
        return <Applications />;
      default:
        return <Dashboard setView={setView} user={user} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-[#f8fafc] font-sans relative overflow-hidden text-slate-800">
      {/* Aurora Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 blur-[120px] animate-float opacity-70"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-l from-indigo-300/30 to-cyan-300/30 blur-[130px] animate-float opacity-70" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-t from-emerald-200/30 to-teal-200/30 blur-[100px] animate-pulse-slow opacity-60"></div>
        
        {/* Noise Overlay for Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex w-full h-full md:p-4 gap-4 flex-col md:flex-row">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/70 backdrop-blur-2xl border-b border-white/50 px-5 py-4 flex items-center justify-between shrink-0 shadow-sm z-30 sticky top-0">
            <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 ring-2 ring-white/50">
                    <Icons.Activity />
                  </div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Aesthetix</h1>
            </div>
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-slate-600 rounded-xl shadow-sm active:scale-95 transition-transform"
            >
                <Icons.Menu />
            </button>
        </header>

        {/* Sidebar Navigation */}
        <Navigation 
            currentView={currentView} 
            setView={setView} 
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            user={user}
            onLogout={handleLogout}
        />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden md:rounded-[3rem] bg-transparent md:bg-white/30 md:backdrop-blur-3xl md:border border-white/40 md:shadow-2xl relative transition-all duration-300 group">
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar w-full relative">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col w-full">
                    {/* GLOBAL BACK BUTTON: Show on all views except Dashboard */}
                    {currentView !== AppView.DASHBOARD && (
                        <div className="mb-4">
                            <button 
                                onClick={() => setView(AppView.DASHBOARD)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white border border-white/60 rounded-xl text-sm font-bold text-slate-600 transition-all shadow-sm hover:shadow-md backdrop-blur-md"
                            >
                                <Icons.ChevronLeft />
                                <span>Geri Dön</span>
                            </button>
                        </div>
                    )}

                    {renderContent()}
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}

export default App;