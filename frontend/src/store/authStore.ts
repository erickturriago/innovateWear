// src/store/authStore.ts
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import { UserFactory } from '../patterns/factory/UserFactory';
import { FirebaseFacade } from '../patterns/facade/FirebaseFacade'; // Importar facade

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  // --- NUEVA ACCIÓN DE LOGOUT ---
  logout: () => Promise<void>; 
}

const mergeState: PersistOptions<AuthState>['merge'] = (persistedState, currentState) => {
  if (typeof persistedState !== 'object' || persistedState === null) {
    return currentState;
  }
  const mergedState = { ...currentState, ...(persistedState as object) };
  const userToHydrate = (persistedState as AuthState).user;
  if (userToHydrate) {
    mergedState.user = UserFactory.createUser(userToHydrate);
  }
  return mergedState;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      
      setUser: (user) => {
        set({ user, isLoading: false });
      },

      // --- IMPLEMENTACIÓN DE LOGOUT ---
      logout: async () => {
        try {
            await FirebaseFacade.signOut(); // Cierra sesión en Firebase
        } catch (error) {
            console.error("Error al cerrar sesión en Firebase:", error);
        }
        // Limpia el estado local inmediatamente para una respuesta de UI instantánea
        set({ user: null, isLoading: false }); 
      },
    }),
    {
      name: 'innovatewear-auth-storage',
      merge: mergeState,
    }
  )
);