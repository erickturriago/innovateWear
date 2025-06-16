// src/store/designStore.ts
import { create } from 'zustand';
import designApi from '../api/designApi';
import type { Print } from '../models/Print';

interface DesignState {
  designs: Print[];
  isLoading: boolean;
  fetchDesignsByArtist: (artistId: number) => Promise<void>;
  addDesign: (design: Print) => void;
  updateDesign: (id: string, updatedDesign: Print) => void;
  removeDesign: (designId: string) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  designs: [],
  isLoading: false,

  fetchDesignsByArtist: async (artistId: number) => {
    set({ isLoading: true });
    const designs = await designApi.getByArtistId(artistId);
    set({ designs, isLoading: false });
  },

  addDesign: (design) => {
    set((state) => ({
      designs: [design, ...state.designs],
    }));
  },
  
  updateDesign: (id, updatedDesign) => {
    set((state) => ({
      designs: state.designs.map(d => (d.id === id ? updatedDesign : d)),
    }));
  },

  removeDesign: (designId) => {
    set((state) => ({
      designs: state.designs.filter(d => d.id !== designId),
    }));
  },
}));