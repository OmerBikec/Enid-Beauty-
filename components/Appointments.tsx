
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { Appointment, User } from '../types';
import { subscribeToAppointments, addAppointment, updateAppointmentStatus } from '../services/firebaseService';

interface AppointmentsProps {
  user: User; // Changed to accept full user object
}

const Appointments: React.FC<AppointmentsProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    patientName: user.role === 'admin' ? '' : `${user.name} ${user.surname}`, // Autofill for patients
    tcNo: user.tcNo || '',
    date: '',
    time: '',
    description: '',
    type: 'Cilt Bakımı'
  });
  const [images, setImages] = useState<string[]>([]);

  // Subscribe to Firebase Realtime Data with User Filtering
  useEffect(() => {
      // Pass userId and role to filter data server-side
      const unsubscribe = subscribeToAppointments((data) => {
          setAppointments(data);
          setLoading(false);
      }, user.uid, user.role);
      
      return () => unsubscribe();
  }, [user.uid, user.role]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
           setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Determine Patient Name: Use input if admin, otherwise use logged-in user's name
        const finalPatientName = user.role === 'admin' 
            ? (formData.patientName || 'Misafir Müşteri') 
            : `${user.name} ${user.surname}`;

        await addAppointment({
          userId: user.uid, // Save the User ID with the appointment
          patientName: finalPatientName,
          tcNo: formData.tcNo,
          date: formData.date,
          time: formData.time,
          type: formData.type,
          description: formData.description,
          images: images,
          status: 'pending',
          price: 0
        });
        
        setShowForm(false);
        // Reset form but keep name/tc if patient
        setFormData({ 
            patientName: user.role === 'admin' ? '' : `${user.name} ${user.surname}`, 
            tcNo: user.tcNo || '', 
            date: '', 
            time: '', 
            description: '', 
            type: 'Cilt Bakımı' 
        });
        setImages([]);
        triggerNotification('Randevu talebiniz başarıyla oluşturuldu.', 'success');
    } catch (error) {
        triggerNotification('Hata oluştu, lütfen tekrar deneyin.', 'error');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
        await updateAppointmentStatus(id, newStatus);
        if (newStatus === 'confirmed') {
            triggerNotification('Randevu başarıyla onaylandı.', 'success');
        } else {
            triggerNotification('Randevu reddedildi.', 'error');
        }
    } catch (error) {
        triggerNotification('Güncelleme başarısız.', 'error');
    }
  };

  const filteredAppointments = appointments.filter(apt => filter === 'all' || apt.status === filter);

  if (loading) {
      return (
          <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in h-full flex flex-col relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up backdrop-blur-md border border-white/20 transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/90 text-white shadow-emerald-500/30' 
            : 'bg-rose-500/90 text-white shadow-rose-500/30'
        }`}>
          <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
            {notification.type === 'success' ? <Icons.Check /> : <Icons.X />}
          </div>
          <div>
              <h4 className="font-bold text-sm leading-tight">{notification.type === 'success' ? 'Başarılı' : 'İşlem Tamamlandı'}</h4>
              <p className="text-xs font-medium opacity-90">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {user.role === 'admin' ? 'Randevu Yönetimi' : 'Randevularım'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {user.role === 'admin' ? 'Tüm müşteri randevularını görüntüleyin ve düzenleyin.' : 'Geçmiş ve gelecek işlemleriniz.'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            {user.role === 'admin' && (
                <div className="relative group w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Müşteri Ara..." 
                        className="pl-11 pr-4 py-3.5 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none shadow-sm transition-all w-full md:w-72"
                    />
                    <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Icons.Search />
                    </div>
                </div>
            )}
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all font-bold hover:-translate-y-1 active:scale-95 group"
            >
              <Icons.Plus />
              <span>{user.role === 'admin' ? 'Randevu Ekle' : 'Randevu Al'}</span>
            </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowForm(false)}></div>
            <div className="glass-modal md:rounded-[2.5rem] w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-fade-in-up border border-gray-100 flex flex-col">
                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white/80 sticky top-0 backdrop-blur-lg z-20 shrink-0">
                    <h3 className="text-2xl font-bold text-slate-800">Yeni Randevu</h3>
                    <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <Icons.Plus /> {/* Rotate via CSS for X */}
                    </button>
                </div>
                
                <form onSubmit={handleCreate} className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                            <input 
                                name="patientName"
                                type="text" 
                                required
                                disabled={user.role !== 'admin'} // Disable editing name if patient
                                className={`w-full px-5 py-4 border border-transparent rounded-2xl font-bold text-slate-700 outline-none transition-all ${user.role !== 'admin' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'}`}
                                value={formData.patientName}
                                onChange={handleInputChange}
                                placeholder="Örn: Ayşe Yılmaz"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">TC Kimlik No</label>
                            <input 
                                name="tcNo"
                                type="text" 
                                maxLength={11}
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                value={formData.tcNo}
                                onChange={handleInputChange}
                                placeholder="11 Haneli TC"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Uygulama</label>
                            <div className="relative">
                                <select 
                                    name="type"
                                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none transition-all cursor-pointer"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    <option>Cilt Bakımı</option>
                                    <option>Lazer Epilasyon</option>
                                    <option>Botox</option>
                                    <option>Hydrafacial</option>
                                    <option>Dudak Dolgusu</option>
                                    <option>Bölgesel İncelme</option>
                                </select>
                                <div className="absolute right-5 top-5 pointer-events-none text-gray-500">
                                    <Icons.ChevronRight />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tarih</label>
                            <input 
                                name="date"
                                type="date" 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Saat</label>
                            <input 
                                name="time"
                                type="time" 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                value={formData.time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">İstek/Beklenti Detayı</label>
                        <textarea 
                            name="description"
                            rows={3}
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl font-medium text-slate-700 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Beklentilerinizi veya cilt durumunuzu açıklayınız..."
                        ></textarea>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Görseller</label>
                        <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                            <label className="flex-shrink-0 cursor-pointer group bg-primary-50 hover:bg-primary-100 border-2 border-dashed border-primary-200 hover:border-primary-300 rounded-2xl w-28 h-28 flex flex-col items-center justify-center text-primary-500 transition-all">
                                <Icons.Camera />
                                <span className="text-[10px] font-bold mt-2 uppercase tracking-wide">Fotoğraf</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-28 h-28 group flex-shrink-0">
                                    <img src={img} alt="preview" className="w-full h-full object-cover rounded-2xl border border-gray-200 shadow-sm" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                    >
                                        <Icons.Plus /> {/* Use rotated plus as X */}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end gap-4 pb-8 md:pb-0">
                        <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">Vazgeç</button>
                        <button type="submit" className="px-10 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 font-bold shadow-xl shadow-primary-600/30 transition-all hover:-translate-y-1 active:scale-95">
                            Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 md:space-x-4 border-b border-gray-200/60 pb-1 overflow-x-auto">
         {(['all', 'confirmed', 'pending'] as const).map(type => (
             <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                    px-4 md:px-6 py-3 text-xs md:text-sm font-bold rounded-t-2xl border-b-2 transition-all relative top-[2px] whitespace-nowrap
                    ${filter === type 
                        ? 'border-primary-500 text-primary-600 bg-white/50 shadow-sm' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'}
                `}
             >
                 {type === 'all' ? 'Tüm Randevular' : type === 'confirmed' ? 'Onaylananlar' : 'Bekleyenler'}
             </button>
         ))}
      </div>

      <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex-1 border border-white/60 bg-white/40">
        <div className="overflow-auto h-full">
            
            {/* Desktop Table View */}
            <table className="hidden md:table w-full text-left border-collapse">
            <thead className="bg-white/50 border-b border-gray-100 sticky top-0 backdrop-blur-md z-10">
                <tr>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Müşteri</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">İşlem</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Zaman</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Durum</th>
                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
                {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-white/60 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-white flex items-center justify-center text-slate-600 font-extrabold text-lg shadow-sm">
                                {apt.patientName.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-base">{apt.patientName}</div>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">{apt.tcNo || 'TC No Girilmedi'}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-700">{apt.type}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{apt.description || 'Standart Bakım'}</div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex flex-col text-sm font-medium text-slate-600">
                            <span className="text-slate-800 font-bold">{apt.time}</span>
                            <span className="text-xs text-slate-400">{apt.date}</span>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                    <span className={`
                        inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold capitalize border shadow-sm
                        ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                        ${apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                        ${apt.status === 'completed' ? 'bg-slate-50 text-slate-600 border-slate-200' : ''}
                        ${apt.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                    `}>
                        <span className={`w-2 h-2 rounded-full ${
                            apt.status === 'confirmed' ? 'bg-green-500' : 
                            apt.status === 'pending' ? 'bg-amber-500' : 
                            apt.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-500'
                        }`}></span>
                        {apt.status === 'confirmed' ? 'Onaylandı' : 
                         apt.status === 'pending' ? 'Bekliyor' : 
                         apt.status === 'cancelled' ? 'İptal' : 'Tamamlandı'}
                    </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        {user.role === 'admin' && apt.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 flex items-center gap-2"
                                >
                                    <Icons.Check />
                                    Onayla
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 flex items-center gap-2"
                                >
                                    <Icons.X />
                                    Reddet
                                </button>
                            </div>
                        ) : user.role === 'admin' && (
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-primary-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm hover:shadow-md">
                                <Icons.Settings />
                            </button>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
                {filteredAppointments.map((apt) => (
                    <div key={apt.id} className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm active:scale-98 transition-transform">
                        <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                                    {apt.patientName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{apt.patientName}</h4>
                                    <p className="text-xs text-slate-400">{apt.type}</p>
                                </div>
                             </div>
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                apt.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                apt.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-500'
                             }`}>
                                 {apt.status === 'confirmed' ? 'Onaylandı' : 
                                  apt.status === 'pending' ? 'Bekliyor' : 
                                  apt.status === 'cancelled' ? 'İptal' : 'Tamamlandı'}
                             </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                            <div className="flex items-center gap-2">
                                <Icons.Calendar />
                                <span className="font-bold">{apt.date}</span>
                            </div>
                            <div className="flex items-center gap-2 border-l pl-3 border-gray-200">
                                <Icons.Clock />
                                <span className="font-bold">{apt.time}</span>
                            </div>
                        </div>

                        {/* Admin Action Buttons Mobile */}
                        {user.role === 'admin' && apt.status === 'pending' && (
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-green-500/20 active:bg-green-600 flex items-center justify-center gap-2"
                                >
                                    <Icons.Check />
                                    Onayla
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                    className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold text-sm active:bg-slate-200 flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500"
                                >
                                    <Icons.X />
                                    Reddet
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredAppointments.length === 0 && (
                 <div className="py-20 text-center text-gray-400 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Icons.Search />
                    </div>
                    {user.role === 'patient' 
                        ? 'Henüz bir randevunuz bulunmuyor.' 
                        : 'Kayıt bulunamadı.'}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Appointments;