import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  MenuItem,
  Divider
} from '@mui/material';
import { Save, Clear, Person } from '@mui/icons-material';

const NuevoPaciente = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Registro de Nuevo Paciente
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<Clear />}
            sx={{ mr: 2 }}
          >
            Limpiar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />}
          >
            Guardar
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6">
            Información Personal
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombres *"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Apellidos *"
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tipo de Documento"
              select
              variant="outlined"
              defaultValue="CC"
            >
              <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
              <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
              <MenuItem value="PP">Pasaporte</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número de Documento *"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento *"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Género"
              select
              variant="outlined"
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
              <MenuItem value="O">Otro</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Estado Civil"
              select
              variant="outlined"
            >
              <MenuItem value="Soltero">Soltero(a)</MenuItem>
              <MenuItem value="Casado">Casado(a)</MenuItem>
              <MenuItem value="Union_libre">Unión Libre</MenuItem>
              <MenuItem value="Divorciado">Divorciado(a)</MenuItem>
              <MenuItem value="Viudo">Viudo(a)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ocupación"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información de Contacto
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono Principal *"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono Secundario"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ciudad"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información de Seguridad Social
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="EPS/Seguro"
              select
              variant="outlined"
            >
              <MenuItem value="">Seleccionar EPS</MenuItem>
              <MenuItem value="salud_total">Salud Total</MenuItem>
              <MenuItem value="nueva_eps">Nueva EPS</MenuItem>
              <MenuItem value="sanitas">Sanitas</MenuItem>
              <MenuItem value="coomeva">Coomeva</MenuItem>
              <MenuItem value="sura">Sura</MenuItem>
              <MenuItem value="particular">Particular</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número de Afiliación"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Afiliación"
              select
              variant="outlined"
            >
              <MenuItem value="cotizante">Cotizante</MenuItem>
              <MenuItem value="beneficiario">Beneficiario</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Régimen"
              select
              variant="outlined"
            >
              <MenuItem value="contributivo">Contributivo</MenuItem>
              <MenuItem value="subsidiado">Subsidiado</MenuItem>
              <MenuItem value="especial">Especial</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contacto de Emergencia
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre Completo"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Parentesco"
              select
              variant="outlined"
            >
              <MenuItem value="padre">Padre</MenuItem>
              <MenuItem value="madre">Madre</MenuItem>
              <MenuItem value="hijo">Hijo(a)</MenuItem>
              <MenuItem value="hermano">Hermano(a)</MenuItem>
              <MenuItem value="conyuge">Cónyuge</MenuItem>
              <MenuItem value="amigo">Amigo(a)</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NuevoPaciente;