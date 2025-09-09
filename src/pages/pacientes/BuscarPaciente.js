import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar
} from '@mui/material';
import { Search, Visibility, Edit, History } from '@mui/icons-material';

const BuscarPaciente = () => {
  const pacientesEncontrados = [
    {
      id: 1,
      nombres: 'María',
      apellidos: 'González Pérez',
      documento: '1234567890',
      fechaNacimiento: '1985-06-15',
      edad: 38,
      telefono: '3123456789',
      eps: 'Salud Total',
      ultimaCita: '2024-01-10',
      estado: 'Activo'
    },
    {
      id: 2,
      nombres: 'Carlos',
      apellidos: 'Rodríguez Silva',
      documento: '0987654321',
      fechaNacimiento: '1978-03-22',
      edad: 45,
      telefono: '3109876543',
      eps: 'Nueva EPS',
      ultimaCita: '2023-12-15',
      estado: 'Activo'
    },
    {
      id: 3,
      nombres: 'Ana',
      apellidos: 'Martínez López',
      documento: '1122334455',
      fechaNacimiento: '1990-11-08',
      edad: 33,
      telefono: '3156789012',
      eps: 'Sanitas',
      ultimaCita: '2024-01-05',
      estado: 'Inactivo'
    }
  ];

  const getEstadoColor = (estado) => {
    return estado === 'Activo' ? 'success' : 'default';
  };

  const getInitials = (nombres, apellidos) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Buscar Paciente
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Criterios de Búsqueda
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Número de Documento"
              variant="outlined"
              placeholder="Ej: 1234567890"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Nombres"
              variant="outlined"
              placeholder="Ej: María"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Apellidos"
              variant="outlined"
              placeholder="Ej: González"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              sx={{ height: '56px' }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Teléfono"
              variant="outlined"
              placeholder="Ej: 3123456789"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              placeholder="Ej: maria@email.com"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ height: '56px' }}
            >
              Limpiar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              Total Pacientes
            </Typography>
            <Typography variant="h3" color="primary.main">
              1,247
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Pacientes Activos
            </Typography>
            <Typography variant="h3" color="success.main">
              1,198
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              Resultados Encontrados
            </Typography>
            <Typography variant="h3" color="info.main">
              {pacientesEncontrados.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Documento</strong></TableCell>
              <TableCell><strong>Fecha Nacimiento</strong></TableCell>
              <TableCell><strong>Edad</strong></TableCell>
              <TableCell><strong>Contacto</strong></TableCell>
              <TableCell><strong>EPS</strong></TableCell>
              <TableCell><strong>Última Cita</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientesEncontrados.map((paciente) => (
              <TableRow key={paciente.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(paciente.nombres, paciente.apellidos)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {paciente.nombres} {paciente.apellidos}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {paciente.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{paciente.documento}</TableCell>
                <TableCell>{paciente.fechaNacimiento}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {paciente.edad} años
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" display="block">
                      Tel: {paciente.telefono}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {paciente.eps}
                  </Typography>
                </TableCell>
                <TableCell>{paciente.ultimaCita}</TableCell>
                <TableCell>
                  <Chip 
                    label={paciente.estado} 
                    color={getEstadoColor(paciente.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" title="Ver Perfil">
                    <Visibility />
                  </IconButton>
                  <IconButton color="info" size="small" title="Editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" size="small" title="Historial">
                    <History />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BuscarPaciente;