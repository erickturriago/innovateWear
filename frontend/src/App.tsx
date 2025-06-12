// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TShirtsPage from './pages/TShirtsPage';
import PrintsPage from './pages/PrintsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Catalog from './pages/Catalog';
import CustomizePage from './pages/CustomizePage';
import { RoleProxy } from './auth/withRole';
import ArtistDashboardPage from './pages/ArtistDashboardPage'; // <-- 1. IMPORTAMOS LA PÁGINA

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/tshirts" element={<Layout><TShirtsPage /></Layout>} />
        <Route path="/tshirts/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/prints" element={<Layout><PrintsPage /></Layout>} />
        <Route path="/customize" element={<Layout><CustomizePage /></Layout>} />
        <Route path="/checkout" element={<Layout><CartPage /></Layout>} />
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />

        {/* --- 2. RUTA PROTEGIDA PARA ARTISTAS --- */}
        <Route
          path="/artist/dashboard"
          element={
            <Layout>
              <RoleProxy requiredRole="ARTISTA">
                <ArtistDashboardPage />
              </RoleProxy>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;