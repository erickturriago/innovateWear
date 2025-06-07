// src/api/tshirtApi.ts
import httpClient from './ApiClient';
import { popularTshirts as mockTshirts } from '../data/mockData'; // Importamos los datos de prueba
import type { TShirt } from '../models/TShirt'; // Asumimos que TShirt es tu modelo

// --- ¡LA CLAVE ESTÁ AQUÍ! ---
// Cambia este valor a `false` cuando tu API esté lista.
const USE_MOCK_DATA = true;

const tshirtApi = {
  /**
   * Obtiene todas las camisetas.
   * Devuelve datos de prueba o hace una llamada real a la API.
   */
  getAll: async (): Promise<TShirt[]> => {
    if (USE_MOCK_DATA) {
      console.log('Usando datos MOCK para camisetas');
      // Simulamos un retraso de red y devolvemos los datos de prueba
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(mockTshirts as TShirt[]); // Aseguramos el tipo
        }, 500); // 0.5 segundos de retraso
      });
    } else {
      try {
        console.log('Haciendo llamada a la API REAL para camisetas');
        const response = await httpClient.get('/tshirts');
        return response.data;
      } catch (error) {
        console.error('Error al obtener las camisetas de la API:', error);
        throw error; // Propagamos el error para que el componente lo maneje
      }
    }
  },

  // Aquí podrías añadir más funciones en el futuro:
  // getById: async (id: string): Promise<TShirt> => { ... },
  // create: async (data: Omit<TShirt, 'id'>): Promise<TShirt> => { ... },
};

export default tshirtApi;