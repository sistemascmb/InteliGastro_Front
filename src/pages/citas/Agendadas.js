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
  Grid
} from '@mui/material';
import { Edit, Delete, CalendarToday, Search } from '@mui/icons-material';

const Agendadas = () => {
  const citasAgendadas = [
    {
      id: 1,
      paciente: 'María González',
      cedula: '1234567890',
      medico: 'Dr. García',
      fecha: '2024-01-15',
      hora: '09:00',
      tipo: 'Primera vez',
      estado: 'Confirmada'
    },
    {
      id: 2,
      paciente: 'Carlos Rodríguez',
      cedula: '0987654321',
      medico: 'Dra. López',
      fecha: '2024-01-15',
      hora: '10:30',
      tipo: 'Control',
      estado: 'Pendiente'
    },
    {
      id: 3,
      paciente: 'Ana Martínez',
      cedula: '1122334455',
      medico: 'Dr. García',
      fecha: '2024-01-15',
      hora: '14:00',
      tipo: 'Primera vez',
      estado: 'Confirmada'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Citas Agendadas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<CalendarToday />}
          sx={{ height: 'fit-content' }}
        >
          Nueva Cita
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
              label="Buscar Paciente"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Médico"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Cédula</strong></TableCell>
              <TableCell><strong>Médico</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Hora</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasAgendadas.map((cita) => (
              <TableRow key={cita.id}>
                <TableCell>{cita.paciente}</TableCell>
                <TableCell>{cita.cedula}</TableCell>
                <TableCell>{cita.medico}</TableCell>
                <TableCell>{cita.fecha}</TableCell>
                <TableCell>{cita.hora}</TableCell>
                <TableCell>{cita.tipo}</TableCell>
                <TableCell>
                  <Chip 
                    label={cita.estado} 
                    color={getEstadoColor(cita.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <Delete />
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

export default Agendadas;