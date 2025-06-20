// src/auth/authService.ts
import { UserFactory } from '../patterns/factory/UserFactory';
import { httpClient } from '../patterns/singleton/ApiClient';
import type { User, UserRole } from '../models/User';
import type { User as FirebaseUser } from 'firebase/auth';

const authService = {
  findOrCreateUser: async (firebaseUser: FirebaseUser): Promise<User | null> => {
    if (!firebaseUser.email) return null;

    try {
      // Intenta encontrar al usuario en tu BD por su email
      const { data: existingUser } = await httpClient.get(`/users/email/${firebaseUser.email}`);
      return UserFactory.createUser(existingUser);
    } catch (error: any) {
      // Si no lo encuentra (error 404), lo crea
      if (error.response && error.response.status === 404) {
        // Genera una contraseña aleatoria y segura solo para este usuario de Google
        const secureRandomPassword = crypto.randomUUID();
        
        const newUserPayload = {
          name: firebaseUser.displayName || 'Usuario de Google',
          email: firebaseUser.email!,
          password: secureRandomPassword, // Contraseña de relleno
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