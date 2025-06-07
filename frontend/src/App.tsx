// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
// import Login from './pages/Login';
// import Checkout from './pages/Checkout';
// Aquí puedes importar las demás páginas

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
        <Route path="/prints" element={<Layout><div>Prints</div></Layout>} />
        <Route path="/tshirts" element={<Layout><div>T-Shirts</div></Layout>} />
        <Route path="/customize" element={<Layout><div>Customize</div></Layout>} />
        {/* <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
