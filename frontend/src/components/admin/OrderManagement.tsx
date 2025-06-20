// src/components/admin/OrderManagement.tsx
import { useState, useEffect } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Chip 
} from '@mui/material';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';

const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'PENDIENTE': return 'warning';
        case 'PROCESANDO': return 'info';
        case 'COMPLETADO': return 'success';
        case 'CANCELADO': return 'error';
        default: return 'default';
    }
}

// --- NUEVA LÓGICA PARA DETERMINAR LAS OPCIONES VÁLIDAS ---
const getValidNextStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
        case 'PENDIENTE':
            return ['PENDIENTE', 'PROCESANDO', 'CANCELADO'];
        case 'PROCESANDO':
            return ['PROCESANDO', 'COMPLETADO', 'CANCELADO'];
        // Para estados finales, solo se puede seleccionar el estado actual (está deshabilitado)
        case 'COMPLETADO':
            return ['COMPLETADO'];
        case 'CANCELADO':
            return ['CANCELADO'];
        default:
            return [];
    }
}

export const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const showNotification = useNotificationStore(state => state.showNotification);

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const updatedOrder = await adminApi.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            showNotification('Estado del pedido actualizado', 'success');
        } catch (err: any) {
            // Si el backend nos da un error de lógica, lo mostramos
            if(err.response && err.response.data) {
                showNotification(err.response.data.message || 'No se pudo actualizar el estado.', 'error');
            } else {
                showNotification('Error al actualizar el estado', 'error');
            }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Gestión de Pedidos ({orders.length})</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => {
                            const validStatuses = getValidNextStatuses(order.status);
                            const isFinalState = order.status === 'COMPLETADO' || order.status === 'CANCELADO';

                            return (
                                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.customerName} ({order.customerEmail})</TableCell>
                                    <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(order.total)}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            size="small"
                                            disabled={isFinalState} // Deshabilitamos el selector si el estado es final
                                            renderValue={(selected) => (
                                                <Chip
                                                    label={selected}
                                                    color={getStatusChipColor(selected)}
                                                    size="small"
                                                    sx={{ minWidth: '90px' }}
                                                />
                                            )}
                                            sx={{
                                                boxShadow: 'none',
                                                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
                                                '.MuiSelect-select': { padding: '6px 20px 6px 0px' }
                                            }}
                                        >
                                            {/* Mostramos solo las opciones de estado válidas */}
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