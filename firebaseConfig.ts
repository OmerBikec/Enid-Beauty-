
// LÜTFEN KENDİ FİREBASE PROJE AYARLARINIZI BURAYA GİRİNİZ
// Firebase Console -> Project Settings -> General -> Your apps -> SDK Setup and Configuration

const firebaseConfig = {
  apiKey: "AIzaSyCy_N1wpDtFDNKXzozQ29TWqiR0GkEwFWM",
  authDomain: "enidbeuty.firebaseapp.com",
  projectId: "enidbeuty",
  storageBucket: "enidbeuty.firebasestorage.app",
  messagingSenderId: "1028748141396",
  appId: "1:1028748141396:web:a751caee78629db1a51ec1"
};

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  // SSR veya sunucu ortamı kontrolü (window undefined ise)
  // Vercel build sırasında window undefined olabilir, bu yüzden kontrol ediyoruz.
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
      if (!getApps().length) {
        try {
            // Eğer config değerleri placeholder ise init etme (çökmemesi için)
            if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_API_KEY")) {
                app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
                console.log("🔥 Firebase başarıyla bağlandı.");
            } else {
                console.warn("⚠️ Firebase API Key eksik. Demo modu aktif.");
            }
        } catch (initError) {
             console.error("❌ Firebase init hatası:", initError);
        }
      } else {
          // Zaten init edilmişse varolanı al
          app = getApps()[0];
          auth = getAuth(app);
          db = getFirestore(app);
      }
  }
} catch (error) {
  console.error("❌ Kritik Firebase hatası:", error);
}

// Servislere undefined kontrolü ekleyerek export ediyoruz
export { auth, db };
