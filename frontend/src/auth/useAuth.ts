// src/auth/useAuth.ts
import { useAuthStore } from '../store/authStore';

/**
 * Hook personalizado para acceder al estado y acciones de autenticación.
 */
export const useAuth = () => {
  // Solo necesitamos seleccionar del store la información que los componentes consumirán
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Las acciones como login y logout ya no se exponen aquí.
  // Se manejan a través de la UI (página de Login) y la FirebaseFacade.
  return {
    user,
    isLoading,
    // Podemos mantener estos helpers, que ahora son más fiables.
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isArtist: user?.role === 'ARTISTA',
  };
};