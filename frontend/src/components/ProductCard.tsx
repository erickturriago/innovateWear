// src/components/ProductCard.tsx
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { TShirt } from '../models/TShirt';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(price);
};

const ProductCard = (props: TShirt) => {
  const { image, title, category, price, link } = props;

  // **** MEJORA DE ACCESIBILIDAD ****
  // Se crea una etiqueta descriptiva para el área del enlace.
  const ariaLabel = `Ver detalles de ${title}, precio: ${formatPrice(price)}`;
  const imageAltText = `Imagen de ${title}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {/* **** MEJORA DE ACCESIBILIDAD ****
        Se añade un 'aria-label' al área de acción para que los lectores de pantalla
        anuncien una descripción clara y concisa del enlace.
      */}
      <CardActionArea
        component={RouterLink}
        to={link}
        aria-label={ariaLabel}
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <CardMedia
          component="img"
          height="280"
          image={image}
          // **** MEJORA DE ACCESIBILIDAD ****
          // Se mejora el texto alternativo para ser más descriptivo.
          alt={imageAltText}
          sx={{ objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">{category}</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{formatPrice(price)}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;