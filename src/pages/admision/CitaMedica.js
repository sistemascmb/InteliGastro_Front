import React from 'react';
import { Box, Typography, Paper, Button, Grid, TextField, MenuItem } from '@mui/material';
import { Add, Search } from '@mui/icons-material';

const CitaMedica = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Admisión - Cita Médica
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ height: 'fit-content' }}
        >
          Nueva Admisión
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buscar Paciente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cédula/Documento"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<Search />}
              sx={{ height: '56px' }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Datos de la Cita
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Médico"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar médico</MenuItem>
              <MenuItem value="1">Dr. García</MenuItem>
              <MenuItem value="2">Dra. Rodríguez</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hora"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Consulta"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar tipo</MenuItem>
              <MenuItem value="1">Primera vez</MenuItem>
              <MenuItem value="2">Control</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CitaMedica;