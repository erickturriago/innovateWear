// src/patterns/factory/TShirtFactory.ts
import type { TShirt } from '../../models/TShirt';

// Definimos explícitamente qué parámetros necesita la fábrica
interface TShirtCreationParams {
  name: string;
  type: 'short' | 'long' | 'hoodie';
  color: string;
  design?: string;
  price: number;
}

export class TShirtFactory {
  private static generateId(): string {
    return `new-${Math.random().toString(36).substring(2, 10)}`;
  }

  createTShirt(params: TShirtCreationParams): TShirt {
    // Validaciones básicas
    if (!params.name) throw new Error('El nombre es requerido');
    if (!params.type) throw new Error('El tipo es requerido');
    if (!params.color) throw new Error('El color es requerido');
    if (params.price === undefined) throw new Error('El precio es requerido');

    const id = TShirtFactory.generateId();

    // Creamos el objeto TShirt completo, asegurándonos de que todas
    // las propiedades requeridas por la interfaz TShirt existan.
    return {
      // Propiedades requeridas por el modelo TShirt para las tarjetas
      id: id,
      image: 'https://via.placeholder.com/300x280?text=Nueva+Camiseta', // Imagen de marcador
      title: params.name,        // Usamos el nombre como título
      price: params.price,
      category: params.type,     // Usamos el tipo como categoría
      link: `/tshirts/${id}`,    // Generamos un enlace

      // Propiedades originales que venían de los parámetros
      name: params.name,
      type: params.type,
      color: params.color,
      design: params.design || 'Default Design',
    };
  }
}