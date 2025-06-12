// src/store/authStore.ts
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import { UserFactory } from '../patterns/factory/UserFactory';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  // Esta es la acción que tu App.tsx necesita.
  // Reemplaza la antigua función de 'login'.
  setUser: (user: User | null) => void; 
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
      isLoading: true, // Empezamos en true hasta que Firebase verifique el estado
      // Implementación de la acción setUser
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