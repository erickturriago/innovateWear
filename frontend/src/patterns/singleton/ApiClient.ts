// src/patterns/singleton/ApiClient.ts
import axios, { type AxiosInstance } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  private constructor() { }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        // Usamos la variable de entorno para la URL base
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return ApiClient.instance;
  }
}

export const httpClient = ApiClient.getInstance();