import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Attachment, Message, MessageRole } from "../types";

// API Anahtarını güvenli şekilde alma (Tarayıcı çökmesini engeller)
const getApiKey = () => {
  try {
    // Vite/Vercel ortamı için
    const meta = import.meta as any;
    if (typeof meta !== 'undefined' && meta.env && meta.env.VITE_API_KEY) {
      return meta.env.VITE_API_KEY;
    }
    // Node ortamı veya process tanımlıysa
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Ortam değişkenleri okunamadı.");
  }
  return ""; 
};

// Initialize the client safely
const ai = new GoogleGenAI({ apiKey: getApiKey() });

const MODEL_TEXT = "gemini-2.5-flash";

/**
 * Normal sohbet fonksiyonu
 */
export const streamChatResponse = async (
  history: Message[],
  newMessage: string,
  attachments: Attachment[],
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const hasAttachments = attachments.length > 0;
    
    if (hasAttachments) {
      const parts: any[] = [];
      attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });
      parts.push({ text: newMessage });

      const responseStream = await ai.models.generateContentStream({
        model: MODEL_TEXT,
        contents: { parts },
        config: {
          systemInstruction: "Sen 'Aesthetix' kliniğinin uzman yapay zeka asistanısın. Uzmanlık alanların: 1) Saç Ekimi (FUE, DHI, safir), 2) Medikal Estetik (Botoks, Dolgu, Gençlik Aşısı), 3) Cilt Gençleştirme (Altın İğne, Lazer). Müşterilere operasyon süreçleri, iyileşme süreleri ve cilt tiplerine uygun işlemler hakkında profesyonel, güven verici ve bilimsel bilgiler ver. Tıbbi teşhis koyma, sadece estetik rehberlik yap.",
        }
      });

      let fullText = "";
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(fullText);
        }
      }
      return fullText;

    } else {
      const validHistory = history
        .filter(m => !m.isError && m.role !== MessageRole.SYSTEM)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const chat: Chat = ai.chats.create({
        model: MODEL_TEXT,
        history: validHistory,
        config: {
          systemInstruction: "Sen 'Aesthetix' kliniğinin uzman danışmanısın. Saç ekimi sonrası yıkama, şok dökülme süreçleri, anti-aging uygulamaları ve cilt bakımı rutinleri hakkında detaylı bilgi ver.",
        },
      });

      const responseStream = await chat.sendMessageStream({ message: newMessage });

      let fullText = "";
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse; 
        const text = c.text;
        if (text) {
          fullText += text;
          onChunk(fullText);
        }
      }
      return fullText;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Hata durumunda kullanıcıya bilgi ver ama uygulamayı çökertme
    onChunk("Üzgünüm, şu anda bağlantı kurulamıyor. Lütfen daha sonra tekrar deneyin.");
    return "Hata oluştu.";
  }
};

/**
 * Randevu öncesi müşterinin isteğini analiz eder
 */
export const analyzePatientComplaint = async (
  complaint: string, 
  images: Attachment[]
): Promise<string> => {
  try {
    const parts: any[] = [];
    
    images.forEach(img => {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      });
    });

    parts.push({ text: `Danışan İsteği: ${complaint}\n\nLütfen görseli ve isteği şu açılardan analiz et: 1. Eğer saç fotoğrafı ise: Norwood ölçeğine göre dökülme durumu ve tahmini greft ihtiyacı nedir? Hangi teknik (DHI/FUE) uygundur? 2. Eğer yüz fotoğrafı ise: Cilt tipi (Yağlı/Kuru/Karma), yaşlanma belirtileri ve leke durumu nedir? 3. Önerilen İşlemler: (Örn: Saç Ekimi + PRP, Altın İğne, Somon DNA vb.)` });

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: { parts },
      config: {
        systemInstruction: "Sen kıdemli bir Estetik ve Saç Ekimi Koordinatörüsün. Yüklenen fotoğrafları detaylı analiz et. Saç açıklığı, cilt sarkması veya leke durumuna göre nokta atışı, kombine tedavi önerileri sun.",
      }
    });

    return response.text || "Analiz oluşturulamadı.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Sistem şu anda analizi gerçekleştiremiyor.";
  }
};

/**
 * Yapılan işleme göre yapay zeka analizi ve bakım önerileri getirir.
 */
export const getTreatmentAnalysis = async (treatment: string, duration: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: `Müşteriye "${treatment}" işlemi uygulandı. 
            Bu işlem estetik/medikal bir işlemdir.
            Lütfen müşteriye işlem sonrası (post-op) dikkat etmesi gerekenleri madde madde anlat.
            Özellikle: Su teması, yatış pozisyonu, güneşten korunma, kullanılacak ilaç/kremler (genel tavsiye) hakkında bilgi ver.
            Markdown formatında yaz.`,
        });
        return response.text || "Analiz alınamadı.";
    } catch (e) {
        return "Yapay zeka servisine şu an ulaşılamıyor.";
    }
};

/**
 * İşlem hakkında soru-cevap
 */
export const getTreatmentChatResponse = async (treatment: string, question: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: `Konu: ${treatment} estetik işlemi.
            Danışan Sorusu: "${question}"
            
            Bu soruya uzman, bilimsel ama anlaşılır bir dille cevap ver. Gerekiyorsa iyileşme sürecinden bahset.`,
        });
        return response.text || "Cevap üretilemedi.";
    } catch (e) {
        return "Bağlantı hatası.";
    }
};