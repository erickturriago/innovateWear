// src/components/TShirtCard.tsx
import React from 'react';
import type { TShirt } from '../models/TShirt';

interface Props {
  tshirt: TShirt;
}

const TShirtCard: React.FC<Props> = ({ tshirt }) => (
  <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
    <h4>{tshirt.name}</h4>
    <p>Tipo: {tshirt.type}</p>
    <p>Color: {tshirt.color}</p>
    <p>Diseño: {tshirt.design}</p>
    <p>Precio: ${tshirt.price.toFixed(2)}</p>
  </div>
);

export default TShirtCard;
