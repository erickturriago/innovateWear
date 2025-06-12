// src/components/layout/Footer.tsx
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} InnovateWear. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;