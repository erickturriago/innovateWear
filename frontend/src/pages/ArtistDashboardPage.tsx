// src/pages/ArtistDashboardPage.tsx
import { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, Button, CircularProgress, Dialog, DialogTitle, DialogContent, 
  Tabs, Tab, TextField, DialogActions, DialogContentText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintCard from '../components/ui/PrintCard';
import { CustomProductCard } from '../components/ui/CustomProductCard';
import { CreateDesignCommand, DeleteDesignCommand, UpdateDesignCommand } from '../patterns/command/Command';
import { useAuth } from '../auth/useAuth';
import { useDesignStore } from '../store/designStore';
import { useCustomProductStore } from '../store/customProductStore';
import { CreateDesignForm } from '../components/forms/CreateDesignForm';
import { EditDesignForm } from '../components/forms/EditDesignForm';
import categoryApi, { type DesignCategory } from '../api/categoryApi';
import customDesignApi from '../api/customDesignApi';
import { useNotificationStore } from '../store/notificationStore';
import { FirebaseFacade } from '../patterns/facade/FirebaseFacade';
import type { Print } from '../models/Print';

const ArtistDashboardPage = () => {
  const { user } = useAuth();
  const { designs, isLoading: isLoadingDesigns, fetchDesignsByArtist, addDesign, removeDesign, updateDesign } = useDesignStore();
  const { products, isLoading: isLoadingProducts, fetchByArtist: fetchCustomProducts, updateProductInfo } = useCustomProductStore();
  const showNotification = useNotificationStore(state => state.showNotification);

  const [currentTab, setCurrentTab] = useState(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Print | null>(null);
  const [categories, setCategories] = useState<DesignCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingProductInfo, setEditingProductInfo] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    if (user) {
      fetchDesignsByArtist(user.id);
      fetchCustomProducts(user.id);
      categoryApi.getAll().then(setCategories);
    }
  }, [user, fetchDesignsByArtist, fetchCustomProducts]);

  const handleCreateFormSubmit = async (formData: any) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const imageUrl = await FirebaseFacade.uploadFile(formData.file, 'designs/');
      const command = new CreateDesignCommand({ ...formData, imageUrl, artistId: user.id }, addDesign);
      const newDesign = await command.execute();
      if (newDesign) {
        showNotification(`¡Diseño "${newDesign.title}" creado!`, 'success');
      } else { throw new Error('Error al crear el diseño.'); }
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setCreateModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    const command = new DeleteDesignCommand(designId, removeDesign);
    if (await command.execute()) {
      showNotification('Diseño eliminado.', 'info');
    } else {
      showNotification('Error al eliminar el diseño.', 'error');
    }
  };

  const handleEditClick = (design: Print) => {
    setEditingDesign(design);
    setEditModalOpen(true);
  };
  
  const handleEditFormSubmit = async (formData: any) => {
    if (!editingDesign || !user) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, artistId: user.id };
      const command = new UpdateDesignCommand(editingDesign.id, payload, updateDesign);
      const updated = await command.execute();
      if (updated) {
        showNotification('Diseño actualizado con éxito.', 'success');
      } else { throw new Error('Error al actualizar el diseño.'); }
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setEditModalOpen(false);
      setEditingDesign(null);
      setIsSubmitting(false);
    }
  };

  const handleProductStatusChange = async (productId: number, active: boolean) => {
    if (!user) return;
    try {
        // --- CORRECCIÓN ---
        // Se añade el objeto 'creator' al payload para la verificación en el backend
        const payload = { active, creator: { id: user.id } };
        const updatedProduct = await customDesignApi.update(productId, payload);
        if(updatedProduct) {
            updateProductInfo(productId, updatedProduct);
            showNotification(`Producto ${active ? 'activado' : 'desactivado'}.`, 'success');
        }
    } catch (error) {
        showNotification('No se pudo actualizar el estado del producto.', 'error');
    }
  };

  const handlePublicStatusChange = async (productId: number, isPublic: boolean) => {
    if (!user) return;
    try {
        // --- CORRECCIÓN ---
        // Se añade el objeto 'creator' al payload para la verificación en el backend
        const payload = { isPublic, creator: { id: user.id } };
        const updatedProduct = await customDesignApi.update(productId, payload);
        if (updatedProduct) {
            updateProductInfo(productId, updatedProduct);
            showNotification(`Visibilidad del producto actualizada.`, 'success');
        }
    } catch (error) {
        showNotification('No se pudo actualizar la visibilidad.', 'error');
    }
  };
  
  const handleEditProductClick = (product: any) => {
    setEditingProduct(product);
    setEditingProductInfo({
        name: product.name,
        description: product.description || '',
        price: product.price.toString()
    });
    setEditProductDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !user) return;
    setIsSubmitting(true);
    try {
        const payload = {
            name: editingProductInfo.name,
            description: editingProductInfo.description,
            price: Number(editingProductInfo.price),
            // --- CORRECCIÓN ---
            // También se añade aquí para la verificación
            creator: { id: user.id }
        };
        const updatedProduct = await customDesignApi.update(editingProduct.id, payload);
        if (updatedProduct) {
            updateProductInfo(editingProduct.id, updatedProduct);
            showNotification('Producto actualizado con éxito', 'success');
        }
    } catch(error) {
        showNotification('Error al actualizar el producto', 'error');
    } finally {
        setIsSubmitting(false);
        setEditProductDialogOpen(false);
        setEditingProduct(null);
    }
  };

  const isLoading = isLoadingDesigns || isLoadingProducts;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>Mi Panel de Artista</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
          Subir Nueva Estampa
        </Button>
      </Box>

      <Dialog open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Subir Nueva Estampa</DialogTitle>
        <DialogContent><CreateDesignForm categories={categories} onSubmit={handleCreateFormSubmit} onCancel={() => setCreateModalOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
      
      {editingDesign && (
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Editar "{editingDesign.title}"</DialogTitle>
          <DialogContent><EditDesignForm design={editingDesign} categories={categories} onSubmit={handleEditFormSubmit} onCancel={() => setEditModalOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
        </Dialog>
      )}

      {editingProduct && (
        <Dialog open={isEditProductDialogOpen} onClose={() => setEditProductDialogOpen(false)}>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogContent>
            <DialogContentText sx={{mb: 2}}>
                Ajusta el nombre, descripción y precio de tu producto.
            </DialogContentText>
            <TextField autoFocus required margin="dense" id="name" label="Nombre del Producto" type="text" fullWidth variant="outlined" value={editingProductInfo.name} onChange={(e) => setEditingProductInfo({...editingProductInfo, name: e.target.value})} />
            <TextField margin="dense" id="description" label="Descripción Corta" type="text" fullWidth multiline rows={2} variant="outlined" value={editingProductInfo.description} onChange={(e) => setEditingProductInfo({...editingProductInfo, description: e.target.value})} />
            <TextField required margin="dense" id="price" label="Precio de Venta (COP)" type="number" fullWidth variant="outlined" value={editingProductInfo.price} onChange={(e) => setEditingProductInfo({...editingProductInfo, price: e.target.value})} />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setEditProductDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProduct} variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : "Guardar Cambios"}
            </Button>
            </DialogActions>
        </Dialog>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label={`Mis Estampas (${designs.length})`} />
          <Tab label={`Mis Productos (${products.length})`} />
        </Tabs>
      </Box>

      {isLoading ? <CircularProgress /> : (
        <>
          <div role="tabpanel" hidden={currentTab !== 0}>
            {currentTab === 0 && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {designs.map((design) => (
                    <Box key={design.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' }}}>
                      <PrintCard {...design} onEdit={handleEditClick} onDelete={handleDeleteDesign} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </div>
          <div role="tabpanel" hidden={currentTab !== 1}>
            {currentTab === 1 && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {products.map((product) => (
                    <Box key={product.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' }}}>
                      <CustomProductCard 
                        product={product} 
                        onStatusChange={handleProductStatusChange}
                        onPublicStatusChange={handlePublicStatusChange}
                        onEdit={handleEditProductClick}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </div>
        </>
      )}
    </Box>
  );
};

export default ArtistDashboardPage;