// src/models/CartItem.ts
import type { TShirt } from './TShirt';
import type { Print } from './Print';

export type TShirtSize = 'S' | 'M' | 'L' | 'XL';

interface BaseCartItem {
  id: string;
  quantity: number;
  price: number;
}

export interface PredesignedCartItem extends BaseCartItem {
  type: 'predesigned';
  product: TShirt;
  size: TShirtSize;
}

export interface CustomCartItem extends BaseCartItem {
  type: 'custom';
  baseTshirt: {
    name: 'Manga Corta' | 'Manga Larga' | 'Hoodie';
    color: string;
  };
  prints: Print[]; // AJUSTE: Ahora es un array de estampas
  size: TShirtSize;
}

export type CartItem = PredesignedCartItem | CustomCartItem;