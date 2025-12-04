import React from 'react';
import { TreatmentCategory, RecoveryGuide, ServiceRecord } from './types';

// Icons as SVG components
export const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
  ),
  Grid: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
  ),
  MessageCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Pill: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 14-7 7c-1.1 1.1-2.9 1.1-4 0l-4-4c-1.1-1.1-1.1-2.9 0-4l7-7c1.1-1.1 2.9-1.1 4 0l4 4c1.1 1.1 1.1 2.9 0 4Z"/><line x1="9" x2="15" y1="15" y2="9"/></svg>
  ),
  Wallet: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M2 7h4"/><path d="M2 11h4"/><path d="M19 13v4"/><path d="M23 13v4"/><path d="M16 17h4"/><path d="M16 21h4"/></svg>
  )
};

export const MOCK_APPOINTMENTS = [
  { id: '1', patientName: 'Selin Kaya', tcNo: '12345678901', date: '2023-10-25', time: '10:00', type: 'Saç Ekimi Konsültasyon', price: 0, status: 'confirmed' },
  { id: '2', patientName: 'Ayşe Demir', tcNo: '23456789012', date: '2023-10-25', time: '14:30', type: 'Gençlik Aşısı', price: 5000, status: 'pending' },
  { id: '3', patientName: 'Derya Öz', tcNo: '34567890123', date: '2023-10-26', time: '11:00', type: 'Botox', price: 4000, status: 'confirmed' },
  { id: '4', patientName: 'Ceren Şen', tcNo: '56789012345', date: '2023-10-26', time: '15:45', type: 'Altın İğne', price: 2000, status: 'completed' },
];

export const MOCK_TREATMENTS: TreatmentCategory[] = [
  {
    category: "Saç Tedavileri",
    items: [
      { id: 'h1', name: 'FUE Saç Ekimi', category: "Saç Tedavileri", description: 'Mikromotor ile greftlerin tek tek alınarak transfer edildiği klasik teknik.', duration: '6-8 Saat', price: 35000 },
      { id: 'h2', name: 'DHI (Kalem) Saç Ekimi', category: "Saç Tedavileri", description: 'Kanal açmadan, özel Choi kalemleri ile doğrudan ekim tekniği. Daha sık ve doğal görünüm.', duration: '6-9 Saat', price: 45000 },
      { id: 'h3', name: 'Saç PRP & Mezoterapi', category: "Saç Tedavileri", description: 'Zayıflayan saç köklerini vitamin ve kendi kan plazmanızla güçlendirme.', duration: '30 dk', price: 2500 },
      { id: 'h4', name: 'Safir FUE', category: "Saç Tedavileri", description: 'Safir uçlarla açılan mikro kanallar sayesinde daha hızlı iyileşme.', duration: '6-8 Saat', price: 40000 },
    ]
  },
  {
    category: "Gençleştirme & Anti-Aging",
    items: [
      { id: 'a1', name: 'H-100 Gençlik Aşısı', category: "Gençleştirme", description: 'Yüksek oranda hyaluronik asit ve amino asitler ile cildi neme doyurma ve sıkılaştırma.', duration: '30 dk', price: 6000 },
      { id: 'a2', name: 'Somon DNA', category: "Gençleştirme", description: 'Cilt yapısını onaran ve elastikiyeti artıran DNA molekülleri.', duration: '30 dk', price: 5000 },
      { id: 'a3', name: 'Fransız Askısı', category: "Gençleştirme", description: 'Ameliyatsız yüz germe işlemi. Sarkan bölgeleri toparlar.', duration: '60 dk', price: 25000 },
      { id: 'a4', name: 'Botoks (Full Face)', category: "Gençleştirme", description: 'Kırışıklıkların açılması ve oluşumunun engellenmesi.', duration: '15 dk', price: 4000 },
    ]
  },
  {
    category: "Cilt & Leke Tedavileri",
    items: [
      { id: 's1', name: 'Altın İğne (Scarlet S)', category: "Cilt Tedavileri", description: 'Radyofrekans ile gözenek sıkılaştırma, leke ve iz tedavisi.', duration: '45 dk', price: 4000 },
      { id: 's2', name: 'Hydrafacial', category: "Cilt Tedavileri", description: 'Vakum teknolojisi ile derinlemesine temizlik ve bakım.', duration: '45 dk', price: 2500 },
      { id: 's3', name: 'Kimyasal Peeling', category: "Cilt Tedavileri", description: 'Cildin üst katmanını soyarak yenileme işlemi.', duration: '30 dk', price: 2000 },
      { id: 's4', name: 'Dermapen', category: "Cilt Tedavileri", description: 'Mikro iğneleme ile kolajen üretimini tetikleme.', duration: '40 dk', price: 2500 },
    ]
  },
  {
    category: "Vücut Estetiği",
    items: [
      { id: 'b1', name: 'Soğuk Lipoliz', category: "Vücut Estetiği", description: 'İnatçı bölgesel yağları dondurarak yok etme.', duration: '60 dk', price: 3500 },
      { id: 'b2', name: 'G5 Selülit Masajı', category: "Vücut Estetiği", description: 'Ritmik titreşimlerle selülit görünümünü azaltma.', duration: '30 dk', price: 1000 },
      { id: 'b3', name: 'Lenf Drenaj', category: "Vücut Estetiği", description: 'Ödem atıcı ve dolaşım hızlandırıcı bakım.', duration: '30 dk', price: 800 },
    ]
  }
];

export const RECOVERY_GUIDES: RecoveryGuide[] = [
  {
    id: '1',
    title: 'Saç Ekimi Sonrası',
    icon: '👨‍🦲',
    content: [
      'İlk 3 gün ekim alanını kesinlikle bir yere çarpmayın ve ellemeyin.',
      'İlk yıkama 3. gün merkezimizde veya tarif edildiği şekilde yapılmalıdır.',
      '10-15 gün sonra şok dökülme başlayabilir, bu normaldir.',
      'İlk 1 ay havuz, deniz, hamam ve ağır spordan uzak durun.'
    ]
  },
  {
    id: '2',
    title: 'Botoks & Dolgu',
    icon: '💉',
    content: [
      'İlk 4 saat dik durun, yatmayın veya eğilmeyin.',
      'Uygulama bölgesine masaj yapmayın.',
      'Sıcak banyo, sauna veya hamamdan ilk gün kaçının.',
      'Alkol tüketimi ödemi artırabilir, ilk gün kaçının.'
    ]
  },
  {
    id: '3',
    title: 'Altın İğne & Lazer',
    icon: '✨',
    content: [
      'Cildinizde kızarıklık ve hafif yanma hissi normaldir.',
      'İlk 24 saat su değdirmeyin, makyaj yapmayın.',
      'Güneş koruyucu krem (SPF 50+) kullanmadan dışarı çıkmayın.',
      'Kabuklanma olursa kesinlikle koparmayın.'
    ]
  }
];

export const MOCK_STAFF = [
  { id: '1', name: 'Op. Dr. Mehmet Öz', role: 'Plastik Cerrah', phone: '0555 111 22 33', status: 'active' },
  { id: '2', name: 'Uzm. Dr. Zeynep Kaya', role: 'Dermatolog', phone: '0555 222 33 44', status: 'active' },
  { id: '3', name: 'Ali Yılmaz', role: 'Saç Ekim Uzmanı', phone: '0555 333 44 55', status: 'active' },
  { id: '4', name: 'Elif Demir', role: 'Estetisyen', phone: '0555 666 77 88', status: 'active' },
];

export const MOCK_PATIENTS = [
  { id: '1', name: 'Selin Kaya', tcNo: '12345678901', phone: '0532 100 20 30', lastVisit: '2023-10-20', totalVisits: 5, status: 'active' },
  { id: '2', name: 'Ayşe Demir', tcNo: '23456789012', phone: '0533 200 30 40', lastVisit: '2023-09-15', totalVisits: 2, status: 'active' },
  { id: '3', name: 'Derya Öz', tcNo: '34567890123', phone: '0535 300 40 50', lastVisit: '2023-01-10', totalVisits: 1, status: 'archived' },
  { id: '4', name: 'Canan Can', tcNo: '98765432101', phone: '0536 400 50 60', lastVisit: '2023-10-24', totalVisits: 1, status: 'active' },
];

export const MOCK_SERVICE_RECORDS: ServiceRecord[] = [
  { id: '1', userId: 'patient1', treatment: 'Saç Ekimi (DHI)', date: '2023-05-12', doctor: 'Ali Yılmaz', status: 'completed', notes: '3500 greft ekildi. Ön hat planlaması yapıldı.' },
  { id: '2', userId: 'patient1', treatment: 'PRP Saç Tedavisi', date: '2023-06-20', doctor: 'Uzm. Dr. Zeynep Kaya', status: 'completed', notes: 'Ekim sonrası 1. seans PRP.' },
  { id: '3', userId: 'patient1', treatment: 'Hydrafacial', date: '2024-01-15', doctor: 'Elif Demir', status: 'planned', notes: 'Cilt bakımı randevusu.' },
  { id: '4', userId: '2', treatment: 'Botoks (Full Face)', date: '2023-11-10', doctor: 'Uzm. Dr. Zeynep Kaya', status: 'completed', notes: 'Alın ve kaz ayakları.' },
];