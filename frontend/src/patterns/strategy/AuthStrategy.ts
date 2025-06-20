// src/patterns/strategy/AuthStrategy.ts
import { FirebaseFacade } from "../facade/FirebaseFacade";
import { UserFactory } from "../factory/UserFactory";
import { useAuthStore } from "../../store/authStore";
import { httpClient } from "../singleton/ApiClient";
import authApi from "../../api/authApi";
import authService from "../../auth/authService";

export interface AuthStrategy {
  execute(...args: any[]): Promise<boolean>;
}

// Estrategia para Google: Ahora también se encarga de crear el usuario en la BD
export class GoogleAuthStrategy implements AuthStrategy {
  public async execute(): Promise<boolean> {
    const firebaseUser = await FirebaseFacade.signInWithGoogle();
    if (firebaseUser) {
      // Después del login exitoso con Google, llamamos a findOrCreateUser
      // para asegurar que el perfil exista en nuestra BD.
      const appUser = await authService.findOrCreateUser(firebaseUser);
      useAuthStore.getState().setUser(appUser);
      return !!appUser;
    }
    return false;
  }
}

// Estrategia para Login con Email/Pass: SOLO usa el backend local
export class EmailPasswordAuthStrategy implements AuthStrategy {
  public async execute(email: string, pass: string): Promise<boolean> {
    const appUser = await authApi.login({ email, password: pass });
    if (appUser) {
      useAuthStore.getState().setUser(UserFactory.createUser(appUser));
      return true;
    }
    return false;
  }
}

// Estrategia para Registro con Email/Pass: Crea en AMBOS sistemas
export class EmailPasswordSignUpStrategy implements AuthStrategy {
  public async execute(email: string, pass: string, name: string): Promise<boolean> {
    try {
      // 1. Verifica si el usuario ya existe en nuestro backend
      try {
        await httpClient.get(`/users/email/${email}`);
        // Si no da error 404, el usuario ya existe.
        throw new Error("El email ya está registrado en la base de datos local.");
      } catch (error: any) {
        if (error.response?.status !== 404) {
          // Si es un error diferente a "no encontrado", lanzamos el error.
          throw error;
        }
        // Si es 404, perfecto, podemos continuar.
      }

      // 2. Crea el usuario en Firebase
      const firebaseUser = await FirebaseFacade.signUpWithEmail(email, pass);
      if (!firebaseUser) {
        throw new Error("No se pudo crear el usuario en Firebase.");
      }

      // 3. Crea el perfil en nuestro backend con la contraseña real
      const newUserPayload = { name, email, password: pass, role: 'CLIENTE' };
      await httpClient.post('/users', newUserPayload);

      return true;
    } catch (error) {
      console.error("Error en el registro híbrido:", error);
      return false;
    }
  }
}