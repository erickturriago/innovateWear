// src/api/customDesignApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { TShirt } from '../models/TShirt'; // Importamos el modelo TShirt para reutilizarlo

export interface SavedCustomDesignPayload {
  name: string;
  description: string;
  price: number;
  isPublic: boolean;
  active?: boolean;
  previewImageUrl: string;
  creator: { id: number };
  product: { id: number };
  prints: { design: { id: number } }[];
}

// Interfaz para el dato que recibimos de la API
interface ApiCustomDesign {
    id: number;
    name: string;
    price: number;
    previewImageUrl: string;
    product: { type: string; };
}

// Función que convierte un CustomDesign a un objeto que ProductCard entiende
const mapApiCustomDesignToProductCardData = (apiDesign: ApiCustomDesign): TShirt => {
    return {
      id: apiDesign.id.toString(),
      title: apiDesign.name,
      price: apiDesign.price,
      category: apiDesign.product.type || 'Diseño',
      image: apiDesign.previewImageUrl || 'https://placehold.co/400x400/1a1a1a/ffffff/png?text=Design',
      link: `/tshirts/${apiDesign.id}`,
    };
};

const customDesignApi = {
  // NUEVA FUNCIÓN: Obtiene todos los diseños públicos para la tienda
  getPublicDesigns: async (): Promise<TShirt[]> => {
    try {
      const response = await httpClient.get<ApiCustomDesign[]>('/custom-designs/public');
      return response.data.map(mapApiCustomDesignToProductCardData);
    } catch (error) {
      console.error('Error fetching public custom designs:', error);
      return [];
    }
  },
  
  // Función para obtener un solo diseño, necesaria para la página de detalle
  getById: async (id: number): Promise<any> => {
    try {
      const response = await httpClient.get(`/custom-designs/detail/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching custom design with id ${id}:`, error);
      throw error;
    }
  },

  create: async (payload: SavedCustomDesignPayload): Promise<any> => {
    try {
      const response = await httpClient.post('/custom-designs', payload);
      return response.data;
    } catch (error) {
      console.error('Error al guardar el diseño personalizado:', error);
      throw error;
    }
  },

  getByCreator: async (creatorId: number): Promise<any[]> => {
    try {
      const response = await httpClient.get(`/custom-designs/creator/${creatorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching custom designs for creator ${creatorId}:`, error);
      return [];
    }
  },

  update: async (id: number, payload: Partial<SavedCustomDesignPayload>): Promise<any> => {
    try {
      const response = await httpClient.put(`/custom-designs/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating custom design ${id}:`, error);
      throw error;
    }
  },
};

export default customDesignApi;