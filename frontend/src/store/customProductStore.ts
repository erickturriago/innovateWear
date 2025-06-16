// src/store/useCustomProductStore.ts
import { create } from 'zustand';
import customDesignApi from '../api/customDesignApi';

interface CustomProductState {
  products: any[];
  isLoading: boolean;
  fetchByArtist: (artistId: number) => Promise<void>;
  updateProductStatus: (id: number, updatedProduct: any) => void;
  // --- NUEVA ACCIÓN ---
  updateProductInfo: (id: number, updatedData: any) => void;
}

export const useCustomProductStore = create<CustomProductState>((set) => ({
  products: [],
  isLoading: false,

  fetchByArtist: async (artistId: number) => {
    set({ isLoading: true });
    try {
      const products = await customDesignApi.getByCreator(artistId);
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  updateProductStatus: (id, updatedProduct) => {
    set((state) => ({
      products: state.products.map(p => (p.id === id ? updatedProduct : p)),
    }));
  },

  // --- IMPLEMENTACIÓN DE LA NUEVA ACCIÓN ---
  updateProductInfo: (id, updatedData) => {
    set((state) => ({
        products: state.products.map(p => 
            p.id === id ? { ...p, ...updatedData } : p
        ),
    }));
  },
}));