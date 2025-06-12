// src/auth/useAuth.ts
import { useAuthStore } from '../store/authStore';

/**
 * Hook personalizado para acceder al estado y acciones de autenticación.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    // Podemos añadir helpers aquí, por ejemplo:
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isArtist: user?.role === 'ARTISTA',
  };
};