// src/pages/ArtistDashboardPage.tsx
import { useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material'; // Grid ya no se importa
import AddIcon from '@mui/icons-material/Add';
import PrintCard from '../components/PrintCard';
import { CreateDesignCommand } from '../patterns/command/Command';
import { useAuth } from '../auth/useAuth';
import { useDesignStore } from '../store/designStore';

const ArtistDashboardPage = () => {
  const { user } = useAuth();
  const { designs, isLoading, fetchDesignsByArtist, addDesign } = useDesignStore();

  useEffect(() => {
    if (user) {
      fetchDesignsByArtist(user.id);
    }
  }, [user, fetchDesignsByArtist]);

  const handleCreateNewDesign = async () => {
    if (!user) return;

    const designData = {
      name: `Diseño Aleatorio #${Math.floor(Math.random() * 1000)}`,
      description: 'Creado con Patrón Command y Observer',
      price: 25.50,
      imageUrl: `https://placehold.co/400x400/2A4D8C/FFFFFF/png?text=Diseño`,
      categoryId: 1,
      artistId: user.id,
    };

    const command = new CreateDesignCommand(designData, addDesign);
    const newDesign = await command.execute();

    if (newDesign) {
      alert(`¡Diseño "${newDesign.title}" creado y añadido a la lista!`);
    } else {
      alert('Hubo un error al crear el diseño.');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Mis Diseños
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateNewDesign}>
          Subir Nueva Estampa
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Listado de Estampas ({designs.length})</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          // --- REEMPLAZO DE GRID POR BOX CON FLEXBOX ---
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3, // Espacio entre los elementos
            }}
          >
            {designs.map((design) => (
              <Box
                key={design.id}
                sx={{
                  // Definimos el ancho para cada tamaño de pantalla
                  width: {
                    xs: '100%', // 1 columna en extra-small
                    sm: 'calc(50% - 12px)', // 2 columnas en small
                    md: 'calc(33.33% - 16px)', // 3 columnas en medium
                    lg: 'calc(25% - 18px)', // 4 columnas en large
                  },
                }}
              >
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