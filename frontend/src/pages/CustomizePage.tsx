// src/pages/CustomizePage.tsx
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Tooltip, ToggleButtonGroup, ToggleButton,
  IconButton, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, SelectChangeEvent,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Stack
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';

import { EditorOriginator } from '../patterns/memento/Originator';
import { HistoryCaretaker } from '../patterns/memento/Caretaker';
import designApi from '../api/designApi';
import tshirtApi from '../api/tshirtApi';
import categoryApi, { type DesignCategory } from '../api/categoryApi';
import customDesignApi from '../api/customDesignApi';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../auth/useAuth';
import { CustomTshirtBuilder } from '../patterns/builder/CustomTshirtBuilder';
import { useNotificationStore } from '../store/notificationStore';
import { FirebaseFacade } from '../patterns/facade/FirebaseFacade';
import { dataURLtoFile } from '../utils/dataUrlToFile';
import type { Print } from '../models/Print';
import type { TShirt } from '../models/TShirt';
import type { TShirtSize, CustomCartItem } from '../models/CartItem';
import { BaseGarmentPrice, PrintPriceDecorator, type PricedItem } from '../patterns/decorator/PriceDecorator';

const useImage = (url: string, crossOrigin: string = 'Anonymous'): [HTMLImageElement | undefined] => {
    const [image, setImage] = useState<HTMLImageElement>();
    useEffect(() => {
        if (!url) {
            setImage(undefined);
            return;
        };
        const img = new window.Image();
        img.src = url;
        img.crossOrigin = crossOrigin;
        img.onload = () => setImage(img);
    }, [url, crossOrigin]);
    return [image];
};

const StampImage = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
    const shapeRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [image] = useImage(shapeProps.src);

    useEffect(() => {
        if (isSelected) {
            trRef.current?.nodes([shapeRef.current!]);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <KonvaImage
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                image={image}
                draggable
                onDragEnd={(e) => {
                    onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
                }}
                onTransformEnd={() => {
                    const node = shapeRef.current;
                    if (node) {
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...shapeProps,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                            rotation: node.rotation()
                        });
                    }
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox}
                />
            )}
        </>
    );
};

interface GroupedGarment {
  name: string;
  type: string;
  variants: TShirt[];
}

const CustomizePage = () => {
  const navigate = useNavigate();
  const { user, isArtist } = useAuth();
  const showNotification = useNotificationStore(state => state.showNotification);

  const [_, forceUpdate] = useState(0); 
  const originator = useRef(new EditorOriginator<any[]>([]));
  const caretaker = useRef(new HistoryCaretaker(originator.current));

  const stamps = originator.current.getState();
  
  const [selectedId, selectShape] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 500, height: 500 });
  const [groupedGarments, setGroupedGarments] = useState<GroupedGarment[]>([]);
  const [prints, setPrints] = useState<Print[]>([]);
  const [categories, setCategories] = useState<DesignCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<GroupedGarment | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<TShirt | null>(null);
  const [tshirtImage] = useImage(selectedVariant?.image || '');
  const [tshirtImageSize, setTshirtImageSize] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [printFilters, setPrintFilters] = useState({ query: '', categoryId: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [designInfo, setDesignInfo] = useState({ name: '', description: '', price: '' });
  const [currentPrice, setCurrentPrice] = useState(0);
  const [builder] = useState(() => new CustomTshirtBuilder());
  const addProductToCart = useCartStore((state) => state.addProduct);
  const colorHexMap: { [key: string]: string } = { rojo: '#FF0000', azul: '#0000FF', amarillo: '#FFFF00', naranja: '#FFA500', verde: '#008000', morado: '#800080', blanco: '#FFFFFF', negro: '#000000', gris: '#808080', rosado: '#FFC0CB', cian: '#00FFFF', turquesa: '#40E0D0', lila: '#C8A2C8', vino: '#8B0000', beige: '#F5F5DC', marron: '#8B4513', celeste: '#87CEEB', dorado: '#FFD700', plateado: '#C0C0C0' }

  const updateStamps = useCallback((newStamps: any[] | ((prevStamps: any[]) => any[])) => {
    const currentState = originator.current.getState();
    const resolvedState = typeof newStamps === 'function' ? newStamps(currentState) : newStamps;
    
    originator.current.setState(resolvedState);
    caretaker.current.backup();
    forceUpdate(val => val + 1);
  }, []);

  const undo = useCallback(() => {
    caretaker.current.undo();
    forceUpdate(val => val + 1);
  }, []);

  const redo = useCallback(() => {
    caretaker.current.redo();
    forceUpdate(val => val + 1);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [allTshirts, allPrints, allCategories] = await Promise.all([
          tshirtApi.getAll(),
          designApi.getAll(),
          categoryApi.getAll(),
        ]);
        const customizableTshirts = allTshirts.filter(t => t.customizable);
        const groups: { [key: string]: GroupedGarment } = {};
        for (const tshirt of customizableTshirts) {
          if (tshirt.name) {
            if (!groups[tshirt.name]) groups[tshirt.name] = { name: tshirt.name, type: tshirt.type || '', variants: [] };
            groups[tshirt.name].variants.push(tshirt);
          }
        }
        const groupedData = Object.values(groups);
        setGroupedGarments(groupedData);
        setPrints(allPrints);
        setCategories(allCategories);
        if (groupedData.length > 0) {
          setSelectedGroup(groupedData[0]);
          setSelectedVariant(groupedData[0].variants[0]);
        }
      } catch (error) {
        showNotification("Error al cargar los datos iniciales.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showNotification]);

  useEffect(() => {
    const handleResize = () => {
        if (stageContainerRef.current) {
            const container = stageContainerRef.current;
            const stageWidth = container.clientWidth;
            const stageHeight = container.clientHeight;
            setStageSize({ width: stageWidth, height: stageHeight });

            if (tshirtImage) {
                const ratio = Math.min((stageWidth * 0.9) / tshirtImage.width, (stageHeight * 0.9) / tshirtImage.height);
                const imgWidth = tshirtImage.width * ratio;
                const imgHeight = tshirtImage.height * ratio;
                setTshirtImageSize({
                    width: imgWidth,
                    height: imgHeight,
                    x: (stageWidth - imgWidth) / 2,
                    y: (stageHeight - imgHeight) / 2,
                });
            }
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tshirtImage, isLoading]);

  useEffect(() => {
    if (selectedVariant) {
      builder.setGarment(selectedVariant);
    }
  }, [selectedVariant, builder]);

  useEffect(() => {
    if (!selectedVariant) {
        setCurrentPrice(0);
        return;
    }
    let pricedItem: PricedItem = new BaseGarmentPrice(selectedVariant);
    stamps.forEach(stampOnCanvas => {
        const fullPrintObject = prints.find(p => p.image === stampOnCanvas.src);
        if (fullPrintObject) {
            pricedItem = new PrintPriceDecorator(pricedItem, fullPrintObject);
        }
    });
    setCurrentPrice(pricedItem.getPrice());
  }, [selectedVariant, stamps, prints]);

  const availablePrints = useMemo(() => {
    const basePrints = isArtist && user ? prints.filter(p => p.author === user.name) : prints;
    let result = basePrints;
    if (printFilters.query) {
      result = result.filter(p => p.title.toLowerCase().includes(printFilters.query.toLowerCase()));
    }
    if (printFilters.categoryId !== 'all') {
      const cat = categories.find(c => c.id === Number(printFilters.categoryId));
      if (cat) result = result.filter(p => p.category === cat.name);
    }
    return result;
  }, [prints, printFilters, categories, isArtist, user]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) selectShape(null);
  };

  const handleGroupChange = (_: React.MouseEvent<HTMLElement>, newGroupName: string | null) => {
    if (newGroupName) {
      const newGroup = groupedGarments.find(g => g.name === newGroupName);
      if (newGroup && newGroup.variants.length > 0) {
        setSelectedGroup(newGroup);
        setSelectedVariant(newGroup.variants[0]);
        builder.resetPrints();
        updateStamps([]);
      }
    }
  };
  
  const handleAddPrint = (print: Print) => {
    builder.addPrint(print);
    const newStamp = {
        src: print.image,
        x: stageSize.width / 2 - 75,
        y: stageSize.height / 2 - 75,
        width: 150,
        height: 150,
        rotation: 0,
        id: `stamp-${Date.now()}`
    };
    updateStamps(prevStamps => [...prevStamps, newStamp]);
  };
  
  const handleDeleteStamp = () => {
    if (!selectedId) return;
    updateStamps(stamps.filter(stamp => stamp.id !== selectedId));
    selectShape(null);
  };

  const handleStampChange = (newAttrs: any, index: number) => {
    const newStamps = [...stamps];
    newStamps[index] = newAttrs;
    updateStamps(newStamps);
  };

  const generateFinalImage = (): Promise<string> => {
    const stage = stageRef.current;
    if (!stage) return Promise.reject("El canvas no está listo");
    
    selectShape(null);

    return new Promise(resolve => {
        setTimeout(() => {
            const dataURL = stage.toDataURL({ ...tshirtImageSize, pixelRatio: 2 });
            resolve(dataURL);
        }, 100);
    });
  };
  
  const handleSaveClick = () => {
    if (isArtist) {
        setDesignInfo({ name: '', description: '', price: '' });
        setSaveDialogOpen(true);
    } else {
        handleFinalAction();
    }
  };

  const handleFinalAction = async () => {
    if (!user || !selectedVariant) { return; }
    if (isArtist) setSaveDialogOpen(false);
    
    setIsSubmitting(true);
    showNotification('Generando imagen final...', 'info');

    try {
      const dataUrl = await generateFinalImage();
      const timestamp = Date.now();
      const snapshotFile = dataURLtoFile(dataUrl, `design-snapshot-${timestamp}.png`);
      showNotification('Subiendo imagen final...', 'info');
      const finalImageUrl = await FirebaseFacade.uploadFile(snapshotFile, 'custom-design-previews/');
      const productData = builder.setSize(selectedSize).setQuantity(quantity).build();
      
      const payload = {
        name: isArtist ? designInfo.name : `Diseño Personalizado de ${user.name}`,
        description: isArtist ? designInfo.description : "Diseño creado por cliente.",
        price: isArtist ? Number(designInfo.price) : currentPrice,
        creator: { id: user.id },
        product: { id: parseInt(productData.baseGarment.id) },
        isPublic: isArtist,
        previewImageUrl: finalImageUrl,
        prints: productData.prints.map(p => ({ design: { id: parseInt(p.id) } })),
      };

      showNotification('Guardando diseño...', 'info');
      const savedCustomDesign = await customDesignApi.create(payload);
      if (!savedCustomDesign) throw new Error("No se pudo guardar el diseño personalizado.");

      if (isArtist) {
        showNotification('¡Tu diseño ha sido guardado para la venta!', 'success');
        navigate('/artist/dashboard');
      } else {
        const cartItem: CustomCartItem = {
          id: `custom-${savedCustomDesign.id}-${selectedSize}`,
          type: 'custom',
          customDesignId: savedCustomDesign.id,
          size: selectedSize,
          quantity: quantity,
          price: currentPrice * quantity,
          unitPrice: currentPrice,
          displayData: { name: savedCustomDesign.name, image: savedCustomDesign.previewImageUrl }
        };
        addProductToCart(cartItem);
        showNotification('¡Tu diseño personalizado fue añadido al carrito!', 'success');
        navigate('/checkout');
      }
    } catch (error: any) {
      console.error("Error al finalizar la acción:", error);
      showNotification(error.message || 'Ocurrió un error inesperado.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        {isArtist ? "Crear un Nuevo Producto" : "Personaliza tu Camiseta"}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>1. Escoge la Prenda y Color</Typography>
                <ToggleButtonGroup value={selectedGroup?.name || ''} exclusive onChange={handleGroupChange} fullWidth orientation="vertical">
                {groupedGarments.map(group => <ToggleButton key={group.name} value={group.name}>{group.name}</ToggleButton>)}
                </ToggleButtonGroup>
                {selectedGroup && (
                <Box mt={2}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Color:</Typography>
                    <Box display="flex" gap={1.5} flexWrap="wrap">
                    {selectedGroup.variants.map(variant => (
                        <Tooltip title={variant.color} key={variant.id}>
                        <Box onClick={() => setSelectedVariant(variant)} sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: colorHexMap[variant.color!] || '#ccc', cursor: 'pointer', border: '3px solid', borderColor: selectedVariant?.id === variant.id ? 'primary.main' : 'transparent', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
                        </Tooltip>
                    ))}
                    </Box>
                </Box>
                )}
            </Paper>

            {!isArtist && (
                <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>2. Elige Talla y Cantidad</Typography>
                    <ToggleButtonGroup value={selectedSize} exclusive onChange={(_, v) => { if (v) setSelectedSize(v as TShirtSize); }} fullWidth sx={{ mb: 2 }}>
                    <ToggleButton value="S">S</ToggleButton><ToggleButton value="M">M</ToggleButton><ToggleButton value="L">L</ToggleButton><ToggleButton value="XL">XL</ToggleButton>
                    </ToggleButtonGroup>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Cantidad:</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))}><RemoveIcon /></IconButton>
                    <Typography variant="h6">{quantity}</Typography>
                    <IconButton onClick={() => setQuantity(q => q + 1)}><AddIcon /></IconButton>
                    </Box>
                </Paper>
            )}
            
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
                <Typography variant="h6" gutterBottom>{isArtist?"2.":"3."} Añade Estampas</Typography>
                <Box display="flex" gap={2} mb={2}>
                    <TextField label="Buscar..." variant="outlined" size="small" fullWidth onChange={e => setPrintFilters(f => ({ ...f, query: e.target.value }))} />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Categoría</InputLabel>
                        <Select value={printFilters.categoryId} label="Categoría" onChange={e => setPrintFilters(f => ({ ...f, categoryId: e.target.value as string | '' }))}>
                            <MenuItem value="all">Todas</MenuItem>
                            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ height: isArtist? '500px':'270px', overflowY: 'auto', pr: 1 }}>
                    <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))">
                        {availablePrints.map(print => (
                            <Tooltip key={print.id} title={`Añadir "${print.title}"`}>
                                <Paper onClick={() => handleAddPrint(print)} elevation={0} sx={{ border: '1px solid #ddd', cursor: 'pointer', aspectRatio: '1 / 1', '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
                                <img src={print.image} alt={print.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                </Paper>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            </Paper>
            
            {!isArtist && (
              <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Precio Total:</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(currentPrice * quantity)}
                  </Typography>
                </Box>
              </Paper>
            )}
            
            <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                startIcon={isArtist ? <SaveIcon /> : <ShoppingCartIcon />} 
                onClick={handleSaveClick}
                disabled={isSubmitting}
            >
                {isSubmitting ? <CircularProgress size={24} /> : isArtist ? "Guardar Diseño para la Venta" : "Agregar al Carrito"}
            </Button>
        </Box>

        <Box sx={{ flex: '1 1 auto', minHeight: { xs: '60vh', md: '80vh' }, position: 'relative' }}>
            <Paper sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, p: 0.5 }}>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Deshacer">
                        <span><IconButton onClick={undo} disabled={!caretaker.current.canUndo()}><UndoIcon /></IconButton></span>
                    </Tooltip>
                    <Tooltip title="Rehacer">
                        <span><IconButton onClick={redo} disabled={!caretaker.current.canRedo()}><RedoIcon /></IconButton></span>
                    </Tooltip>
                    <Tooltip title="Eliminar Estampa">
                         <span><IconButton onClick={handleDeleteStamp} disabled={!selectedId} color="error"><DeleteIcon /></IconButton></span>
                    </Tooltip>
                </Stack>
            </Paper>

          <Paper
            ref={stageContainerRef}
            sx={{ height: '100%', width: '100%', borderRadius: 3, overflow: 'hidden', background: '#f0f0f0' }}
          >
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                ref={stageRef}
            >
                <Layer listening={false}>
                    <KonvaImage image={tshirtImage} {...tshirtImageSize} listening={false} />
                </Layer>
                <Layer>
                    {stamps.map((stamp, i) => (
                        <StampImage
                            key={stamp.id}
                            shapeProps={stamp}
                            isSelected={stamp.id === selectedId}
                            onSelect={() => selectShape(stamp.id)}
                            onChange={(newAttrs: any) => handleStampChange(newAttrs, i)}
                        />
                    ))}
                </Layer>
            </Stage>
          </Paper>
        </Box>
      </Box>

      <Dialog open={isSaveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Guardar Nuevo Producto</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Dale un nombre y precio a tu nueva creación para que aparezca en la tienda.
          </DialogContentText>
          <TextField autoFocus required margin="dense" id="name" label="Nombre del Producto" type="text" fullWidth variant="outlined" value={designInfo.name} onChange={(e) => setDesignInfo({...designInfo, name: e.target.value})} />
          <TextField margin="dense" id="description" label="Descripción Corta (Opcional)" type="text" fullWidth multiline rows={2} variant="outlined" value={designInfo.description} onChange={(e) => setDesignInfo({...designInfo, description: e.target.value})} />
          <TextField required margin="dense" id="price" label="Precio de Venta (COP)" type="number" fullWidth variant="outlined" value={designInfo.price} onChange={(e) => setDesignInfo({...designInfo, price: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleFinalAction} variant="contained" disabled={!designInfo.name || !designInfo.price}>
            Confirmar y Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomizePage;