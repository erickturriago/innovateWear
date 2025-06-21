// src/api/adminApi.ts
import { httpClient } from '../patterns/singleton/ApiClient';

type User = any; type Order = any; type Product = any; type Design = any; type CustomDesign = any; type Category = any;

export const adminApi = {
  // --- Usuarios ---
  getAllUsers: async (): Promise<User[]> => {
    const response = await httpClient.get('/users/all');
    return response.data;
  },
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await httpClient.put(`/users/${id}`, data);
    return response.data;
  },
  archiveUser: async (id: number): Promise<void> => {
    await httpClient.delete(`/users/${id}/archive`);
  },
  deactivateUser: async (id: number): Promise<void> => {
    await httpClient.delete(`/users/${id}`);
  },
  
  // --- Pedidos ---
  getAllOrders: async (): Promise<Order[]> => {
    const response = await httpClient.get('/orders');
    return response.data;
  },
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await httpClient.put(`/orders/${id}/status`, status, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  },

  // --- Diseños Personalizados (Camisetas Diseñadas) ---
  getAllCustomDesigns: async (): Promise<CustomDesign[]> => {
    const response = await httpClient.get('/custom-designs/all');
    return response.data;
  },
  updateCustomDesign: async (id: number, data: Partial<CustomDesign>): Promise<CustomDesign> => {
    const response = await httpClient.put(`/custom-designs/${id}`, data);
    return response.data;
  },
  archiveCustomDesign: async (id: number): Promise<void> => {
    await httpClient.delete(`/custom-designs/${id}/archive`);
  },

  // --- Productos Base ---
  getAllProducts: async (): Promise<Product[]> => {
    const response = await httpClient.get('/products/all');
    return response.data;
  },
  createProduct: async (data: Product): Promise<Product> => {
    const response = await httpClient.post('/products', data);
    return response.data;
  },
  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await httpClient.put(`/products/${id}`, data);
    return response.data;
  },
  archiveProduct: async (id: number): Promise<void> => {
    await httpClient.delete(`/products/${id}/archive`);
  },

  // --- Diseños (Estampas) ---
  getAllDesigns: async (): Promise<Design[]> => {
    const response = await httpClient.get('/designs/all');
    return response.data;
  },
  createDesign: async (data: Design): Promise<Design> => {
    const response = await httpClient.post('/designs', data);
    return response.data;
  },
  updateDesign: async (id: number, data: Partial<Design>): Promise<Design> => {
    const response = await httpClient.put(`/designs/${id}`, data);
    return response.data;
  },
  archiveDesign: async (id: number): Promise<void> => {
    await httpClient.delete(`/designs/${id}/archive`);
  },

  // --- Categorías de Diseño ---
  getAllCategories: async (): Promise<Category[]> => {
    const response = await httpClient.get('/design-categories/all');
    return response.data;
  },
  createCategory: async (data: Category): Promise<Category> => {
      const response = await httpClient.post('/design-categories', data);
      return response.data;
  },
  updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
      const response = await httpClient.put(`/design-categories/${id}`, data);
      return response.data;
  },
  deactivateCategory: async (id: number): Promise<void> => {
      await httpClient.delete(`/design-categories/${id}`);
  },
  archiveCategory: async (id: number): Promise<void> => {
      await httpClient.delete(`/design-categories/${id}/archive`);
  },
};