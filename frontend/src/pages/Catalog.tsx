// src/pages/Catalog.tsx
import React, { useState } from 'react';
import CreateTShirt from '../components/CreateTShirt';
import type { TShirt } from '../models/TShirt';

const Catalog: React.FC = () => {
  const [tshirts, setTshirts] = useState<TShirt[]>([]);

  const handleCreate = (newTShirt: TShirt) => {
    // Aseguramos que el nuevo objeto tenga las propiedades básicas para no romper el estado
    const productTShirt: TShirt = {
      ...newTShirt,
      id: newTShirt.id || `temp-${Date.now()}`,
      image: 'https://via.placeholder.com/280x280?text=Nueva',
      title: newTShirt.name || 'Sin Título',
      category: newTShirt.type || 'short',
      link: `/tshirts/${newTShirt.id}`
    };
    setTshirts(prev => [...prev, productTShirt]);
  };

  return (
    <div>
      <h2>Catálogo de Camisetas (Creación)</h2>
      <CreateTShirt onCreate={handleCreate} />

      <div style={{ marginTop: 20 }}>
        <h3>Camisetas Creadas:</h3>
        {tshirts.length === 0 && <p>Aún no has creado camisetas.</p>}
        {tshirts.map(t => (
          <div key={t.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>ID:</strong> {t.id}</p>
            <p><strong>Título:</strong> {t.title}</p>
            <p><strong>Precio:</strong> {t.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;