// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { HomeRouter } from './pages/HomeRouter'; 
import TShirtsPage from './pages/TShirtsPage';
import PrintsPage from './pages/PrintsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CustomizePage from './pages/CustomizePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { RoleProxy } from './auth/withRole';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { GuestRoute } from './auth/GuestRoute';

import { useAuthStore } from './store/authStore';
import authService from './auth/authService';
import { FirebaseFacade } from './patterns/facade/FirebaseFacade';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Este oyente ahora solo se preocupa por la sesión de Firebase (principalmente Google Sign-In)
    // al recargar la página. La sesión de usuario/contraseña es manejada por el middleware
    // 'persist' de Zustand.
    const unsubscribe = FirebaseFacade.onAuthStateChanged(async (firebaseUser) => {
      // Si al recargar hay un usuario de Firebase, lo sincronizamos.
      if (firebaseUser) {
        const appUser = await authService.findOrCreateUser(firebaseUser);
        setUser(appUser);
      } else {
        // Si no hay usuario de Firebase, simplemente terminamos la carga.
        // NO hacemos setUser(null) para no borrar una posible sesión local.
        setUser(useAuthStore.getState().user);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRouter />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/tshirts" element={<TShirtsPage />} />
          <Route path="/tshirts/:productId" element={<ProductDetailPage />} />
          <Route path="/prints" element={<PrintsPage />} />
          
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          <Route path="/customize" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          
          <Route 
            path="/artist/dashboard" 
            element={<ProtectedRoute><RoleProxy requiredRole="ARTISTA"><ArtistDashboardPage /></RoleProxy></ProtectedRoute>} 
          />
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute><RoleProxy requiredRole="ADMIN"><AdminDashboardPage /></RoleProxy></ProtectedRoute>} 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;