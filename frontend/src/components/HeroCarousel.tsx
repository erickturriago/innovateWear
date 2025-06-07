// src/components/HeroCarousel.tsx
import Slider from 'react-slick';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { heroImages } from '../data/mockData';

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true, // Flechas activadas
  };

  return (
    <Box sx={{ width: '100%', mb: 6, '& .slick-dots li button:before': { color: 'white' }, '& .slick-dots li.slick-active button:before': { color: '#6C5CF0' } }}>
      <Slider {...settings}>
        {heroImages.map((item) => (
          <Box key={item.id} sx={{ position: 'relative', height: { xs: '400px', md: '500px' } }}>
            <Box
              sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${item.img})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(60%)',
              }}
            />
            <Box
              sx={{
                position: 'relative', color: 'white', height: '100%',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                textAlign: 'center', p: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                }}
              >
                {item.title}
              </Typography>
              <Typography
                component="p"
                sx={{
                  mb: 3,
                  maxWidth: '600px',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                {item.subtitle}
              </Typography>
              <Button
                variant="contained" size="large" component={RouterLink} to={item.link}
                sx={{ backgroundColor: '#6C5CF0', '&:hover': { backgroundColor: '#5a4dbb' }, textTransform: 'none', fontSize: '1.1rem', padding: '10px 25px' }}
              >
                {item.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HeroCarousel;