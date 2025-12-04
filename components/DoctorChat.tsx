
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ChatMessage, User } from '../types';
import { subscribeToMessages, sendMessage, subscribeToAllMessages } from '../services/firebaseService';

interface DoctorChatProps {
    user?: User; // User prop passed from App
}

const DoctorChat: React.FC<DoctorChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Admin Specific State
  const [inboxList, setInboxList] = useState<{patientId: string, patientName: string, lastMsg: string, unread: number, timestamp: any}[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  const isAdmin = user?.role === 'admin';
  const currentUserId = user?.uid;

  // SCROLL TO BOTTOM
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedPatientId]);

  // DATA SUBSCRIPTION
  useEffect(() => {
    if (!currentUserId) return;

    if (isAdmin) {
        // ADMIN: Subscribe to ALL messages to build the inbox list
        const unsubscribe = subscribeToAllMessages((allMsgs) => {
            // Group by patientId
            const groups: {[key: string]: any} = {};
            
            allMsgs.forEach(msg => {
                if (!groups[msg.patientId]) {
                    groups[msg.patientId] = {
                        patientId: msg.patientId,
                        patientName: msg.patientName || 'Bilinmeyen Hasta',
                        lastMsg: msg.text,
                        unread: 0,
                        timestamp: msg.timestamp
                    };
                }
                // Count unread messages from patients
                if (!msg.isRead && msg.role === 'patient') {
                    groups[msg.patientId].unread++;
                }
            });
            
            setInboxList(Object.values(groups).sort((a: any, b: any) => b.timestamp - a.timestamp));
            setLoading(false);
        });
        return () => unsubscribe();
    } else {
        // PATIENT: Subscribe only to MY chat
        const unsubscribe = subscribeToMessages(currentUserId, (msgs) => {
            setMessages(msgs);
            setLoading(false);
        });
        return () => unsubscribe();
    }
  }, [currentUserId, isAdmin]);

  // ADMIN: Fetch specific chat when a patient is selected
  useEffect(() => {
      if (isAdmin && selectedPatientId) {
          setLoading(true);
          const unsubscribe = subscribeToMessages(selectedPatientId, (msgs) => {
              setMessages(msgs);
              setLoading(false);
          });
          return () => unsubscribe();
      }
  }, [isAdmin, selectedPatientId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    if (!user) {
        alert("Oturum bilgisi bulunamadı. Lütfen sayfayı yenileyin.");
        return;
    }

    const targetPatientId = isAdmin ? selectedPatientId : user.uid;
    const targetPatientName = isAdmin ? selectedPatientName : `${user.name} ${user.surname}`;

    if (!targetPatientId) return;

    const newMessage: any = {
      text: inputText,
      senderId: user.uid || 'unknown',
      patientId: targetPatientId,
      patientName: targetPatientName,
      role: isAdmin ? 'admin' : 'patient',
      isRead: false,
      timestamp: new Date() // Will be replaced by server timestamp
    };

    try {
        await sendMessage(newMessage);
        setInputText('');
    } catch (error: any) {
        console.error("Mesaj gönderme hatası:", error);
        alert("Mesaj gönderilemedi: " + (error.message || "Bilinmeyen hata"));
    }
  };

  const openWhatsApp = () => {
      window.open('https://wa.me/905528872263', '_blank');
  };

  // --- RENDER HELPERS ---
  
  // Format Timestamp
  const formatTime = (timestamp: any) => {
      if (!timestamp) return '';
      // Handle Firestore Timestamp or Date object
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // --- ADMIN VIEW ---
  if (isAdmin) {
      return (
        <div className="h-full flex gap-6 animate-fade-in">
            {/* Left Sidebar: Inbox */}
            <div className={`w-full md:w-1/3 glass-card rounded-[2.5rem] flex flex-col overflow-hidden ${selectedPatientId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md">
                    <h3 className="text-xl font-bold text-slate-800">Mesajlar</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Gelen Kutusu</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {inboxList.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Henüz mesaj yok.</div>
                    ) : (
                        inboxList.map((chat) => (
                            <div 
                                key={chat.patientId} 
                                onClick={() => {
                                    setSelectedPatientId(chat.patientId);
                                    setSelectedPatientName(chat.patientName);
                                }}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedPatientId === chat.patientId ? 'bg-indigo-600 text-white shadow-lg border-indigo-500' : 'bg-white hover:bg-indigo-50 border-transparent hover:border-indigo-100'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold ${selectedPatientId === chat.patientId ? 'text-white' : 'text-slate-800'}`}>{chat.patientName}</h4>
                                    {chat.unread > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">{chat.unread} yeni</span>
                                    )}
                                </div>
                                <p className={`text-sm truncate ${selectedPatientId === chat.patientId ? 'text-indigo-100' : 'text-slate-500'}`}>{chat.lastMsg}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side: Chat Area */}
            <div className={`flex-1 glass-card rounded-[2.5rem] flex flex-col overflow-hidden relative ${!selectedPatientId ? 'hidden md:flex' : 'flex'}`}>
                {selectedPatientId ? (
                    <>
                        <div className="p-4 md:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedPatientId(null)} className="md:hidden p-2 bg-slate-100 rounded-full">
                                    <Icons.ChevronLeft />
                                </button>
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                    {selectedPatientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedPatientName}</h3>
                                    <p className="text-xs text-slate-500">Hasta</p>
                                </div>
                            </div>
                            <button onClick={openWhatsApp} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all">
                                <Icons.Phone />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.role === 'admin' ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md' : 'bg-white text-slate-700 border border-gray-100 rounded-tl-sm shadow-sm'}`}>
                                        {msg.text}
                                        <div className={`text-[10px] mt-1 text-right ${msg.role === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder="Mesaj yazın..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button onClick={handleSend} className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                                    <Icons.Send />
                                </button>
                             </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Icons.Chat />
                        </div>
                        <p>Sohbet başlatmak için soldan bir hasta seçin.</p>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- PATIENT VIEW ---
  return (
    <div className="h-full flex flex-col glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden animate-fade-in relative shadow-premium border border-white/60">
      {/* Header */}
      <div className="bg-teal-50/90 backdrop-blur-md p-4 md:p-6 border-b border-teal-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="relative">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-md border-2 border-white overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Dr+Zeynep&background=fff&color=0d9488" alt="Dr" className="w-full h-full object-cover" />
               </div>
               <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[3px] border-white rounded-full shadow-sm"></span>
           </div>
           <div>
               <h3 className="text-lg md:text-xl font-bold text-slate-800">Dr. Zeynep Kaya</h3>
               <div className="flex items-center gap-2 text-[10px] md:text-xs text-teal-700 font-bold bg-white/60 px-2 py-1 rounded-lg w-fit mt-1 border border-teal-100">
                   <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse"></span>
                   Çevrimiçi
               </div>
           </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            <button 
                onClick={openWhatsApp}
                className="bg-green-500 text-white hover:bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-500/20 transition-all border border-green-400 active:scale-95"
                title="WhatsApp"
            >
                <Icons.Phone />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50 scroll-smooth">
        {loading ? (
             <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : messages.length === 0 ? (
             <div className="text-center text-slate-400 py-10">
                 <p>Henüz mesaj yok. Merhaba deyin! 👋</p>
             </div>
        ) : (
            messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${msg.role === 'patient' ? 'items-end' : 'items-start'}`}>
                    <div className={`
                        p-4 md:p-5 rounded-[1.5rem] text-sm shadow-sm relative leading-relaxed transition-all
                        ${msg.role === 'patient' 
                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-tr-sm shadow-teal-500/20' 
                            : 'bg-white text-slate-700 border border-gray-100 rounded-tl-sm shadow-gray-200/50'}
                    `}>
                        {msg.text}
                    </div>
                    <div className="text-[10px] mt-2 px-2 text-slate-400 font-bold uppercase tracking-wide opacity-80">
                        {formatTime(msg.timestamp)}
                    </div>
                </div>
            </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100 relative z-20">
        <div className="flex items-end gap-2 md:gap-3 max-w-5xl mx-auto bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100 shadow-inner focus-within:bg-white focus-within:shadow-lg focus-within:ring-2 focus-within:ring-teal-100 transition-all">
          <div className="flex-1 rounded-2xl transition-all">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mesajınızı yazın..." 
                className="w-full px-2 md:px-4 py-3 md:py-4 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 font-medium h-full outline-none text-sm md:text-base"
              />
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText}
            className="p-3 md:p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-all shadow-lg shadow-teal-600/30 transform active:scale-95"
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
