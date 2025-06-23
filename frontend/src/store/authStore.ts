import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import { UserFactory } from '../patterns/factory/UserFactory';
import { FirebaseFacade } from '../patterns/facade/FirebaseFacade';
import { useCartStore } from './cartStore'; // Importamos el cartStore para la orquestación

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
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
    (set, get) => ({
      user: null,
      isLoading: true,
      
      setUser: (user) => {
        set({ user, isLoading: false });
      },

      logout: async () => {
        // LÓGICA DE CARRITO: GUARDAR AL CERRAR SESIÓN
        const userToLogout = get().user;
        if (userToLogout) {
            // Se obtiene el carrito de la sesión actual usando .items
            const currentCart = useCartStore.getState().items; // <-- CORREGIDO

            if (currentCart.length > 0) {
                localStorage.setItem(`user-cart-${userToLogout.id}`, JSON.stringify(currentCart));
            } else {
                localStorage.removeItem(`user-cart-${userToLogout.id}`);
            }
        }
        
        try {
            await FirebaseFacade.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión en Firebase:", error);
        }

        useCartStore.getState().clearCart();
        set({ user: null, isLoading: false }); 
      },
    }),
    {
      name: 'innovatewear-auth-storage',
      merge: mergeState,
    }
  )
);

// LÓGICA DE CARRITO: CARGAR AL INICIAR SESIÓN
useAuthStore.subscribe((state, prevState) => {
    // Detectamos un inicio de sesión (de null a un objeto de usuario)
    if (!prevState.user && state.user) {
        const userId = state.user.id;
        const savedCartJson = localStorage.getItem(`user-cart-${userId}`);

        if (savedCartJson) {
            const savedCart = JSON.parse(savedCartJson);
            // Se establece el carrito guardado como el estado de la sesión activa, usando .items
            useCartStore.setState({ items: savedCart }); // <-- CORREGIDO
        } else {
            useCartStore.getState().clearCart();
        }
    }
});