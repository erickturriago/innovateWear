// src/components/Header.tsx
import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Badge } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import headerTheme from '../theme/headerTheme';
import { useCartStore } from '../store/cartStore'; // <-- 1. IMPORTAMOS EL STORE

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // --- 2. NOS SUSCRIBIMOS AL ESTADO DEL CARRITO ---
  const cartItems = useCartStore(state => state.items);
  // Calculamos la cantidad total de artículos sumando las cantidades de cada item
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Prints', path: '/prints' },
    { label: 'T-Shirts', path: '/tshirts' },
    { label: 'Customize', path: '/customize' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>InnovateWear</Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={headerTheme}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" color="text.primary" sx={{ flexGrow: { xs: 1, md: 0 } }}>
            InnovateWear
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {navItems.map((item) => (
                <Button key={item.label} component={RouterLink} to={item.path} sx={{ color: location.pathname === item.path ? '#6C5CF0' : '#424242' }}>
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          <Box>
            <IconButton color="inherit"><SearchIcon /></IconButton>
            <IconButton color="inherit"><AccountCircle /></IconButton>
            {/* --- 3. ENVOLVEMOS EL ÍCONO DEL CARRITO CON EL BADGE --- */}
            <IconButton color="inherit" component={RouterLink} to="/checkout">
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
        >
          {drawer}
        </Drawer>
      </nav>
    </ThemeProvider>
  );
};

export default Header;