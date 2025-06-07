// src/components/CreateTShirt.tsx
import React, { useState } from 'react';
import { TShirtFactory } from '../patterns/factory/TShirtFactory';
import type { TShirt } from '../models/TShirt';

interface Props {
  onCreate: (newTShirt: TShirt) => void;
}

const CreateTShirt: React.FC<Props> = ({ onCreate }) => {
  const factory = new TShirtFactory();

  const [name, setName] = useState('');
  const [type, setType] = useState<'short' | 'long' | 'hoodie'>('short');
  const [color, setColor] = useState('');
  const [design, setDesign] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tshirt = factory.createTShirt({
        name,
        type,
        color,
        design,
        price: typeof price === 'number' ? price : 0,
      });

      onCreate(tshirt);

      // Reset form
      setName('');
      setType('short');
      setColor('');
      setDesign('');
      setPrice('');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>Crear Camiseta</h3>
      <div>
        <label>Nombre:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <div>
        <label>Tipo:</label>
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="short">Manga corta</option>
          <option value="long">Manga larga</option>
          <option value="hoodie">Hoodie</option>
        </select>
      </div>

      <div>
        <label>Color:</label>
        <input value={color} onChange={e => setColor(e.target.value)} required />
      </div>

      <div>
        <label>Diseño:</label>
        <input value={design} onChange={e => setDesign(e.target.value)} placeholder="Opcional" />
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
          required
          min={0}
          step={0.01}
        />
      </div>

      <button type="submit" style={{ marginTop: 10 }}>
        Crear
      </button>
    </form>
  );
};

export default CreateTShirt;
