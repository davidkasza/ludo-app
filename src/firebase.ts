import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8Ml4AoakKKuwmbGyJ7pPFvuG-TCsKoGI",
  authDomain: "ludo-app-569c2.firebaseapp.com",
  projectId: "ludo-app-569c2",
  storageBucket: "ludo-app-569c2.firebasestorage.app",
  messagingSenderId: "32046134053",
  appId: "1:32046134053:web:f8e0b6cdfa638a32f4e0cc",
  measurementId: "G-XLFHJYXFRN"
};

const app = initializeApp(firebaseConfig);

// 🔥 EZ HIÁNYZIK NÁLAD
export const db = getFirestore(app);

// optional (nem kell a játékhoz)
const analytics = getAnalytics(app);
export const auth = getAuth(app);