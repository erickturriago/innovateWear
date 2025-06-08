// src/api/tshirtApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import { popularTshirts as mockTshirts } from '../data/mockData';
import type { TShirt } from '../models/TShirt';

const USE_MOCK_DATA = true;

const tshirtApi = {
  getAll: async (): Promise<TShirt[]> => {
    // ... (este método se mantiene igual)
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(mockTshirts), 500));
    } else {
      const response = await httpClient.get('/tshirts');
      return response.data;
    }
  },

  // --- NUEVO MÉTODO ---
  getById: async (id: string): Promise<TShirt | undefined> => {
    if (USE_MOCK_DATA) {
      console.log(`Buscando camiseta con ID: ${id}`);
      // Simulamos la búsqueda en nuestros datos de prueba
      const product = mockTshirts.find(p => p.id === id);
      return new Promise(resolve => setTimeout(() => resolve(product), 300));
    } else {
      const response = await httpClient.get(`/tshirts/${id}`);
      return response.data;
    }
  },
};

export default tshirtApi;