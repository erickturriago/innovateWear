// src/pages/PrintsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Alert, Skeleton, Paper, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PrintCard from '../components/ui/PrintCard'; // Usamos la versión más completa de PrintCard
import designApi from '../api/designApi';
import type { Print } from '../models/Print';

const PrintsPage = () => {
  const [allPrints, setAllPrints] = useState<Print[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrints = async () => {
      try {
        setLoading(true);
        const printsData = await designApi.getAll();
        // --- SOLUCIÓN ---
        // Simplemente asignamos los datos recibidos de la API, sin duplicarlos.
        setAllPrints(printsData);
      } catch (err) {
        setError('Error al cargar el catálogo de estampas.');
      } finally {
        setLoading(false);
      }
    };
    loadPrints();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  const processedPrints = useMemo(() => {
    let filtered = allPrints.filter(print =>
      print.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered];

    switch (sortOption) {
      case 'likes-desc':
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      case 'author-asc':
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      default:
        // Por defecto, se mantiene el orden de la API
        break;
    }

    return sorted;
  }, [allPrints, searchQuery, sortOption]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  const renderSkeletons = (count = 8) => (
    <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}>
      {Array.from(new Array(count)).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="rectangular" sx={{ borderRadius: 3, aspectRatio: '1 / 1' }} />
          <Skeleton /><Skeleton width="60%" />
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Galería de Estampas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Encuentra la estampa perfecta para tu próxima creación. Arte original de nuestra comunidad.
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
            <MenuItem value="likes-desc">Más populares</MenuItem>
            <MenuItem value="author-asc">Artista: A-Z</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      
      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        renderSkeletons()
      ) : (
        <Box>
          <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}>
            {processedPrints.map((estampa) => (
              // --- SOLUCIÓN ---
              // Usamos una 'key' única y estable, que es el ID de la estampa.
              <PrintCard key={estampa.id} {...estampa} />
            ))}
          </Box>
          {processedPrints.length === 0 && !loading && (
              <Typography sx={{ mt: 4, textAlign: 'center' }}>
                No se encontraron estampas que coincidan con tus criterios.
              </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PrintsPage;