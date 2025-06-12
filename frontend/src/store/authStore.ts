// src/store/authStore.ts
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import { UserFactory } from '../patterns/factory/UserFactory';

// La interfaz ahora es más simple. Solo define el estado.
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  // La acción ahora es 'setUser', que será llamada desde App.tsx
  setUser: (user: User | null) => void;
}

// La función 'merge' sigue siendo necesaria para rehidratar los métodos de la clase User
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
      isLoading: true, // Se inicia en true hasta que Firebase verifique el estado inicial
      
      // Esta es la ÚNICA acción que modifica el estado.
      // Ya no hay lógica de login/logout aquí.
      setUser: (user) => {
        set({ user, isLoading: false });
      },
    }),
    {
      name: 'innovatewear-auth-storage',
      merge: mergeState,
    }
  )
);