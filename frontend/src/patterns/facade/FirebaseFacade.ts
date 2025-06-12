// src/patterns/facade/FirebaseFacade.ts
import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebaseConfig";

// La Facade simplifica la interacción con el subsistema de autenticación de Firebase.
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
};