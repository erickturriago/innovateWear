// src/components/ui/PrintCard.tsx
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Print } from '../../models/Print';

interface PrintCardProps extends Print {
  // Prop para la descripción corta (implícita en alt)

  // Prop para la descripción larga en la página (método moderno)
  longDescription?: string;
  // Prop para la URL de la descripción larga (método obsoleto)
  longDescURL?: string;

  onEdit?: (print: Print) => void;
  onDelete?: (id: string) => void;
}

const PrintCard = (props: PrintCardProps) => {
  const { onEdit, onDelete, longDescription, longDescURL, ...printData } = props;
  const { image, title, category, author, id } = printData;

  const altText = `Estampa titulada "${title}", creada por ${author}, categoría: ${category}.`;
  const descriptionId = `print-desc-${id}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) {
      onDelete?.(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(printData);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        position: 'relative',
      }}
    >
      {(onEdit || onDelete) && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 0.5, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '50px' }}>
          {onEdit && (
            <IconButton size="small" onClick={handleEdit} aria-label={`Editar la estampa ${title}`}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton size="small" onClick={handleDelete} aria-label={`Eliminar la estampa ${title}`}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <CardActionArea
        component="div"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          // 1. Atributo 'alt' (Correcto y necesario)
          alt={altText}
          sx={{ objectFit: 'cover' }}
          // 2. Atributo 'aria-describedby' (Método moderno y recomendado)
          aria-describedby={longDescription ? descriptionId : undefined}
          // 3. Atributo 'longdesc' (Obsoleto y no recomendado)
          {...(longDescURL && { longdesc: longDescURL })}
        />
        <CardContent
          sx={{ flexGrow: 1, width: '100%', pt: 2, pb: '16px !important' }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', mb: 0, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <span style={{ color: '#6C5CF0' }}>@{author}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
      
      {/* Contenedor para la descripción de 'aria-describedby' */}
      {longDescription && (
        <Box
          id={descriptionId}
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {longDescription}
        </Box>
      )}
    </Card>
  );
};

export default PrintCard;