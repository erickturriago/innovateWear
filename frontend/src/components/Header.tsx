// src/components/layout/Header.tsx
import { useState } from 'react';
import { 
  AppBar, Toolbar, IconButton, Typography, Box, Button, Drawer, List, 
  ListItem, ListItemButton, ListItemText, Badge, CircularProgress, Link, 
  Menu, MenuItem, Avatar
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import headerTheme from '../theme/headerTheme';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const getInitials = (name: string = ''): string => {
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const totalItems = useCartStore(state => state.items.reduce((total, item) => total + item.quantity, 0));

  // --- SOLUCIÓN AL BUCLE INFINITO ---
  // Se selecciona cada pieza del estado de forma individual.
  // Esto evita que se cree un nuevo objeto en cada render.
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  // --- FIN DE LA SOLUCIÓN ---

  const guestNavItems = [
    { label: 'T-Shirts', path: '/tshirts' },
    { label: 'Prints', path: '/prints' },
    { label: 'Personalizar', path: '/customize' },
  ];
  
  // Lógica para determinar los ítems de navegación
  let navItems = guestNavItems;
  if (user) {
    switch (user.role) {
      case 'ARTISTA':
        navItems = [
          { label: 'Explorar Prints', path: '/prints' },
          { label: 'Crear Producto', path: '/customize' },
          { label: 'Mi Panel', path: '/artist/dashboard' },
        ];
        break;
      case 'ADMIN':
        navItems = [{ label: 'Panel de Admin', path: '/admin/dashboard' }];
        break;
      default: // CLIENTE
        navItems = guestNavItems;
        break;
    }
  }

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/');
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#424242', display: { md: 'none' } }}><MenuIcon /></IconButton>
            <Typography variant="h6" color="text.primary" component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
              InnovateWear
            </Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {navItems.map((item) => (
              <Button key={item.label} component={RouterLink} to={item.path} sx={{ color: location.pathname === item.path ? '#6C5CF0' : '#424242' }}>
                {item.label}
              </Button>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: '#424242' }}><SearchIcon /></IconButton>
            
            {user && (user.role === 'CLIENTE' || user.role === 'ADMIN') && (
              <IconButton component={RouterLink} to="/checkout" sx={{ color: '#424242' }}>
                <Badge badgeContent={totalItems} color="error"><ShoppingCartIcon /></Badge>
              </IconButton>
            )}

            {isLoading ? <CircularProgress size={24} /> : user ? (
              <div>
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#6C5CF0', width: 32, height: 32, fontSize: '0.875rem' }}>
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem component={RouterLink} to={user.getDashboardPath()} onClick={handleClose}>Mi Panel</MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" size="small">Login</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <nav>
        <Drawer open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}>
          {drawer}
        </Drawer>
      </nav>
    </ThemeProvider>
  );
};

export default Header;