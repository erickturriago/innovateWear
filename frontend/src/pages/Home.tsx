// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Alert, Skeleton } from '@mui/material'; // Grid ya no es necesario aquí
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import PrintCard from '../components/PrintCard';
import ViewMoreCard from '../components/ViewMoreCard';
import tshirtApi from '../api/tshirtApi';
import printApi from '../api/printApi';
import type { TShirt } from '../models/TShirt';
import type { Print } from '../models/Print';

const Home = () => {
  const [tshirts, setTshirts] = useState<TShirt[]>([]);
  const [prints, setPrints] = useState<Print[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tshirtsData, printsData] = await Promise.all([
          tshirtApi.getAll(),
          printApi.getAll(),
        ]);
        setTshirts(tshirtsData);
        setPrints(printsData);
      } catch (err) {
        setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const renderSkeletons = (count = 4) => (
    <Box
      display="grid"
      gap={3}
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
    >
      {Array.from(new Array(count)).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="rectangular" sx={{ borderRadius: 3, aspectRatio: '1 / 1.15' }} />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <HeroCarousel />
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        
        <Box mb={6}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Camisetas populares
          </Typography>
          {loading ? renderSkeletons() : (
            <Box
              display="grid"
              gap={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {tshirts.map((camiseta) => (
                <ProductCard key={camiseta.id} {...camiseta} />
              ))}
              <ViewMoreCard text="Camisetas" link="/tshirts" />
            </Box>
          )}
        </Box>

        <Box mb={6}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Estampas populares
          </Typography>
          {loading ? renderSkeletons() : (
            <Box
              display="grid"
              gap={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {prints.map((estampa) => (
                <PrintCard key={estampa.id} {...estampa} />
              ))}
              <ViewMoreCard text="Estampados" link="/prints" />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;