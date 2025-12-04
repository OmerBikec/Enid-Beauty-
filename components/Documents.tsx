
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { ServiceRecord, Patient } from '../types';
import { 
    subscribeToDentalRecords, 
    subscribeToPatients, 
    addDentalRecord, 
    deleteDentalRecord, 
    getCurrentUser 
} from '../services/firebaseService';
import { getTreatmentAnalysis, getTreatmentChatResponse } from '../services/gemini';

const Documents: React.FC = () => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  // Data State
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  
  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender: 'user'|'ai', text: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecordData, setNewRecordData] = useState({
      treatment: 'Cilt Bakımı',
      status: 'completed',
      notes: '',
      startTime: '',
      endTime: ''
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
      const checkRoleAndFetch = async () => {
          if (!currentUser) return;
          try {
              if (currentUser.role === 'admin') {
                  setIsAdmin(true);
                  const unsubPatients = subscribeToPatients((data) => setPatients(data));
                  return unsubPatients; 
              } else {
                  setPatientInfo(currentUser as unknown as Patient);
              }
          } catch (error) {
              console.error("Rol hatası:", error);
          }
      };
      checkRoleAndFetch();
  }, [currentUser]);

  useEffect(() => {
      if (isAdmin && !selectedPatientId) {
          setLoading(false);
          return;
      }
      const targetUid = isAdmin ? selectedPatientId! : currentUser?.uid;
      
      if (targetUid) {
          setLoading(true);
          const unsubRecords = subscribeToDentalRecords((data) => {
              setRecords(data);
              setLoading(false);
          }, targetUid);
          
          return () => unsubRecords();
      }
  }, [isAdmin, selectedPatientId, currentUser]);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const calculateDuration = (record?: ServiceRecord) => {
      if (record?.startTime && record?.endTime) {
          const start = new Date(`2000-01-01T${record.startTime}`);
          const end = new Date(`2000-01-01T${record.endTime}`);
          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return diff > 0 ? `${diff.toFixed(1)} Saat` : 'Belirsiz';
      }
      return 'Süre Bilgisi Yok';
  };

  const handleAnalyze = async (record: ServiceRecord) => {
      setSelectedRecordId(record.id);
      setIsAnalyzing(true);
      setAiAnalysis("");
      setChatHistory([]); // Reset chat
      
      const duration = calculateDuration(record);
      const analysis = await getTreatmentAnalysis(record.treatment, duration);
      
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
  };

  const handleAskQuestion = async (q?: string) => {
      const question = q || chatInput;
      if(!question.trim()) return;

      const currentRecord = records.find(r => r.id === selectedRecordId);
      if(!currentRecord) return;

      setChatHistory(prev => [...prev, {sender: 'user', text: question}]);
      setChatInput("");
      setIsChatting(true);

      const response = await getTreatmentChatResponse(currentRecord.treatment, question);
      
      setChatHistory(prev => [...prev, {sender: 'ai', text: response}]);
      setIsChatting(false);
  };

  const handleAddRecord = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPatientId) return;
      try {
          await addDentalRecord({
              userId: selectedPatientId,
              treatment: newRecordData.treatment,
              status: newRecordData.status as any,
              date: new Date().toISOString().split('T')[0],
              startTime: newRecordData.startTime,
              endTime: newRecordData.endTime,
              doctor: currentUser?.name || 'Uzman Estetisyen',
              notes: newRecordData.notes,
              id: Date.now().toString()
          });
          setShowAddForm(false);
      } catch (error) {
          alert('Hata oluştu.');
      }
  };

  const handleDeleteRecord = async (id: string) => {
      if(confirm('Silinsin mi?')) await deleteDentalRecord(id);
  }

  // --- ADMIN LIST VIEW ---
  if (isAdmin && !selectedPatientId) {
      return (
          <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kayıtlar & Analiz</h2>
                      <p className="text-slate-500 font-medium mt-1">Geçmiş işlem kayıtlarını inceleyin ve AI analizi yapın.</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patients.map(p => (
                      <div key={p.id} onClick={() => { setSelectedPatientId(p.id); setSelectedPatientName(`${p.name} ${p.surname}`); }}
                        className="glass-card p-6 rounded-[2.5rem] hover:shadow-premium cursor-pointer transition-all bg-white hover:bg-white/80 border border-slate-100 group relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                          <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform">{p.name.charAt(0)}</div>
                              <div>
                                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{p.name} {p.surname}</h3>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{p.phone}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  const activeRecord = records.find(r => r.id === selectedRecordId);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-fade-in pb-12 relative">
      {isAdmin && (
          <button onClick={() => { setSelectedPatientId(null); setRecords([]); setSelectedRecordId(null); }} className="absolute top-0 right-0 z-30 bg-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 border border-gray-100 flex items-center gap-2">
            <Icons.ChevronLeft /> Geri Dön
          </button>
      )}

      {/* LEFT: TREATMENT LIST */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="glass-card rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-xl min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>
              
              <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAdmin ? selectedPatientName : 'Hizmet Geçmişim'}</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Yapılan işlemlerin detayları.</p>
              </div>

              {isAdmin && (
                  <button onClick={() => setShowAddForm(!showAddForm)} className="mb-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                      <Icons.Plus /> {showAddForm ? 'İptal' : 'Yeni İşlem Ekle'}
                  </button>
              )}

              {showAddForm && isAdmin && (
                  <div className="p-6 bg-slate-50 rounded-3xl mb-6 border border-slate-200 animate-slide-up">
                      <form onSubmit={handleAddRecord} className="space-y-4">
                          <div className="relative">
                            <select className="w-full p-4 rounded-2xl text-sm font-bold bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-pink-100 appearance-none" onChange={e => setNewRecordData({...newRecordData, treatment: e.target.value})}>
                                <option>Cilt Bakımı</option><option>Hydrafacial</option><option>Botox</option><option>Lazer Epilasyon</option><option>Dudak Dolgusu</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-gray-400"><Icons.ChevronDown /></div>
                          </div>
                          <div className="flex gap-3">
                              <input type="time" className="flex-1 p-4 rounded-2xl text-sm bg-white border border-gray-100 outline-none" onChange={e => setNewRecordData({...newRecordData, startTime: e.target.value})} />
                              <input type="time" className="flex-1 p-4 rounded-2xl text-sm bg-white border border-gray-100 outline-none" onChange={e => setNewRecordData({...newRecordData, endTime: e.target.value})} />
                          </div>
                          <textarea className="w-full p-4 rounded-2xl text-sm bg-white border border-gray-100 outline-none resize-none" rows={2} placeholder="Notlar..." onChange={e => setNewRecordData({...newRecordData, notes: e.target.value})}></textarea>
                          <button className="w-full py-3 bg-pink-600 text-white rounded-2xl font-bold text-sm hover:bg-pink-700 transition-colors shadow-md shadow-pink-200">Kaydet</button>
                      </form>
                  </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {records.length === 0 ? <p className="text-center text-slate-400 mt-10">Kayıt bulunamadı.</p> : 
                   records.map((rec, index) => (
                       <div 
                        key={rec.id} 
                        onClick={() => handleAnalyze(rec)}
                        className={`
                            relative p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 group
                            ${selectedRecordId === rec.id 
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30 scale-[1.02] border-slate-900' 
                                : 'bg-white border-slate-100 hover:border-pink-200 hover:shadow-lg'}
                        `}
                       >
                           {/* Timeline connector visual */}
                           {index !== records.length - 1 && (
                               <div className={`absolute left-8 bottom-0 w-0.5 h-6 translate-y-full ${selectedRecordId === rec.id ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                           )}

                           <div className="flex justify-between items-start mb-2">
                               <h4 className={`font-bold text-lg ${selectedRecordId === rec.id ? 'text-white' : 'text-slate-800'}`}>{rec.treatment}</h4>
                               {isAdmin && <button onClick={(e) => { e.stopPropagation(); handleDeleteRecord(rec.id); }} className="text-slate-400 hover:text-red-500"><Icons.Trash /></button>}
                           </div>
                           
                           <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${selectedRecordId === rec.id ? 'text-slate-400' : 'text-slate-400'}`}>
                               {rec.date}
                           </div>

                           <div className="flex items-center gap-3">
                               <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedRecordId === rec.id ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
                                   {rec.status === 'completed' ? 'Tamamlandı' : 'Planlandı'}
                               </div>
                               <div className={`text-[10px] font-bold ${selectedRecordId === rec.id ? 'text-slate-400' : 'text-slate-400'}`}>
                                   {calculateDuration(rec)}
                               </div>
                           </div>
                       </div>
                   ))
                  }
              </div>
          </div>
      </div>

      {/* RIGHT: AI ANALYSIS & CHAT */}
      <div className="flex-1 flex flex-col gap-6">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 bg-white border border-slate-100 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              {!selectedRecordId ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-28 h-28 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-5xl shadow-inner animate-float">
                        <Icons.Sparkles />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800">Yapay Zeka Analizi</h3>
                      <p className="text-slate-500 max-w-sm mt-3 font-medium">İşlem sonrası bakım, olası etkiler ve öneriler için sol taraftan bir kayıt seçin.</p>
                  </div>
              ) : (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-8 mb-8 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                                <Icons.Activity /> AI Health Report
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{activeRecord?.treatment}</h3>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
                                <span>Dr. {activeRecord?.doctor}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{activeRecord?.date}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-pink-500/30 animate-pulse-slow">
                            <Icons.Sparkles />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-8 relative z-10 custom-scrollbar">
                        {isAnalyzing ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded-full w-1/4 animate-pulse"></div>
                                    <div className="h-32 bg-slate-50 rounded-3xl animate-pulse border border-slate-100"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded-full w-1/3 animate-pulse"></div>
                                    <div className="h-20 bg-slate-50 rounded-3xl animate-pulse border border-slate-100"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-slate prose-sm max-w-none">
                                <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100/60 leading-relaxed text-slate-600 font-medium shadow-sm">
                                    <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b class="text-slate-900">$1</b>') }} />
                                </div>
                            </div>
                        )}

                        {/* Q&A SECTION */}
                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                                <Icons.MessageCircle /> Uzman Asistana Sor
                            </h4>
                            
                            {/* Suggested Chips */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {["Kızarıklık ne zaman geçer?", "Duş alabilir miyim?", "Güneş kremi kullanmalı mıyım?", "Makyaj yapabilir miyim?"].map(q => (
                                    <button 
                                        key={q} 
                                        onClick={() => handleAskQuestion(q)} 
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-slate-900 text-white rounded-tr-sm shadow-md' : 'bg-white border border-gray-100 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isChatting && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold ml-2">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                        Yazıyor...
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="relative group">
                                <input 
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-5 pr-14 py-4 text-sm font-medium focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all shadow-inner" 
                                    placeholder="Bakımınız hakkında aklınıza takılanları sorun..." 
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                                />
                                <button 
                                    onClick={() => handleAskQuestion()} 
                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                >
                                    <Icons.Send />
                                </button>
                            </div>
                        </div>
                    </div>
                  </>
              )}
          </div>
      </div>
    </div>
  );
};

export default Documents;
