import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab, Tooltip,
    Stack, ToggleButton, ToggleButtonGroup, Popover, Chip, FormControl, InputLabel, Select, MenuItem
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

type Product = any;

interface DynamicFilter {
    id: string;
    field: | 'name_includes' | 'color_includes' | 'customizable_equals' | 'active_equals' | '';
    value: any;
    label: string;
}

const EMPTY_PRODUCT = {
    name: '',
    description: '',
    price: 0,
    type: 'Customizable',
    size: 'M',
    color: '',
    material: 'Algodón',
    link: '',
    customizable: true,
    active: true,
};

export const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
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
    const [editingProduct, setEditingProduct] = useState<Product>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchData = async () => {
        try { setLoading(true); const data = await adminApi.getAllProducts(); setProducts(data); } 
        catch (err) { setError('No se pudo cargar la lista de productos base.'); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredProducts = useMemo(() => {
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        if (activeFilters.length === 0) return products;

        const filterComposite = logicalOperator === 'AND' ? new AndFilter<Product>() : new OrFilter<Product>();
        
        activeFilters.forEach(filter => {
            switch (filter.field) {
                case 'name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('name', filter.value));
                    break;
                case 'color_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('color', filter.value));
                    break;
                case 'customizable_equals':
                    filterComposite.add(new ExactPropertyFilter('customizable', filter.value));
                    break;
                case 'active_equals':
                    filterComposite.add(new ExactPropertyFilter('active', filter.value));
                    break;
            }
        });

        return filterComposite.apply(products);
    }, [products, dynamicFilters, logicalOperator]);

    const handleOpenDialog = (product?: any) => {
        setEditingProduct(product ? { ...product } : { ...EMPTY_PRODUCT });
        setImageFile(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        setImageFile(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!editingProduct) return;
        
        setIsSubmitting(true);
        try {
            let imageUrl = editingProduct.link;

            if (imageFile) {
                showNotification('Subiendo imagen...', 'info');
                imageUrl = await FirebaseFacade.uploadFile(imageFile, 'base-products/');
            }
            
            const payload = { ...editingProduct, link: imageUrl };

            if (editingProduct.id) {
                const { id, ...productData } = payload;
                const updatedProduct = await adminApi.updateProduct(id, productData);
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                showNotification('Producto actualizado con éxito', 'success');
            } else {
                const newProduct = await adminApi.createProduct(payload);
                setProducts([...products, newProduct]);
                showNotification('Producto creado con éxito', 'success');
            }
        } catch (err) {
            showNotification('Error al guardar el producto', 'error');
        } finally {
            setIsSubmitting(false);
            handleCloseDialog();
        }
    };

    const handleToggle = async (product: any, field: 'active' | 'customizable') => {
        try {
            const payload = { [field]: !product[field] };
            const updatedProduct = await adminApi.updateProduct(product.id, payload);
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            showNotification('Estado actualizado', 'info');
        } catch (err) {
            showNotification('Error al cambiar el estado', 'error');
        }
    };

    const handleArchive = async (productId: number, productName: string) => {
        const isConfirmed = await confirm({
            title: 'Confirmar Archivado de Producto Base',
            message: `¿Estás seguro de que quieres archivar "${productName}"?`
        });

        if (isConfirmed) {
            try { await adminApi.archiveProduct(productId); setProducts(prev => prev.filter(p => p.id !== productId)); showNotification('Producto base archivado.', 'success'); } 
            catch (err) { showNotification('Error al archivar.', 'error'); }
        }
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));

    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('prod-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        let valueLabel = currentFilter.value;
        if (typeof currentFilter.value === 'boolean') {
            valueLabel = currentFilter.value ? 'Sí' : 'No';
        }
        
        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;

        if (currentFilter.field.includes('equals')) {
             return (
                <FormControl fullWidth size="small"><InputLabel>Valor</InputLabel>
                    <Select autoFocus label="Valor" value={currentFilter.value === '' ? '' : currentFilter.value} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value as boolean })}>
                        <MenuItem value={true as any}>Sí</MenuItem>
                        <MenuItem value={false as any}>No</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        return <TextField autoFocus fullWidth size="small" label="Valor" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })} />;
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'prod-filter-popover' : undefined;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">Gestión de Camisetas Base ({filteredProducts.length})</Typography>
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
                        <Select id="prod-filter-select" value={currentFilter.field} label="Condición" onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}>
                            <MenuItem value="name_includes">Nombre contiene</MenuItem>
                            <MenuItem value="color_includes">Color contiene</MenuItem>
                            <MenuItem value="customizable_equals">Es Personalizable</MenuItem>
                            <MenuItem value="active_equals">Está Activo</MenuItem>
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
                            <TableCell>Color</TableCell><TableCell>Precio</TableCell><TableCell>Personalizable</TableCell>
                            <TableCell>Activo</TableCell><TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} sx={{ backgroundColor: !product.active ? '#fafafa' : 'inherit' }}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell><img src={product.link} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} /></TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.color}</TableCell>
                                <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}</TableCell>
                                <TableCell><Switch checked={product.customizable} onChange={() => handleToggle(product, 'customizable')} /></TableCell>
                                <TableCell><Switch checked={product.active} onChange={() => handleToggle(product, 'active')} /></TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"><IconButton onClick={() => handleOpenDialog(product)}><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Archivar"><IconButton onClick={() => handleArchive(product.id, product.name)} color="warning"><DeleteOutlinedIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingProduct?.id ? 'Editar' : 'Crear'} Camiseta Base</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre" type="text" fullWidth variant="standard" value={editingProduct?.name || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingProduct?.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                    <TextField margin="dense" label="Precio (COP)" type="number" fullWidth variant="standard" value={editingProduct?.price || 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} required />
                    <TextField margin="dense" label="Tipo (ej. Customizable)" type="text" fullWidth variant="standard" value={editingProduct?.type || ''} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })} required />
                    <TextField margin="dense" label="Color (ej. blanco)" type="text" fullWidth variant="standard" value={editingProduct?.color || ''} onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })} required />
                    <TextField margin="dense" label="Talla (ej. M)" type="text" fullWidth variant="standard" value={editingProduct?.size || ''} onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })} required />
                    <TextField margin="dense" label="Material" type="text" fullWidth variant="standard" value={editingProduct?.material || ''} onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })} />
                    
                    <Box mt={2}>
                        <Button variant="outlined" component="label">
                            Seleccionar Imagen
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        {imageFile && <Typography variant="caption" sx={{ml: 2}}>{imageFile.name}</Typography>}
                        {!imageFile && editingProduct?.link && <Typography variant="caption" sx={{ml: 2}}>Imagen actual guardada.</Typography>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24}/> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};