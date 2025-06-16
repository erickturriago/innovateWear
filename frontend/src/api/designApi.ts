// src/api/designApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { Print } from '../models/Print';

const mapApiToPrint = (apiDesign: any): Print => {
  return {
    id: apiDesign.id.toString(),
    title: apiDesign.name,
    image: apiDesign.imageUrl || 'https://placehold.co/400x400/1a1a1a/ffffff/png?text=Print',
    category: apiDesign.category?.name || 'General',
    author: apiDesign.artist?.name || 'Anónimo',
    likes: Math.floor(Math.random() * 300),
    link: `/prints/${apiDesign.id}`,
  };
};

interface NewDesignData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  artistId: number;
}

const designApi = {
  getAll: async (): Promise<Print[]> => {
    try {
      const response = await httpClient.get('/designs');
      return response.data.map(mapApiToPrint);
    } catch (error) {
      console.error('Error fetching designs:', error);
      return [];
    }
  },
  
  // CORRECCIÓN DE RUTA
  getByArtistId: async (artistId: number): Promise<Print[]> => {
    try {
      const response = await httpClient.get(`/designs/by-artist/${artistId}`);
      return response.data.map(mapApiToPrint);
    } catch (error) {
      console.error(`Error fetching designs for artist ${artistId}:`, error);
      return [];
    }
  },

  // NUEVO MÉTODO ALINEADO CON EL BACKEND
  getById: async (id: string): Promise<Print | null> => {
    try {
      const response = await httpClient.get(`/designs/detail/${id}`);
      return mapApiToPrint(response.data);
    } catch (error) {
      console.error(`Error fetching design with id ${id}:`, error);
      return null;
    }
  },

  create: async (data: NewDesignData): Promise<Print | null> => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        category: { id: data.categoryId },
        artist: { id: data.artistId },
      };
      const response = await httpClient.post('/designs', payload);
      return mapApiToPrint(response.data);
    } catch (error) {
      console.error('Error creating design:', error);
      return null;
    }
  },
  
  update: async (id: string, data: Partial<NewDesignData>): Promise<Print | null> => {
    try {
      const response = await httpClient.put(`/designs/${id}`, data);
      return mapApiToPrint(response.data);
    } catch (error) {
      console.error(`Error updating design ${id}:`, error);
      return null;
    }
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await httpClient.delete(`/designs/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting design ${id}:`, error);
      return false;
    }
  },
};

export default designApi;