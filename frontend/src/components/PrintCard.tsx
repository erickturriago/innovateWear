// src/components/PrintCard.tsx
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Print } from '../models/Print';

const PrintCard = (props: Print) => {
  const { image, title, category, author, likes, link } = props;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <CardActionArea component={RouterLink} to={link} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardMedia component="img" height="200" image={image} alt={title} sx={{ objectFit: 'cover' }}/>
        <CardContent sx={{ flexGrow: 1, width: '100%', pt: 2, pb: '16px !important', display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 0, lineHeight: 1.2 }}>{title}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{category}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <span style={{ color: '#6C5CF0' }}>@</span>{author.startsWith('@') ? author.substring(1) : author}
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Chip
              icon={<FavoriteIcon />}
              label={likes}
              variant="filled"
              sx={{
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                padding: '10px 8px',
                '& .MuiChip-label': { color: '#000' },
                '& .MuiChip-icon': { color: '#30A8FF' },
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default PrintCard;