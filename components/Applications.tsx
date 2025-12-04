
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { ServiceRecord, User } from '../types';
import { 
    subscribeToPatients, 
    subscribeToDentalRecords,
    addDentalRecord,
    updateDentalRecord,
    getCurrentUser 
} from '../services/firebaseService';
import { getTreatmentAnalysis } from '../services/gemini';

const Applications: React.FC = () => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  
  // Admin: Patient Selection
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  // Records
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Form (Admin)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
      treatment: 'Lazer Epilasyon',
      totalSessions: 8,
      completedSessions: 0,
      instructions: '',
      notes: ''
  });
  const [aiGenerating, setAiGenerating] = useState(false);

  // Initial Fetch
  useEffect(() => {
      if (isAdmin) {
          const unsub = subscribeToPatients(setPatients);
          return () => unsub();
      } else if (currentUser) {
          setLoading(true);
          const unsub = subscribeToDentalRecords((data) => {
              setRecords(data);
              setLoading(false);
          }, currentUser.uid);
          return () => unsub();
      }
  }, [isAdmin, currentUser]);

  // Fetch records when admin selects a patient
  useEffect(() => {
      if (isAdmin && selectedPatientId) {
          setLoading(true);
          const unsub = subscribeToDentalRecords((data) => {
              setRecords(data);
              setLoading(false);
          }, selectedPatientId);
          return () => unsub();
      }
  }, [isAdmin, selectedPatientId]);

  const handleAiSuggest = async () => {
      setAiGenerating(true);
      const prompt = `${formData.treatment} işlemi için danışana verilmesi gereken kısa, maddeler halinde yapılması ve yapılmaması gerekenler listesi. 3-4 madde yeterli.`;
      const suggestion = await getTreatmentAnalysis(formData.treatment, "Belirsiz");
      // The service function is generic, but works well for extracting instructions
      setFormData(prev => ({ ...prev, instructions: suggestion }));
      setAiGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPatientId && isAdmin) return;

      const targetId = isAdmin ? selectedPatientId! : currentUser!.uid;

      await addDentalRecord({
          id: Date.now().toString(),
          userId: targetId,
          treatment: formData.treatment,
          status: 'active',
          date: new Date().toISOString().split('T')[0],
          doctor: currentUser?.name || 'Uzman',
          notes: formData.notes,
          totalSessions: Number(formData.totalSessions),
          completedSessions: Number(formData.completedSessions),
          instructions: formData.instructions
      });
      
      setShowForm(false);
      setFormData({treatment: 'Lazer Epilasyon', totalSessions: 8, completedSessions: 0, instructions: '', notes: ''});
  };

  const incrementSession = async (record: ServiceRecord) => {
      if (!record.totalSessions || !isAdmin) return;
      const newCount = (record.completedSessions || 0) + 1;
      if (newCount <= record.totalSessions) {
          await updateDentalRecord(record.id, { 
              completedSessions: newCount,
              status: newCount === record.totalSessions ? 'completed' : 'active'
          });
      }
  };

  // ADMIN: SELECT PATIENT VIEW
  if (isAdmin && !selectedPatientId) {
      return (
          <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Müşteri Uygulamaları</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {patients.map(p => (
                      <div 
                        key={p.uid} 
                        onClick={() => { setSelectedPatientId(p.uid); setSelectedPatientName(`${p.name} ${p.surname}`); }}
                        className="glass-card p-6 rounded-[2rem] hover:shadow-premium cursor-pointer transition-all bg-white hover:bg-pink-50/50 border border-slate-100 group"
                      >
                          <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                  {p.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-pink-600 transition-colors">{p.name} {p.surname}</h3>
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{p.phone}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in pb-12 relative">
      <div className="flex items-center justify-between mb-8">
          <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {isAdmin ? `${selectedPatientName} - Uygulamalar` : 'Uygulamalarım'}
              </h2>
              <p className="text-slate-500 font-medium">Aktif seanslar ve tedavi detayları.</p>
          </div>
          {isAdmin && (
              <div className="flex gap-3">
                <button onClick={() => setSelectedPatientId(null)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                    Geri Dön
                </button>
                <button onClick={() => setShowForm(!showForm)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                    {showForm ? 'İptal' : '+ Yeni Uygulama'}
                </button>
              </div>
          )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: FORM (Admin Only) */}
          {showForm && isAdmin && (
              <div className="w-full lg:w-1/3 order-1 lg:order-2 animate-slide-up">
                  <div className="glass-card p-6 rounded-[2.5rem] bg-white border border-pink-100 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full -z-10"></div>
                      <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                          <Icons.Plus /> Yeni Tedavi Planı
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">İşlem Türü</label>
                              <select 
                                className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                                value={formData.treatment}
                                onChange={e => setFormData({...formData, treatment: e.target.value})}
                              >
                                  <option>Lazer Epilasyon</option>
                                  <option>Cilt Bakımı</option>
                                  <option>Dermapen</option>
                                  <option>G5 Masajı</option>
                                  <option>Saç Mezoterapisi</option>
                              </select>
                          </div>
                          <div className="flex gap-4">
                              <div className="space-y-2 flex-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Toplam Seans</label>
                                  <input 
                                    type="number" 
                                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-pink-200"
                                    value={formData.totalSessions}
                                    onChange={e => setFormData({...formData, totalSessions: Number(e.target.value)})} 
                                  />
                              </div>
                              <div className="space-y-2 flex-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yapılan</label>
                                  <input 
                                    type="number" 
                                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-pink-200"
                                    value={formData.completedSessions}
                                    onChange={e => setFormData({...formData, completedSessions: Number(e.target.value)})} 
                                  />
                              </div>
                          </div>
                          
                          <div className="space-y-2">
                              <div className="flex justify-between items-center px-1">
                                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Talimatlar (Do's & Don'ts)</label>
                                  <button type="button" onClick={handleAiSuggest} className="text-[10px] font-bold text-pink-600 hover:underline flex items-center gap-1">
                                      {aiGenerating ? 'Yazılıyor...' : '✨ AI Önerisi Al'}
                                  </button>
                              </div>
                              <textarea 
                                rows={4}
                                className="w-full p-4 bg-slate-50 rounded-2xl font-medium text-slate-600 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                                placeholder="Örn: Güneşe çıkmayın, kese yapmayın..."
                                value={formData.instructions}
                                onChange={e => setFormData({...formData, instructions: e.target.value})}
                              ></textarea>
                          </div>

                          <div className="pt-4">
                              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
                                  Planı Oluştur
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

          {/* LIST VIEW */}
          <div className={`w-full ${showForm && isAdmin ? 'lg:w-2/3 order-2 lg:order-1' : ''} space-y-6`}>
              {records.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Icons.Grid />
                      </div>
                      <p>Henüz atanmış bir uygulama bulunmuyor.</p>
                  </div>
              ) : (
                  records.map((rec) => (
                      <div key={rec.id} className="glass-card p-6 md:p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-premium transition-all duration-300 relative overflow-hidden group">
                          
                          {/* Background Decoration */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>

                          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                              {/* Left Info */}
                              <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${rec.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                                          {rec.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                                      </span>
                                      <span className="text-xs text-slate-400 font-bold">{rec.date}</span>
                                  </div>
                                  <h3 className="text-2xl font-black text-slate-800 mb-1">{rec.treatment}</h3>
                                  <p className="text-slate-500 font-medium text-sm mb-6">Uzm. {rec.doctor}</p>
                                  
                                  {/* Progress Bar */}
                                  {rec.totalSessions && (
                                      <div className="mb-6">
                                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                                              <span>İlerleme</span>
                                              <span>{rec.completedSessions} / {rec.totalSessions} Seans</span>
                                          </div>
                                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                              <div 
                                                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-1000"
                                                style={{width: `${(rec.completedSessions! / rec.totalSessions!) * 100}%`}}
                                              ></div>
                                          </div>
                                      </div>
                                  )}

                                  {/* Instructions Box */}
                                  {rec.instructions && (
                                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative">
                                          <div className="absolute -top-3 left-4 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1">
                                              <span className="text-yellow-500">💡</span>
                                              <span className="text-[10px] font-bold text-slate-600 uppercase">Dikkat Edilmesi Gerekenler</span>
                                          </div>
                                          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">
                                              {rec.instructions}
                                          </div>
                                      </div>
                                  )}
                              </div>

                              {/* Right Action (Admin Only) */}
                              {isAdmin && rec.status !== 'completed' && (
                                  <div className="flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                                      <button 
                                        onClick={() => incrementSession(rec)}
                                        className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-lg hover:bg-pink-600 transition-colors active:scale-95 group/btn"
                                        title="Seans Tamamla"
                                      >
                                          <Icons.Check />
                                      </button>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 text-center">Seans<br/>Onayla</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default Applications;
