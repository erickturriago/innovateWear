// src/api/tshirtApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import { popularTshirts as mockTshirts } from '../data/mockData';
import type { TShirt } from '../models/TShirt';

const USE_MOCK_DATA = true;

const tshirtApi = {
  getAll: async (): Promise<TShirt[]> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(mockTshirts), 500));
    } else {
      const response = await httpClient.get('/tshirts');
      return response.data;
    }
  },
};

export default tshirtApi;