
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { analyzePatientComplaint } from '../services/gemini';
import { Attachment } from '../types';

interface AIChatMessage {
  id: string;
  role: 'model' | 'user';
  text: string;
  image?: string;
}

const AIConsultation: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Merhaba! Ben Aesthetix Güzellik Asistanı. \n\nCilt sorunlarınız, estetik işlemler veya bakım rutinleri hakkında sorularınızı sorabilir veya fotoğraf göndererek cilt analizi isteyebilirsiniz.' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setLoading(true);

    try {
        // Prepare attachments for Gemini Service
        const attachments: Attachment[] = [];
        if (userMessage.image) {
            // Extract mimeType and base64 data from Data URL (e.g., data:image/jpeg;base64,....)
            const matches = userMessage.image.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                attachments.push({
                    mimeType: matches[1],
                    data: matches[2]
                });
            }
        }

        const responseText = await analyzePatientComplaint(userMessage.text, attachments);
        
        const botMessage: AIChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText
        };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        const errorMessage: AIChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "Bağlantı hatası oluştu. Lütfen tekrar deneyin."
        }
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden animate-fade-in relative shadow-premium border border-white/60">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 md:px-8 md:py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30 relative">
                <Icons.Activity />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
                </span>
           </div>
           <div>
               <h3 className="text-base md:text-lg font-bold text-slate-800">Aesthetix Asistan</h3>
               <p className="text-[10px] md:text-xs text-pink-500 font-bold uppercase tracking-wide">Yapay Zeka Destekli</p>
           </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 md:p-3 rounded-xl transition-all">
            <Icons.Info />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 bg-slate-50/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`flex max-w-[90%] md:max-w-[70%] gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm self-end mb-2
                    ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-pink-600 border border-gray-100'}
                `}>
                    {msg.role === 'user' ? <Icons.User /> : <Icons.Activity />}
                </div>

                {/* Bubble */}
                <div className={`
                  p-4 md:p-5 shadow-sm relative text-sm leading-relaxed transition-all duration-300
                  ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-[1.5rem] rounded-br-sm shadow-primary-500/20' 
                    : 'bg-white text-slate-700 border border-gray-100 rounded-[1.5rem] rounded-bl-sm shadow-gray-200/50'}
                `}>
                  {msg.image && (
                    <div className="mb-4 relative rounded-xl overflow-hidden border border-white/20 shadow-sm">
                        <img src={msg.image} alt="Uploaded" className="max-w-full h-auto" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  <div className={`text-[10px] mt-3 font-bold opacity-60 text-right uppercase tracking-wider ${msg.role === 'user' ? 'text-primary-100' : 'text-slate-300'}`}>
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
             </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start w-full pl-10 md:pl-14 animate-fade-in-up">
             <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-1.5 shadow-sm">
               <span className="text-xs text-gray-400 font-bold mr-2 uppercase tracking-wide">Analiz Ediliyor</span>
               <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100/80 backdrop-blur-md relative z-20">
        <div className="max-w-5xl mx-auto">
            {selectedImage && (
                <div className="mb-4 ml-0 md:ml-14 relative inline-block animate-fade-in-up group">
                    <img src={selectedImage} alt="Preview" className="h-24 md:h-32 rounded-2xl border-2 border-white shadow-lg object-cover" />
                    <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-3 -right-3 bg-slate-900 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors shadow-md"
                    >
                        <Icons.Plus /> {/* Use rotated Plus as X */}
                    </button>
                </div>
            )}
            <div className="flex items-end gap-2 md:gap-3 bg-slate-50 p-1.5 md:p-2 rounded-[1.5rem] border border-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-200 transition-all shadow-inner">
                <label className="cursor-pointer p-3 md:p-4 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-2xl transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Icons.Camera />
                </label>
                
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Şikayetinizi yazın..." 
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 md:py-4 text-slate-700 font-medium placeholder-slate-400 max-h-32 text-sm md:text-base"
                    style={{minHeight: '48px'}}
                />
                
                <button 
                    onClick={handleSend}
                    disabled={loading || (!inputText && !selectedImage)}
                    className="p-3 md:p-4 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 disabled:opacity-50 disabled:hover:bg-pink-600 transition-all shadow-lg shadow-pink-600/20 active:scale-95"
                >
                    <Icons.Send />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultation;