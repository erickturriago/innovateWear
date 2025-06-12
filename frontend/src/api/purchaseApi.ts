// src/api/purchaseApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';

interface PurchaseIntentPayload {
  userId: number | null;
  userName: string;
  items: any[];
  total: number;
}

const purchaseApi = {
  logIntent: async (payload: PurchaseIntentPayload): Promise<boolean> => {
    try {
      await httpClient.post('/purchase-intents', payload);
      console.log('Intento de compra registrado con éxito.');
      return true;
    } catch (error) {
      console.error('Error al registrar el intento de compra:', error);
      return false;
    }
  }
};

export default purchaseApi;