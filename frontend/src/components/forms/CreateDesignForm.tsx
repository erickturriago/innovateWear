// src/components/forms/CreateDesignForm.tsx
import { useState } from 'react';
// --- AJUSTE 1: Importar SelectChangeEvent ---
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import type { DesignCategory } from '../../api/categoryApi';

interface FormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number | '';
}

interface CreateDesignFormProps {
  categories: DesignCategory[];
  onSubmit: (data: Omit<FormData, 'categoryId'> & { categoryId: number }) => void;
  onCancel: () => void;
}

export const CreateDesignForm = ({ categories, onSubmit, onCancel }: CreateDesignFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: '',
  });

  // Este manejador se queda para los TextField
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'price' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name as string]: finalValue }));
  };
  
  // --- AJUSTE 2: Crear un manejador específico para el Select ---
  const handleCategoryChange = (e: SelectChangeEvent<number | ''>) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value as number | '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoryId === '') {
      alert('Por favor, selecciona una categoría.');
      return;
    }
    // Aseguramos que categoryId es un número antes de enviar
    const submissionData = { ...formData, categoryId: Number(formData.categoryId) };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" label="Nombre del Diseño" value={formData.name} onChange={handleChange} required />
        <TextField name="description" label="Descripción" value={formData.description} onChange={handleChange} multiline rows={3} />
        <TextField name="imageUrl" label="URL de la Imagen" value={formData.imageUrl} onChange={handleChange} required />
        <TextField name="price" label="Precio" type="number" value={formData.price} onChange={handleChange} required inputProps={{ step: "0.01" }}/>
        <FormControl fullWidth required>
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            name="categoryId"
            label="Categoría"
            value={formData.categoryId}
            // --- AJUSTE 3: Usar el nuevo manejador ---
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="submit" variant="contained">Crear Diseño</Button>
        </Box>
      </Box>
    </form>
  );
};