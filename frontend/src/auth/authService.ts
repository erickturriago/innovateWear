// src/auth/authService.ts

import { UserFactory } from '../patterns/factory/UserFactory';
import type { User, UserRole } from '../models/User';

// Simulación de una base de datos de usuarios de la API
const mockApiUsers = [
  { id: 1, name: 'Admin User', email: 'admin@innovatewear.com', role: 'ADMIN', active: true, password: 'admin' },
  { id: 2, name: 'Carlos Artista', email: 'carlos@artista.com', role: 'ARTISTA', active: true, password: '123' },
  { id: 3, name: 'Ana Cliente', email: 'ana@cliente.com', role: 'CLIENTE', active: true, password: '456' },
];


const authService = {
  /**
   * Simula el proceso de login.
   * Busca un usuario y, si lo encuentra, usa la UserFactory para crear el objeto.
   */
  login: async (email: string, pass: string): Promise<User | null> => {
    console.log(`Intentando iniciar sesión como ${email}`);
    
    // Simulamos la búsqueda del usuario en el backend
    const userData = mockApiUsers.find(u => u.email === email && u.password === pass);

    if (userData) {
      console.log('Usuario encontrado, creando instancia con la fábrica...');
      // ¡Aquí usamos la fábrica!
      // El authService no necesita saber si es un Buyer, Artist o Admin.
      // Simplemente pide a la fábrica que cree el usuario correcto.
      const user = UserFactory.createUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        active: userData.active,
      });
      
      console.log(`¡Login exitoso! Rol: ${user.role}, Dashboard: ${user.getDashboardPath()}`);
      return user;
    }

    console.error('Credenciales incorrectas');
    return null;
  },

  logout: async (): Promise<void> => {
    console.log('Cerrando sesión...');
    // En una app real, aquí se limpiarían tokens o cookies.
    return Promise.resolve();
  }
};

export default authService;