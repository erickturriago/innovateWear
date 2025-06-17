// src/components/forms/CreateDesignForm.tsx
import { useState, type ChangeEvent } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, SelectChangeEvent } from '@mui/material';
import type { DesignCategory } from '../../api/categoryApi';

interface FormData {
  name: string;
  description: string;
  price: number;
  categoryId: number | '';
  file: File | null;
}

interface CreateDesignFormProps {
  categories: DesignCategory[];
  onSubmit: (data: Omit<FormData, 'categoryId' | 'file'> & { categoryId: number; file: File }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CreateDesignForm = ({ categories, onSubmit, onCancel, isSubmitting }: CreateDesignFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', price: 0, categoryId: '', file: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'price' ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // --- FUNCIÓN CORREGIDA Y MÁS EXPLÍCITA ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData(prev => ({ ...prev, file: selectedFile }));
    }
  };
  
  const handleCategoryChange = (e: SelectChangeEvent<number>) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value as number }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoryId === '' || !formData.file) {
      alert('Por favor, completa todos los campos, incluyendo la imagen.');
      return;
    }
    onSubmit({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId), 
        file: formData.file 
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField name="name" label="Nombre del Diseño" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
        
        <Button variant="outlined" component="label" disabled={isSubmitting}>
          {formData.file ? `Archivo: ${formData.file.name}` : "Seleccionar Imagen"}
          <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" required />
        </Button>
        
        <TextField name="description" label="Descripción" value={formData.description} onChange={handleChange} multiline rows={2} disabled={isSubmitting} />
        
        <TextField name="price" label="Precio" type="number" value={formData.price} onChange={handleChange} required disabled={isSubmitting} inputProps={{ min: 0, step: "1000" }} />
        
        <FormControl fullWidth required disabled={isSubmitting}>
          <InputLabel id="category-select-label">Categoría</InputLabel>
          <Select
            labelId="category-select-label"
            name="categoryId"
            label="Categoría"
            value={formData.categoryId}
            onChange={handleCategoryChange}
          >
            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Crear Diseño"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};