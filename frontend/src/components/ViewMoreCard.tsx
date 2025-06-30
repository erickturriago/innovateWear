// src/components/ViewMoreCard.tsx
import { Card, CardActionArea, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface ViewMoreCardProps {
  text: string;
  link: string;
}

const ViewMoreCard = ({ text, link }: ViewMoreCardProps) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <CardActionArea
        component={RouterLink} to={link}
        // Se añade un aria-label para que el enlace sea más claro para lectores de pantalla
        aria-label={`Ver más ${text}`}
        sx={{
          height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
        }}
      >
        <AddCircleIcon sx={{ fontSize: 60, color: '#6C5CF0' }} />
        
        {/* **** LA CORRECCIÓN ESTÁ AQUÍ **** */}
        {/* Se renderiza como <div> pero mantiene el estilo de h6 */}
        <Typography variant="h6" component="div" mt={2}>
          Ver más
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default ViewMoreCard;