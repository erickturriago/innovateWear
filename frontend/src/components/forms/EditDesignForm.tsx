// src/components/forms/EditDesignForm.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, SelectChangeEvent } from '@mui/material';
import type { DesignCategory } from '../../api/categoryApi';
import type { Print } from '../../models/Print';

interface FormData {
  name: string;
  price: number;
  categoryId: number | '';
}

interface EditDesignFormProps {
  design: Print;
  categories: DesignCategory[];
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EditDesignForm = ({ design, categories, onSubmit, onCancel, isSubmitting }: EditDesignFormProps) => {
  const [formData, setFormData] = useState<FormData>({ name: '', price: 0, categoryId: '' });

  useEffect(() => {
    if (design) {
      const category = categories.find(c => c.name === design.category);
      setFormData({
        name: design.title,
        price: 0, // El precio se debe reingresar por seguridad/simplicidad
        categoryId: category ? category.id : '',
      });
    }
  }, [design, categories]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (e: SelectChangeEvent<number | ''>) => {
    setFormData(prev => ({ ...prev, categoryId: e.target.value as number | '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return;
    onSubmit({ ...formData, categoryId: Number(formData.categoryId) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField name="name" label="Nombre del Diseño" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
        <TextField name="price" label="Precio" type="number" value={formData.price} onChange={handleChange} required disabled={isSubmitting} />
        <FormControl fullWidth required disabled={isSubmitting}>
          <InputLabel>Categoría</InputLabel>
          <Select name="categoryId" label="Categoría" value={formData.categoryId} onChange={handleCategoryChange}>
            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};