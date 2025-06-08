// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TShirtsPage from './pages/TShirtsPage';
import PrintsPage from './pages/PrintsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; // <-- IMPORTAR
import Catalog from './pages/Catalog';
import CustomizePage from './pages/CustomizePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/tshirts" element={<Layout><TShirtsPage /></Layout>} />
        <Route path="/tshirts/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        
        <Route path="/prints" element={<Layout><PrintsPage /></Layout>} />
        <Route path="/customize" element={<Layout><CustomizePage /></Layout>} />
        
        <Route path="/checkout" element={<Layout><CartPage /></Layout>} /> {/* <-- RUTA ACTUALIZADA */}
        
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;