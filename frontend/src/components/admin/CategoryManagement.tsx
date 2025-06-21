import { useState, useEffect, useMemo } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab, Tooltip,
    Stack, ToggleButtonGroup, ToggleButton, Chip, Popover, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import { useConfirm } from '../../context/ConfirmProvider';
import {
    AndFilter, OrFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../../patterns/composite/Filter';

type Category = any;

interface DynamicFilter {
    id: string;
    field: | 'name_includes' | 'description_includes' | 'active_equals' | '';
    value: any;
    label: string;
}

const EMPTY_CATEGORY = {
    name: '',
    description: '',
    active: true,
};

export const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);
    const confirm = useConfirm();

    // --- Sistema de filtros ---
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilter, setCurrentFilter] = useState<Omit<DynamicFilter, 'id' | 'label'>>({ field: '', value: '' });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const fetchData = async () => {
        try { setLoading(true); const data = await adminApi.getAllCategories(); setCategories(data); } 
        catch (err) { setError('No se pudo cargar la lista de categorías.'); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredCategories = useMemo(() => {
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        if (activeFilters.length === 0) return categories;

        const filterComposite = logicalOperator === 'AND' ? new AndFilter<Category>() : new OrFilter<Category>();
        
        activeFilters.forEach(filter => {
            switch (filter.field) {
                case 'name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('name', filter.value));
                    break;
                case 'description_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('description', filter.value));
                    break;
                case 'active_equals':
                    filterComposite.add(new ExactPropertyFilter('active', filter.value));
                    break;
            }
        });

        return filterComposite.apply(categories);
    }, [categories, dynamicFilters, logicalOperator]);

    const handleOpenDialog = (category?: any) => {
        setEditingCategory(category ? { ...category } : { ...EMPTY_CATEGORY });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
    };

    const handleSave = async () => {
        if (!editingCategory) return;
        try {
            if (editingCategory.id) {
                const { id, ...categoryData } = editingCategory;
                const updatedCategory = await adminApi.updateCategory(id, categoryData);
                setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
                showNotification('Categoría actualizada.', 'success');
            } else {
                const newCategory = await adminApi.createCategory(editingCategory);
                setCategories([...categories, newCategory]);
                showNotification('Categoría creada.', 'success');
            }
        } catch (err) {
            showNotification('Error al guardar la categoría.', 'error');
        } finally {
            handleCloseDialog();
        }
    };

    const handleActivationToggle = async (category: any) => {
        const newActiveState = !category.active;
        try {
            if (newActiveState === false) {
                await adminApi.deactivateCategory(category.id);
            } else {
                await adminApi.updateCategory(category.id, { active: true });
            }
            const updatedCategories = categories.map(c => c.id === category.id ? { ...c, active: newActiveState } : c);
            setCategories(updatedCategories);
            showNotification(`Categoría ${newActiveState ? 'activada' : 'desactivada'}.`, 'info');
        } catch (err) {
            showNotification('Error al cambiar el estado.', 'error');
        }
    }

    const handleArchive = async (categoryId: number, categoryName: string) => {
        const isConfirmed = await confirm({
            title: 'Confirmar Archivado de Categoría',
            message: `¿Seguro que quieres archivar la categoría "${categoryName}"?`
        });
        if (isConfirmed) {
            try { await adminApi.archiveCategory(categoryId); setCategories(prev => prev.filter(c => c.id !== categoryId)); showNotification('Categoría archivada.', 'success'); } 
            catch (err) { showNotification('Error al archivar.', 'error'); }
        }
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));

    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('cat-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        let valueLabel = currentFilter.value;
        if (typeof currentFilter.value === 'boolean') {
            valueLabel = currentFilter.value ? 'Activo' : 'Inactivo';
        }
        
        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;
        if (currentFilter.field === 'active_equals') {
            return (
                <FormControl fullWidth size="small"><InputLabel>Estado</InputLabel>
                    <Select autoFocus label="Estado" value={currentFilter.value === '' ? '' : currentFilter.value} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value as boolean })}>
                        <MenuItem value={true as any}>Activo</MenuItem><MenuItem value={false as any}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        return <TextField autoFocus fullWidth size="small" label="Valor a buscar" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })} />;
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'cat-filter-popover' : undefined;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">Gestión de Categorías ({filteredCategories.length})</Typography>
                <Fab color="primary" aria-label="add" size="small" onClick={() => handleOpenDialog()}>
                    <AddIcon />
                </Fab>
            </Box>

            <Paper sx={{ p: 1.5, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{mr: 2}}>Filtros</Typography>
                    <ToggleButtonGroup size="small" color="primary" value={logicalOperator} exclusive onChange={(_, newValue) => { if (newValue) setLogicalOperator(newValue); }}>
                        <ToggleButton value="AND">Y</ToggleButton><ToggleButton value="OR">O</ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ flex: 1, ml: 2, overflowX: 'auto' }}><Stack direction="row" spacing={1}>
                        {dynamicFilters.map((filter) => (<Chip key={filter.id} label={filter.label} onDelete={() => removeFilter(filter.id)} />))}
                    </Stack></Box>
                    <Button variant="outlined" size="small" sx={{ ml: 1, flexShrink: 0 }} startIcon={<FilterListIcon />} onClick={handleAddFilterClick} aria-describedby={popoverId}>Añadir</Button>
                </Stack>
            </Paper>

            <Popover id={popoverId} open={openPopover} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Stack spacing={2} sx={{ p: 2, width: 350 }}>
                    <Typography variant="subtitle1">Añadir condición de filtro</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Condición</InputLabel>
                        <Select id="cat-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="name_includes">Nombre contiene</MenuItem>
                            <MenuItem value="description_includes">Descripción contiene</MenuItem>
                            <MenuItem value="active_equals">Estado es</MenuItem>
                        </Select>
                    </FormControl>
                    {renderFilterValueInput()}
                    <Button variant="contained" onClick={handleApplyFilter} disabled={!currentFilter.field || currentFilter.value === ''}>Aplicar Filtro</Button>
                </Stack>
            </Popover>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell><TableCell>Nombre</TableCell><TableCell>Descripción</TableCell>
                            <TableCell>Activo</TableCell><TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCategories.map((category) => (
                            <TableRow key={category.id} sx={{ backgroundColor: !category.active ? '#fafafa' : 'inherit' }}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Switch checked={category.active} onChange={() => handleActivationToggle(category)} />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"><IconButton onClick={() => handleOpenDialog(category)}><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Archivar"><IconButton onClick={() => handleArchive(category.id, category.name)} color="warning"><DeleteOutlinedIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingCategory?.id ? 'Editar' : 'Crear'} Categoría</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre de la Categoría" type="text" fullWidth variant="standard" value={editingCategory?.name || ''} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingCategory?.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};