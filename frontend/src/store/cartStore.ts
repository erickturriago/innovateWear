import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../models/CartItem';

interface CartState {
  items: CartItem[];
  pendingItem: CartItem | null; // <-- NUEVO ESTADO PARA RECORDAR EL ITEM
  addProduct: (newItem: CartItem) => void;
  removeProduct: (itemId: string) => void;
  updateQuantity: (itemId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  setPendingItem: (item: CartItem | null) => void; // <-- NUEVA ACCIÓN
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      pendingItem: null, // <-- VALOR INICIAL

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
        set({ items: [], pendingItem: null }); // Aseguramos limpiar todo
      },

      // --- IMPLEMENTACIÓN DE LA NUEVA ACCIÓN ---
      setPendingItem: (item) => {
        set({ pendingItem: item });
      },
    }),
    {
      name: 'cart-session-storage', // Clave para el carrito de la sesión activa
      // No persistimos el item pendiente, es solo para la memoria de la sesión actual
      partialize: (state) => ({ items: state.items }),
    }
  )
);