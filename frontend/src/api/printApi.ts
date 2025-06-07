// src/api/printApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import { popularPrints as mockPrints } from '../data/mockData';
import type { Print } from '../models/Print';

const USE_MOCK_DATA = true;

const printApi = {
  getAll: async (): Promise<Print[]> => {
    if (USE_MOCK_DATA) {
      return new Promise(resolve => setTimeout(() => resolve(mockPrints), 500));
    } else {
      const response = await httpClient.get('/prints');
      return response.data;
    }
  },
};

export default printApi;