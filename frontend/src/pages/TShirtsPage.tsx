import { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Alert, Skeleton, Paper, TextField, FormControl, InputLabel,
    Select, MenuItem, SelectChangeEvent, Stack, ToggleButton, ToggleButtonGroup,
    Button, Popover, Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductCard from '../components/ProductCard';
import customDesignApi from '../api/customDesignApi';
import type { TShirt } from '../models/TShirt';
import {
    AndFilter, OrFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../patterns/composite/Filter';

// La estructura de un filtro dinámico para Camisetas
interface DynamicFilter {
    id: string;
    field: | 'title_includes' | 'category_equals' | '';
    value: any;
    label: string;
}

const TShirtsPage = () => {
    const [allTshirts, setAllTshirts] = useState<TShirt[]>([]);
    const [sortOption, setSortOption] = useState('default');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Sistema de filtros ---
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilter, setCurrentFilter] = useState<Omit<DynamicFilter, 'id' | 'label'>>({ field: '', value: '' });

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
        // 1. Filtrado
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        let filtered: TShirt[];

        if (activeFilters.length > 0) {
            const filterComposite = logicalOperator === 'AND' ? new AndFilter<TShirt>() : new OrFilter<TShirt>();
            activeFilters.forEach(filter => {
                switch (filter.field) {
                    case 'title_includes':
                        filterComposite.add(new StringIncludesPropertyFilter('title', filter.value));
                        break;
                    case 'category_equals':
                        filterComposite.add(new ExactPropertyFilter('category', filter.value));
                        break;
                }
            });
            filtered = filterComposite.apply(allTshirts);
        } else {
            filtered = [...allTshirts];
        }

        // 2. Ordenamiento (sobre los resultados ya filtrados)
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
    }, [allTshirts, dynamicFilters, logicalOperator, sortOption]);

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortOption(event.target.value as string);
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
    
    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('tshirt-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        const valueLabel = currentFilter.value;
        
        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const uniqueCategories = useMemo(() => Array.from(new Set(allTshirts.map(t => t.category))), [allTshirts]);

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;
        if (currentFilter.field === 'category_equals') {
            return (
                <FormControl fullWidth size="small"><InputLabel>Categoría</InputLabel>
                    <Select autoFocus label="Categoría" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}>
                        {uniqueCategories.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        return <TextField autoFocus fullWidth size="small" label="Valor" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })} />;
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

    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'tshirt-filter-popover' : undefined;

    return (
        <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Catálogo de Camisetas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Explora nuestra colección completa de camisetas. Diseños únicos para todos los gustos.
            </Typography>

            <Paper elevation={2} sx={{ p: 1.5, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexWrap="wrap">
                    <Typography variant="h6" sx={{mr: 2}}>Filtros</Typography>
                    <ToggleButtonGroup size="small" color="primary" value={logicalOperator} exclusive onChange={(_, newValue) => { if (newValue) setLogicalOperator(newValue); }}>
                        <ToggleButton value="AND">Y</ToggleButton><ToggleButton value="OR">O</ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ flex: 1, minWidth: '200px', overflowX: 'auto' }}><Stack direction="row" spacing={1}>
                        {dynamicFilters.map((filter) => (<Chip key={filter.id} label={filter.label} onDelete={() => removeFilter(filter.id)} />))}
                    </Stack></Box>
                    <Button variant="outlined" size="small" sx={{ ml: 1, flexShrink: 0 }} startIcon={<FilterListIcon />} onClick={handleAddFilterClick} aria-describedby={popoverId}>Añadir</Button>
                    <FormControl size="small" sx={{ minWidth: '180px' }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select label="Ordenar por" value={sortOption} onChange={handleSortChange}>
                            <MenuItem value="default">Por Defecto</MenuItem>
                            <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
                            <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
                            <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>
            
            <Popover id={popoverId} open={openPopover} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Stack spacing={2} sx={{ p: 2, width: 350 }}>
                    <Typography variant="subtitle1">Añadir condición de filtro</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Condición</InputLabel>
                        <Select id="tshirt-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="title_includes">Título contiene</MenuItem>
                            <MenuItem value="category_equals">Categoría es</MenuItem>
                        </Select>
                    </FormControl>
                    {renderFilterValueInput()}
                    <Button variant="contained" onClick={handleApplyFilter} disabled={!currentFilter.field || currentFilter.value === ''}>Aplicar Filtro</Button>
                </Stack>
            </Popover>

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