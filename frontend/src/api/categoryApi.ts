// src/api/categoryApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';

export interface DesignCategory {
  id: number;
  name: string;
  description: string;
}

const categoryApi = {
  getAll: async (): Promise<DesignCategory[]> => {
    try {
      const response = await httpClient.get('/design-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching design categories:', error);
      return [];
    }
  },
};

export default categoryApi;