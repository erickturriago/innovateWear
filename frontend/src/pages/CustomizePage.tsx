import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Skeleton, Tooltip,
  ToggleButtonGroup, ToggleButton, IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as fabric from 'fabric';

import printApi from '../api/printApi';
import { useCartStore } from '../store/cartStore';
import { CustomTshirtBuilder } from '../patterns/builder/CustomTshirtBuilder';
import { availableGarments } from '../data/mockData';
import type { Print } from '../models/Print';
import type { BaseGarment, ColorOption } from '../models/Garment';
import type { TShirtSize } from '../models/CartItem';

const availableColors = [
  { name: 'Blanco', value: '#FFFFFF' }, { name: 'Negro', value: '#222222' },
  { name: 'Gris', value: '#888888' }, { name: 'Rojo', value: '#B71C1C' },
  { name: 'Azul', value: '#0D47A1' }, { name: 'Verde', value: '#1B5E20' },
];

const CustomizePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const tShirtImageRef = useRef<fabric.Image | null>(null);

  const [prints, setPrints] = useState<Print[]>([]);
  const [loadingPrints, setLoadingPrints] = useState(true);

  const [selectedGarment, setSelectedGarment] = useState<BaseGarment>(availableGarments[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(availableGarments[0].colors[0]);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  
  const [builder] = useState(() => new CustomTshirtBuilder());
  const addProductToCart = useCartStore((state: { addProduct: any; }) => state.addProduct);

  const totalPrice = useMemo(() => {
    const garmentPrice = selectedGarment.price;
    const printPrice = selectedPrint ? 15000 : 0;
    return (garmentPrice + printPrice) * quantity;
  }, [selectedGarment, selectedPrint, quantity]);


  const handleColorChange = useCallback((color: string) => {
    const tShirtImg = tShirtImageRef.current;
    if (!tShirtImg) return;
    
    const newColorOption = selectedGarment.colors.find(c => c.value === color);
    if (newColorOption) setSelectedColor(newColorOption);
    
    builder.setColor(color);

    tShirtImg.filters = [];
    if (color !== '#FFFFFF') {
      const filter = new fabric.filters.BlendColor({ color, mode: 'tint' });
      tShirtImg.filters.push(filter);
    }
    tShirtImg.applyFilters();
    fabricCanvasRef.current?.requestRenderAll();
  }, [builder, selectedGarment.colors]);

  const updateGarmentImage = useCallback((imageUrl: string, canvas: fabric.Canvas) => {
    if (tShirtImageRef.current) {
        canvas.remove(tShirtImageRef.current);
    }
    fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then(img => {
        img.scaleToWidth(canvas.getWidth() * 0.9);
        img.set({
            selectable: false,
            evented: false,
            top: canvas.getHeight() / 2,
            left: canvas.getWidth() / 2,
            originX: 'center',
            originY: 'center',
        });
        tShirtImageRef.current = img;
        canvas.add(img);
        
        // FORZAMOS A TYPESCRIPT A ACEPTAR EL MÉTODO
        (canvas as any).moveTo(img, 0);

        handleColorChange(selectedColor.value);
        canvas.requestRenderAll();
    });
  }, [handleColorChange, selectedColor.value]);
  
  // Efecto principal de inicialización y cambios
  useEffect(() => {
    if (!fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current!, {
        width: canvasContainerRef.current!.offsetWidth,
        height: 500,
      });
      fabricCanvasRef.current = canvas;
      
      printApi.getAll().then(setPrints).catch(console.error).finally(() => setLoadingPrints(false));
    }
    
    const canvas = fabricCanvasRef.current;
    updateGarmentImage(selectedColor.imageUrl, canvas);
    builder.setGarment(selectedGarment);

  }, [selectedColor, selectedGarment, updateGarmentImage, builder]);

  const handleGarmentChange = (_: React.MouseEvent<HTMLElement>, newGarmentName: string | null) => {
    if (newGarmentName) {
      const newGarment = availableGarments.find(g => g.name === newGarmentName);
      if (newGarment && newGarment.id !== selectedGarment.id) {
        setSelectedGarment(newGarment);
        setSelectedColor(newGarment.colors[0]); // Reset al primer color de la nueva prenda
      }
    }
  };

  const handleAddPrint = (print: Print) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    setSelectedPrint(print);
    builder.setPrint(print);
    
    canvas.getObjects().forEach(obj => {
      if (obj !== tShirtImageRef.current) canvas.remove(obj);
    });

    fabric.Image.fromURL(print.image, { crossOrigin: 'anonymous' }).then(img => {
      img.scaleToWidth(150);
      
      // FORZAMOS A TYPESCRIPT A ACEPTAR EL CENTRADO
      (canvas as any).centerObject(img);
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };
  
  const handleAddToCart = () => {
    builder.setSize(selectedSize).setQuantity(quantity);
    const cartItem = builder.build();
    if (cartItem) {
      addProductToCart(cartItem);
      alert('¡Tu diseño personalizado fue añadido al carrito!');
      navigate('/checkout');
    }
  };

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Personaliza tu Camiseta</Typography>
      <Box display="grid" gap={4} gridTemplateColumns={{ xs: '1fr', md: '400px 1fr' }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>1. Escoge la prenda</Typography>
            <ToggleButtonGroup value={selectedGarment.name} exclusive onChange={handleGarmentChange} fullWidth>
              {availableGarments.map(garment => <ToggleButton key={garment.id} value={garment.name}>{garment.name}</ToggleButton>)}
            </ToggleButtonGroup>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>2. Escoge talla, color y cantidad</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Color:</Typography>
            <Box display="flex" gap={1.5} flexWrap="wrap" mb={2}>
              {selectedGarment.colors.map(colorOpt => (
                <Tooltip title={colorOpt.name} key={colorOpt.value}>
                  <Box onClick={() => handleColorChange(colorOpt.value)} sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: colorOpt.value, cursor: 'pointer', border: '2px solid', borderColor: selectedColor.value === colorOpt.value ? 'primary.main' : '#e0e0e0' }}/>
                </Tooltip>
              ))}
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Talla:</Typography>
            <ToggleButtonGroup value={selectedSize} exclusive onChange={(_, newSize: TShirtSize | null) => { if (newSize) setSelectedSize(newSize); }} fullWidth sx={{ mb: 2 }}>
              <ToggleButton value="S">S</ToggleButton><ToggleButton value="M">M</ToggleButton>
              <ToggleButton value="L">L</ToggleButton><ToggleButton value="XL">XL</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Cantidad:</Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))}><RemoveIcon /></IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={() => setQuantity(q => q + 1)}><AddIcon /></IconButton>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>3. Escoge tu diseño</Typography>
            {loadingPrints ? <Skeleton variant="rectangular" height={80} /> : (
              <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))">
                {prints.map(print => (
                  <Paper key={print.id} onClick={() => handleAddPrint(print)} elevation={0} sx={{ border: '1px solid', borderColor: selectedPrint?.id === print.id ? 'primary.main' : '#ddd', cursor: 'pointer', aspectRatio: '1 / 1', '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
                    <img src={print.image} alt={print.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}/>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ position: 'sticky', top: '2rem' }}>
          <Paper ref={canvasContainerRef} elevation={2} sx={{ p: 2, borderRadius: 3, overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom align="center">Previsualización</Typography>
            <canvas ref={canvasRef} />
          </Paper>
          <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 3 }}>
            <Typography variant="h6">Precio Total Estimado</Typography>
            <Typography variant="h4" fontWeight="bold">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPrice)}</Typography>
          </Paper>
          <Button variant="contained" size="large" fullWidth startIcon={<ShoppingCartIcon />} onClick={handleAddToCart} sx={{ mt: 2, py: 1.5, backgroundColor: '#6C5CF0', '&:hover': { backgroundColor: '#5a4dbb' } }}>
            Agregar al carrito
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomizePage;