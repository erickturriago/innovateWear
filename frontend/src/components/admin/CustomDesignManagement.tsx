// src/components/admin/CustomDesignManagement.tsx
import { useState, useEffect } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Stack, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';

export const CustomDesignManagement = () => {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDesign, setEditingDesign] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllCustomDesigns();
            setDesigns(data);
        } catch (err) {
            setError('No se pudo cargar la lista de diseños personalizados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (design: any) => {
        setEditingDesign({ ...design });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingDesign(null);
    };

    const handleSave = async () => {
        if (!editingDesign) return;
        
        try {
            const { id, name, description, price } = editingDesign;
            const payload = { name, description, price };
            const updatedDesign = await adminApi.updateCustomDesign(id, payload);
            
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
            showNotification('Diseño actualizado con éxito', 'success');
        } catch (err) {
            showNotification('Error al actualizar el diseño', 'error');
        } finally {
            handleCloseDialog();
        }
    };

    const handleToggle = async (design: any, field: 'active' | 'isPublic') => {
        try {
            let updatedDesign;
            // Usamos el endpoint específico para cada acción, que no requiere verificación de propiedad
            if (field === 'active') {
                updatedDesign = await adminApi.toggleCustomDesignActivation(design.id);
            } else {
                updatedDesign = await adminApi.toggleCustomDesignPublicStatus(design.id);
            }
            
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
            showNotification('Estado actualizado', 'info');
        } catch (err) {
            showNotification('Error al cambiar el estado del diseño', 'error');
        }
    }

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Camisetas Diseñadas ({designs.length})</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vista Previa</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Creador</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {designs.map((design) => (
                            <TableRow key={design.id}>
                                <TableCell>{design.id}</TableCell>
                                <TableCell>
                                    <img src={design.previewImageUrl} alt={design.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }} />
                                </TableCell>
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
                                    <IconButton onClick={() => handleEditClick(design)}><EditIcon /></IconButton>
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