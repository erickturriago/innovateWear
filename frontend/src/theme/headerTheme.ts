// src/theme/headerTheme.ts
import { createTheme } from '@mui/material/styles';

const headerTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // Fondo AppBar
    },
    text: {
      primary: '#333333', // Texto por defecto
    }
  },
  typography: {
    h6: {
      fontWeight: 800,
      fontSize: '1.3rem',
    },
    button: {
      fontWeight: 600,
      fontSize: '0.95rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#141414',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#141414',
        },
      },
    },
  },
});

export default headerTheme;
