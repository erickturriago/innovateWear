// src/api/tshirtApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { TShirt } from '../models/TShirt';

// Mapea la respuesta de la API al modelo TShirt del frontend
const mapApiToTShirt = (apiProduct: any): TShirt => {
  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    price: apiProduct.price,
    category: apiProduct.type, // Usamos 'type' como 'category'
    image: 'https://placehold.co/400x400/E81C1C/FFFFFF/png?text=' + apiProduct.name.replace(/\s/g, '+'), // Placeholder
    link: `/tshirts/${apiProduct.id}`,
    // Mantenemos los campos originales por si se usan en otro lado
    name: apiProduct.name,
    type: apiProduct.type,
    color: apiProduct.color,
    design: apiProduct.description, // Usamos 'description' como 'design'
  };
};

const tshirtApi = {
  getAll: async (): Promise<TShirt[]> => {
    try {
      const response = await httpClient.get('/products');
      // La respuesta de la API es un array de productos, lo mapeamos
      return response.data.map(mapApiToTShirt);
    } catch (error) {
      console.error('Error fetching t-shirts:', error);
      return []; // Devolver un array vacío en caso de error
    }
  },

  getById: async (id: string): Promise<TShirt | undefined> => {
    try {
      const response = await httpClient.get(`/products/${id}`);
      return mapApiToTShirt(response.data);
    } catch (error) {
      console.error(`Error fetching t-shirt with id ${id}:`, error);
      return undefined; // Devolver undefined en caso de error
    }
  },
};

export default tshirtApi;