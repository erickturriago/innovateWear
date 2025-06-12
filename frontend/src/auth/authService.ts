// src/auth/authService.ts
import { UserFactory } from '../patterns/factory/UserFactory';
import { httpClient } from '../patterns/singleton/ApiClient';
import type { User, UserRole } from '../models/User';
import type { User as FirebaseUser } from 'firebase/auth';

const authService = {
  /**
   * Busca un usuario en nuestro backend por email.
   * Si no existe, lo crea con el rol de 'CLIENTE'.
   * Devuelve una instancia de la clase User de nuestra aplicación.
   */
  findOrCreateUser: async (firebaseUser: FirebaseUser): Promise<User | null> => {
    if (!firebaseUser.email) return null;

    try {
      const { data: existingUser } = await httpClient.get(`/users/email/${firebaseUser.email}`);
      return UserFactory.createUser(existingUser);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        const newUserPayload = {
          name: firebaseUser.displayName || 'Usuario de Google',
          email: firebaseUser.email!,
          password: Math.random().toString(36).slice(-8),
          role: 'CLIENTE' as UserRole,
        };
        const { data: newUser } = await httpClient.post('/users', newUserPayload);
        return UserFactory.createUser(newUser);
      }
      console.error("Error en findOrCreateUser:", error);
      return null;
    }
  },
};

export default authService;