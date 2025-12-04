
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
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
      if (!getApps().length && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_API_KEY")) {
        try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            console.log("🔥 Firebase başarıyla bağlandı.");
        } catch (initError) {
             console.error("❌ Firebase init hatası:", initError);
        }
      } else {
        console.warn("⚠️ Firebase Config eksik. Demo modu aktif.");
      }
  }
} catch (error) {
  console.error("❌ Kritik Firebase hatası:", error);
}

// Servislere undefined kontrolü ekleyerek export ediyoruz
export { auth, db };
