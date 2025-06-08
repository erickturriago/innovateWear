// src/components/HorizontalProductScroller.tsx
import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface HorizontalProductScrollerProps {
  title: string;
  children: ReactNode;
}

const HorizontalProductScroller = ({ title, children }: HorizontalProductScrollerProps) => {
  return (
    <Box mb={6}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
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