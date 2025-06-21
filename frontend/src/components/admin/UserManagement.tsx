import { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Switch,
    Tooltip, Dialog, DialogActions, Button, DialogContent, TextField,
    FormControl, InputLabel, Select, MenuItem, DialogTitle, FormHelperText,
    ToggleButtonGroup, ToggleButton, Stack, Divider, Popover, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import { useConfirm } from '../../context/ConfirmProvider';
import {
    AndFilter, OrFilter, NotFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../../patterns/composite/Filter';

type User = any;

interface DynamicFilter {
    id: string;
    field: | 'name_includes' | 'role_equals' | 'role_not_equals' | 'status_equals' | '';
    value: any;
    label: string; // Etiqueta para mostrar en el Chip
}

const validateEmail = (email: string) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);
    const confirm = useConfirm();

    // --- Sistema de filtros ---
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
    
    // --- State para el Popover de añadir filtro ---
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilter, setCurrentFilter] = useState<Omit<DynamicFilter, 'id' | 'label'>>({ field: '', value: '' });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formErrors, setFormErrors] = useState({ name: '', email: '', role: '' });

    const fetchData = async () => {
        try { setLoading(true); const data = await adminApi.getAllUsers(); setUsers(data); } 
        catch (err) { setError('No se pudo cargar la lista de usuarios.'); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);
    
    const filteredUsers = useMemo(() => {
        if (dynamicFilters.length === 0) return users;

        const filterComposite = logicalOperator === 'AND' ? new AndFilter<User>() : new OrFilter<User>();

        dynamicFilters.forEach(filter => {
            switch (filter.field) {
                case 'name_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('name', filter.value));
                    break;
                case 'role_equals':
                    filterComposite.add(new ExactPropertyFilter('role', filter.value));
                    break;
                case 'role_not_equals':
                    filterComposite.add(new NotFilter(new ExactPropertyFilter('role', filter.value)));
                    break;
                case 'status_equals':
                    filterComposite.add(new ExactPropertyFilter('active', filter.value));
                    break;
            }
        });

        return filterComposite.apply(users);
    }, [users, dynamicFilters, logicalOperator]);

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCurrentFilter({ field: '', value: '' }); // Resetear al cerrar
    };

    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;

        const fieldSelect = document.getElementById('filter-field-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        let valueLabel = currentFilter.value;
        if (typeof currentFilter.value === 'boolean') {
            valueLabel = currentFilter.value ? 'Activo' : 'Inactivo';
        }

        const newFilter: DynamicFilter = {
            id: crypto.randomUUID(),
            ...currentFilter,
            label: `${fieldLabel}: "${valueLabel}"`
        };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const removeFilter = (id: string) => {
        setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
    };
    
    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;

        if (currentFilter.field.startsWith('name')) {
            return <TextField autoFocus fullWidth size="small" label="Texto a buscar" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({...currentFilter, value: e.target.value })} />;
        }
        if (currentFilter.field.startsWith('role')) {
            return (
                <FormControl fullWidth size="small">
                    <InputLabel>Rol</InputLabel>
                    <Select autoFocus label="Rol" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({...currentFilter, value: e.target.value })}>
                        <MenuItem value="CLIENTE">CLIENTE</MenuItem>
                        <MenuItem value="ARTISTA">ARTISTA</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        if (currentFilter.field.startsWith('status')) {
            return (
                <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select autoFocus label="Estado" value={currentFilter.value === '' ? '' : currentFilter.value} onChange={(e) => setCurrentFilter({...currentFilter, value: e.target.value as boolean })}>
                        <MenuItem value={true as any}>Activo</MenuItem>
                        <MenuItem value={false as any}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        return null;
    };
    
    // --- Funciones de gestión de usuario (sin cambios) ---
    const handleEditClick = (user: any) => { setEditingUser({ ...user }); setFormErrors({ name: '', email: '', role: '' }); setIsDialogOpen(true); };
    const handleCloseDialog = () => { setIsDialogOpen(false); setEditingUser(null); };
    const validateForm = (user: any) => { const tempErrors = { name: '', email: '', role: '' }; if (!user.name) tempErrors.name = 'El nombre es obligatorio.'; if (!validateEmail(user.email)) tempErrors.email = 'El formato del email es inválido.'; if (!user.role) tempErrors.role = 'Debe seleccionar un rol.'; setFormErrors(tempErrors); return Object.values(tempErrors).every(x => x === ""); };
    const handleSave = async () => { if (!editingUser || !validateForm(editingUser)) { showNotification('Por favor, corrige los errores.', 'warning'); return; } try { const { id, ...userData } = editingUser; const updatedUser = await adminApi.updateUser(id, userData); setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u)); showNotification('Usuario actualizado.', 'success'); } catch (err) { showNotification('Error al actualizar.', 'error'); } finally { handleCloseDialog(); } };
    const handleActivationToggle = async (user: any) => { const newActiveState = !user.active; try { if (newActiveState === false) { await adminApi.deactivateUser(user.id); } else { await adminApi.updateUser(user.id, { active: true }); } setUsers(users.map(u => u.id === user.id ? { ...u, active: newActiveState } : u)); showNotification(`Usuario ${newActiveState ? 'activado' : 'desactivado'}.`, 'info'); } catch (err) { showNotification('Error al cambiar estado.', 'error'); } };
    const handleArchive = async (userId: number, userName: string) => { const isConfirmed = await confirm({ title: 'Confirmar Archivado', message: `¿Seguro que quieres archivar a "${userName}"?` }); if (isConfirmed) { try { await adminApi.archiveUser(userId); setUsers(prevUsers => prevUsers.filter(u => u.id !== userId)); showNotification('Usuario archivado.', 'success'); } catch (err) { showNotification('Error al archivar.', 'error'); } } };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    
    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Usuarios ({filteredUsers.length} / {users.length})</Typography>

            <Paper sx={{ p: 1.5, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{mr: 2}}>Filtros</Typography>
                    <ToggleButtonGroup size="small" color="primary" value={logicalOperator} exclusive onChange={(_, newValue) => { if (newValue) setLogicalOperator(newValue); }}>
                        <ToggleButton value="AND">Y</ToggleButton>
                        <ToggleButton value="OR">O</ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ flex: 1, ml: 2, overflowX: 'auto' }}>
                        <Stack direction="row" spacing={1}>
                            {dynamicFilters.map((filter) => (
                                <Chip key={filter.id} label={filter.label} onDelete={() => removeFilter(filter.id)} />
                            ))}
                        </Stack>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ ml: 1, flexShrink: 0 }} startIcon={<FilterListIcon />} onClick={handleAddFilterClick} aria-describedby={id}>Añadir</Button>
                </Stack>
            </Paper>

            <Popover
                id={id} open={open} anchorEl={anchorEl} onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Stack spacing={2} sx={{ p: 2, width: 350 }}>
                    <Typography variant="subtitle1">Añadir condición de filtro</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Condición</InputLabel>
                        <Select
                            id="filter-field-select"
                            value={currentFilter.field} label="Condición"
                            onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}
                        >
                            <MenuItem value="name_includes">Nombre contiene</MenuItem>
                            <MenuItem value="role_equals">Rol es igual a</MenuItem>
                            <MenuItem value="role_not_equals">Rol NO es igual a</MenuItem>
                            <MenuItem value="status_equals">Estado es igual a</MenuItem>
                        </Select>
                    </FormControl>
                    {renderFilterValueInput()}
                    <Button variant="contained" onClick={handleApplyFilter} disabled={!currentFilter.field || currentFilter.value === ''}>Aplicar Filtro</Button>
                </Stack>
            </Popover>

            <TableContainer component={Paper}>
                {/* Tabla y Dialogo sin cambios */}
                <Table>
                    <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Nombre</TableCell><TableCell>Email</TableCell><TableCell>Rol</TableCell><TableCell>Activo</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} sx={{ backgroundColor: !user.active ? '#fafafa' : 'inherit' }}>
                                <TableCell>{user.id}</TableCell><TableCell>{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.role}</TableCell>
                                <TableCell><Switch checked={user.active} onChange={() => handleActivationToggle(user)} /></TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar"><IconButton onClick={() => handleEditClick(user)}><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Archivar"><IconButton onClick={() => handleArchive(user.id, user.name)} color="warning"><DeleteOutlinedIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {editingUser && (
                <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="Nombre" type="text" fullWidth variant="standard" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required error={!!formErrors.name} helperText={formErrors.name}/>
                        <TextField margin="dense" label="Email" type="email" fullWidth variant="standard" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required error={!!formErrors.email} helperText={formErrors.email} />
                        <FormControl fullWidth margin="dense" variant="standard" required error={!!formErrors.role}>
                            <InputLabel>Rol</InputLabel>
                            <Select value={editingUser.role} label="Rol" onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                <MenuItem value="CLIENTE">CLIENTE</MenuItem>
                                <MenuItem value="ARTISTA">ARTISTA</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                            {!!formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};