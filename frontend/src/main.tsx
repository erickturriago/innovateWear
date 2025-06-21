import React from 'react';
import ReactDOM from 'react-dom/client';

// Importaciones de Estilos
import CssBaseline from '@mui/material/CssBaseline';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'; // Tu archivo de estilos base

// Importaciones de Componentes y Temas
import App from './App';
import theme from './theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from './context/ConfirmProvider';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <CssBaseline />
        <App />
      </ConfirmProvider>
    </ThemeProvider>
  </React.StrictMode>
);