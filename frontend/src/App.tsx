// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Importamos el nuevo HomeRouter
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
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const unsubscribe = FirebaseFacade.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await authService.findOrCreateUser(firebaseUser);
        setUser(appUser);
      } else {
        if (isAuthLoading) {
            setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, [setUser, isAuthLoading]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- RUTA PRINCIPAL MODIFICADA --- */}
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