// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Box, Alert, Skeleton } from '@mui/material';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import PrintCard from '../components/ui/PrintCard';
import ViewMoreCard from '../components/ViewMoreCard';
import HorizontalProductScroller from '../components/HorizontalProductScroller';
import customDesignApi from '../api/customDesignApi';
import printApi from '../api/designApi';
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
          customDesignApi.getPublicDesigns(), 
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
    <Box display="flex" gap={3}>
      {Array.from(new Array(count)).map((_, index) => (
        <Box key={index} sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
          <Skeleton variant="rectangular" sx={{ borderRadius: 3, height: 320 }} />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      ))}
    </Box>
  );

  return (
    // Se usa <main> para el contenido principal, buena práctica semántica.
    <Box component="main">
      <HeroCarousel />
      {/* Contenedor principal para las secciones */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        
        {loading ? (
          <>
            <Box mb={6}>{renderSkeletons()}</Box>
            <Box mb={6}>{renderSkeletons()}</Box>
          </>
        ) : (
          <>
            {/* **** LA SOLUCIÓN FINAL ESTÁ AQUÍ **** */}
            {/* 1. Envuelve el primer scroller en un Box que actúa como <section> */}
            <Box component="section" aria-labelledby="popular-tshirts-heading">
              <HorizontalProductScroller
                title="Camisetas Populares"
                titleId="popular-tshirts-heading"
              >
                {tshirts.map((camiseta) => (
                  <Box key={camiseta.id} sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                    <ProductCard {...camiseta} />
                  </Box>
                ))}
                <Box sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                  <ViewMoreCard text="Camisetas" link="/tshirts" />
                </Box>
              </HorizontalProductScroller>
            </Box>

            {/* 2. Envuelve el segundo scroller en su propio Box que actúa como <section> */}
            <Box component="section" aria-labelledby="popular-prints-heading">
              <HorizontalProductScroller
                title="Estampas Populares"
                titleId="popular-prints-heading"
              >
                {prints.map((estampa) => (
                  <Box key={estampa.id} sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                    <PrintCard {...estampa} />
                  </Box>
                ))}
                <Box sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                  <ViewMoreCard text="Estampados" link="/prints" />
                </Box>
              </HorizontalProductScroller>
            </Box>
            {/* **** FIN DE LA SOLUCIÓN **** */}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;