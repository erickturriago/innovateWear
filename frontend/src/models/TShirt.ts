// src/models/TShirt.ts
export interface TShirt {
  id: string;
  name: string;
  type: 'short' | 'long' | 'hoodie';
  color: string;
  design: string;
  price: number;
}
