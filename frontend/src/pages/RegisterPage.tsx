// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { EmailPasswordSignUpStrategy } from '../patterns/strategy/AuthStrategy';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(''); // <-- Nuevo estado para el nombre
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const strategy = new EmailPasswordSignUpStrategy();
    const success = await strategy.execute(email, password, name); 
    
    if (success) {
      // Después de registrar, el usuario debe iniciar sesión
      alert('¡Registro exitoso! Ahora por favor inicia sesión.');
      navigate('/login');
    } else {
      setError('Falló el registro. El email podría estar en uso o la contraseña es muy débil.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Crear Cuenta
        </Typography>
        
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <TextField
            label="Nombre Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="La contraseña debe tener al menos 6 caracteres."
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
            Registrarse
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          ¿Ya tienes una cuenta?{' '}
          <RouterLink to="/login">Inicia sesión aquí</RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;