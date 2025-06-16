// src/api/authApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { User } from '../models/User';

interface LoginCredentials {
  email: string;
  password: string;
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const response = await httpClient.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error en el login de la API local:', error);
      return null;
    }
  },
};

export default authApi;