// src/api/adminApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';
import type { User } from '../models/User';

const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await httpClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  updateUser: async (userId: number, userData: Partial<User>): Promise<User | null> => {
    try {
      const response = await httpClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      return null;
    }
  },
};

export default adminApi;