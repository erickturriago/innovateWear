// src/components/ui/PrintCard.tsx
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Print } from '../../models/Print';

interface PrintCardProps extends Print {
  onEdit?: (print: Print) => void;
  onDelete?: (id: string) => void;
}

const PrintCard = (props: PrintCardProps) => {
  const { onEdit, onDelete, ...printData } = props;
  const { image, title, category, author, id } = printData;

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
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <CardActionArea
        component="div"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
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
    </Card>
  );
};

export default PrintCard;
