// src/components/Header.tsx
import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import headerTheme from '../theme/headerTheme';

const Header = () => {
  const [activeButton, setActiveButton] = useState<string>('home');

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  // Función que decide color del botón según si está activo o no
  const getButtonColor = (buttonName: string) => {
    return activeButton === buttonName ? '#6C5CF0' : '#424242';
  };

  return (
    <ThemeProvider theme={headerTheme}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between', mx: 2 }}>
          <Typography variant="h6" color="text.primary">
            InnovateWear
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => handleButtonClick('home')}
              sx={{ color: getButtonColor('home') }}
              component={RouterLink}
              to="/catalog"
            >
              Home
            </Button>
            <Button
              onClick={() => handleButtonClick('prints')}
              sx={{ color: getButtonColor('prints') }}
              component={RouterLink}
              to="/prints"
            >
              Prints
            </Button>
            <Button
              onClick={() => handleButtonClick('tshirts')}
              sx={{ color: getButtonColor('tshirts') }}
              component={RouterLink}
              to="/tshirts"
            >
              T-Shirts
            </Button>
            <Button
              onClick={() => handleButtonClick('customize')}
              sx={{ color: getButtonColor('customize') }}
              component={RouterLink}
              to="/customize"
            >
              Customize
            </Button>
          </Box>

          <Box>
            <IconButton color="inherit"><SearchIcon /></IconButton>
            <IconButton color="inherit"><AccountCircle /></IconButton>
            <IconButton color="inherit" component={RouterLink} to="/checkout">
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
