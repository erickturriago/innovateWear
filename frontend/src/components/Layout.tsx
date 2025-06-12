// src/components/layout/Layout.tsx
import { Container, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flex="1" py={4}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;