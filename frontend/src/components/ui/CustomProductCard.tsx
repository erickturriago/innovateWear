// src/components/ui/CustomProductCard.tsx
import { Card, CardMedia, CardContent, Typography, Box, Switch, FormControlLabel, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface CustomProduct {
    id: number;
    name: string;
    price: number;
    description?: string;
    active: boolean;
    isPublic: boolean;
    previewImageUrl: string;
    product: any;
}

interface CustomProductCardProps {
  product: CustomProduct;
  onStatusChange: (id: number, active: boolean) => void;
  onPublicStatusChange: (id: number, isPublic: boolean) => void;
  onEdit: (product: CustomProduct) => void;
}

const formatPrice = (price: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
}).format(price);

export const CustomProductCard = ({ product, onStatusChange, onPublicStatusChange, onEdit }: CustomProductCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.previewImageUrl || product.product?.image}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
      />
      <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2, flexGrow: 1, pr: 1 }}>
                {product.name}
            </Typography>
            <IconButton size="small" onClick={() => onEdit(product)}>
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formatPrice(product.price)}
        </Typography>
        
        <Stack spacing={0} mt="auto">
            <FormControlLabel
                sx={{ ml: 0, justifyContent: 'space-between', width: '100%' }}
                labelPlacement="start"
                control={<Switch size="small" checked={product.active} onChange={(e) => onStatusChange(product.id, e.target.checked)} />}
                label={<Typography variant="body2">Activo</Typography>}
            />
            <FormControlLabel
                sx={{ ml: 0, justifyContent: 'space-between', width: '100%' }}
                labelPlacement="start"
                control={<Switch size="small" checked={product.isPublic} onChange={(e) => onPublicStatusChange(product.id, e.target.checked)} />}
                label={<Typography variant="body2">Público</Typography>}
            />
        </Stack>
      </CardContent>
    </Card>
  );
};