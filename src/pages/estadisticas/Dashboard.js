import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard - Clínica María Belén
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Pacientes Hoy
            </Typography>
            <Typography variant="h3">
              24
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Citas Pendientes
            </Typography>
            <Typography variant="h3">
              12
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Procedimientos
            </Typography>
            <Typography variant="h3">
              8
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Personal Activo
            </Typography>
            <Typography variant="h3">
              15
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;