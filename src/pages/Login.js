import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, InputAdornment, Alert, Grid, FormControlLabel, Checkbox, Divider, Link, Paper } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services';
import mariaBelenImg from '../assets/images/MariaBelen.png';

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
      await usuariosService.login({ usuario, contraseña: password });
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
  <Container
    maxWidth={false}
    disableGutters
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e6f0ff',
    }}
  >
    <Paper
      elevation={8}
      sx={{
        width: '100%',
        maxWidth: 1160,
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Cambia a columna en móvil
      }}
    >
      {/* Formulario */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 5 },
          order: { xs: 2, md: 1 }, // En móvil, el formulario va abajo si deseas, o cámbialo a 1 si quieres arriba
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: 460, sm: 520, md: 560 },
            mx: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000' }}>
              Bienvenidos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" fullWidth>
              Login con Google
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>O ingrese con email</Divider>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
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
                ),
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
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel control={<Checkbox size="small" />} label="Mantener sesión" />
              <Link href="#" underline="hover" sx={{ fontSize: 13 }}>
                Olvidé mi contraseña
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ mt: 1, backgroundColor: '#2184be' }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?{' '}
                <Link href="#" underline="hover">
                  Regístrate
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Imagen */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: { xs: 300, md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          backgroundColor: '#f5f9ff',
          borderLeft: { md: '1px solid #d9dee7' },
          order: { xs: 1, md: 2 }, // En móvil, la imagen va arriba (ajusta si prefieres abajo)
        }}
      >
        <img
          src={mariaBelenImg}
          alt="Maria Belen"
          loading="eager"
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Grid>
    </Paper>
  </Container>
);

  
};

export default Login;