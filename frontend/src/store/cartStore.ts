// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PredesignedCartItem } from '../models/CartItem';

// Definimos la "forma" de nuestro store: el estado y las acciones
interface CartState {
  items: CartItem[];
  addProduct: (newItem: CartItem) => void;
  removeProduct: (itemId: string) => void;
  updateQuantity: (itemId: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  // `persist` es un "middleware" opcional de Zustand.
  // Guarda automáticamente el estado del carrito en el localStorage del navegador,
  // para que si el usuario refresca la página, su carrito no se vacíe. ¡Muy útil!
  persist(
    (set, get) => ({
      items: [],

      // Acción para añadir un producto
      addProduct: (newItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(item => item.id === newItem.id);

        if (existingItemIndex !== -1) {
          // Si el item ya existe (mismo producto y misma talla), solo aumentamos la cantidad
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          // Si es un item nuevo, lo añadimos al array
          set({ items: [...items, newItem] });
        }
      },

      // Acción para eliminar un producto completamente
      removeProduct: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },

      // Acción para aumentar o disminuir la cantidad de un producto
      updateQuantity: (itemId, action) => {
        const items = get().items;
        const itemIndex = items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) return;

        const updatedItems = [...items];
        const currentItem = updatedItems[itemIndex];

        if (action === 'increase') {
          currentItem.quantity += 1;
        } else if (action === 'decrease') {
          if (currentItem.quantity > 1) {
            currentItem.quantity -= 1;
          } else {
            // Si la cantidad es 1 y se disminuye, se elimina el producto
            updatedItems.splice(itemIndex, 1);
          }
        }
        
        set({ items: updatedItems });
      },

      // Acción para vaciar todo el carrito
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'innovatewear-cart-storage', // Nombre para el guardado en localStorage
    }
  )
);