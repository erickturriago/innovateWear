// src/patterns/facade/FirebaseFacade.ts
import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User as FirebaseUser
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, googleProvider, app } from "../../firebase/firebaseConfig";

// Inicializamos el servicio de Storage
const storage = getStorage(app);

// La Facade simplifica la interacción con los subsistemas de Firebase.
export const FirebaseFacade = {
  signInWithGoogle: async (): Promise<FirebaseUser | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
      return null;
    }
  },

  signInWithEmail: async (email: string, pass: string): Promise<FirebaseUser | null> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error) {
      console.error("Error durante el inicio de sesión con Email:", error);
      return null;
    }
  },
  
  signUpWithEmail: async (email: string, pass: string): Promise<FirebaseUser | null> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch(error) {
      console.error("Error durante el registro con Email:", error);
      return null;
    }
  },

  signOut: (): Promise<void> => {
    return signOut(auth);
  },

  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * --- MÉTODO AÑADIDO ---
   * Sube un archivo a Firebase Storage y devuelve la URL de descarga.
   * @param file El archivo a subir.
   * @param path La ruta en el storage (ej: 'designs/').
   * @returns La URL pública del archivo subido.
   */
  uploadFile: async (file: File, path: string): Promise<string> => {
    try {
      const timestamp = Date.now();
      const fileRef = ref(storage, `${path}${timestamp}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Archivo subido con éxito:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw error;
    }
  },
};