// src/pages/CartPage.tsx
import { Box, Typography, Button, Paper, IconButton, Divider } from '@mui/material'; // Grid ya no se importa
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useCartStore } from '../store/cartStore';
import type { PredesignedCartItem } from '../models/CartItem';

const CartPage = () => {
  const { items, removeProduct, updateQuantity, clearCart } = useCartStore();
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const numeroTienda = '573001234567';

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const generarMensajeWhatsApp = () => {
    let mensaje = '¡Hola! Quisiera hacer el siguiente pedido:\n\n';
    items.forEach(item => {
      switch (item.type) {
        case 'predesigned':
          mensaje += `*${item.product.title}*\n`;
          mensaje += `  - Talla: ${item.size}\n`;
          mensaje += `  - Cantidad: ${item.quantity}\n`;
          mensaje += `  - Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
          break;
        case 'custom':
          // Futura lógica para items personalizados
          break;
      }
    });
    mensaje += `*TOTAL DEL PEDIDO: ${formatPrice(subtotal)}*`;
    return encodeURIComponent(mensaje);
  };
  
  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>Tu carrito está vacío</Typography>
        <Button component={RouterLink} to="/tshirts" variant="contained">
          Explorar camisetas
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Tu Carrito de Compras
      </Typography>

      {/* --- REEMPLAZO DEL GRID AQUÍ --- */}
      <Box 
        display="grid"
        gap={4}
        gridTemplateColumns={{
          xs: '1fr', // En móviles, una sola columna
          md: '2fr 1fr'  // En escritorio, 2/3 para la lista y 1/3 para el resumen
        }}
      >
        {/* Columna Izquierda: Lista de Items */}
        <Box>
          {items.map(item => (
            <Paper key={item.id} elevation={2} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, borderRadius: 3 }}>
              <img src={(item as PredesignedCartItem).product.image} alt={(item as PredesignedCartItem).product.title} width="100" style={{ marginRight: '16px', borderRadius: '8px' }}/>
              <Box flexGrow={1}>
                <Typography variant="h6">{(item as PredesignedCartItem).product.title}</Typography>
                <Typography color="text.secondary">Talla: {item.size}</Typography>
                <Typography fontWeight="bold">{formatPrice(item.price)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton size="small" onClick={() => updateQuantity(item.id, 'decrease')}><RemoveIcon/></IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.id, 'increase')}><AddIcon/></IconButton>
              </Box>
              <IconButton edge="end" sx={{ ml: 2 }} onClick={() => removeProduct(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>

        {/* Columna Derecha: Resumen del Pedido */}
        <Box>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: '2rem' }}>
            <Typography variant="h5" gutterBottom>Resumen del Pedido</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Subtotal</Typography>
              <Typography fontWeight="bold">{formatPrice(subtotal)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Envío</Typography>
              <Typography>A convenir</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" fontWeight="bold">{formatPrice(subtotal)}</Typography>
            </Box>
            <Button
              variant="contained" fullWidth size="large"
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/${numeroTienda}?text=${generarMensajeWhatsApp()}`}
              target="_blank"
              sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#1EAE50' }, py: 1.5 }}
            >
              Comprar vía WhatsApp
            </Button>
            <Button fullWidth onClick={clearCart} sx={{ mt: 2 }}>Vaciar Carrito</Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;