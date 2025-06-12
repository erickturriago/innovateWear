// src/models/Garment.ts
export type GarmentType = 'Manga Corta' | 'Manga Larga' | 'Hoodie';

// Define la opción de color con su propia imagen
export interface ColorOption {
  name: string;
  value: string; // El código hexadecimal para la muestra de color
  imageUrl: string; // La URL de la imagen para este color específico
}

export interface BaseGarment {
  id: string;
  name: GarmentType;
  // Cada prenda ahora tiene un array de colores disponibles
  colors: ColorOption[];
  price: number;
}