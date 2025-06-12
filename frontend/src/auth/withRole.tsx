// src/auth/withRole.tsx
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';
import { Box, Alert, CircularProgress } from '@mui/material';
import type { UserRole } from '../models/User';

interface RoleProxyProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export const RoleProxy = ({ children, requiredRole }: RoleProxyProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Alert severity="error">Debes iniciar sesión para ver esta página.</Alert>;
  }

  if (user.role !== requiredRole) {
    return <Alert severity="warning">No tienes los permisos necesarios para acceder a esta sección.</Alert>;
  }

  return <>{children}</>;
};