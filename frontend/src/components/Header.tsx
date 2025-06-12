// src/components/Header.tsx
import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Badge, CircularProgress, Stack, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import headerTheme from '../theme/headerTheme';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../auth/useAuth';

const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItems = useCartStore(state => state.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const { user, login, logout, isLoading } = useAuth();
  
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
            <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ color: '#424242' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* --- AJUSTE: Añadido 'sx' para forzar el color --- */}
            <IconButton sx={{ color: '#424242' }}><SearchIcon /></IconButton>
            
            {isLoading ? (
              <CircularProgress size={24} />
            ) : user ? (
              <>
                <Link component={RouterLink} to={user.getDashboardPath()} underline="hover" sx={{ color: 'text.primary' }}>
                   Hola, {user.name.split(' ')[0]}
                </Link>
                <Button variant="outlined" size="small" onClick={logout} sx={{ ml: 1 }}>
                  Salir
                </Button>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" onClick={() => login('ana@cliente.com', '456')}>
                  Login Cliente
                </Button>
                 <Button variant="contained" size="small" color="secondary" onClick={() => login('carlos@artista.com', '123')}>
                  Login Artista
                </Button>
              </Stack>
            )}
            
            {/* --- AJUSTE: Añadido 'sx' para forzar el color --- */}
            <IconButton component={RouterLink} to="/checkout" sx={{ color: '#424242' }}>
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