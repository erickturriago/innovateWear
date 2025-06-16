// src/firebase/firebaseConfig.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDv1tb1aM-UcOqtznGFkYbSh7yaUMdnNIg",
  authDomain: "soundrentals-ef63b.firebaseapp.com",
  databaseURL: "https://soundrentals-ef63b-default-rtdb.firebaseio.com",
  projectId: "soundrentals-ef63b",
  storageBucket: "soundrentals-ef63b.appspot.com",
  messagingSenderId: "1076771950167",
  appId: "1:1076771950167:web:9757c032cdaecf8a379d12",
  measurementId: "G-51NDWPZTWY"
};

// --- AJUSTE AQUÍ: Añadimos 'export' ---
export const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();