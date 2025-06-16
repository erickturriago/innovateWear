// src/components/admin/DesignManagement.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Fab,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import { FirebaseFacade } from '../../patterns/facade/FirebaseFacade';

const EMPTY_DESIGN = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    artistId: '', // Guardaremos solo el ID en el estado del formulario
    categoryId: '', // Guardaremos solo el ID en el estado del formulario
    active: true,
};

export const DesignManagement = () => {
    const [designs, setDesigns] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (design?: any) => {
        setEditingDesign(design ? { ...design, artistId: design.artist?.id, categoryId: design.category?.id } : { ...EMPTY_DESIGN });
        setImageFile(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingDesign(null);
        setImageFile(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
    };

    const handleSave = async () => {
        if (!editingDesign) return;
        
        setIsSubmitting(true);
        try {
            let imageUrl = editingDesign.imageUrl;
            if (imageFile) {
                showNotification('Subiendo imagen de estampa...', 'info');
                imageUrl = await FirebaseFacade.uploadFile(imageFile, 'designs/');
            }

            const payload = {
                ...editingDesign,
                imageUrl,
                artist: { id: editingDesign.artistId },
                category: { id: editingDesign.categoryId },
            };
            // Eliminar IDs que no van en el payload
            delete payload.artistId;
            delete payload.categoryId;

            if (editingDesign.id) { // Editando
                const updatedDesign = await adminApi.updateDesign(editingDesign.id, payload);
                setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
                showNotification('Estampa actualizada con éxito', 'success');
            } else { // Creando
                const newDesign = await adminApi.createDesign(payload);
                setDesigns([...designs, newDesign]);
                showNotification('Estampa creada con éxito', 'success');
            }
        } catch (err) {
            showNotification('Error al guardar la estampa', 'error');
        } finally {
            setIsSubmitting(false);
            handleCloseDialog();
        }
    };

    const handleActivationToggle = async (design: any) => {
        try {
            const updatedDesign = await adminApi.updateDesign(design.id, { active: !design.active });
            setDesigns(designs.map(d => d.id === updatedDesign.id ? updatedDesign : d));
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
                <Typography variant="h5" component="h2">Gestión de Estampas ({designs.length})</Typography>
                <Fab color="primary" aria-label="add" size="small" onClick={() => handleOpenDialog()}>
                    <AddIcon />
                </Fab>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Imagen</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Artista</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {designs.map((design) => (
                            <TableRow key={design.id}>
                                <TableCell>{design.id}</TableCell>
                                <TableCell>
                                    <img src={design.imageUrl} alt={design.name} style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: '4px' }} />
                                </TableCell>
                                <TableCell>{design.name}</TableCell>
                                <TableCell>{design.artist?.name || 'N/A'}</TableCell>
                                <TableCell>{design.category?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Switch checked={design.active} onChange={() => handleActivationToggle(design)} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(design)}><EditIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingDesign?.id ? 'Editar' : 'Crear'} Estampa</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre de la Estampa" type="text" fullWidth variant="standard" value={editingDesign?.name || ''} onChange={(e) => setEditingDesign({ ...editingDesign, name: e.target.value })} />
                    <TextField margin="dense" label="Descripción" type="text" fullWidth multiline rows={2} variant="standard" value={editingDesign?.description || ''} onChange={(e) => setEditingDesign({ ...editingDesign, description: e.target.value })} />
                    <TextField margin="dense" label="Precio (COP)" type="number" fullWidth variant="standard" value={editingDesign?.price || ''} onChange={(e) => setEditingDesign({ ...editingDesign, price: Number(e.target.value) })} />
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel>Artista</InputLabel>
                        <Select value={editingDesign?.artistId || ''} label="Artista" onChange={(e) => setEditingDesign({ ...editingDesign, artistId: e.target.value })}>
                            {artists.map(artist => <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" variant="standard">
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
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24}/> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};