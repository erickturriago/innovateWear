import { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Chip,
    Stack, ToggleButtonGroup, ToggleButton, Button, Popover, InputLabel, FormControl, TextField
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';
import {
    AndFilter, OrFilter, NotFilter,
    StringIncludesPropertyFilter, ExactPropertyFilter
} from '../../patterns/composite/Filter';

type Order = any;

// La estructura de un filtro dinámico para Pedidos
interface DynamicFilter {
    id: string;
    field: | 'id_equals' | 'customerName_includes' | 'customerEmail_includes' | 'status_equals' | 'status_not_equals' | '';
    value: any;
    label: string;
}

const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'PENDIENTE': return 'warning';
        case 'PROCESANDO': return 'info';
        case 'COMPLETADO': return 'success';
        case 'CANCELADO': return 'error';
        default: return 'default';
    }
}

const getValidNextStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
        case 'PENDIENTE': return ['PENDIENTE', 'PROCESANDO', 'CANCELADO'];
        case 'PROCESANDO': return ['PROCESANDO', 'COMPLETADO', 'CANCELADO'];
        case 'COMPLETADO': return ['COMPLETADO'];
        case 'CANCELADO': return ['CANCELADO'];
        default: return [];
    }
}

export const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

    // --- Sistema de filtros ---
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentFilter, setCurrentFilter] = useState<Omit<DynamicFilter, 'id' | 'label'>>({ field: '', value: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllOrders();
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (err) {
            setError('No se pudo cargar la lista de pedidos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredOrders = useMemo(() => {
        const activeFilters = dynamicFilters.filter(f => f.field && f.value !== '' && f.value !== null);
        if (activeFilters.length === 0) return orders;

        const filterComposite = logicalOperator === 'AND' ? new AndFilter<Order>() : new OrFilter<Order>();
        
        activeFilters.forEach(filter => {
            switch (filter.field) {
                case 'id_equals':
                    filterComposite.add(new ExactPropertyFilter('id', Number(filter.value)));
                    break;
                case 'customerName_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('customerName', filter.value));
                    break;
                case 'customerEmail_includes':
                    filterComposite.add(new StringIncludesPropertyFilter('customerEmail', filter.value));
                    break;
                case 'status_equals':
                    filterComposite.add(new ExactPropertyFilter('status', filter.value));
                    break;
                case 'status_not_equals':
                    filterComposite.add(new NotFilter(new ExactPropertyFilter('status', filter.value)));
                    break;
            }
        });

        return filterComposite.apply(orders);
    }, [orders, dynamicFilters, logicalOperator]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const updatedOrder = await adminApi.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            showNotification('Estado del pedido actualizado', 'success');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Error al actualizar el estado';
            showNotification(errorMsg, 'error');
        }
    };

    const handleAddFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClosePopover = () => { setAnchorEl(null); setCurrentFilter({ field: '', value: '' }); };
    const removeFilter = (id: string) => setDynamicFilters(dynamicFilters.filter(f => f.id !== id));

    const handleApplyFilter = () => {
        if (!currentFilter.field || currentFilter.value === '') return;
        const fieldSelect = document.getElementById('order-filter-select') as HTMLSelectElement;
        const selectedOption = Array.from(fieldSelect.querySelectorAll('li')).find(li => li.dataset.value === currentFilter.field);
        const fieldLabel = selectedOption?.innerText || 'Condición';
        const valueLabel = currentFilter.value;

        const newFilter: DynamicFilter = { id: crypto.randomUUID(), ...currentFilter, label: `${fieldLabel}: "${valueLabel}"` };
        setDynamicFilters([...dynamicFilters, newFilter]);
        handleClosePopover();
    };

    const renderFilterValueInput = () => {
        if (!currentFilter.field) return <TextField fullWidth size="small" disabled />;
        if (currentFilter.field.includes('status')) {
            return (
                <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select autoFocus label="Estado" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}>
                        <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                        <MenuItem value="PROCESANDO">PROCESANDO</MenuItem>
                        <MenuItem value="COMPLETADO">COMPLETADO</MenuItem>
                        <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                    </Select>
                </FormControl>
            );
        }
        return <TextField autoFocus fullWidth size="small" label="Valor" value={currentFilter.value || ''} onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })} />;
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    const open = Boolean(anchorEl);
    const popoverId = open ? 'order-filter-popover' : undefined;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Pedidos ({filteredOrders.length})</Typography>
            
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
                    <Button variant="outlined" size="small" sx={{ ml: 1, flexShrink: 0 }} startIcon={<FilterListIcon />} onClick={handleAddFilterClick} aria-describedby={popoverId}>Añadir</Button>
                </Stack>
            </Paper>

            <Popover
                id={popoverId} open={open} anchorEl={anchorEl} onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Stack spacing={2} sx={{ p: 2, width: 350 }}>
                    <Typography variant="subtitle1">Añadir condición de filtro</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Condición</InputLabel>
                        <Select
                            id="order-filter-select" value={currentFilter.field} label="Condición"
                            onChange={(e) => setCurrentFilter({ ...currentFilter, field: e.target.value as any, value: '' })}
                        >
                            <MenuItem value="id_equals">ID del Pedido es</MenuItem>
                            <MenuItem value="customerName_includes">Nombre Cliente contiene</MenuItem>
                            <MenuItem value="customerEmail_includes">Email Cliente contiene</MenuItem>
                            <MenuItem value="status_equals">Estado es</MenuItem>
                            <MenuItem value="status_not_equals">Estado NO es</MenuItem>
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
                            <TableCell>ID Pedido</TableCell><TableCell>Cliente</TableCell><TableCell>Total</TableCell>
                            <TableCell>Fecha</TableCell><TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => {
                            const validStatuses = getValidNextStatuses(order.status);
                            const isFinalState = order.status === 'COMPLETADO' || order.status === 'CANCELADO';
                            return (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.customerName} ({order.customerEmail})</TableCell>
                                    <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(order.total)}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            size="small" disabled={isFinalState}
                                            renderValue={(selected) => (<Chip label={selected} color={getStatusChipColor(selected)} size="small" sx={{ minWidth: '90px' }} />)}
                                            sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                                        >
                                            <MenuItem value="PENDIENTE" disabled={!validStatuses.includes('PENDIENTE')}>Pendiente</MenuItem>
                                            <MenuItem value="PROCESANDO" disabled={!validStatuses.includes('PROCESANDO')}>Procesando</MenuItem>
                                            <MenuItem value="COMPLETADO" disabled={!validStatuses.includes('COMPLETADO')}>Completado</MenuItem>
                                            <MenuItem value="CANCELADO" disabled={!validStatuses.includes('CANCELADO')}>Cancelado</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};