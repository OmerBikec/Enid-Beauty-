
import React, { useState, useEffect } from 'react';
import { User, Payment } from '../types';
import { Icons } from '../constants';
import { subscribeToPayments, addPayment, updatePaymentStatus } from '../services/firebaseService';

interface PaymentsProps {
  user: User;
}

const Payments: React.FC<PaymentsProps> = ({ user }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Card Form State
  const [cardData, setCardData] = useState({
      number: '',
      holder: user.role === 'patient' ? `${user.name} ${user.surname}`.toUpperCase() : '',
      expiry: '',
      cvv: '',
      amount: '',
      description: 'Güzellik Bakım Ödemesi'
  });
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPayments((data) => {
        setPayments(data);
        setLoading(false);
    }, user.uid, user.role);
    return () => unsubscribe();
  }, [user.uid, user.role]);

  // Handle Card Input and Formatting
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      let formattedValue = value;

      if (name === 'number') {
          // Only numbers, max 16 digits
          const raw = value.replace(/\D/g, '').slice(0, 16);
          // Group by 4
          formattedValue = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
      } else if (name === 'expiry') {
          // MM/YY format
          const raw = value.replace(/\D/g, '').slice(0, 4);
          if (raw.length >= 3) {
              formattedValue = `${raw.slice(0, 2)}/${raw.slice(2)}`;
          } else {
              formattedValue = raw;
          }
      } else if (name === 'cvv') {
          formattedValue = value.replace(/\D/g, '').slice(0, 3);
      }

      setCardData({ ...cardData, [name]: formattedValue });
  };

  const handlePay = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!cardData.number || !cardData.cvv || !cardData.amount) {
          setNotification({ message: 'Lütfen tüm alanları doldurunuz.', type: 'error' });
          return;
      }

      try {
          await addPayment({
              userId: user.uid!,
              patientName: `${user.name} ${user.surname}`,
              amount: parseFloat(cardData.amount),
              description: cardData.description,
              cardNumberMasked: `**** **** **** ${cardData.number.replace(/\s/g, '').slice(-4)}`,
              date: new Date().toISOString().split('T')[0],
              status: 'pending'
          });

          setNotification({ message: 'Ödeme işleminiz başarıyla alındı. Onay bekleniyor.', type: 'success' });
          setShowForm(false);
          setCardData({ ...cardData, amount: '', number: '', expiry: '', cvv: '' });
          setIsFlipped(false);
      } catch (error) {
          setNotification({ message: 'Ödeme sırasında bir hata oluştu.', type: 'error' });
      }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
      try {
          await updatePaymentStatus(id, status);
          setNotification({ message: `Ödeme ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.`, type: status === 'approved' ? 'success' : 'error' });
      } catch (error) {
          console.error(error);
      }
  };

  // GENERATE REALISTIC RECEIPT
  const handleDownloadReceipt = (payment: Payment) => {
    const printWindow = window.open('', '', 'width=900,height=800');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <title>Dekont - ${payment.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body { 
                font-family: 'Inter', sans-serif; 
                background-color: #f3f4f6; 
                padding: 40px; 
                margin: 0;
                display: flex;
                justify-content: center;
            }
            .receipt-paper { 
                background: white; 
                width: 100%; 
                max-width: 700px; 
                padding: 50px; 
                border-radius: 4px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                position: relative;
                overflow: hidden;
            }
            .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 100px;
                font-weight: 900;
                color: rgba(0,0,0,0.03);
                z-index: 0;
                pointer-events: none;
                white-space: nowrap;
            }
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                border-bottom: 2px solid #111;
                padding-bottom: 20px;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
            }
            .logo h1 { margin: 0; font-size: 28px; font-weight: 800; color: #111; letter-spacing: -1px; }
            .logo p { margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; }
            .receipt-title { text-align: right; }
            .receipt-title h2 { margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
            .receipt-title p { margin: 5px 0 0; font-size: 14px; font-weight: 600; color: #111; }

            .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; position: relative; z-index: 1; }
            .info-group label { display: block; font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; font-weight: 600; }
            .info-group div { font-size: 15px; font-weight: 600; color: #111; }

            .payment-box {
                background: #F9FAFB;
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
            }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
            .row span { font-size: 14px; color: #555; }
            .row strong { font-size: 14px; color: #111; font-weight: 600; }
            
            .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; border-top: 2px solid #111; padding-top: 20px; }
            .total-row span { font-size: 14px; font-weight: 700; text-transform: uppercase; }
            .total-row strong { font-size: 24px; color: #111; }

            .stamp {
                position: absolute;
                bottom: 160px;
                right: 60px;
                border: 3px solid #10B981;
                color: #10B981;
                font-size: 20px;
                font-weight: 900;
                text-transform: uppercase;
                padding: 10px 20px;
                transform: rotate(-15deg);
                border-radius: 8px;
                opacity: 0.8;
                z-index: 0;
            }

            .footer { 
                border-top: 1px solid #eee; 
                padding-top: 30px; 
                text-align: center; 
                color: #999; 
                font-size: 10px; 
                line-height: 1.6;
            }
            .barcode { 
                font-family: 'Courier New', monospace; 
                text-align: center; 
                font-size: 24px; 
                letter-spacing: 5px; 
                margin-top: 20px; 
                font-weight: bold;
                color: #333;
                opacity: 0.8;
            }

            @media print {
                body { background: white; padding: 0; }
                .receipt-paper { box-shadow: none; max-width: 100%; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-paper">
            <div class="watermark">AESTHETIX</div>
            <div class="stamp">ONAYLANDI<br>${new Date(payment.date).toLocaleDateString()}</div>
            
            <div class="header">
                <div class="logo">
                    <h1>Aesthetix.</h1>
                    <p>Beauty & Care Systems</p>
                </div>
                <div class="receipt-title">
                    <h2>İşlem Dekontu</h2>
                    <p>#${payment.id.toUpperCase().slice(0, 10)}</p>
                </div>
            </div>

            <div class="grid-info">
                <div class="info-group">
                    <label>Ödeme Yapan (Müşteri)</label>
                    <div>${payment.patientName.toUpperCase()}</div>
                </div>
                <div class="info-group">
                    <label>İşlem Tarihi</label>
                    <div>${new Date(payment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
            </div>

            <div class="payment-box">
                <div class="row">
                    <span>Açıklama</span>
                    <strong>${payment.description}</strong>
                </div>
                <div class="row">
                    <span>Ödeme Yöntemi</span>
                    <strong>Kredi Kartı (${payment.cardNumberMasked})</strong>
                </div>
                <div class="row">
                    <span>Referans No</span>
                    <strong>${Math.random().toString(36).substring(2, 10).toUpperCase()}</strong>
                </div>
                <div class="total-row">
                    <span>Ödenen Tutar</span>
                    <strong>₺${payment.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</strong>
                </div>
            </div>

            <div class="footer">
                <p>Bu belge 5070 sayılı Elektronik İmza Kanunu uyarınca güvenli elektronik imza ile oluşturulmuştur.<br>
                Aesthetix Güzellik Merkezi • Mersis No: 1234567890 • İstanbul/Türkiye</p>
                
                <div class="barcode">
                    ||| || ||||| |||| || |||| |||
                </div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Auto-hide notification
  useEffect(() => {
      if(notification) {
          const timer = setTimeout(() => setNotification(null), 3000);
          return () => clearTimeout(timer);
      }
  }, [notification]);

  if (loading) {
      return <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative">
       
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
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{isAdmin ? 'Ödeme Yönetimi' : 'Ödemelerim & Faturalar'}</h2>
          <p className="text-slate-500 font-medium mt-1">{isAdmin ? 'Hastaların ödemelerini onaylayın.' : 'Geçmiş işlemlerinizi görüntüleyin ve dekont indirin.'}</p>
        </div>
        {!isAdmin && (
            <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all font-bold hover:-translate-y-1 active:scale-95 group"
            >
            <Icons.Plus />
            <span>Ödeme Yap</span>
            </button>
        )}
      </div>

      {/* PATIENT: 3D CARD PAYMENT MODAL */}
      {(!isAdmin && showForm) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setShowForm(false)}></div>
              <div className="glass-modal rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative z-10 animate-fade-in-up border border-white/60 overflow-hidden flex flex-col lg:flex-row bg-white h-[90vh] lg:h-auto">
                  
                  {/* LEFT: 3D CARD VISUAL */}
                  <div className="w-full lg:w-1/2 bg-[#0a0a0a] p-8 lg:p-12 flex items-center justify-center relative overflow-hidden group">
                      {/* Ambient Background Lights */}
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                      
                      {/* THE CARD CONTAINER */}
                      <div className="w-[360px] h-[230px] perspective-1000 relative select-none transform transition-transform hover:scale-105 duration-500">
                          <div 
                            className={`w-full h-full relative transition-transform duration-700 preserve-3d shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`} 
                            style={{transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}
                          >
                              
                              {/* --- CARD FRONT --- */}
                              <div className="absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col justify-between text-white backface-hidden z-20 overflow-hidden border border-white/10 bg-slate-900">
                                  {/* Texture Layer */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-slate-900 to-black z-0"></div>
                                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
                                  
                                  {/* Holographic Shine */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10 pointer-events-none" style={{ background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)' }}></div>

                                  {/* Card Top */}
                                  <div className="flex justify-between items-start relative z-20">
                                      <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 flex items-center justify-center border border-yellow-300/50 shadow-md relative overflow-hidden">
                                           <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_3px)]"></div>
                                           <div className="w-full h-[1px] bg-black/20 absolute top-1/3"></div>
                                           <div className="w-full h-[1px] bg-black/20 absolute bottom-1/3"></div>
                                           <div className="h-full w-[1px] bg-black/20 absolute left-1/3"></div>
                                           <div className="h-full w-[1px] bg-black/20 absolute right-1/3"></div>
                                      </div>
                                      <div className="text-white/80">
                                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10c0-3.35 4.3-6.57 8.5-6.57 5.76 0 10.38 3.32 10.38 9.5 0 2.5-1.5 5.08-4.25 5.08-1.53 0-2.33-1-3.63-1-1.3 0-2 .97-3.5 1-2.94 0-4.63-2.37-4.63-5.26 0-2.4 1.4-4.8 4.13-4.8 1.46 0 2.22.68 3.5.68 1.25 0 1.96-.68 3.46-.68 1.25 0 2.45.62 3.25 1.6-2.73 1.57-3.22 5.57-.46 8.3-1.07 2.4-3.1 3.5-4.4 3.5"/></svg>
                                      </div>
                                  </div>

                                  {/* Card Middle (Number) */}
                                  <div className="relative z-20 mt-4">
                                      <p className="font-mono text-[26px] tracking-[0.15em] text-slate-200 drop-shadow-md" style={{textShadow: '0 2px 3px rgba(0,0,0,0.8)'}}>
                                          {cardData.number || '#### #### #### ####'}
                                      </p>
                                  </div>

                                  {/* Card Bottom */}
                                  <div className="flex justify-between items-end relative z-20 mt-auto">
                                      <div>
                                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Card Holder</p>
                                          <p className="font-bold text-sm tracking-widest uppercase text-slate-100 truncate max-w-[200px]" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>
                                              {cardData.holder || 'AD SOYAD'}
                                          </p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Expires</p>
                                          <p className="font-bold text-sm tracking-widest text-slate-100" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8)'}}>
                                              {cardData.expiry || 'MM/YY'}
                                          </p>
                                      </div>
                                  </div>

                                  {/* Master/Visa Logo */}
                                  <div className="absolute bottom-6 right-6 z-10 opacity-80 mix-blend-overlay">
                                       <div className="flex -space-x-4">
                                           <div className="w-10 h-10 rounded-full bg-red-500"></div>
                                           <div className="w-10 h-10 rounded-full bg-yellow-500"></div>
                                       </div>
                                  </div>
                              </div>

                              {/* --- CARD BACK --- */}
                              <div className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between text-white shadow-2xl bg-slate-900 backface-hidden rotate-y-180 overflow-hidden border border-white/10" style={{transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}>
                                   {/* Texture */}
                                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                   
                                   {/* Magnetic Strip */}
                                   <div className="w-full h-14 bg-black mt-8 relative z-10">
                                       <div className="absolute inset-0 bg-white/10"></div>
                                   </div>
                                   
                                   {/* Signature & CVV */}
                                   <div className="px-8 relative z-10 flex items-center gap-4 mt-2">
                                       <div className="flex-1 h-10 bg-white/90 flex items-center px-4">
                                            <span className="font-handwriting text-slate-800 text-lg transform -rotate-2 select-none" style={{fontFamily: 'cursive'}}>
                                                {cardData.holder}
                                            </span>
                                       </div>
                                       <div className="w-16 h-10 bg-white flex items-center justify-center">
                                            <span className="text-slate-900 font-mono font-bold tracking-widest">{cardData.cvv || '***'}</span>
                                       </div>
                                   </div>

                                   {/* Footer Text */}
                                   <div className="px-8 pb-8 mt-auto relative z-10 flex justify-between items-center opacity-50">
                                       <div className="text-[8px] max-w-[150px] leading-tight text-justify">
                                            This card is property of Aesthetix. Use implies acceptance of agreement. Found? Call +90 000 000 00.
                                       </div>
                                       <Icons.Lock />
                                   </div>
                              </div>

                          </div>
                      </div>

                      {/* Reflection/Shadow under card */}
                      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[300px] h-10 bg-black/40 blur-xl rounded-[100%] pointer-events-none"></div>
                  </div>

                  {/* RIGHT: FORM */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-12 relative flex flex-col bg-white overflow-y-auto">
                      <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors z-20">
                          <Icons.Plus /> {/* Using Plus rotated as Close */}
                      </button>

                      <h3 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Ödeme Detayları</h3>
                      <p className="text-slate-500 mb-8 font-medium">Güvenli 256-bit SSL şifreleme ile işleminizi tamamlayın.</p>
                      
                      <form onSubmit={handlePay} className="space-y-6 flex-1 flex flex-col">
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kart Sahibi</label>
                              <input 
                                  name="holder"
                                  value={cardData.holder}
                                  onChange={handleCardChange}
                                  onFocus={() => setIsFlipped(false)}
                                  className="w-full px-5 py-4 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all uppercase"
                                  placeholder="AD SOYAD"
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kart Numarası</label>
                              <div className="relative group">
                                <input 
                                    name="number"
                                    value={cardData.number}
                                    onChange={handleCardChange}
                                    onFocus={() => setIsFlipped(false)}
                                    maxLength={19}
                                    className="w-full px-5 py-4 pl-14 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono tracking-wide"
                                    placeholder="0000 0000 0000 0000"
                                />
                                <div className="absolute left-5 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><Icons.CreditCard /></div>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Son Kullanma</label>
                                  <input 
                                      name="expiry"
                                      value={cardData.expiry}
                                      onChange={handleCardChange}
                                      onFocus={() => setIsFlipped(false)}
                                      maxLength={5}
                                      className="w-full px-5 py-4 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-center placeholder-slate-300"
                                      placeholder="AA/YY"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">CVV</label>
                                  <input 
                                      name="cvv"
                                      value={cardData.cvv}
                                      onChange={handleCardChange}
                                      onFocus={() => setIsFlipped(true)}
                                      maxLength={3}
                                      className="w-full px-5 py-4 bg-slate-50 border border-gray-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-center placeholder-slate-300"
                                      placeholder="***"
                                  />
                              </div>
                          </div>
                          
                          <div className="space-y-2 pt-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Ödenecek Tutar (TL)</label>
                                <div className="relative">
                                    <input 
                                        name="amount"
                                        type="number"
                                        value={cardData.amount}
                                        onChange={handleCardChange}
                                        className="w-full px-5 py-5 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-emerald-600 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-2xl tracking-tight"
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-6 top-6 font-bold text-emerald-400">TL</span>
                                </div>
                          </div>

                          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95 mt-auto flex items-center justify-center gap-2">
                              <Icons.Lock />
                              {cardData.amount ? `₺${cardData.amount} Öde` : 'Ödemeyi Tamamla'}
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* PAYMENTS LIST (Shared) */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/60 bg-white/40 shadow-sm animate-fade-in-up">
           <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                   <thead className="bg-white/50 border-b border-gray-100">
                       <tr>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Ödeme Yapan</th>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Açıklama</th>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Kart Detay</th>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Tutar</th>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Durum</th>
                           <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">İşlem</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50/50">
                       {payments.length === 0 ? (
                           <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400">Kayıtlı ödeme bulunamadı.</td></tr>
                       ) : (
                           payments.map((pay) => (
                               <tr key={pay.id} className="hover:bg-white/60 transition-colors group">
                                   <td className="px-8 py-5">
                                       <div className="font-bold text-slate-700">{pay.patientName}</div>
                                       <div className="text-xs text-slate-400 font-mono mt-0.5">{pay.id.slice(0,8).toUpperCase()}</div>
                                   </td>
                                   <td className="px-8 py-5 text-sm text-slate-500 font-medium">{pay.description}</td>
                                   <td className="px-8 py-5 text-sm font-mono text-slate-500 flex items-center gap-2">
                                       <div className="w-8 h-5 bg-slate-200 rounded flex items-center justify-center text-[8px] text-slate-500">CARD</div>
                                       {pay.cardNumberMasked}
                                   </td>
                                   <td className="px-8 py-5 font-bold text-slate-800 text-lg">₺{pay.amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</td>
                                   <td className="px-8 py-5">
                                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                           pay.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                           pay.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                           'bg-amber-50 text-amber-600 border-amber-100'
                                       }`}>
                                           <span className={`w-1.5 h-1.5 rounded-full ${
                                                pay.status === 'approved' ? 'bg-green-500' :
                                                pay.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                                           }`}></span>
                                           {pay.status === 'approved' ? 'Onaylandı' : pay.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                                       </span>
                                   </td>
                                   <td className="px-8 py-5 text-right">
                                       {isAdmin ? (
                                            pay.status === 'pending' && (
                                               <div className="flex justify-end gap-2">
                                                   <button onClick={() => handleStatusUpdate(pay.id, 'approved')} className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100" title="Onayla"><Icons.Check /></button>
                                                   <button onClick={() => handleStatusUpdate(pay.id, 'rejected')} className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100" title="Reddet"><Icons.X /></button>
                                               </div>
                                            )
                                       ) : (
                                            pay.status === 'approved' && (
                                                <button 
                                                    onClick={() => handleDownloadReceipt(pay)}
                                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 ml-auto"
                                                >
                                                    <Icons.Download />
                                                    Dekont
                                                </button>
                                            )
                                       )}
                                   </td>
                               </tr>
                           ))
                       )}
                   </tbody>
               </table>
           </div>
      </div>

    </div>
  );
};

export default Payments;
