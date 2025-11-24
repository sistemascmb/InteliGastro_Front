import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, InputAdornment, Alert } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!usuario || !password) {
      setError('Ingrese usuario y contraseña');
      return;
    }
    try {
      setLoading(true);
      const result = await usuariosService.login({ usuario, contraseña: password });
      try {
        sessionStorage.setItem('authToken', 'system-user');
      } catch {}
      navigate('/', { replace: true });
    } catch (err) {
      const detalle = err?.details ? ` — ${err.details}` : '';
      setError((err?.message || 'Acceso no autorizado') + detalle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2184be' }}>
            Acceso al Sistema Clínico
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingrese sus credenciales para continuar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            fullWidth
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              )
            }}
          />

          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1 }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;