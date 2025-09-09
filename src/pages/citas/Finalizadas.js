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
import { Visibility, Print, Search, GetApp } from '@mui/icons-material';

const Finalizadas = () => {
  const citasFinalizadas = [
    {
      id: 1,
      paciente: 'María González',
      cedula: '1234567890',
      medico: 'Dr. García',
      fecha: '2024-01-10',
      horaInicio: '09:00',
      horaFin: '09:45',
      duracion: '45 min',
      diagnostico: 'Gastritis crónica',
      resultado: 'Tratamiento iniciado',
      proximaCita: '2024-02-10'
    },
    {
      id: 2,
      paciente: 'Carlos Rodríguez',
      cedula: '0987654321',
      medico: 'Dra. López',
      fecha: '2024-01-10',
      horaInicio: '10:30',
      horaFin: '11:00',
      duracion: '30 min',
      diagnostico: 'Control post-operatorio',
      resultado: 'Evolución favorable',
      proximaCita: '2024-01-25'
    },
    {
      id: 3,
      paciente: 'Ana Martínez',
      cedula: '1122334455',
      medico: 'Dr. Martínez',
      fecha: '2024-01-09',
      horaInicio: '14:00',
      horaFin: '15:15',
      duracion: '75 min',
      diagnostico: 'Endoscopia diagnóstica',
      resultado: 'Biopsia enviada a patología',
      proximaCita: '2024-01-20'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Citas Finalizadas
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<GetApp />}
          sx={{ height: 'fit-content' }}
        >
          Exportar Reporte
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
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Fecha Desde"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Fecha Hasta"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Médico"
              select
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="1">Dr. García</MenuItem>
              <MenuItem value="2">Dra. López</MenuItem>
              <MenuItem value="3">Dr. Martínez</MenuItem>
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Citas Completadas Hoy
            </Typography>
            <Typography variant="h3" color="success.main">
              {citasFinalizadas.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              Duración Promedio
            </Typography>
            <Typography variant="h3" color="info.main">
              50 min
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              Próximas Citas
            </Typography>
            <Typography variant="h3" color="primary.main">
              3
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
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Duración</strong></TableCell>
              <TableCell><strong>Diagnóstico</strong></TableCell>
              <TableCell><strong>Resultado</strong></TableCell>
              <TableCell><strong>Próxima Cita</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasFinalizadas.map((cita) => (
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
                <TableCell>
                  <Box>
                    <Typography variant="body2">{cita.fecha}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cita.horaInicio} - {cita.horaFin}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{cita.duracion}</TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {cita.diagnostico}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {cita.resultado}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={cita.proximaCita} 
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" title="Ver Detalle">
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary" size="small" title="Imprimir">
                    <Print />
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

export default Finalizadas;