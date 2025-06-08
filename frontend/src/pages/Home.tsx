// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Box, Alert, Skeleton } from '@mui/material'; // Ya no necesitamos Typography aquí
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import PrintCard from '../components/PrintCard';
import ViewMoreCard from '../components/ViewMoreCard';
import HorizontalProductScroller from '../components/HorizontalProductScroller'; // <-- IMPORTAMOS EL NUEVO COMPONENTE
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

  // El esqueleto ahora es para una fila, no una cuadrícula
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
    <Box>
      <HeroCarousel />
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        
        {loading ? (
          <>
            <Box mb={6}>{renderSkeletons()}</Box>
            <Box mb={6}>{renderSkeletons()}</Box>
          </>
        ) : (
          <>
            {/* Sección de Camisetas con el Scroller */}
            <HorizontalProductScroller title="Camisetas populares">
              {tshirts.map((camiseta) => (
                <Box key={camiseta.id} sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                  <ProductCard {...camiseta} />
                </Box>
              ))}
              <Box sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                <ViewMoreCard text="Camisetas" link="/tshirts" />
              </Box>
            </HorizontalProductScroller>

            {/* Sección de Estampas con el Scroller */}
            <HorizontalProductScroller title="Estampas populares">
              {prints.map((estampa) => (
                <Box key={estampa.id} sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                  <PrintCard {...estampa} />
                </Box>
              ))}
              <Box sx={{ width: {xs: '280px', md: '300px'}, flexShrink: 0 }}>
                <ViewMoreCard text="Estampados" link="/prints" />
              </Box>
            </HorizontalProductScroller>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;