import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import type { User } from '../models/User';
import { UserFactory } from '../patterns/factory/UserFactory';
import { FirebaseFacade } from '../patterns/facade/FirebaseFacade';
import { useCartStore } from './cartStore';
import { CartItem } from '../models/CartItem';

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
        const userToLogout = get().user;
        if (userToLogout) {
            const currentCartItems = useCartStore.getState().items;
            if (currentCartItems.length > 0) {
                localStorage.setItem(`user-cart-${userToLogout.id}`, JSON.stringify(currentCartItems));
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

// Lógica de orquestación que se ejecuta cuando el estado de autenticación cambia
useAuthStore.subscribe((state, prevState) => {
    // Detectamos un inicio de sesión (de null a un objeto de usuario)
    if (!prevState.user && state.user) {
        const userId = state.user.id;
        const savedCartJson = localStorage.getItem(`user-cart-${userId}`);
        let cartToSet: CartItem[] = [];

        // Cargamos el carrito que el usuario tenía guardado de una sesión anterior
        if (savedCartJson) {
            cartToSet = JSON.parse(savedCartJson);
        }
        
        const { pendingItem, setPendingItem } = useCartStore.getState();
        
        // Verificamos si hay un item pendiente que el usuario quiso añadir antes de iniciar sesión
        if (pendingItem) {
            const existingItemIndex = cartToSet.findIndex(item => item.id === pendingItem.id);

            if (existingItemIndex > -1) {
                // Si el item ya existía en su carrito guardado, sumamos las cantidades
                const existingItem = cartToSet[existingItemIndex];
                cartToSet[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + pendingItem.quantity,
                    price: existingItem.price + pendingItem.price,
                };
            } else {
                // Si era un item nuevo, lo añadimos
                cartToSet.push(pendingItem);
            }

            // Limpiamos el item pendiente para que no se vuelva a añadir
            setPendingItem(null);
        }

        // Finalmente, establecemos el estado del carrito con los datos cargados y/o combinados
        useCartStore.setState({ items: cartToSet });
    }
});