// src/models/Print.ts
export interface Print {
  id: string;
  image: string;
  title: string;    // ANTES: nombre
  category: string; // ANTES: tipo
  author: string;   // ANTES: autor
  likes: number;    // ANTES: total_favoritos
  link: string;
}