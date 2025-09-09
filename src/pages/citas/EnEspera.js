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
  Grid
} from '@mui/material';
import { CheckCircle, Cancel, AccessTime, Refresh } from '@mui/icons-material';

const EnEspera = () => {
  const citasEnEspera = [
    {
      id: 1,
      paciente: 'Pedro Sánchez',
      cedula: '1111222233',
      medico: 'Dr. García',
      horaLlegada: '08:45',
      horaAsignada: '09:00',
      tiempoEspera: '15 min',
      prioridad: 'Normal',
      motivo: 'Control gastroenterológico'
    },
    {
      id: 2,
      paciente: 'Laura Jiménez',
      cedula: '4444555566',
      medico: 'Dra. López',
      horaLlegada: '09:30',
      horaAsignada: '10:00',
      tiempoEspera: '30 min',
      prioridad: 'Alta',
      motivo: 'Dolor abdominal severo'
    },
    {
      id: 3,
      paciente: 'Roberto Castro',
      cedula: '7777888899',
      medico: 'Dr. Martínez',
      horaLlegada: '10:15',
      horaAsignada: '10:30',
      tiempoEspera: '15 min',
      prioridad: 'Normal',
      motivo: 'Endoscopia de seguimiento'
    }
  ];

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'error';
      case 'Media':
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
          Citas en Espera
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              En Espera
            </Typography>
            <Typography variant="h3" color="warning.main">
              {citasEnEspera.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error.main">
              Prioridad Alta
            </Typography>
            <Typography variant="h3" color="error.main">
              {citasEnEspera.filter(c => c.prioridad === 'Alta').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              Tiempo Promedio
            </Typography>
            <Typography variant="h3" color="info.main">
              20 min
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Médico</strong></TableCell>
              <TableCell><strong>Hora Asignada</strong></TableCell>
              <TableCell><strong>Hora Llegada</strong></TableCell>
              <TableCell><strong>Tiempo Espera</strong></TableCell>
              <TableCell><strong>Prioridad</strong></TableCell>
              <TableCell><strong>Motivo</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasEnEspera.map((cita) => (
              <TableRow key={cita.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {cita.paciente}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      C.C. {cita.cedula}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{cita.medico}</TableCell>
                <TableCell>{cita.horaAsignada}</TableCell>
                <TableCell>{cita.horaLlegada}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                    {cita.tiempoEspera}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={cita.prioridad} 
                    color={getPrioridadColor(cita.prioridad)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {cita.motivo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton color="success" size="small" title="Atender">
                    <CheckCircle />
                  </IconButton>
                  <IconButton color="error" size="small" title="Cancelar">
                    <Cancel />
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

export default EnEspera;