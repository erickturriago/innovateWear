// src/data/mockData.ts
import type { TShirt } from '../models/TShirt';
import type { Print } from '../models/Print';
import type { BaseGarment } from '../models/Garment';

// --- DATOS DEL CARRUSEL ---
// Asegúrate de que la palabra 'export' está aquí
export const heroImages = [
  { id: 1, img: 'https://i.ibb.co/b3VLfF4/C3.png', title: 'Crea Diseños Únicos', subtitle: 'Nuestra herramienta de personalización te da el control total para crear la camiseta perfecta.', buttonText: '¡Personaliza Ahora!', link: '/customize' },
  { id: 2, img: 'https://i.ibb.co/yqcmkRj/C1-1.png', title: 'Nueva Colección Abstracta', subtitle: 'Explora nuestros diseños más recientes con un toque moderno y minimalista.', buttonText: 'Ver Colección', link: '/tshirts' },
  { id: 3, img: 'https://i.ibb.co/M5xJchw/C2.png', title: 'Envío Gratis Este Mes', subtitle: 'Aprovecha nuestra promoción de envío gratuito en todas las órdenes superiores a $100.000.', buttonText: 'Comprar Ya', link: '/catalog' }
];


// --- DATOS DE CAMISETAS ---
// Asegúrate de que la palabra 'export' está aquí
export const popularTshirts: TShirt[] = [
  { id: 't1', image: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Cosmic+Cat', title: 'Gato Cósmico', price: 35000, category: 'Animales', link: '/tshirts/t1' },
  { id: 't2', image: 'https://placehold.co/400x400/E81C1C/FFFFFF/png?text=Retro+Gamer', title: 'Retro Gamer', price: 42000, category: 'Gaming', link: '/tshirts/t2' },
  { id: 't3', image: 'https://placehold.co/400x400/2A4D8C/FFFFFF/png?text=Vintage+85', title: 'Clásico del 85', price: 38000, category: 'Vintage', link: '/tshirts/t3' },
  { id: 't4', image: 'https://placehold.co/400x400/F28A0C/FFFFFF/png?text=Sonrisa', title: 'Sonrisa Minimalista', price: 29000, category: 'Emojis', link: '/tshirts/t4' },
  { id: 't5', image: 'https://placehold.co/400x400/9B51E0/FFFFFF/png?text=EVA', title: 'Unidad Evangelion', price: 45000, category: 'Anime', link: '/tshirts/t5' },
  { id: 't6', image: 'https://placehold.co/400x400/4F4F4F/FFFFFF/png?text=Astro+Dog', title: 'Perro Astronauta', price: 36000, category: 'Animales', link: '/tshirts/t6' },
  { id: 't7', image: 'https://placehold.co/400x400/219653/FFFFFF/png?text=Abstract', title: 'Formas Abstractas', price: 32000, category: 'Abstracto', link: '/tshirts/t7' },
  { id: 't8', image: 'https://placehold.co/400x400/F2C94C/000000/png?text=Caution!', title: 'Cinta de Precaución', price: 33000, category: 'Urbano', link: '/tshirts/t8' },
];


// --- DATOS DE ESTAMPAS ---
// Asegúrate de que la palabra 'export' está aquí
export const popularPrints: Print[] = [
   { id: 'p1', image: 'https://i.imgur.com/kSj5b23.png', title: 'Baby Yoda', category: 'Personaje', author: '@Grodesh', likes: 152, link: '/prints/p1' },
   { id: 'p2', image: 'https://i.imgur.com/d3L3pWl.png', title: 'Gato Serio', category: 'Meme', author: '@AmeEE', likes: 230, link: '/prints/p2' },
   { id: 'p3', image: 'https://i.imgur.com/jI5k2Db.png', title: 'Eva 01', category: 'Anime', author: '@Shinji', likes: 98, link: '/prints/p3' },
   { id: 'p4', image: 'https://placehold.co/400x400/1a1a1a/ffffff/png?text=Glitch', title: 'Efecto Glitch', category: 'Abstracto', author: '@Pixel', likes: 180, link: '/prints/p4' },
   { id: 'p5', image: 'https://placehold.co/400x400/ffffff/000000/png?text=Oni+Mask', title: 'Máscara Oni', category: 'Japonés', author: '@Taka', likes: 215, link: '/prints/p5' },
   { id: 'p6', image: 'https://placehold.co/400x400/f2a3b1/ffffff/png?text=Sad+Club', title: 'Club de los Tristes', category: 'Tipografía', author: '@Vapor', likes: 75, link: '/prints/p6' },
   { id: 'p7', image: 'https://placehold.co/400x400/94d3ac/1c1c1c/png?text=Hongo', title: 'Hongo Psicodélico', category: 'Psicodélico', author: '@Trip', likes: 112, link: '/prints/p7' },
   { id: 'p8', image: 'https://placehold.co/400x400/3c3c3c/ffffff/png?text=Anatomy', title: 'Corazón Anatómico', category: 'Ciencia', author: '@Doc', likes: 99, link: '/prints/p8' },
];

// --- DATOS DE PRENDAS BASE ---
// Asegúrate de que la palabra 'export' está aquí
export const availableGarments: BaseGarment[] = [
  { id: 'g1', name: 'Manga Corta', price: 30000, colors: [
      { name: 'Blanco', value: '#FFFFFF', imageUrl: 'https://i.imgur.com/eT8H2m4.png' },
      { name: 'Negro', value: '#222222', imageUrl: 'https://i.imgur.com/3G3aC2f.png' },
      { name: 'Gris', value: '#888888', imageUrl: 'https://i.imgur.com/2eyy2b9.png' },
      { name: 'Rojo', value: '#B71C1C', imageUrl: 'https://i.imgur.com/9l3o2Wh.png' },
      { name: 'Azul', value: '#0D47A1', imageUrl: 'https://i.imgur.com/p7x2r8w.png' },
  ]},
  { id: 'g2', name: 'Manga Larga', price: 35000, colors: [
      { name: 'Blanco', value: '#FFFFFF', imageUrl: 'https://i.imgur.com/7sHcN3z.png' },
      { name: 'Negro', value: '#222222', imageUrl: 'https://i.imgur.com/r5y5B6f.png' },
  ]},
  { id: 'g3', name: 'Hoodie', price: 50000, colors: [
      { name: 'Gris', value: '#888888', imageUrl: 'https://i.imgur.com/s6D4tTe.png' },
      { name: 'Negro', value: '#222222', imageUrl: 'https://i.imgur.com/01bN1zH.png' },
  ]},
];