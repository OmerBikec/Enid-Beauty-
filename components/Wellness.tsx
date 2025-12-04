
import React from 'react';
import { Icons } from '../constants';

const Wellness: React.FC = () => {
  const tips = [
      { 
        title: "Saç Ekim Sonrası", 
        desc: "İlk 10 gün ekim bölgesini sürtünmeden koruyun. Şişlik oluşmaması için başınızı dik tutun.", 
        icon: "👨‍🦲",
        color: "bg-blue-50 text-blue-600" 
      },
      { 
        title: "Güneş Koruması", 
        desc: "Lazer ve cilt işlemlerinden sonra leke oluşmaması için kışın bile SPF 50+ kullanın.", 
        icon: "☀️",
        color: "bg-amber-50 text-amber-600"
      },
      { 
        title: "Hidrasyon", 
        desc: "Dolgu ve botoks işlemlerinin kalıcılığını artırmak için günde en az 2.5L su tüketin.", 
        icon: "💧",
        color: "bg-cyan-50 text-cyan-600"
      },
      { 
        title: "Kolajen Desteği", 
        desc: "Cilt elastikiyeti ve saç kökleri için Tip 1 ve Tip 3 hidrolize kolajen takviyesi alın.", 
        icon: "✨",
        color: "bg-purple-50 text-purple-600"
      },
      { 
        title: "PRP & Mezoterapi", 
        desc: "Ekimden 1 ay sonra başlanan PRP, greftlerin tutunma oranını %30 artırır.", 
        icon: "💉",
        color: "bg-red-50 text-red-600"
      },
      { 
        title: "Uyku Düzeni", 
        desc: "Cildin kendini yenilemesi için 23:00 - 03:00 arası uykuda olmak kritiktir.", 
        icon: "🛌",
        color: "bg-indigo-50 text-indigo-600"
      },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        {/* Hero Section */}
        <div className="relative rounded-[3rem] p-10 md:p-14 overflow-hidden shadow-2xl shadow-pink-500/20 group">
             <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600"></div>
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="max-w-xl space-y-4 text-center md:text-left">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white mb-2">
                        <Icons.Heart /> <span>Aesthetix Care</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                         Güzelliğinizi <br/> Korumak İçin İpuçları
                     </h2>
                     <p className="text-pink-100 font-medium text-lg leading-relaxed">
                         Operasyon sonrası iyileşme süreci ve günlük bakım rutinleri için uzmanlarımızın hazırladığı özel rehber.
                     </p>
                 </div>
                 <div className="w-40 h-40 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 shadow-xl animate-float">
                     <span className="text-6xl">🧘‍♀️</span>
                 </div>
             </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 hover:-translate-y-2 transition-all duration-300 cursor-default bg-white border border-slate-100 relative group overflow-hidden">
                    {/* Background decoration */}
                    <div className={`absolute top-0 w-full h-1/2 opacity-5 rounded-b-[50%] transition-transform group-hover:scale-150 duration-700 ${tip.color.split(' ')[0].replace('50', '500')}`}></div>

                    <div className={`w-20 h-20 ${tip.color} rounded-3xl flex items-center justify-center text-4xl shadow-lg relative z-10 group-hover:rotate-6 transition-transform duration-300`}>
                        {tip.icon}
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-slate-800 mb-3">{tip.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Wellness;
