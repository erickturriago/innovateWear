// src/pages/HomeRouter.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Home from './Home';
import { CircularProgress, Box } from '@mui/material';

// Este componente actúa como un controlador de tráfico para la ruta principal "/"
export const HomeRouter = () => {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);

    // Muestra un spinner mientras se verifica el estado de autenticación
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // Si hay un usuario, redirige según su rol
    if (user) {
        switch (user.role) {
            case 'ADMIN':
                return <Navigate to="/admin/dashboard" replace />;
            case 'ARTISTA':
                return <Navigate to="/artist/dashboard" replace />;
            // Para el CLIENTE, se queda en el Home
            case 'CLIENTE':
            default:
                return <Home />;
        }
    }

    // Si no hay usuario (es un invitado), muestra el Home normal
    return <Home />;
};