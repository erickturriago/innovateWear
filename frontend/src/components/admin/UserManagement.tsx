// src/components/admin/UserManagement.tsx
import { useState, useEffect } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch, 
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';

export const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('No se pudo cargar la lista de usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (user: any) => {
        setEditingUser({ ...user });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingUser(null);
    };

    const handleSave = async () => {
        if (!editingUser) return;
        
        try {
            const { id, ...userData } = editingUser; // No enviar el ID en el cuerpo
            const updatedUser = await adminApi.updateUser(id, userData);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            showNotification('Usuario actualizado con éxito', 'success');
        } catch (err) {
            showNotification('Error al actualizar el usuario', 'error');
        } finally {
            handleCloseDialog();
        }
    };

    const handleActivationToggle = async (user: any) => {
        try {
            const updatedUser = await adminApi.updateUser(user.id, { active: !user.active });
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            showNotification(`Usuario ${updatedUser.active ? 'activado' : 'desactivado'}`, 'info');
        } catch (err) {
            showNotification('Error al cambiar el estado del usuario', 'error');
        }
    }

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Usuarios ({users.length})</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Switch checked={user.active} onChange={() => handleActivationToggle(user)} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditClick(user)}><EditIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nombre" type="text" fullWidth variant="standard" value={editingUser?.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                    <TextField margin="dense" label="Email" type="email" fullWidth variant="standard" value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel>Rol</InputLabel>
                        <Select value={editingUser?.role || ''} label="Rol" onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                            <MenuItem value="CLIENTE">CLIENTE</MenuItem>
                            <MenuItem value="ARTISTA">ARTISTA</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};