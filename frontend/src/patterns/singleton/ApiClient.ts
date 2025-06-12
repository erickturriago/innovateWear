// src/patterns/singleton/ApiClient.ts
import axios, { type AxiosInstance } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  private constructor() { }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      console.log("Creando instancia ÚNICA de ApiClient (Singleton)");
      ApiClient.instance = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return ApiClient.instance;
  }
}

export const httpClient = ApiClient.getInstance();