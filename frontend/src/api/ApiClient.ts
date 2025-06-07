// src/patterns/singleton/ApiClient.ts
import axios, { type AxiosInstance } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  private constructor() { } // Constructor privado para evitar new ApiClient()

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      console.log("Creando instancia ÚNICA de ApiClient");
      ApiClient.instance = axios.create({
        baseURL: 'http://localhost:3001/api', // Debería venir de un .env
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return ApiClient.instance;
  }
}

// Exportamos la función para obtener la instancia, no la clase
export const httpClient = ApiClient.getInstance();