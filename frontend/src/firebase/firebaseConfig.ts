// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tu configuración de Firebase que nos proporcionaste.
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

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exportamos las instancias que necesitaremos en la aplicación
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();