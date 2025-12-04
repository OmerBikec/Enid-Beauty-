import React, { useState } from 'react';
import { Personnel } from '../types';
import { Send, CheckCircle, MessageCircle, Phone, Video, MoreVertical, Search, Paperclip } from 'lucide-react';

interface ContactSpecialistAreaProps {
  personnel: Personnel[];
}

export const ContactSpecialistArea: React.FC<ContactSpecialistAreaProps> = ({ personnel }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const selectedPerson = personnel.find(p => p.id === selectedPersonId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedPersonId) return;

    setTimeout(() => {
      setIsSent(true);
      setMessage('');
    }, 1000);
  };

  const resetForm = () => {
    setIsSent(false);
    setSelectedPersonId(null);
  };

  if (isSent) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-slate-50">
        <div className="bg-white p-10 rounded-3xl border border-green-100 text-center max-w-md w-full shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-green-50 blur-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-100">
                <CheckCircle className="text-green-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Mesajınız İletildi!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Uzmanımız mesajınızı aldı. Profilinizdeki iletişim bilgileri üzerinden en kısa sürede dönüş yapılacaktır.
            </p>
            <button 
                onClick={resetForm}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-medium transition-colors shadow-lg"
            >
                Sohbete Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-slate-50 flex flex-col md:flex-row border-t border-slate-200">
        
        {/* Sidebar List */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col">
            <div className="p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Mesajlar</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Uzman Ara..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:border-teal-500 outline-none placeholder:text-slate-400 transition-colors"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {personnel.map(p => (
                <button
                    key={p.id}
                    onClick={() => setSelectedPersonId(p.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                    selectedPersonId === p.id
                        ? 'bg-orange-50 border border-orange-100'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                >
                    <div className="relative">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full bg-slate-100 object-cover border border-slate-100" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={`font-bold truncate ${selectedPersonId === p.id ? 'text-orange-600' : 'text-slate-700 group-hover:text-slate-900'}`}>{p.name}</div>
                        <div className="text-xs text-slate-400 truncate font-medium">{p.role}</div>
                    </div>
                </button>
                ))}
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {selectedPerson ? (
            <>
                {/* Chat Header */}
                <div className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={selectedPerson.image} alt={selectedPerson.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
                        <div>
                            <div className="font-bold text-slate-800">{selectedPerson.name}</div>
                            <div className="text-xs text-green-600 flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Çevrimiçi • {selectedPerson.department}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hover:text-slate-600"><Phone size={20} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hover:text-slate-600"><Video size={20} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors hover:text-slate-600"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages Placeholder */}
                <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                        <MessageCircle size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedPerson.name} ile Sohbet Başlatın</h3>
                    <p className="text-slate-500 max-w-sm font-medium">
                        Sorularınızı, randevu taleplerinizi veya merak ettiklerinizi aşağıdan yazabilirsiniz.
                    </p>
                    <div className="mt-8 text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">
                        Mesajlarınız uçtan uca şifrelenmektedir
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-3 items-end">
                        <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors mb-0.5">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300 transition-all">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="w-full bg-transparent border-none text-slate-800 p-3 max-h-32 focus:ring-0 resize-none placeholder:text-slate-400 font-medium"
                                rows={1}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="p-3.5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl transition-all shadow-lg shadow-orange-100 mb-0.5"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-orange-100 blur-2xl rounded-full"></div>
                 <MessageCircle size={80} className="text-slate-200 relative z-10" />
               </div>
              <p className="text-xl font-bold text-slate-700 mb-2">Henüz bir seçim yapmadınız</p>
              <p className="text-sm font-medium">Mesaj göndermek için soldaki listeden bir uzman seçiniz.</p>
            </div>
          )}
        </div>
    </div>
  );
};