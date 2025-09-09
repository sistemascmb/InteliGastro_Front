import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Avatar,
  Divider
} from '@mui/material';
import { 
  PersonAdd, 
  CalendarToday, 
  MedicalServices, 
  People,
  TrendingUp,
  Schedule,
  LocalHospital,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Nueva Cita Médica',
      description: 'Registrar nueva cita médica para paciente',
      icon: <CalendarToday />,
      color: '#1976d2',
      path: '/admision/cita'
    },
    {
      title: 'Nuevo Procedimiento',
      description: 'Programar procedimiento médico',
      icon: <MedicalServices />,
      color: '#2e7d32',
      path: '/admision/procedimiento'
    },
    {
      title: 'Buscar Paciente',
      description: 'Buscar y gestionar información de pacientes',
      icon: <People />,
      color: '#ed6c02',
      path: '/pacientes/buscar-paciente'
    },
    {
      title: 'Agenda del Día',
      description: 'Ver procedimientos programados para hoy',
      icon: <Schedule />,
      color: '#9c27b0',
      path: '/procedimientos/agenda-hoy'
    }
  ];

  const statsCards = [
    {
      title: 'Pacientes Atendidos Hoy',
      value: '24',
      icon: <People />,
      color: '#1976d2',
      trend: '+12%'
    },
    {
      title: 'Citas Agendadas',
      value: '18',
      icon: <CalendarToday />,
      color: '#2e7d32',
      trend: '+8%'
    },
    {
      title: 'Procedimientos Completados',
      value: '8',
      icon: <MedicalServices />,
      color: '#ed6c02',
      trend: '+15%'
    },
    {
      title: 'En Sala de Espera',
      value: '6',
      icon: <LocalHospital />,
      color: '#9c27b0',
      trend: '-3%'
    }
  ];

  return (
    <Box>
      {/* Header de Bienvenida */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Bienvenido a InteligastrO
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sistema de Gestión Médica - Clínica María Belén
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </Box>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUp sx={{ mr: 0.5, fontSize: 16 }} />
                      {stat.trend} vs ayer
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Acciones Rápidas */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Acciones Rápidas
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                <Avatar sx={{ bgcolor: action.color, width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  {action.icon}
                </Avatar>
                <Typography variant="h6" component="div" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                <Button size="small" color="primary">
                  Acceder
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Información de Estado del Sistema */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1 }} />
          Estado del Sistema
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                98.5%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tiempo de Actividad
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" gutterBottom>
                1,247
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pacientes Registrados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personal Médico Activo
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Home;