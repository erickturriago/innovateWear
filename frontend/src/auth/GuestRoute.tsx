// src/auth/GuestRoute.tsx
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Si hay un usuario logueado, lo redirigimos a la página principal
    if (user) {
        return <Navigate to="/" replace />;
    }

    // Si no hay un usuario, muestra la página para invitados (login, register)
    return <>{children}</>;
};