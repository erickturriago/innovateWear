import { useState, useEffect, useMemo } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Tooltip, Dialog, DialogActions, Button, DialogContent, TextField, 
    Stack, FormControlLabel, DialogTitle, ToggleButtonGroup, ToggleButton,
    Chip, Popover, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import { useConfirm } from '../../context/ConfirmProvider';
import {
    AndFilter, OrFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../../patterns/composite/Filter';

type Design = any;

interface DynamicFilter {
    id: string;
    field: | 'name_includes' | 'creator_includes' | 'status_equals' | 'visibility_equals' | '';
    value: any;
    label: string;
}

export const CustomDesignManagement = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
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
    const [editingDesign, setEditingDesign] = useState<Design>(null);

    const fetchData = async () => {
        try { setLoading(true); const data = await adminApi.getAllCustomDesigns(); setDesigns(data); } 
        catch (err) { setError('No se pudo cargar la lista de diseños personalizados.'); } 
        finally { setLoading(false); }
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
                case 'creator_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('creator.name', filter.value));
                    break;
                case 'status_equals':
                    filterComposite.add(new ExactPropertyFilter('active', filter.value));
                    break;
                case 'visibility_equals':
                    filterComposite.add(new ExactPropertyFilter('isPublic', filter.value));
                    break;
            }
        });

        return filterComposite.apply(designs);
    }, [designs, dynamicFilters, logicalOperator]);

    const handleEditClick = (design: any) => { setEditingDesign({ ...design }); setIsDialogOpen(true); };
    const handleCloseDialog = () => { setIsDialogOpen(false); setEditingDesign(null); };

    const handleSave = async () => {
        if (!editingDesign) return;
        try {
            // --- CORRECCIÓN AQUÍ ---
            // Se incluyen 'active' y 'isPublic' para que no se pierdan al actualizar.
            const { id, name, description, price, active, isPublic } = editingDesign;
            const payload = { name, description, price, active, isPublic }; 
            
            const updatedDesign = await adminApi.updateCustomDesign(id, payload);
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
            showNotification('Diseño actualizado.', 'success');
        } catch (err) {
            showNotification('Error al actualizar.', 'error');
        } finally {
            handleCloseDialog();
        }
    };
    
    const handleToggle = async (design: any, field: 'active' | 'isPublic') => {
        try {
            const payload = { [field]: !design[field] };
            const updatedDesign = await adminApi.updateCustomDesign(design.id, payload);
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
            showNotification('Estado actualizado.', 'info');
        } catch (err) {
            showNotification('Error al cambiar estado.', 'error');
        }
    };
    
    const handleArchive = async (designId: number, designName: string) => {
        const isConfirmed = await confirm({ title: 'Confirmar Archivado', message: `¿Seguro que quieres archivar "${designName}"?` });
        if (isConfirmed) {
            try { await adminApi.archiveCustomDesign(designId); setDesigns(prev => prev.filter(d => d.id !== designId)); showNotification('Diseño archivado.', 'success'); } 
            catch (err) { showNotification('Error al archivar.', 'error'); }
        }
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));

    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('cd-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        let valueLabel = currentFilter.value;
        if (typeof currentFilter.value === 'boolean') {
            if (currentFilter.field === 'status_equals') valueLabel = currentFilter.value ? 'Activo' : 'Inactivo';
            if (currentFilter.field === 'visibility_equals') valueLabel = currentFilter.value ? 'Público' : 'Privado';
        }

        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;
        if (currentFilter.field === 'status_equals') {
            return (
                <FormControl fullWidth size="small"><InputLabel>Estado</InputLabel>
                    <Select autoFocus label="Estado" value={currentFilter.value === '' ? '' : currentFilter.value} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value as boolean })}>
                        <MenuItem value={true as any}>Activo</MenuItem><MenuItem value={false as any}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        if (currentFilter.field === 'visibility_equals') {
            return (
                <FormControl fullWidth size="small"><InputLabel>Visibilidad</InputLabel>
                    <Select autoFocus label="Visibilidad" value={currentFilter.value === '' ? '' : currentFilter.value} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value as boolean })}>
                        <MenuItem value={true as any}>Público</MenuItem><MenuItem value={false as any}>Privado</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        return <TextField autoFocus fullWidth size="small" label="Valor" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })} />;
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'cd-filter-popover' : undefined;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Camisetas Diseñadas ({filteredDesigns.length})</Typography>
            
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
                        <Select id="cd-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="name_includes">Nombre diseño contiene</MenuItem>
                            <MenuItem value="creator_includes">Nombre creador contiene</MenuItem>
                            <MenuItem value="status_equals">Estado es</MenuItem>
                            <MenuItem value="visibility_equals">Visibilidad es</MenuItem>
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
                            <TableCell>ID</TableCell><TableCell>Vista Previa</TableCell><TableCell>Nombre</TableCell>
                            <TableCell>Creador</TableCell><TableCell>Precio</TableCell><TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDesigns.map((design) => (
                            <TableRow key={design.id} sx={{ backgroundColor: !design.active ? '#fafafa' : 'inherit' }}>
                                <TableCell>{design.id}</TableCell>
                                <TableCell><img src={design.previewImageUrl} alt={design.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} /></TableCell>
                                <TableCell>{design.name}</TableCell>
                                <TableCell>{design.creator?.name || 'N/A'}</TableCell>
                                <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(design.price)}</TableCell>
                                <TableCell>
                                    <Stack>
                                        <FormControlLabel control={<Switch size="small" checked={design.active} onChange={() => handleToggle(design, 'active')} />} label="Activo" />
                                        <FormControlLabel control={<Switch size="small" checked={design.isPublic} onChange={() => handleToggle(design, 'isPublic')} />} label="Público" />
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"><IconButton onClick={() => handleEditClick(design)}><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Archivar"><IconButton onClick={() => handleArchive(design.id, design.name)} color="warning"><DeleteOutlinedIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Editar Camiseta Diseñada</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre del Producto" type="text" fullWidth variant="standard" value={editingDesign?.name || ''} onChange={(e) => setEditingDesign({ ...editingDesign, name: e.target.value })} />
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingDesign?.description || ''} onChange={(e) => setEditingDesign({ ...editingDesign, description: e.target.value })} />
                    <TextField margin="dense" label="Precio (COP)" type="number" fullWidth variant="standard" value={editingDesign?.price || ''} onChange={(e) => setEditingDesign({ ...editingDesign, price: Number(e.target.value) })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};