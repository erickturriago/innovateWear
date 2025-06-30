// src/components/HorizontalProductScroller.tsx

// 1. Importa 'styled' de @mui/material
import { Box, styled } from '@mui/material';
import type { ReactNode } from 'react';

interface HorizontalProductScrollerProps {
  title: string;
  children: ReactNode;
  titleId?: string;
}

// 2. Creamos un componente de título que SIEMPRE será un <h2>
//    y le aplicamos los estilos visuales que necesitas.
const SectionTitle = styled('h2')(({ theme }) => ({
  ...theme.typography.h4, // Usa el estilo de la variante h4 de tu tema
  fontWeight: 'bold',    // Le asignamos la negrita
  marginBottom: theme.spacing(2), // Añadimos un margen inferior
}));


const HorizontalProductScroller = ({ title, children, titleId }: HorizontalProductScrollerProps) => {
  return (
    <Box mb={6}>
      {/* 3. Usamos nuestro nuevo componente en lugar de <Typography> */}
      {/* Esto garantiza que el HTML final sea un <h2>, eliminando el error. */}
      <SectionTitle id={titleId}>
        {title}
      </SectionTitle>
      
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 3,
          py: 2
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HorizontalProductScroller;