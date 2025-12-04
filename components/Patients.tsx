
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { subscribeToPatients, addPatient, updatePatient, deletePatient, subscribeToDentalRecords } from '../services/firebaseService';
import { ServiceRecord } from '../types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected Patient for Details View
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientRecords, setPatientRecords] = useState<ServiceRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
      name: '',
      surname: '',
      tcNo: '',
      phone: '',
      relativeName: '',
      relativePhone: '',
      entryTime: '',
      exitTime: ''
  });

  useEffect(() => {
      const unsubscribe = subscribeToPatients((data) => {
          setPatients(data);
          setLoading(false);
      });
      return () => unsubscribe();
  }, []);

  // Fetch records when a patient is selected
  useEffect(() => {
      if (selectedPatient) {
          setLoadingRecords(true);
          const unsub = subscribeToDentalRecords((data) => {
              setPatientRecords(data);
              setLoadingRecords(false);
          }, selectedPatient.uid);
          return () => unsub();
      }
  }, [selectedPatient]);

  const contactPatient = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const target = cleanPhone.length > 10 ? cleanPhone : `90${cleanPhone}`;
        window.open(`https://wa.me/${target}`, '_blank');
    } else {
        alert('Telefon numarası kayıtlı değil.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (p: any, e: React.MouseEvent) => {
      e.stopPropagation();
      setFormData({
          name: p.name || '',
          surname: p.surname || '',
          tcNo: p.tcNo || '',
          phone: p.phone || '',
          relativeName: p.relativeName || '',
          relativePhone: p.relativePhone || '',
          entryTime: p.entryTime || '',
          exitTime: p.exitTime || ''
      });
      setEditId(p.uid); // Using uid as id
      setIsEditing(true);
      setShowForm(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(confirm('Bu hastayı ve tüm verilerini silmek istediğinize emin misiniz?')) {
          try {
              await deletePatient(id);
              if (selectedPatient?.uid === id) setSelectedPatient(null);
              alert('Hasta silindi.');
          } catch(e) {
              alert('Silme hatası.');
          }
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const patientData = {
              name: formData.name,
              surname: formData.surname,
              tcNo: formData.tcNo,
              phone: formData.phone,
              relativeName: formData.relativeName,
              relativePhone: formData.relativePhone,
              entryTime: formData.entryTime,
              exitTime: formData.exitTime,
              lastVisit: new Date().toISOString().split('T')[0],
              role: 'patient'
          };

          if (isEditing && editId) {
              await updatePatient(editId, patientData);
              alert('Hasta bilgileri güncellendi.');
          } else {
              await addPatient({
                  ...patientData,
                  totalVisits: 0,
                  status: 'active'
              });
              alert('Yeni hasta eklendi.');
          }

          setShowForm(false);
          setIsEditing(false);
          setFormData({ name: '', surname: '', tcNo: '', phone: '', relativeName: '', relativePhone: '', entryTime: '', exitTime: '' });
      } catch (error) {
          console.error("Hata:", error);
          alert('Bir hata oluştu.');
      }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in h-full flex flex-col relative">
        
        {/* ADD/EDIT FORM MODAL */}
        {showForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowForm(false)}></div>
                <div className="glass-modal rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 animate-fade-in-up border border-white/60 p-8 max-h-[90vh] overflow-y-auto bg-white">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center"><Icons.User /></div>
                            <h3 className="text-2xl font-black text-slate-800">{isEditing ? 'Hasta Profilini Düzenle' : 'Yeni Hasta Kaydı'}</h3>
                        </div>
                        <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><Icons.X /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-6">
                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ad</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all" required />
                            </div>
                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Soyad</label>
                                <input name="surname" value={formData.surname} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">TC Kimlik</label>
                                <input name="tcNo" value={formData.tcNo} onChange={handleInputChange} maxLength={11} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Telefon</label>
                                <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all" required />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-xs font-bold text-pink-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                                Ziyaret & Yakın Bilgisi
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yakın Adı</label>
                                    <input name="relativeName" value={formData.relativeName} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Yakın Tel</label>
                                    <input name="relativePhone" value={formData.relativePhone} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Giriş Saati</label>
                                    <input name="entryTime" type="time" value={formData.entryTime} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Çıkış Saati</label>
                                    <input name="exitTime" type="time" value={formData.exitTime} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-4">
                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors">Vazgeç</button>
                            <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">{isEditing ? 'Değişiklikleri Kaydet' : 'Kaydı Tamamla'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* DETAILS SIDEBAR */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${selectedPatient ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedPatient && (
                <div className="h-full flex flex-col bg-white">
                    {/* Sidebar Header */}
                    <div className="p-8 pb-4 bg-white relative z-10">
                         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-white -z-10"></div>
                         <div className="flex justify-between items-start mb-6">
                             <button onClick={() => setSelectedPatient(null)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors">
                                <Icons.ArrowRight />
                             </button>
                             <div className="flex gap-2">
                                <button onClick={(e) => openEdit(selectedPatient, e)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"><Icons.Settings /></button>
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-slate-900/20 rotate-3">
                                {selectedPatient.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{selectedPatient.name} <br/> {selectedPatient.surname}</h2>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aktif Üye
                                </span>
                            </div>
                         </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8 custom-scrollbar">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">Telefon</div>
                                 <div className="font-bold text-slate-800 text-sm">{selectedPatient.phone}</div>
                             </div>
                             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">TC Kimlik</div>
                                 <div className="font-bold text-slate-800 text-sm">{selectedPatient.tcNo}</div>
                             </div>
                        </div>

                        {/* Recent History */}
                        <div>
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-slate-900 text-lg">İşlem Geçmişi</h4>
                                <span className="text-xs font-bold text-slate-400">{patientRecords.length} Kayıt</span>
                             </div>
                             
                             {loadingRecords ? (
                                 <div className="space-y-3">
                                     <div className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>
                                     <div className="h-16 bg-slate-50 rounded-2xl animate-pulse delay-75"></div>
                                 </div>
                             ) : patientRecords.length === 0 ? (
                                 <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">Kayıtlı işlem bulunamadı.</div>
                             ) : (
                                 <div className="space-y-4">
                                     {patientRecords.map((rec, i) => (
                                         <div key={rec.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-pink-200 transition-colors">
                                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-pink-500 transition-colors"></div>
                                             <div className="flex justify-between items-start mb-2 pl-3">
                                                 <h5 className="font-bold text-slate-800 text-lg">{rec.treatment}</h5>
                                                 <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{rec.date}</span>
                                             </div>
                                             <p className="text-sm text-slate-500 pl-3 font-medium leading-relaxed">{rec.notes}</p>
                                             {rec.totalSessions && (
                                                <div className="pl-3 mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-bold uppercase tracking-wider">Durum</span>
                                                    <span className="font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                                                        {rec.completedSessions}/{rec.totalSessions} Seans
                                                    </span>
                                                </div>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                    
                    {/* Fixed Action Footer */}
                    <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0 z-20">
                        <button onClick={(e) => contactPatient(selectedPatient.phone, e)} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95">
                            <Icons.MessageCircle /> WhatsApp ile Ulaş
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Müşteri Portföyü</h2>
            <p className="text-slate-500 mt-2 text-lg font-medium max-w-lg">Kayıtlı üyeleri görüntüleyin, düzenleyin ve takibini yapın.</p>
          </div>
          <button 
                onClick={() => { setIsEditing(false); setFormData({name:'',surname:'',tcNo:'',phone:'',relativeName:'',relativePhone:'',entryTime:'',exitTime:''}); setShowForm(true); }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 font-bold hover:-translate-y-1 active:scale-95 group"
            >
                 <div className="bg-white/20 rounded-full p-1"><Icons.Plus /></div>
                 <span>Müşteri Ekle</span>
          </button>
        </header>

        {/* Patients Table Card */}
        <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden flex-1 bg-white/50 relative">
         <div className="overflow-auto h-full custom-scrollbar">
            <table className="hidden md:table w-full text-left border-collapse">
            <thead className="bg-white/80 border-b border-gray-100 sticky top-0 backdrop-blur-xl z-10">
                <tr>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest pl-10">Profil</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">İletişim</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Ziyaret Durumu</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Yakın Bilgisi</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-10">İşlemler</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
                {patients.map((p) => (
                <tr 
                    key={p.uid} 
                    onClick={() => setSelectedPatient(p)}
                    className={`hover:bg-white transition-colors group cursor-pointer ${selectedPatient?.uid === p.uid ? 'bg-indigo-50/30' : ''}`}
                >
                    <td className="px-8 py-5 pl-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                                {p.name ? p.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-base group-hover:text-pink-600 transition-colors">{p.name} {p.surname}</div>
                                <div className="text-xs text-slate-400 font-mono mt-0.5 tracking-wide">{p.tcNo}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-600 bg-slate-50 inline-block px-3 py-1 rounded-lg">{p.phone}</div>
                    </td>
                    <td className="px-8 py-5">
                        {p.entryTime ? (
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <div className="text-xs font-bold text-emerald-700">
                                    {p.entryTime} - {p.exitTime || 'İçeride'}
                                </div>
                            </div>
                        ) : <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Giriş Yok</span>}
                    </td>
                    <td className="px-8 py-5">
                        {p.relativeName ? (
                            <div className="text-xs">
                                <span className="font-bold text-slate-700 block mb-0.5">{p.relativeName}</span>
                                <span className="text-slate-400 font-mono">{p.relativePhone}</span>
                            </div>
                        ) : <span className="text-slate-300 text-xs">-</span>}
                    </td>
                    <td className="px-8 py-5 text-right pr-10">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button onClick={(e) => contactPatient(p.phone, e)} className="text-green-600 bg-green-50 p-2.5 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm"><Icons.MessageCircle /></button>
                            <button onClick={(e) => openEdit(p, e)} className="text-indigo-600 bg-indigo-50 p-2.5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm"><Icons.Settings /></button>
                            <button onClick={(e) => handleDelete(p.uid, e)} className="text-red-400 bg-red-50 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Icons.Trash /></button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Patients;
