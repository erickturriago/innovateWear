// src/models/TShirt.ts
export interface TShirt {
  id: string;
  image: string;
  title: string;
  price: number;
  category: string;
  link: string;
  name?: string; // Original name field, now optional
  type?: 'short' | 'long' | 'hoodie';
  color?: string;
  design?: string;
}