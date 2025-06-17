// src/patterns/facade/AdminFacade.ts
import {adminApi} from '../../api/adminApi';
import categoryApi from '../../api/categoryApi'; // <-- Usamos el nuevo servicio
import type { User } from '../../models/User';

export const AdminFacade = {
  getDashboardData: async () => {
    console.log('Facade: Fetching all dashboard data...');
    const [users, categories] = await Promise.all([
      adminApi.getAllUsers(),
      categoryApi.getAll(), // <-- Llamada actualizada
    ]);
    return { users, categories };
  },

  approveArtist: async (artist: User): Promise<User | null> => {
    if (artist.role !== 'ARTISTA') {
      console.error('Facade: Only users with role ARTISTA can be approved.');
      return null;
    }
    console.log(`Facade: Approving artist ${artist.id}...`);
    return adminApi.updateUser(artist.id, { active: true });
  },
};