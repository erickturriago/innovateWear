import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../models/CartItem';

interface CartState {
  items: CartItem[];
  addProduct: (newItem: CartItem) => void;
  removeProduct: (itemId: string) => void;
  updateQuantity: (itemId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addProduct: (newItem) => {
        set((state) => {
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (existingItem) {
                // Si ya existe, actualiza la cantidad y el precio
                return {
                    items: state.items.map(item =>
                        item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity, price: item.price + newItem.price }
                        : item
                    )
                };
            }
            // Si es nuevo, lo añade
            return { items: [...state.items, newItem] };
        });
      },

      removeProduct: (itemId) => {
        set((state) => ({ items: state.items.filter(item => item.id !== itemId) }));
      },

      updateQuantity: (itemId, action) => {
        set((state) => {
          const updatedItems = state.items
            .map(item => {
              if (item.id === itemId) {
                const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                
                if (newQuantity > 0) {
                  return {
                    ...item,
                    quantity: newQuantity,
                    // RECALCULA EL PRECIO TOTAL USANDO EL PRECIO UNITARIO
                    price: item.unitPrice * newQuantity, 
                  };
                }
                return null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null); 
          
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      // CAMBIO: Renombramos la clave para reflejar que es el carrito de la sesión activa
      name: 'cart-session-storage',
    }
  )
);