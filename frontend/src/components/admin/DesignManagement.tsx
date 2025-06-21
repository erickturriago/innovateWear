import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab, Tooltip,
    FormControl, InputLabel, Select, MenuItem, Stack, ToggleButtonGroup, ToggleButton,
    Chip, Popover
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import { FirebaseFacade } from '../../patterns/facade/FirebaseFacade';
import { useConfirm } from '../../context/ConfirmProvider';
import {
    AndFilter, OrFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../../patterns/composite/Filter';

type Design = any;

interface DynamicFilter {
    id: string;
    field: | 'name_includes' | 'artist_name_includes' | 'category_name_includes' | 'active_equals' | '';
    value: any;
    label: string;
}

const EMPTY_DESIGN = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    artistId: '',
    categoryId: '',
    active: true,
};

export const DesignManagement = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDesign, setEditingDesign] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const artists = users.filter(u => u.role === 'ARTISTA');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [designsData, usersData, categoriesData] = await Promise.all([
                adminApi.getAllDesigns(),
                adminApi.getAllUsers(),
                adminApi.getAllCategories(),
            ]);
            setDesigns(designsData);
            setUsers(usersData);
            setCategories(categoriesData);
        } catch (err) {
            setError('No se pudo cargar los datos para la gestión de estampas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredDesigns = useMemo(() => {
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        if (activeFilters.length === 0) return designs;

        const filterComposite = logicalOperator === 'AND' ? new AndFilter<Design>() : new OrFilter<Design>();
        
        activeFilters.forEach(filter => {
            switch (filter.field) {
                case 'name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('name', filter.value));
                    break;
                case 'artist_name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('artist.name', filter.value));
                    break;
                case 'category_name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('category.name', filter.value));
                    break;
                case 'active_equals':
                    filterComposite.add(new ExactPropertyFilter('active', filter.value));
                    break;
            }
        });

        return filterComposite.apply(designs);
    }, [designs, dynamicFilters, logicalOperator]);

    const handleOpenDialog = (design?: any) => {
        setEditingDesign(design ? { ...design, artistId: design.artist?.id, categoryId: design.category?.id } : { ...EMPTY_DESIGN });
        setImageFile(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => { setIsDialogOpen(false); setEditingDesign(null); setImageFile(null); };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); };

    const handleSave = async () => {
        if (!editingDesign || !editingDesign.artistId || !editingDesign.categoryId) {
            showNotification('Por favor, completa todos los campos requeridos.', 'warning');
            return;
        }
        
        setIsSubmitting(true);
        try {
            let imageUrl = editingDesign.imageUrl;
            if (imageFile) {
                showNotification('Subiendo imagen de estampa...', 'info');
                imageUrl = await FirebaseFacade.uploadFile(imageFile, 'designs/');
            }
            if (!imageUrl) throw new Error("La imagen es requerida.");

            const payload = {
                name: editingDesign.name, description: editingDesign.description, price: editingDesign.price,
                imageUrl, artist: { id: editingDesign.artistId }, category: { id: editingDesign.categoryId },
                active: editingDesign.active
            };
            
            if (editingDesign.id) {
                const updatedDesign = await adminApi.updateDesign(editingDesign.id, payload);
                setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
                showNotification('Estampa actualizada.', 'success');
            } else {
                const newDesign = await adminApi.createDesign(payload);
                setDesigns([...designs, newDesign]);
                showNotification('Estampa creada.', 'success');
            }
        } catch (err) {
            showNotification('Error al guardar la estampa.', 'error');
        } finally {
            setIsSubmitting(false);
            handleCloseDialog();
        }
    };

    const handleActivationToggle = async (design: any) => {
        try {
            const updatedDesign = await adminApi.updateDesign(design.id, { active: !design.active });
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
            showNotification('Estado de activación actualizado.', 'info');
        } catch (err) {
            showNotification('Error al cambiar el estado.', 'error');
        }
    }

    const handleArchive = async (designId: number, designName: string) => {
        const isConfirmed = await confirm({ title: 'Confirmar Archivado de Estampa', message: `¿Seguro que quieres archivar "${designName}"?` });
        if (isConfirmed) {
            try { await adminApi.archiveDesign(designId); setDesigns(prev => prev.filter(d => d.id !== designId)); showNotification('Estampa archivada.', 'success'); } 
            catch (err) { showNotification('Error al archivar.', 'error'); }
        }
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
    
    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('design-filter-select') as HTMLSelectElement;
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
    const popoverId = openPopover ? 'design-filter-popover' : undefined;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">Gestión de Estampas ({filteredDesigns.length})</Typography>
                <Fab color="primary" aria-label="add" size="small" onClick={() => handleOpenDialog()}><AddIcon /></Fab>
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
                        <Select id="design-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="name_includes">Nombre de Estampa contiene</MenuItem>
                            <MenuItem value="artist_name_includes">Nombre de Artista contiene</MenuItem>
                            <MenuItem value="category_name_includes">Categoría contiene</MenuItem>
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
                            <TableCell>ID</TableCell><TableCell>Imagen</TableCell><TableCell>Nombre</TableCell>
                            <TableCell>Artista</TableCell><TableCell>Categoría</TableCell><TableCell>Activo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDesigns.map((design) => (
                            <TableRow key={design.id} sx={{ backgroundColor: !design.active ? '#fafafa' : 'inherit' }}>
                                <TableCell>{design.id}</TableCell>
                                <TableCell><img src={design.imageUrl} alt={design.name} style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: '4px' }} /></TableCell>
                                <TableCell>{design.name}</TableCell>
                                <TableCell>{design.artist?.name || 'N/A'}</TableCell>
                                <TableCell>{design.category?.name || 'N/A'}</TableCell>
                                <TableCell><Switch checked={design.active} onChange={() => handleActivationToggle(design)} /></TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"><IconButton onClick={() => handleOpenDialog(design)}><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Archivar"><IconButton onClick={() => handleArchive(design.id, design.name)} color="warning"><DeleteOutlinedIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingDesign?.id ? 'Editar' : 'Crear'} Estampa</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre de la Estampa" type="text" fullWidth variant="standard" value={editingDesign?.name || ''} onChange={(e) => setEditingDesign({ ...editingDesign, name: e.target.value })} required/>
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingDesign?.description || ''} onChange={(e) => setEditingDesign({ ...editingDesign, description: e.target.value })} />
                    <TextField margin="dense" label="Precio (COP)" type="number" fullWidth variant="standard" value={editingDesign?.price || ''} onChange={(e) => setEditingDesign({ ...editingDesign, price: Number(e.target.value) })} required />
                    <FormControl fullWidth margin="dense" variant="standard" required>
                        <InputLabel>Artista</InputLabel>
                        <Select value={editingDesign?.artistId || ''} label="Artista" onChange={(e) => setEditingDesign({ ...editingDesign, artistId: e.target.value })}>
                            {artists.map(artist => <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" variant="standard" required>
                        <InputLabel>Categoría</InputLabel>
                        <Select value={editingDesign?.categoryId || ''} label="Categoría" onChange={(e) => setEditingDesign({ ...editingDesign, categoryId: e.target.value })}>
                            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <Button variant="outlined" component="label">
                            Seleccionar Imagen
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        {imageFile && <Typography variant="caption" sx={{ml: 2}}>{imageFile.name}</Typography>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24}/> : 'Guardar'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};