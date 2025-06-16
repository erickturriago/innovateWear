// src/components/admin/CategoryManagement.tsx
import { useState, useEffect } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';

const EMPTY_CATEGORY = {
    name: '',
    description: '',
    active: true,
};

export const CategoryManagement = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError('No se pudo cargar la lista de categorías.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            if (editingCategory.id) { // Editando
                const { id, ...categoryData } = editingCategory;
                const updatedCategory = await adminApi.updateCategory(id, categoryData);
                setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
                showNotification('Categoría actualizada con éxito', 'success');
            } else { // Creando
                const newCategory = await adminApi.createCategory(editingCategory);
                setCategories([...categories, newCategory]);
                showNotification('Categoría creada con éxito', 'success');
            }
        } catch (err) {
            showNotification('Error al guardar la categoría', 'error');
        } finally {
            handleCloseDialog();
        }
    };

    const handleActivationToggle = async (category: any) => {
        try {
            const updatedCategory = await adminApi.updateCategory(category.id, { active: !category.active });
            setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
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
                <Typography variant="h5" component="h2">Gestión de Categorías ({categories.length})</Typography>
                <Fab color="primary" aria-label="add" size="small" onClick={() => handleOpenDialog()}>
                    <AddIcon />
                </Fab>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Switch checked={category.active} onChange={() => handleActivationToggle(category)} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(category)}><EditIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingCategory?.id ? 'Editar' : 'Crear'} Categoría</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre de la Categoría" type="text" fullWidth variant="standard" value={editingCategory?.name || ''} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
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