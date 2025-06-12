// src/models/User.ts

export type UserRole = 'CLIENTE' | 'ARTISTA' | 'ADMIN';

// Interfaz común para todos los usuarios
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  
  // Método que podría tener una implementación diferente por rol
  getDashboardPath(): string;
}

// Clases concretas para cada rol

export class Buyer implements User {
  id: number;
  name: string;
  email: string;
  role: UserRole = 'CLIENTE';
  active: boolean;

  constructor(data: Omit<User, 'getDashboardPath' | 'role'>) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.active = data.active;
  }

  public getDashboardPath(): string {
    return '/my-purchases';
  }
}

export class Artist implements User {
  id: number;
  name: string;
  email: string;
  role: UserRole = 'ARTISTA';
  active: boolean;

  constructor(data: Omit<User, 'getDashboardPath' | 'role'>) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.active = data.active;
  }

  public getDashboardPath(): string {
    return '/artist/dashboard';
  }
}

export class Admin implements User {
  id: number;
  name: string;
  email: string;
  role: UserRole = 'ADMIN';
  active: boolean;

  constructor(data: Omit<User, 'getDashboardPath' | 'role'>) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.active = data.active;
  }

  public getDashboardPath(): string {
    return '/admin/panel';
  }
}