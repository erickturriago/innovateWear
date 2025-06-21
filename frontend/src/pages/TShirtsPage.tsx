// src/pages/TShirtsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Alert, Skeleton, Paper, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import ProductCard from '../components/ProductCard';
import customDesignApi from '../api/customDesignApi';
import type { TShirt } from '../models/TShirt';
import { AndFilter, TextPropertyFilter } from '../patterns/composite/Filter'; // Importamos el patrón

const TShirtsPage = () => {
  const [allTshirts, setAllTshirts] = useState<TShirt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTshirts = async () => {
      try {
        setLoading(true);
        const tshirtsData = await customDesignApi.getPublicDesigns();
        setAllTshirts(tshirtsData);
      } catch (err) {
        setError('Error al cargar el catálogo de camisetas.');
      } finally {
        setLoading(false);
      }
    };
    loadTshirts();
  }, []);

  const processedTshirts = useMemo(() => {
    // --- LÓGICA DE FILTRADO CON COMPOSITE ---
    const filter = new AndFilter<TShirt>();
    if (searchQuery) {
      filter.add(new TextPropertyFilter<TShirt>('title', searchQuery));
    }
    const filtered = filter.apply(allTshirts);
    // --- FIN DEL FILTRADO ---

    const sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [allTshirts, searchQuery, sortOption]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  const renderSkeletons = (count = 8) => (
    <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}>
      {Array.from(new Array(count)).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="rectangular" sx={{ borderRadius: 3, aspectRatio: '1 / 1.15' }} />
          <Skeleton /><Skeleton width="60%" />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Catálogo de Camisetas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explora nuestra colección completa de camisetas. Diseños únicos para todos los gustos.
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre..." variant="outlined" size="small"
          sx={{ flexGrow: 1, minWidth: '200px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select label="Ordenar por" value={sortOption} onChange={handleSortChange}>
            <MenuItem value="default">Por Defecto</MenuItem>
            <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
            <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        renderSkeletons()
      ) : (
        <Box>
          <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}>
            {processedTshirts.map((camiseta) => (
              <ProductCard key={camiseta.id} {...camiseta} />
            ))}
          </Box>
          {processedTshirts.length === 0 && !loading && (
            <Typography sx={{ mt: 4, textAlign: 'center' }}>
              No se encontraron camisetas que coincidan con tus criterios.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TShirtsPage;