// src/api/orderApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';

const orderApi = {
  createFromCart: async (orderPayload: any): Promise<any> => {
    try {
      const response = await httpClient.post('/orders/create-from-cart', orderPayload);
      return response.data;
    } catch (error) {
      console.error('Error creando la orden:', error);
      throw error;
    }
  },
};

export default orderApi;