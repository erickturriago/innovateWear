// src/components/admin/OrderManagement.tsx
import { useState, useEffect } from 'react';
import { 
    Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Chip 
} from '@mui/material';
import { adminApi } from '../../api/adminApi';
import { useNotificationStore } from '../../store/notificationStore';

// Función helper para asignar un color a cada estado del pedido
const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'PENDIENTE': return 'warning';
        case 'PROCESANDO': return 'info';
        case 'COMPLETADO': return 'success';
        case 'CANCELADO': return 'error';
        default: return 'default';
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
            // Ordenar por ID descendente para ver los más nuevos primero
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
        } catch (err) {
            showNotification('Error al actualizar el estado', 'error');
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
                        {orders.map((order) => (
                            <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.customerName} ({order.customerEmail})</TableCell>
                                <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(order.total)}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        size="small"
                                        // 1. renderValue personaliza cómo se ve el valor seleccionado
                                        renderValue={(selected) => (
                                            <Chip
                                                label={selected}
                                                color={getStatusChipColor(selected)}
                                                size="small"
                                                sx={{ minWidth: '90px' }}
                                            />
                                        )}
                                        // 2. sx se usa para quitar el borde blanco y hacerlo más limpio
                                        sx={{
                                            boxShadow: 'none',
                                            '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
                                            // Asegura que el texto dentro del menú también se vea bien
                                            '.MuiSelect-select': {
                                                padding: '6px 20px 6px 0px',
                                            }
                                        }}
                                    >
                                        {/* 3. Las opciones del menú ahora son texto simple */}
                                        <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                                        <MenuItem value="PROCESANDO">Procesando</MenuItem>
                                        <MenuItem value="COMPLETADO">Completado</MenuItem>
                                        <MenuItem value="CANCELADO">Cancelado</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};