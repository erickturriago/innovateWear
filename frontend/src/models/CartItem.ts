// src/models/CartItem.ts
import type { TShirt } from './TShirt';
import type { Print } from './Print';

// Definimos las tallas disponibles como un tipo para reutilizarlo
export type TShirtSize = 'S' | 'M' | 'L' | 'XL';

// Propiedades comunes a cualquier item en el carrito
interface BaseCartItem {
  id: string; // Un ID único para el item en el carrito (ej. 't1-M')
  quantity: number;
  price: number; // Guardamos el precio al momento de añadirlo
}

// Item para un producto que ya estaba diseñado
export interface PredesignedCartItem extends BaseCartItem {
  type: 'predesigned';
  product: TShirt; // El producto T-Shirt completo
  size: TShirtSize;
}

// Item para un producto creado por el usuario
export interface CustomCartItem extends BaseCartItem {
  type: 'custom';
  baseTshirt: {
    name: 'Manga Corta' | 'Manga Larga' | 'Hoodie';
    color: string;
  };
  print: Print; // La estampa que se usó
  size: TShirtSize;
}

// Un tipo unión que nos permite tener ambos tipos de items en el mismo array
export type CartItem = PredesignedCartItem | CustomCartItem;