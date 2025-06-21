// src/pages/PrintsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Alert, Skeleton, Paper, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PrintCard from '../components/ui/PrintCard';
import designApi from '../api/designApi';
import categoryApi, { type DesignCategory } from '../api/categoryApi'; // 1. Importar la API de categorías
import type { Print } from '../models/Print';
import { AndFilter, TextPropertyFilter } from '../patterns/composite/Filter';

const PrintsPage = () => {
  const [allPrints, setAllPrints] = useState<Print[]>([]);
  const [categories, setCategories] = useState<DesignCategory[]>([]); // 2. Nuevo estado para guardar las categorías
  
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 3. Nuevo estado para el filtro de categoría
  const [sortOption, setSortOption] = useState('default');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. useEffect actualizado para cargar tanto estampas como categorías
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [printsData, categoriesData] = await Promise.all([
          designApi.getAll(),
          categoryApi.getAll()
        ]);
        setAllPrints(printsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Error al cargar los datos del catálogo.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 5. useMemo actualizado para usar el filtro compuesto con múltiples criterios
  const processedPrints = useMemo(() => {
    const compositeFilter = new AndFilter<Print>();

    if (searchQuery) {
      compositeFilter.add(new TextPropertyFilter('title', searchQuery));
    }

    if (selectedCategory !== 'all') {
      compositeFilter.add(new TextPropertyFilter('category', selectedCategory));
    }

    const filtered = compositeFilter.apply(allPrints);

    const sorted = [...filtered];
    switch (sortOption) {
      case 'author-asc':
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [allPrints, searchQuery, selectedCategory, sortOption]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };
  
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
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
        
        {/* --- 6. NUEVO FILTRO DE CATEGORÍA EN LA UI --- */}
        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel>Categoría</InputLabel>
          <Select label="Categoría" value={selectedCategory} onChange={handleCategoryFilterChange}>
            <MenuItem value="all">Todas</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select label="Ordenar por" value={sortOption} onChange={handleSortChange}>
            <MenuItem value="default">Por Defecto</MenuItem>
            <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
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