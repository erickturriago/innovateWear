// src/pages/Catalog.tsx
import React, { useState } from 'react';
import CreateTShirt from '../components/CreateTShirt';
import type { TShirt } from '../models/TShirt';
import TShirtCard from '../components/TShirtCard';

const Catalog: React.FC = () => {
  const [tshirts, setTshirts] = useState<TShirt[]>([]);

  const handleCreate = (newTShirt: TShirt) => {
    setTshirts(prev => [...prev, newTShirt]);
  };

  return (
    <div>
      <h2>Catálogo de Camisetas</h2>
      <CreateTShirt onCreate={handleCreate} />

      <div style={{ marginTop: 20 }}>
        {tshirts.length === 0 && <p>No hay camisetas creadas.</p>}
        {tshirts.map(t => (
          <TShirtCard key={t.id} tshirt={t} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
