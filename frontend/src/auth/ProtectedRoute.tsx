// src/auth/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const location = useLocation();

    // 1. Mientras se verifica el estado de autenticación, muestra un spinner
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. Si la verificación terminó y NO hay usuario, redirige al login
    if (!user) {
        // Guardamos la página que intentaba visitar para redirigirlo de vuelta después del login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Si hay un usuario, muestra la página protegida
    return <>{children}</>;
};