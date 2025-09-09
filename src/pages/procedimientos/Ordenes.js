import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete, Schedule, Search } from '@mui/icons-material';

const Ordenes = () => {
  const ordenes = [
    {
      id: 'ORD-2024-001',
      paciente: 'María González',
      cedula: '1234567890',
      procedimiento: 'Endoscopia Alta',
      medicoSolicitante: 'Dr. Hernández',
      fechaSolicitud: '2024-01-12',
      prioridad: 'Normal',
      estado: 'Pendiente',
      indicaciones: 'Control post-tratamiento gastritis',
      seguro: 'EPS Salud Total'
    },
    {
      id: 'ORD-2024-002',
      paciente: 'Carlos Rodríguez',
      cedula: '0987654321',
      procedimiento: 'Colonoscopia',
      medicoSolicitante: 'Dra. Morales',
      fechaSolicitud: '2024-01-11',
      prioridad: 'Alta',
      estado: 'Aprobada',
      indicaciones: 'Dolor abdominal recurrente, descartar patología',
      seguro: 'Nueva EPS'
    },
    {
      id: 'ORD-2024-003',
      paciente: 'Ana Martínez',
      cedula: '1122334455',
      procedimiento: 'Biopsia Gástrica',
      medicoSolicitante: 'Dr. García',
      fechaSolicitud: '2024-01-10',
      prioridad: 'Urgente',
      estado: 'Programada',
      indicaciones: 'Lesión sospechosa encontrada en endoscopia',
      seguro: 'Sanitas'
    },
    {
      id: 'ORD-2024-004',
      paciente: 'Pedro Sánchez',
      cedula: '1111222233',
      procedimiento: 'Endoscopia Baja',
      medicoSolicitante: 'Dra. López',
      fechaSolicitud: '2024-01-09',
      prioridad: 'Normal',
      estado: 'Rechazada',
      indicaciones: 'Seguimiento post-cirugía',
      seguro: 'Coomeva'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'Aprobada':
        return 'info';
      case 'Programada':
        return 'success';
      case 'Rechazada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Urgente':
        return 'error';
      case 'Alta':
        return 'warning';
      case 'Normal':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Órdenes de Procedimientos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ height: 'fit-content' }}
        >
          Nueva Orden
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros de Búsqueda
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Número de Orden"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Paciente"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Estado"
              select
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Aprobada">Aprobada</MenuItem>
              <MenuItem value="Programada">Programada</MenuItem>
              <MenuItem value="Rechazada">Rechazada</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Prioridad"
              select
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="Urgente">Urgente</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<Search />}
              sx={{ height: '40px' }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              Pendientes
            </Typography>
            <Typography variant="h3" color="warning.main">
              {ordenes.filter(o => o.estado === 'Pendiente').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              Aprobadas
            </Typography>
            <Typography variant="h3" color="info.main">
              {ordenes.filter(o => o.estado === 'Aprobada').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Programadas
            </Typography>
            <Typography variant="h3" color="success.main">
              {ordenes.filter(o => o.estado === 'Programada').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error.main">
              Urgentes
            </Typography>
            <Typography variant="h3" color="error.main">
              {ordenes.filter(o => o.prioridad === 'Urgente').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>N° Orden</strong></TableCell>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Procedimiento</strong></TableCell>
              <TableCell><strong>Médico Solicitante</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Prioridad</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Seguro</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {orden.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {orden.paciente}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      C.C. {orden.cedula}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {orden.procedimiento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {orden.indicaciones}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{orden.medicoSolicitante}</TableCell>
                <TableCell>{orden.fechaSolicitud}</TableCell>
                <TableCell>
                  <Chip 
                    label={orden.prioridad} 
                    color={getPrioridadColor(orden.prioridad)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={orden.estado} 
                    color={getEstadoColor(orden.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {orden.seguro}
                  </Typography>
                </TableCell>
                <TableCell>
                  {orden.estado === 'Aprobada' && (
                    <IconButton color="primary" size="small" title="Programar">
                      <Schedule />
                    </IconButton>
                  )}
                  <IconButton color="info" size="small" title="Editar">
                    <Edit />
                  </IconButton>
                  {orden.estado === 'Pendiente' && (
                    <IconButton color="error" size="small" title="Eliminar">
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ordenes;