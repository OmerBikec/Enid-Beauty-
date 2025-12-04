
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { Icons } from '../constants';

interface LandingPageProps {
  setView: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full w-full font-sans text-slate-900 overflow-y-auto relative bg-white selection:bg-pink-500 selection:text-white scroll-smooth">
       
       {/* Modern Grid Background */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-pink-500 opacity-20 blur-[100px]"></div>
          <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-500 opacity-10 blur-[120px]"></div>
       </div>

       {/* Floating Header */}
       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-md border-b border-gray-100' : 'py-6 bg-transparent'}`}>
          <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
              <div 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 cursor-pointer"
              >
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                      <Icons.Activity />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">Aesthetix.</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                  <button onClick={() => scrollToSection('services')} className="hover:text-pink-600 transition-colors">Hizmetler</button>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-pink-600 transition-colors">Teknoloji</button>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-pink-600 transition-colors">İletişim</button>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={() => setView(AppView.LOGIN)} className="text-sm font-bold text-slate-900 hover:text-pink-600 transition-colors hidden sm:block">Giriş Yap</button>
                  <button 
                    onClick={() => setView(AppView.REGISTER)} 
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                  >
                    Randevu Al
                  </button>
              </div>
          </div>
       </header>

      {/* ULTRA MODERN HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="relative z-10 space-y-8">
                {/* GİZLİ YÖNETİCİ GİRİŞ BUTONU */}
                <button 
                    onClick={() => setView(AppView.ADMIN_LOGIN)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest animate-fade-in hover:bg-pink-100 hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    title="Yönetici Girişi"
                >
                    <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse"></span>
                    Yeni Nesil Güzellik
                </button>
                
                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] animate-fade-in-up">
                    Işıltınıza <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 animate-gradient-x">Estetik</span> <br/>
                    Dokunuşu.
                </h1>
                
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg animate-fade-in-up delay-100">
                    Yapay zeka destekli cilt analizi ve kişiye özel bakım rutinleriyle, hayalinizdeki görünüme kavuşmak artık çok daha kolay.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-200">
                    <button 
                        onClick={() => setView(AppView.REGISTER)} 
                        className="h-14 px-8 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 group"
                    >
                        Hemen Başlayın 
                        <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
                    </button>
                    <a 
                        href="tel:+902122345678"
                        className="h-14 px-8 rounded-full bg-white border border-gray-200 text-slate-700 font-bold text-lg hover:border-slate-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                        <Icons.Phone />
                        +90 (212) 234 56
                    </a>
                </div>

                <div className="pt-8 flex items-center gap-8 border-t border-gray-100 animate-fade-in-up delay-300">
                    <div>
                        <p className="text-3xl font-black text-slate-900">10K+</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Mutlu Müşteri</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div>
                        <p className="text-3xl font-black text-slate-900">%99</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Sonuç</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                     <div>
                        <p className="text-3xl font-black text-slate-900">7/24</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Online Danışma</p>
                    </div>
                </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-[600px] hidden lg:block animate-fade-in delay-200">
                {/* Abstract Shape Background */}
                <div className="absolute right-0 top-0 w-[120%] h-full bg-gray-50 rounded-tl-[100px] rounded-bl-[200px] -z-10 translate-x-20"></div>
                
                {/* Main Image Masked */}
                <div className="relative w-full h-full rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl shadow-slate-200">
                    <img 
                        src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" 
                        alt="Beauty Skin Care" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Floating Glass Card 1 */}
                    <div className="absolute top-10 right-10 p-5 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl max-w-[200px] animate-float">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-3">
                            <Icons.Shield />
                        </div>
                        <p className="font-bold text-slate-900 text-sm">Doğal & Etkili Bakım</p>
                    </div>

                    {/* Floating Glass Card 2 */}
                    <div className="absolute bottom-10 left-10 p-4 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md rounded-full pr-8 shadow-2xl animate-float" style={{animationDelay: '1.5s'}}>
                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Zeynep+Kaya&background=random" alt="Expert" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Uzm. Zeynep Kaya</p>
                            <div className="flex text-yellow-400 text-xs">★★★★★</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* MODERN SERVICES GRID */}
      <section id="services" className="py-24 px-6">
          <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Hizmetlerimiz</h2>
                      <p className="text-slate-500 font-medium text-lg max-w-xl">
                          En yeni estetik teknolojileri ve uzman dokunuşlarla güzelliğinizi ortaya çıkarın.
                      </p>
                  </div>
                  <button 
                    onClick={() => setView(AppView.REGISTER)} 
                    className="flex items-center gap-2 font-bold text-slate-900 hover:text-pink-600 transition-colors group"
                  >
                      Tüm İşlemleri Gör <span className="group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></span>
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div onClick={() => setView(AppView.REGISTER)} className="group rounded-[2.5rem] p-1 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-pink-500 hover:to-rose-600 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer">
                      <div className="bg-white h-full rounded-[2.4rem] p-10 flex flex-col justify-between overflow-hidden relative">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 text-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                              <Icons.Activity />
                          </div>
                          <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">Cilt Bakımı</h3>
                              <p className="text-slate-500 font-medium leading-relaxed">Hydrafacial ve medikal bakım ile ışıldayan bir cilde kavuşun.</p>
                          </div>
                          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl group-hover:bg-pink-100 transition-colors"></div>
                      </div>
                  </div>

                  {/* Card 2 (Dark) */}
                  <div onClick={() => setView(AppView.REGISTER)} className="group rounded-[2.5rem] bg-slate-900 p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      
                      <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl mb-8 border border-white/10">
                              <Icons.Camera />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">AI Cilt Analizi</h3>
                          <p className="text-slate-400 font-medium leading-relaxed">Yapay zeka asistanımız cildinizin ihtiyaçlarını saniyeler içinde belirlesin.</p>
                      </div>
                      <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                          <span className="text-sm font-bold text-pink-300 uppercase tracking-widest">Özel Teknoloji</span>
                          <Icons.ArrowRight />
                      </div>
                  </div>

                  {/* Card 3 */}
                  <div onClick={() => setView(AppView.REGISTER)} className="group rounded-[2.5rem] p-1 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-teal-400 hover:to-emerald-500 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer">
                      <div className="bg-white h-full rounded-[2.4rem] p-10 flex flex-col justify-between overflow-hidden relative">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 text-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                              <Icons.Shield />
                          </div>
                          <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">Lazer Epilasyon</h3>
                              <p className="text-slate-500 font-medium leading-relaxed">Son teknoloji cihazlarla pürüzsüzlüğün keyfini çıkarın.</p>
                          </div>
                          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl group-hover:bg-teal-100 transition-colors"></div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
          <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/30 rounded-full blur-[150px] animate-pulse-slow"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                      Değişime Hazır Mısınız?
                  </h2>
                  <p className="text-slate-300 text-xl font-medium">
                      İlk görüşmeniz bizden. Güzellik uzmanlarımızla ihtiyaçlarınızı belirleyelim.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                      <button onClick={() => setView(AppView.REGISTER)} className="h-16 px-10 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-pink-50 transition-all hover:scale-105 shadow-xl">
                          Randevu Oluştur
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="md:col-span-1">
                      <div className="flex items-center gap-2 mb-6">
                          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm shadow-md">
                              <Icons.Activity />
                          </div>
                          <span className="text-xl font-bold tracking-tight text-slate-900">Aesthetix.</span>
                      </div>
                      <p className="text-slate-500 font-medium">Modern teknoloji, etik değerler ve şeffaf güzellik anlayışı.</p>
                  </div>
                
                  <div>
                      <h4 className="font-bold text-slate-900 mb-6">Yasal</h4>
                      <ul className="space-y-3 text-slate-500 font-medium text-sm">
                          <li className="hover:text-pink-600 cursor-pointer transition-colors">Gizlilik Politikası</li>
                          <li className="hover:text-pink-600 cursor-pointer transition-colors">KVKK Aydınlatma</li>
                          <li className="hover:text-pink-600 cursor-pointer transition-colors">Çerez Politikası</li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-900 mb-6">İletişim</h4>
                      <ul className="space-y-3 text-slate-500 font-medium text-sm">
                          <li className="flex items-center gap-2"><Icons.MapPin /> İstanbul, Turkey</li>
                          <li><a href="tel:+902122345678" className="hover:text-pink-600 transition-colors">+90 (212) 234 56 78</a></li>
                          <li><a href="mailto:info@aesthetix.com" className="hover:text-pink-600 transition-colors">info@aesthetix.com</a></li>
                      </ul>
                  </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <p>© 2025 Aesthetix Group.</p>
                  
              </div>
          </div>
      </footer>

    </div>
  );
};

export default LandingPage;
