import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string; // ruta para el botón "Ver más"
}

const ProductCard = ({ id, image, title, description, link }: ProductCardProps) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={link}>
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
