// src/store/designStore.ts
import { create } from 'zustand';
import designApi from '../api/designApi';
import type { Print } from '../models/Print';

interface DesignState {
  designs: Print[];
  isLoading: boolean;
  fetchDesignsByArtist: (artistId: number) => Promise<void>;
  addDesign: (design: Print) => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  isLoading: false,

  fetchDesignsByArtist: async (artistId) => {
    set({ isLoading: true });
    const designs = await designApi.getByArtistId(artistId);
    set({ designs, isLoading: false });
  },

  addDesign: (design) => {
    // Añade el nuevo diseño al estado existente sin hacer otra llamada a la API
    set((state) => ({
      designs: [design, ...state.designs],
    }));
  },
}));