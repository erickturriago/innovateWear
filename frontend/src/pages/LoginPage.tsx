// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Box, Typography, Button, Paper, TextField, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthStrategy, GoogleAuthStrategy, EmailPasswordAuthStrategy } from '../patterns/strategy/AuthStrategy';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // El "Contexto" que usará la estrategia
  const handleLogin = async (strategy: AuthStrategy, ...args: any[]) => {
    setError('');
    const success = await strategy.execute(...args);
    if (success) {
      navigate('/'); // Redirige al home en caso de éxito
    } else {
      setError('Falló el inicio de sesión. Revisa tus credenciales.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Iniciar Sesión
        </Typography>
        
        {/* Formulario para Email y Contraseña */}
        <Box 
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(new EmailPasswordAuthStrategy(), email, password);
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}
        >
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
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
            Ingresar
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>O</Divider>

        {/* Botón para la estrategia de Google */}
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => handleLogin(new GoogleAuthStrategy())}
          fullWidth
          size="large"
        >
          Continuar con Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          ¿No tienes una cuenta?{' '}
          <RouterLink to="/register">
            Regístrate aquí
          </RouterLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;