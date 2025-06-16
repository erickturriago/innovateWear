// src/api/tshirtApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { TShirt } from '../models/TShirt';

// Esta función mapea un Producto base de la API
const mapApiToTShirt = (apiProduct: any): TShirt => {
  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    price: apiProduct.price,
    category: apiProduct.type,
    image: apiProduct.link, 
    link: `/tshirts/${apiProduct.id}`,
    name: apiProduct.name,
    type: apiProduct.type,
    color: apiProduct.color,
    design: apiProduct.description,
    customizable: apiProduct.customizable,
  };
};

const tshirtApi = {
  // RESTAURADO: Esta función ahora obtiene TODOS los productos base,
  // que es lo que la página de personalización necesita.
  getAll: async (): Promise<TShirt[]> => {
    try {
      const response = await httpClient.get('/products'); // <-- AQUÍ ESTÁ EL CAMBIO
      return response.data.map(mapApiToTShirt);
    } catch (error) {
      console.error('Error fetching active base t-shirts:', error);
      return [];
    }
  },

  // Esta función obtiene un producto base por ID y no necesita cambios.
  getById: async (id: string): Promise<TShirt | undefined> => {
    try {
      const response = await httpClient.get(`/products/detail/${id}`);
      return mapApiToTShirt(response.data);
    } catch (error) {
      console.error(`Error fetching t-shirt with id ${id}:`, error);
      return undefined;
    }
  },
};

export default tshirtApi;