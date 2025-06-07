import { Box, Typography, Grid, Button } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';


const camisetasPopulares = [
  {
    id: '1',
    image: 'https://via.placeholder.com/300x140?text=Camiseta+1',
    title: 'Camiseta Retro',
    description: 'Diseño vintage muy popular.',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/300x140?text=Camiseta+2',
    title: 'Camiseta Minimalista',
    description: 'Estilo simple y elegante.',
  },
];

const estampasPopulares = [
  {
    id: '1',
    image: 'https://via.placeholder.com/300x140?text=Estampa+1',
    title: 'Estampa Floral',
    description: 'Flores coloridas y llamativas.',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/300x140?text=Estampa+2',
    title: 'Estampa Geométrica',
    description: 'Formas abstractas y modernas.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      {/* Sección Camisetas Populares */}
      <Typography variant="h5" gutterBottom>
        Camisetas Populares
      </Typography>
      <Grid container spacing={2} mb={2}>
        {camisetasPopulares.map((camiseta) => (
          <Grid item key={camiseta.id} xs={12} sm={6} md={4}>
            <ProductCard
              id={camiseta.id}
              image={camiseta.image}
              title={camiseta.title}
              description={camiseta.description}
              link="/tshirts"
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={() => navigate('/tshirts')}>
        Ver más camisetas
      </Button>

      {/* Sección Estampas Populares */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Estampas Populares
        </Typography>
        <Grid container spacing={2} mb={2}>
          {estampasPopulares.map((estampa) => (
            <Grid item key={estampa.id} xs={12} sm={6} md={4}>
              <ProductCard
                id={estampa.id}
                image={estampa.image}
                title={estampa.title}
                description={estampa.description}
                link="/prints"
              />
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" onClick={() => navigate('/prints')}>
          Ver más estampas
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
