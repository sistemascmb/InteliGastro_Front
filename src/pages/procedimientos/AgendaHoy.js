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
  Grid,
  LinearProgress
} from '@mui/material';
import { PlayArrow, Pause, CheckCircle, AccessTime, Refresh } from '@mui/icons-material';

const AgendaHoy = () => {
  const procedimientosHoy = [
    {
      id: 1,
      paciente: 'María González',
      cedula: '1234567890',
      procedimiento: 'Endoscopia Alta',
      medico: 'Dr. García',
      hora: '08:00',
      duracion: '45 min',
      sala: 'Sala 1',
      estado: 'En Proceso',
      progreso: 60,
      preparacion: 'Completa'
    },
    {
      id: 2,
      paciente: 'Carlos Rodríguez',
      cedula: '0987654321',
      procedimiento: 'Colonoscopia',
      medico: 'Dra. López',
      hora: '09:30',
      duracion: '60 min',
      sala: 'Sala 2',
      estado: 'Esperando',
      progreso: 0,
      preparacion: 'Pendiente'
    },
    {
      id: 3,
      paciente: 'Ana Martínez',
      cedula: '1122334455',
      procedimiento: 'Biopsia',
      medico: 'Dr. Martínez',
      hora: '11:00',
      duracion: '30 min',
      sala: 'Sala 1',
      estado: 'Programado',
      progreso: 0,
      preparacion: 'Completa'
    },
    {
      id: 4,
      paciente: 'Pedro Sánchez',
      cedula: '1111222233',
      procedimiento: 'Endoscopia Baja',
      medico: 'Dr. García',
      hora: '14:00',
      duracion: '45 min',
      sala: 'Sala 1',
      estado: 'Finalizado',
      progreso: 100,
      preparacion: 'Completa'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'En Proceso':
        return 'info';
      case 'Finalizado':
        return 'success';
      case 'Esperando':
        return 'warning';
      case 'Programado':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPreparacionColor = (preparacion) => {
    return preparacion === 'Completa' ? 'success' : 'error';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Agenda de Procedimientos - Hoy
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          sx={{ height: 'fit-content' }}
        >
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              Total Hoy
            </Typography>
            <Typography variant="h3" color="primary.main">
              {procedimientosHoy.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              En Proceso
            </Typography>
            <Typography variant="h3" color="info.main">
              {procedimientosHoy.filter(p => p.estado === 'En Proceso').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              En Espera
            </Typography>
            <Typography variant="h3" color="warning.main">
              {procedimientosHoy.filter(p => p.estado === 'Esperando').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Completados
            </Typography>
            <Typography variant="h3" color="success.main">
              {procedimientosHoy.filter(p => p.estado === 'Finalizado').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Procedimiento</strong></TableCell>
              <TableCell><strong>Médico</strong></TableCell>
              <TableCell><strong>Hora</strong></TableCell>
              <TableCell><strong>Sala</strong></TableCell>
              <TableCell><strong>Preparación</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Progreso</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {procedimientosHoy.map((procedimiento) => (
              <TableRow key={procedimiento.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {procedimiento.paciente}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      C.C. {procedimiento.cedula}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {procedimiento.procedimiento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Duración: {procedimiento.duracion}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{procedimiento.medico}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                    {procedimiento.hora}
                  </Box>
                </TableCell>
                <TableCell>{procedimiento.sala}</TableCell>
                <TableCell>
                  <Chip 
                    label={procedimiento.preparacion} 
                    color={getPreparacionColor(procedimiento.preparacion)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={procedimiento.estado} 
                    color={getEstadoColor(procedimiento.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={procedimiento.progreso} 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption">
                      {procedimiento.progreso}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {procedimiento.estado === 'En Proceso' && (
                    <IconButton color="warning" size="small" title="Pausar">
                      <Pause />
                    </IconButton>
                  )}
                  {(procedimiento.estado === 'Esperando' || procedimiento.estado === 'Programado') && (
                    <IconButton color="primary" size="small" title="Iniciar">
                      <PlayArrow />
                    </IconButton>
                  )}
                  {procedimiento.estado !== 'Finalizado' && (
                    <IconButton color="success" size="small" title="Completar">
                      <CheckCircle />
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

export default AgendaHoy;