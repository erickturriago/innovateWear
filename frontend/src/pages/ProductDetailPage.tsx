// src/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Skeleton, Alert, Paper, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import tshirtApi from '../api/tshirtApi';
import type { TShirt } from '../models/TShirt';
import type { TShirtSize, PredesignedCartItem } from '../models/CartItem';
import { useCartStore } from '../store/cartStore';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<TShirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('M');
  const [quantity, setQuantity] = useState(1);

  // Obtenemos la acción para añadir productos de nuestro store (Zustand)
  const addProductToCart = useCartStore(state => state.addProduct);

  useEffect(() => {
    if (!productId) {
      setError('No se especificó un ID de producto.');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await tshirtApi.getById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('El producto no fue encontrado.');
        }
      } catch (err) {
        setError('Ocurrió un error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: PredesignedCartItem = {
      id: `${product.id}-${selectedSize}`, // ID único para producto + talla
      type: 'predesigned',
      product: product,
      size: selectedSize,
      quantity: quantity,
      price: product.price,
    };

    addProductToCart(cartItem);
    // Opcional: Redirigir al carrito o mostrar notificación
    alert(`${quantity} x ${product.title} (Talla: ${selectedSize}) añadido al carrito!`);
    navigate('/tshirts'); // Volvemos al catálogo después de añadir
  };

  if (loading) {
    return (
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4}>
        <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: 300, md: 500 }, borderRadius: 3 }} />
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '3rem' }} width="80%" />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width="40%" />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="100%" height={80} />
          <Skeleton variant="rectangular" sx={{ width: '100%', height: 100, mt: 2 }} />
          <Skeleton variant="rectangular" sx={{ width: '100%', height: 50, mt: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="info">Producto no disponible.</Alert>;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={{ xs: 3, md: 5 }}>
        {/* Columna Izquierda: Imagen */}
        <Box>
          <img src={product.image} alt={product.title} style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'contain' }} />
        </Box>

        {/* Columna Derecha: Detalles y Acciones */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="caption" color="primary">{product.category.toUpperCase()}</Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>{product.title}</Typography>
          <Typography variant="h4" sx={{ color: 'text.secondary', mb: 2 }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}</Typography>
          
          <Typography fontWeight="bold">Talla:</Typography>
          <ToggleButtonGroup value={selectedSize} exclusive onChange={(_, newSize) => { if(newSize) setSelectedSize(newSize); }} aria-label="Tallas">
            <ToggleButton value="S">S</ToggleButton>
            <ToggleButton value="M">M</ToggleButton>
            <ToggleButton value="L">L</ToggleButton>
            <ToggleButton value="XL">XL</ToggleButton>
          </ToggleButtonGroup>

          <Typography fontWeight="bold" sx={{ mt: 2 }}>Cantidad:</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))}><RemoveIcon /></IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton onClick={() => setQuantity(q => q + 1)}><AddIcon /></IconButton>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{ mt: 'auto', backgroundColor: '#6C5CF0', '&:hover': { backgroundColor: '#5a4dbb' }, py: 1.5 }}
          >
            Agregar al carrito
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductDetailPage;