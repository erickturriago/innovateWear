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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };
  
  const handleCategoryChange = (e: SelectChangeEvent<number | ''>) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value as number | '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoryId === '' || !formData.file) {
      alert('Por favor, completa todos los campos, incluyendo la imagen.');
      return;
    }
    onSubmit({ ...formData, categoryId: Number(formData.categoryId), file: formData.file });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" label="Nombre del Diseño" onChange={handleChange} required disabled={isSubmitting} />
        <Button variant="outlined" component="label" disabled={isSubmitting}>
          {formData.file ? `Archivo: ${formData.file.name}` : "Seleccionar Imagen"}
          <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" required />
        </Button>
        <TextField name="description" label="Descripción" onChange={handleChange} multiline rows={2} disabled={isSubmitting} />
        <TextField name="price" label="Precio" type="number" onChange={handleChange} required disabled={isSubmitting} />
        <FormControl fullWidth required disabled={isSubmitting}>
          <InputLabel>Categoría</InputLabel>
          <Select name="categoryId" label="Categoría" value={formData.categoryId} onChange={handleCategoryChange}>
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