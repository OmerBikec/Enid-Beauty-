
import React from 'react';
import { MOCK_TREATMENTS, Icons } from '../constants';

const Treatments: React.FC = () => {
  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 md:pb-8 border-b border-gray-100/60 gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-100 shadow-sm">Klinik Uygulamaları</span>
           </div>
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Estetik & Saç Ekimi</h2>
           <p className="text-slate-500 mt-2 md:mt-3 text-base md:text-lg font-medium max-w-2xl">Saç ekimi, medikal estetik ve ileri düzey cilt gençleştirme teknolojileri.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 text-white font-bold bg-slate-900 px-6 py-3.5 rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95 group">
            <Icons.Calendar />
            Randevu Al
        </button>
      </header>

      {/* SKIN TYPE GUIDE */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-8 border border-indigo-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3">
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/50 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full"></div>
                   <h3 className="text-2xl font-black text-slate-800 mb-2">Cilt Tipi Rehberi</h3>
                   <p className="text-slate-500 text-sm font-medium mb-4">Size en uygun işlemi seçmek için cilt tipinizi tanıyın.</p>
                   <div className="flex gap-2 text-4xl">👩🏻 👩🏽 👩🏿</div>
              </div>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white/60 p-4 rounded-2xl">
                   <h4 className="font-bold text-slate-800">Yağlı Ciltler</h4>
                   <p className="text-xs text-slate-500 mt-1">Geniş gözenek ve parlama sorunu.</p>
                   <span className="text-[10px] font-bold text-indigo-600 mt-2 block">Öneri: Hydrafacial, Karbon Peeling</span>
               </div>
               <div className="bg-white/60 p-4 rounded-2xl">
                   <h4 className="font-bold text-slate-800">Kuru Ciltler</h4>
                   <p className="text-xs text-slate-500 mt-1">Gerginlik, pullanma ve matlık.</p>
                   <span className="text-[10px] font-bold text-indigo-600 mt-2 block">Öneri: Gençlik Aşısı, Nem Dolgusu</span>
               </div>
               <div className="bg-white/60 p-4 rounded-2xl">
                   <h4 className="font-bold text-slate-800">Lekeli/Olgun Ciltler</h4>
                   <p className="text-xs text-slate-500 mt-1">Güneş lekeleri ve elastikiyet kaybı.</p>
                   <span className="text-[10px] font-bold text-indigo-600 mt-2 block">Öneri: Altın İğne, Somon DNA</span>
               </div>
               <div className="bg-white/60 p-4 rounded-2xl">
                   <h4 className="font-bold text-slate-800">Hassas Ciltler</h4>
                   <p className="text-xs text-slate-500 mt-1">Kızarıklığa meyilli, ince yapılı.</p>
                   <span className="text-[10px] font-bold text-indigo-600 mt-2 block">Öneri: Yatıştırıcı Medikal Bakım</span>
               </div>
          </div>
      </div>

      <div className="space-y-12 md:space-y-16">
        {MOCK_TREATMENTS.map((categoryGroup, index) => (
            <div key={index} className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary-600 shadow-soft">
                        <Icons.Star />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{categoryGroup.category}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {categoryGroup.items.map((treatment) => (
                        <div key={treatment.id} className="glass-card rounded-[2rem] p-6 md:p-8 hover:shadow-premium hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 border border-white/60">
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 via-primary-50/20 to-primary-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary-700 transition-colors">
                                        {treatment.name}
                                    </h4>
                                    <div className="bg-white p-2.5 rounded-xl text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/30">
                                        <Icons.Info />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">{treatment.description}</p>
                            
                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Ortalama</span>
                                        <span className="text-2xl font-extrabold text-slate-800 tracking-tight">₺{treatment.price.toLocaleString('tr-TR')}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                        <Icons.Clock />
                                        {treatment.duration}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-slate-900/30 group border border-white/5">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] group-hover:bg-primary-500/30 transition-colors duration-700"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ücretsiz Konsültasyon</h3>
            <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                Saç ekimi ve medikal estetik işlemlerimiz için uzmanlarımızla görüşerek size özel tedavi planınızı oluşturun.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:scale-105 inline-flex items-center justify-center gap-3 shadow-lg active:scale-95">
                    <Icons.Phone />
                    Hemen Ara
                </button>
                <button className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-3">
                    <Icons.MessageCircle />
                    Asistana Sor
                </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Treatments;
