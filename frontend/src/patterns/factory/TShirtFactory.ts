// src/patterns/factory/TShirtFactory.ts
import type { TShirt } from '../../models/TShirt';

// Clase abstracta (o interfaz) para la fábrica, si quieres usarla
export interface ITShirtFactory {
  createTShirt(params: Partial<TShirt>): TShirt;
}

export class TShirtFactory implements ITShirtFactory {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  createTShirt(params: Partial<TShirt>): TShirt {
    // Validaciones básicas (podrías agregar más)
    if (!params.name) throw new Error('El nombre es requerido');
    if (!params.type) throw new Error('El tipo es requerido');
    if (!params.color) throw new Error('El color es requerido');
    if (!params.price) throw new Error('El precio es requerido');

    return {
      id: TShirtFactory.generateId(),
      name: params.name,
      type: params.type,
      color: params.color,
      design: params.design || 'Default Design',
      price: params.price,
    };
  }
}
