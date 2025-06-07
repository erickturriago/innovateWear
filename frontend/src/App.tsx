// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TShirtsPage from './pages/TShirtsPage'; // <-- IMPORTAR
import PrintsPage from './pages/PrintsPage';   // <-- IMPORTAR
import Catalog from './pages/Catalog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Rutas de los Catálogos */}
        <Route path="/tshirts" element={<Layout><TShirtsPage /></Layout>} />
        <Route path="/prints" element={<Layout><PrintsPage /></Layout>} />
        
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
        <Route path="/customize" element={<Layout><div>Página de Personalización</div></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;