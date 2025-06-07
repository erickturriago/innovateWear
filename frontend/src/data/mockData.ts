// src/data/mockData.ts
import type { TShirt } from '../models/TShirt';
import type { Print } from '../models/Print';

// --- DATOS DEL CARRUSEL MEJORADOS ---
export const heroImages = [
  {
    id: 1,
    img: 'https://i.ibb.co/b3VLfF4/C3.png',
    title: 'Crea Diseños Únicos',
    subtitle: 'Nuestra herramienta de personalización te da el control total para crear la camiseta perfecta.',
    buttonText: '¡Personaliza Ahora!',
    link: '/customize'
  },
  {
    id: 2,
    img: 'https://i.ibb.co/yqcmkRj/C1-1.png',
    title: 'Nueva Colección Abstracta',
    subtitle: 'Explora nuestros diseños más recientes con un toque moderno y minimalista.',
    buttonText: 'Ver Colección',
    link: '/tshirts'
  },
  {
    id: 3,
    img: 'https://i.ibb.co/M5xJchw/C2.png',
    title: 'Envío Gratis Este Mes',
    subtitle: 'Aprovecha nuestra promoción de envío gratuito en todas las órdenes superiores a $100.000.',
    buttonText: 'Comprar Ya',
    link: '/catalog'
  }
];

// --- DATOS DE CAMISETAS EXPANDIDOS Y VARIADOS ---
export const popularTshirts: TShirt[] = [
  { id: 't1', image: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Cosmic+Cat', title: 'Gato Cósmico', price: 35000, category: 'Animales', link: '/tshirts/gato-cosmico' },
  { id: 't2', image: 'https://placehold.co/400x400/E81C1C/FFFFFF/png?text=Retro+Gamer', title: 'Retro Gamer', price: 42000, category: 'Gaming', link: '/tshirts/retro-gamer' },
  { id: 't3', image: 'https://placehold.co/400x400/2A4D8C/FFFFFF/png?text=Vintage+85', title: 'Clásico del 85', price: 38000, category: 'Vintage', link: '/tshirts/clasico-85' },
  { id: 't4', image: 'https://placehold.co/400x400/F28A0C/FFFFFF/png?text=Sonrisa', title: 'Sonrisa Minimalista', price: 29000, category: 'Emojis', link: '/tshirts/sonrisa-minimalista' },
  { id: 't5', image: 'https://placehold.co/400x400/9B51E0/FFFFFF/png?text=EVA', title: 'Unidad Evangelion', price: 45000, category: 'Anime', link: '/tshirts/unidad-evangelion' },
  { id: 't6', image: 'https://placehold.co/400x400/4F4F4F/FFFFFF/png?text=Astro+Dog', title: 'Perro Astronauta', price: 36000, category: 'Animales', link: '/tshirts/perro-astronauta' },
  { id: 't7', image: 'https://placehold.co/400x400/219653/FFFFFF/png?text=Abstract', title: 'Formas Abstractas', price: 32000, category: 'Abstracto', link: '/tshirts/formas-abstractas' },
  { id: 't8', image: 'https://placehold.co/400x400/F2C94C/000000/png?text=Caution!', title: 'Cinta de Precaución', price: 33000, category: 'Urbano', link: '/tshirts/cinta-precaucion' },
];

// --- DATOS DE ESTAMPAS EXPANDIDOS Y ESTANDARIZADOS ---
export const popularPrints: Print[] = [
   { id: 'p1', image: 'https://i.imgur.com/kSj5b23.png', title: 'Baby Yoda', category: 'Personaje', author: '@Grodesh', likes: 152, link: '/prints/baby-yoda' },
   { id: 'p2', image: 'https://i.imgur.com/d3L3pWl.png', title: 'Gato Serio', category: 'Meme', author: '@AmeEE', likes: 230, link: '/prints/gato-serio' },
   { id: 'p3', image: 'https://i.imgur.com/jI5k2Db.png', title: 'Eva 01', category: 'Anime', author: '@Shinji', likes: 98, link: '/prints/eva-01' },
   { id: 'p4', image: 'https://placehold.co/400x400/1a1a1a/ffffff/png?text=Glitch', title: 'Efecto Glitch', category: 'Abstracto', author: '@Pixel', likes: 180, link: '/prints/glitch' },
   { id: 'p5', image: 'https://placehold.co/400x400/ffffff/000000/png?text=Oni+Mask', title: 'Máscara Oni', category: 'Japonés', author: '@Taka', likes: 215, link: '/prints/mascara-oni' },
   { id: 'p6', image: 'https://placehold.co/400x400/f2a3b1/ffffff/png?text=Sad+Club', title: 'Club de los Tristes', category: 'Tipografía', author: '@Vapor', likes: 75, link: '/prints/sad-club' },
   { id: 'p7', image: 'https://placehold.co/400x400/94d3ac/1c1c1c/png?text=Hongo', title: 'Hongo Psicodélico', category: ' психоделик', author: '@Trip', likes: 112, link: '/prints/hongo' },
   { id: 'p8', image: 'https://placehold.co/400x400/3c3c3c/ffffff/png?text=Anatomy', title: 'Corazón Anatómico', category: 'Ciencia', author: '@Doc', likes: 99, link: '/prints/corazon' },
];