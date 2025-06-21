import { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Alert, Skeleton, Paper, TextField, FormControl, InputLabel,
    Select, MenuItem, SelectChangeEvent, Stack, ToggleButton, ToggleButtonGroup,
    Button, Popover, Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintCard from '../components/ui/PrintCard';
import designApi from '../api/designApi';
import categoryApi, { type DesignCategory } from '../api/categoryApi';
import type { Print } from '../models/Print';
import {
    AndFilter, OrFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../patterns/composite/Filter';

// La estructura de un filtro dinámico para Estampas
interface DynamicFilter {
    id: string;
    field: | 'title_includes' | 'author_includes' | 'category_equals' | '';
    value: any;
    label: string;
}

const PrintsPage = () => {
    const [allPrints, setAllPrints] = useState<Print[]>([]);
    const [categories, setCategories] = useState<DesignCategory[]>([]);
    const [sortOption, setSortOption] = useState('default');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Sistema de filtros ---
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilter, setCurrentFilter] = useState<Omit<DynamicFilter, 'id' | 'label'>>({ field: '', value: '' });

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

    const processedPrints = useMemo(() => {
        // 1. Filtrado
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        let filtered: Print[];

        if (activeFilters.length > 0) {
            const filterComposite = logicalOperator === 'AND' ? new AndFilter<Print>() : new OrFilter<Print>();
            activeFilters.forEach(filter => {
                switch (filter.field) {
                    case 'title_includes':
                        filterComposite.add(new StringIncludesPropertyFilter('title', filter.value));
                        break;
                    case 'author_includes':
                        filterComposite.add(new StringIncludesPropertyFilter('author', filter.value));
                        break;
                    case 'category_equals':
                        filterComposite.add(new ExactPropertyFilter('category', filter.value));
                        break;
                }
            });
            filtered = filterComposite.apply(allPrints);
        } else {
            filtered = [...allPrints];
        }

        // 2. Ordenamiento (sobre los resultados ya filtrados)
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
    }, [allPrints, dynamicFilters, logicalOperator, sortOption]);

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortOption(event.target.value as string);
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
    
    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('print-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        const valueLabel = currentFilter.value;
        
        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;
        if (currentFilter.field === 'category_equals') {
            return (
                <FormControl fullWidth size="small"><InputLabel>Categoría</InputLabel>
                    <Select autoFocus label="Categoría" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}>
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
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
                    <Skeleton variant="rectangular" sx={{ borderRadius: 3, aspectRatio: '1 / 1' }} />
                    <Skeleton /><Skeleton width="60%" />
                </Box>
            ))}
        </Box>
    );
    
    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'print-filter-popover' : undefined;

    return (
        <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Galería de Estampas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Encuentra la estampa perfecta para tu próxima creación. Arte original de nuestra comunidad.
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
                            <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
                            <MenuItem value="author-asc">Artista: A-Z</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            <Popover id={popoverId} open={openPopover} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Stack spacing={2} sx={{ p: 2, width: 350 }}>
                    <Typography variant="subtitle1">Añadir condición de filtro</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Condición</InputLabel>
                        <Select id="print-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="title_includes">Título contiene</MenuItem>
                            <MenuItem value="author_includes">Artista contiene</MenuItem>
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