// src/store/authStore.ts
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import authService from '../auth/authService';
import { UserFactory } from '../patterns/factory/UserFactory';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

// Creamos una función 'merge' separada para mayor claridad
const mergeState: PersistOptions<AuthState>['merge'] = (persistedState, currentState) => {
  // TypeScript sabe que 'persistedState' es 'unknown'. Debemos verificar su tipo.
  if (typeof persistedState !== 'object' || persistedState === null) {
    return currentState;
  }

  // Ahora que sabemos que es un objeto, lo podemos mezclar.
  const mergedState = { ...currentState, ...(persistedState as object) };

  // Verificamos si el usuario necesita ser "re-hidratado"
  const userToHydrate = (persistedState as AuthState).user;
  if (userToHydrate) {
    // Usamos nuestra fábrica para restaurar la instancia de la clase
    mergedState.user = UserFactory.createUser(userToHydrate);
  }

  return mergedState;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
          const loggedInUser = await authService.login(email, pass);
          if (loggedInUser) {
            set({ user: loggedInUser, isLoading: false });
            return true;
          }
          set({ isLoading: false, error: 'Credenciales inválidas.' });
          return false;
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
          set({ isLoading: false, error: errorMsg });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null });
      },
    }),
    {
      name: 'innovatewear-auth-storage',
      merge: mergeState, // Usamos nuestra función merge segura para TypeScript
    }
  )
);