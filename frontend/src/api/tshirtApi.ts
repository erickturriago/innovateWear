// src/api/tshirtApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { TShirt } from '../models/TShirt';

const mapApiToTShirt = (apiProduct: any): TShirt => {
  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    price: apiProduct.price,
    category: apiProduct.type,
    image: 'https://placehold.co/400x400/E81C1C/FFFFFF/png?text=' + apiProduct.name.replace(/\s/g, '+'),
    link: `/tshirts/${apiProduct.id}`,
    name: apiProduct.name,
    type: apiProduct.type,
    color: apiProduct.color,
    design: apiProduct.description,
  };
};

const tshirtApi = {
  getAll: async (): Promise<TShirt[]> => {
    try {
      const response = await httpClient.get('/products');
      return response.data.map(mapApiToTShirt);
    } catch (error) {
      console.error('Error fetching t-shirts:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<TShirt | undefined> => {
    try {
      const response = await httpClient.get(`/products/${id}`);
      return mapApiToTShirt(response.data);
    } catch (error) {
      console.error(`Error fetching t-shirt with id ${id}:`, error);
      return undefined;
    }
  },
};

export default tshirtApi;