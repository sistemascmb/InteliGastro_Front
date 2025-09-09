import React from 'react';
import { Box, Typography, Paper, Button, Grid, TextField, MenuItem, Chip } from '@mui/material';
import { Add, Search } from '@mui/icons-material';

const ProcedimientoAdmision = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Admisión - Procedimiento
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
          Información del Paciente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar Paciente"
              variant="outlined"
              placeholder="Cédula o nombre"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              startIcon={<Search />}
              sx={{ height: '56px' }}
            >
              Buscar
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Chip 
              label="Paciente: María González - C.C. 1234567890" 
              color="primary" 
              variant="outlined"
              sx={{ height: '56px', fontSize: '1rem' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Detalles del Procedimiento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Procedimiento"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar procedimiento</MenuItem>
              <MenuItem value="1">Endoscopia</MenuItem>
              <MenuItem value="2">Colonoscopia</MenuItem>
              <MenuItem value="3">Gastroscopia</MenuItem>
              <MenuItem value="4">Biopsia</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Médico Especialista"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar médico</MenuItem>
              <MenuItem value="1">Dr. Martínez - Gastroenterólogo</MenuItem>
              <MenuItem value="2">Dra. López - Gastroenteróloga</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha del Procedimiento"
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
              label="Sala"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar sala</MenuItem>
              <MenuItem value="1">Sala 1 - Endoscopia</MenuItem>
              <MenuItem value="2">Sala 2 - Procedimientos</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado"
              select
              variant="outlined"
              defaultValue="programado"
            >
              <MenuItem value="programado">Programado</MenuItem>
              <MenuItem value="confirmado">Confirmado</MenuItem>
              <MenuItem value="en-espera">En Espera</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Indicaciones Previas"
              multiline
              rows={3}
              variant="outlined"
              placeholder="Instrucciones de preparación para el paciente..."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={2}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProcedimientoAdmision;