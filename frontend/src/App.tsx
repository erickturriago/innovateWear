// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TShirtsPage from './pages/TShirtsPage';
import PrintsPage from './pages/PrintsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Catalog from './pages/Catalog';
import CustomizePage from './pages/CustomizePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { RoleProxy } from './auth/withRole';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { FirebaseFacade } from './patterns/facade/FirebaseFacade';
import { useAuthStore } from './store/authStore';
import authService from './auth/authService';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = FirebaseFacade.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await authService.findOrCreateUser(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/tshirts" element={<Layout><TShirtsPage /></Layout>} />
        <Route path="/tshirts/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/prints" element={<Layout><PrintsPage /></Layout>} />
        <Route path="/customize" element={<Layout><CustomizePage /></Layout>} />
        <Route path="/checkout" element={<Layout><CartPage /></Layout>} />
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
        <Route path="/artist/dashboard" element={<Layout><RoleProxy requiredRole="ARTISTA"><ArtistDashboardPage /></RoleProxy></Layout>} />
        <Route path="/admin/dashboard" element={<Layout><RoleProxy requiredRole="ADMIN"><AdminDashboardPage /></RoleProxy></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;