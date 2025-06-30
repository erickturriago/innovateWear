// src/components/HorizontalProductScroller.tsx
import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface HorizontalProductScrollerProps {
  title: string;
  children: ReactNode;
  // **** ACCESIBILIDAD: Se añade la prop opcional para el ID del título ****
  titleId?: string;
}

const HorizontalProductScroller = ({ title, children, titleId }: HorizontalProductScrollerProps) => {
  return (
    <Box mb={6}>
      <Typography
        variant="h4"
        component="p"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
        // **** ACCESIBILIDAD: Se asigna el ID al título ****
        id={titleId}
      >
        {title}
      </Typography>
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