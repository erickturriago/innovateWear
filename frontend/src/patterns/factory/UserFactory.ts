// src/patterns/factory/UserFactory.ts

import { User, Buyer, Artist, Admin, UserRole } from '../../models/User';

// Datos que esperamos recibir para crear un usuario (ej. desde una API)
interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export class UserFactory {
  /**
   * Este es nuestro "Método Fábrica".
   * Recibe los datos en crudo y devuelve una instancia de la clase de usuario correcta.
   */
  public static createUser(data: UserData): User {
    switch (data.role) {
      case 'CLIENTE':
        return new Buyer(data);
      case 'ARTISTA':
        return new Artist(data);
      case 'ADMIN':
        return new Admin(data);
      default:
        // Como fallback, podríamos devolver el tipo más básico o lanzar un error.
        console.warn(`Rol desconocido: ${data.role}. Se creará como Cliente.`);
        return new Buyer(data);
    }
  }
}