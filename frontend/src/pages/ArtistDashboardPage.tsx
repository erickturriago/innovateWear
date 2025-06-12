// src/pages/ArtistDashboardPage.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PrintCard from '../components/PrintCard';
import { CreateDesignCommand } from '../patterns/command/Command';
import { useAuth } from '../auth/useAuth';
import { useDesignStore } from '../store/designStore';
import { CreateDesignForm } from '../components/forms/CreateDesignForm';
import categoryApi, { type DesignCategory } from '../api/categoryApi';

const ArtistDashboardPage = () => {
  const { user } = useAuth();
  const { designs, isLoading, fetchDesignsByArtist, addDesign } = useDesignStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<DesignCategory[]>([]);

  useEffect(() => {
    if (user) {
      fetchDesignsByArtist(user.id);
    }
    categoryApi.getAll().then(setCategories);
  }, [user, fetchDesignsByArtist]);

  const handleFormSubmit = async (formData: any) => {
    if (!user) return;
    
    const command = new CreateDesignCommand({ ...formData, artistId: user.id }, addDesign);
    const newDesign = await command.execute();

    if (newDesign) {
      alert(`¡Diseño "${newDesign.title}" creado y añadido a la lista!`);
    } else {
      alert('Hubo un error al crear el diseño.');
    }
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Mis Diseños
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          Subir Nueva Estampa
        </Button>
      </Box>

      {/* Modal para crear diseño */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Subir Nueva Estampa</DialogTitle>
        <DialogContent>
          <CreateDesignForm
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Listado de Estampas ({designs.length})</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {designs.map((design) => (
              <Box key={design.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' }}}>
                <PrintCard {...design} />
              </Box>
            ))}
          </Box>
        )}
        {designs.length === 0 && !isLoading && (
          <Typography color="text.secondary">Aún no has subido ningún diseño.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ArtistDashboardPage;