// src/models/CartItem.ts
export type TShirtSize = 'S' | 'M' | 'L' | 'XL';

export interface CartItemDisplayData {
    name: string;
    image: string;
}

interface BaseCartItem {
  id: string; // ID único para el item en el carrito
  quantity: number;
  price: number; // Representa el precio total (unitPrice * quantity)
  unitPrice: number;
  size: TShirtSize; // <-- PROPIEDAD AÑADIDA DE VUELTA
  customDesignId: number;
  displayData: CartItemDisplayData;
}

export interface PredesignedCartItem extends BaseCartItem {
  type: 'predesigned';
}

export interface CustomCartItem extends BaseCartItem {
  type: 'custom';
}

export type CartItem = PredesignedCartItem | CustomCartItem;