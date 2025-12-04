

import React, { useState } from 'react';
import { AppView, User } from '../types';
import { Icons } from '../constants';
import { loginUser, registerUser, registerAdmin } from '../services/firebaseService';

interface AuthProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ currentView, setView, onLogin }) => {
  // Determine the current mode
  const isPatientRegister = currentView === AppView.REGISTER;
  const isAdminLogin = currentView === AppView.ADMIN_LOGIN;
  const isAdminRegister = currentView === AppView.ADMIN_REGISTER;
  const isAnyAdmin = isAdminLogin || isAdminRegister;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    tcNo: '',
    phone: '',
    email: '', 
    password: '',
    adminCode: '', // Master PIN
    relativeName: '', 
    relativePhone: '' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Email handling: Admin uses input email, Patient uses TC based dummy email if not provided
    const email = formData.email || (isAnyAdmin ? '' : `${formData.tcNo}@aesthetix.com`); 
    
    try {
        if (isAdminRegister) {
            // ADMIN REGISTRATION
            const res = await registerAdmin(email, formData.password, {
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                adminCode: formData.adminCode // Validate PIN in service
            });
            
            if (res.success) {
                // Auto login after register
                const loginRes = await loginUser(email, formData.password);
                if (loginRes.success && loginRes.userData) onLogin(loginRes.userData);
            } else {
                setError(res.error || 'Yönetici kaydı başarısız.');
            }
            
        } else if (isPatientRegister) {
             // PATIENT REGISTRATION
             const newUser: any = {
                name: formData.name,
                surname: formData.surname,
                tcNo: formData.tcNo,
                phone: formData.phone,
                relativeName: formData.relativeName,
                relativePhone: formData.relativePhone,
             };
             const res = await registerUser(email, formData.password, newUser);
             if (res.success) {
                // Auto login after register, create temp user object to pass immediately
                const loggedInUser: User = {
                    uid: 'temp', 
                    email, 
                    role: 'patient',
                    ...newUser
                };
                onLogin(loggedInUser);
             } else {
                 setError('Kayıt başarısız: ' + res.error);
             }

        } else {
             // LOGIN (Both Admin & Patient)
             // For Admin Login, we might check for 'wasd123wasd' if we want extra security on login, 
             // but usually PIN is for Registration. 
             // Here we stick to email/pass for login.
             
             const res = await loginUser(email, formData.password);
             if (res.success && res.userData) {
                 // Role check
                 if (isAnyAdmin && res.userData.role !== 'admin') {
                     setError('Bu hesap yönetici yetkisine sahip değil.');
                 } else {
                     onLogin(res.userData);
                 }
             } else {
                 setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
             }
        }
    } catch (err: any) {
        setError('Bir hata oluştu: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  // Theme Colors
  const themeColor = isAnyAdmin ? 'amber' : 'primary'; // 'primary' maps to pink usually in tailwind config or we use pink hardcoded
  const ThemeIcon = isAnyAdmin ? Icons.Shield : Icons.Activity;
  const gradientClass = isAnyAdmin ? 'from-amber-500 to-orange-600' : 'from-pink-500 to-rose-600';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 font-sans text-slate-800 relative overflow-y-auto bg-slate-50">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none fixed">
          <div className={`absolute top-0 right-0 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] rounded-full blur-[120px] animate-pulse-slow ${isAnyAdmin ? 'bg-amber-200/30' : 'bg-pink-200/30'}`}></div>
          <div className={`absolute bottom-0 left-0 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] rounded-full blur-[120px] ${isAnyAdmin ? 'bg-orange-200/30' : 'bg-indigo-200/30'}`}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="glass-card w-full max-w-[480px] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 border border-white/60 animate-fade-in-up my-auto bg-white/80">
        
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
           <div 
             onClick={() => setView(AppView.LANDING)}
             className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br ${gradientClass} shadow-${themeColor}-500/30`}
           >
              <ThemeIcon />
           </div>
           <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
             {isAdminLogin ? 'Yönetici Girişi' : isAdminRegister ? 'Yönetici Kaydı' : isPatientRegister ? 'Aramıza Katılın' : 'Hoş Geldiniz'}
           </h2>
           <p className="font-medium text-slate-500 text-sm md:text-base">
             {isAdminRegister ? 'Yeni yönetici hesabı oluşturun.' : isAdminLogin ? 'Panel erişimi için kimliğinizi doğrulayın.' : isPatientRegister ? 'Sağlıklı ve güzel bir gelecek için.' : 'Hesabınıza giriş yapın.'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
           {error && (
               <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 text-center animate-pulse">
                   {error}
               </div>
           )}

           {/* Name/Surname Fields (Register Modes) */}
           {(isPatientRegister || isAdminRegister) && (
               <div className="flex flex-col md:flex-row gap-4">
                   <div className="space-y-1.5 flex-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Ad</label>
                     <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-100 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all" placeholder="Adınız" onChange={handleChange} />
                   </div>
                   <div className="space-y-1.5 flex-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Soyad</label>
                     <input name="surname" type="text" required className="w-full px-4 py-3 border border-gray-100 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all" placeholder="Soyadınız" onChange={handleChange} />
                   </div>
               </div>
           )}

           {/* Email / TC Field Logic */}
           {isAnyAdmin ? (
               // Admin uses Email
               <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Kurumsal E-Posta</label>
                    <div className="relative group">
                        <input name="email" type="email" required className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all" placeholder="admin@aesthetix.com" onChange={handleChange} />
                        <div className="absolute left-4 top-3.5 text-slate-400"><Icons.MessageCircle /></div>
                    </div>
               </div>
           ) : (
                // Patient uses TC (Login) or TC (Register)
                // For Register, we also have TC field separately
                !isPatientRegister ? (
                    // Patient Login
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">TC Kimlik / E-Posta</label>
                        <div className="relative group">
                            <input name="email" type="text" required className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all" placeholder="TC No veya E-Posta" onChange={handleChange} />
                            <div className="absolute left-4 top-3.5 text-slate-400"><Icons.User /></div>
                        </div>
                    </div>
                ) : null
           )}

           {/* Patient Specific Register Fields */}
           {isPatientRegister && (
               <>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">TC Kimlik No</label>
                   <input name="tcNo" type="text" maxLength={11} required className="w-full px-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-pink-300 focus:ring-4 outline-none transition-all" placeholder="11 Haneli TC" onChange={handleChange} />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon</label>
                   <input name="phone" type="tel" required className="w-full px-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-pink-300 focus:ring-4 outline-none transition-all" placeholder="05XX..." onChange={handleChange} />
                 </div>
                 
                 <div className="pt-2 border-t border-gray-100 mt-2">
                     <p className="text-xs text-pink-500 font-bold mb-2 uppercase tracking-wide">Acil Durum Kişisi</p>
                     <div className="flex flex-col md:flex-row gap-4">
                        <div className="space-y-1.5 flex-1">
                            <input name="relativeName" type="text" className="w-full px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:bg-white" placeholder="Yakın Adı" onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <input name="relativePhone" type="tel" className="w-full px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:bg-white" placeholder="Yakın Tel" onChange={handleChange} />
                        </div>
                     </div>
                 </div>
               </>
           )}
           
           {/* Admin Register Extra Fields */}
           {isAdminRegister && (
               <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon</label>
                   <input name="phone" type="tel" required className="w-full px-4 py-3 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-amber-300 focus:ring-4 outline-none transition-all" placeholder="05XX..." onChange={handleChange} />
               </div>
           )}

           {/* Password Field */}
           <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Şifre</label>
             <div className="relative group">
                <input name="password" type="password" required className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl font-bold bg-slate-50 focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all" placeholder="••••••••" onChange={handleChange} />
                <div className="absolute left-4 top-3.5 text-slate-400"><Icons.Lock /></div>
             </div>
           </div>

           {/* Admin Register PIN */}
           {isAdminRegister && (
             <div className="space-y-1.5 animate-fade-in">
               <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-amber-500 flex items-center gap-1"><Icons.Shield /> Master PIN Kodu</label>
               <input name="adminCode" type="password" required className="w-full px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl font-bold text-amber-600 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-center tracking-[0.5em]" placeholder="******" onChange={handleChange} />
             </div>
           )}

           <button 
                type="submit" 
                disabled={loading} 
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 text-white bg-gradient-to-r ${gradientClass}`}
           >
             {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <span>{isAdminRegister ? 'Yönetici Oluştur' : isPatientRegister ? 'Kayıt Ol' : 'Giriş Yap'}</span>}
           </button>
        </form>
        
        {/* Toggle Links */}
        {!isAnyAdmin && (
            <div className="mt-8 text-center space-y-4">
                <p className="text-slate-500 font-medium text-sm">
                    {isPatientRegister ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'} 
                    <button onClick={() => setView(isPatientRegister ? AppView.LOGIN : AppView.REGISTER)} className="ml-2 text-pink-600 font-bold hover:underline">
                        {isPatientRegister ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </p>
            </div>
        )}

        {isAnyAdmin && (
            <div className="mt-8 text-center space-y-4">
                 <p className="text-slate-500 font-medium text-sm">
                    {isAdminRegister ? 'Giriş ekranına dön.' : 'Yeni yönetici mi ekleyeceksiniz?'}
                    <button onClick={() => setView(isAdminRegister ? AppView.ADMIN_LOGIN : AppView.ADMIN_REGISTER)} className="ml-2 text-amber-600 font-bold hover:underline">
                        {isAdminRegister ? 'Giriş Yap' : 'Yönetici Ekle'}
                    </button>
                </p>
                <button onClick={() => setView(AppView.LOGIN)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-wide">
                    &larr; Müşteri Girişine Dön
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Auth;