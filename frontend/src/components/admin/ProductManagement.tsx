// src/components/admin/ProductManagement.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
// Importamos el facade de Firebase para subir la imagen
import { FirebaseFacade } from '../../patterns/facade/FirebaseFacade';

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
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    // --- NUEVO ESTADO PARA EL ARCHIVO DE IMAGEN ---
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError('No se pudo cargar la lista de productos base.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (product?: any) => {
        setEditingProduct(product ? { ...product } : { ...EMPTY_PRODUCT });
        setImageFile(null); // Limpiar el archivo anterior
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
            let imageUrl = editingProduct.link; // Usa la URL existente por defecto

            // Si se seleccionó un nuevo archivo, lo subimos
            if (imageFile) {
                showNotification('Subiendo imagen...', 'info');
                imageUrl = await FirebaseFacade.uploadFile(imageFile, 'base-products/');
            }
            
            const payload = { ...editingProduct, link: imageUrl };

            if (editingProduct.id) { // Editando
                const { id, ...productData } = payload;
                const updatedProduct = await adminApi.updateProduct(id, productData);
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                showNotification('Producto actualizado con éxito', 'success');
            } else { // Creando
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
    }

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">Gestión de Camisetas Base ({products.length})</Typography>
                <Fab color="primary" aria-label="add" size="small" onClick={() => handleOpenDialog()}>
                    <AddIcon />
                </Fab>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            {/* --- NUEVA COLUMNA DE IMAGEN --- */}
                            <TableCell>Vista Previa</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Personalizable</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                {/* --- CELDA CON LA IMAGEN --- */}
                                <TableCell>
                                    <img src={product.link} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.color}</TableCell>
                                <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.price)}</TableCell>
                                <TableCell>
                                    <Switch checked={product.customizable} onChange={() => handleToggle(product, 'customizable')} />
                                </TableCell>
                                <TableCell>
                                    <Switch checked={product.active} onChange={() => handleToggle(product, 'active')} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(product)}><EditIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingProduct?.id ? 'Editar' : 'Crear'} Camiseta Base</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre" type="text" fullWidth variant="standard" value={editingProduct?.name || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingProduct?.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                    <TextField margin="dense" label="Precio (COP)" type="number" fullWidth variant="standard" value={editingProduct?.price || ''} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
                    <TextField margin="dense" label="Tipo (ej. Hoodie)" type="text" fullWidth variant="standard" value={editingProduct?.type || ''} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })} />
                    <TextField margin="dense" label="Color (ej. blanco)" type="text" fullWidth variant="standard" value={editingProduct?.color || ''} onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })} />
                    
                    {/* --- NUEVO BOTÓN PARA SUBIR IMAGEN --- */}
                    <Box mt={2}>
                        <Button variant="outlined" component="label">
                            Seleccionar Imagen
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        {imageFile && <Typography variant="caption" sx={{ml: 2}}>{imageFile.name}</Typography>}
                        {!imageFile && editingProduct?.link && <Typography variant="caption" sx={{ml: 2}}>Imagen actual: {editingProduct.link.substring(editingProduct.link.lastIndexOf('%2F') + 3, editingProduct.link.indexOf('?'))}</Typography>}
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