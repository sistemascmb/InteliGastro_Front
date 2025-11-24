import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid, 
  Card, 
  CardContent,
  Paper,
  Divider
} from '@mui/material';
import { 
  CalendarMonth, 
  AssignmentTurnedIn,
  BarChart
} from '@mui/icons-material';

const Home = () => {
  // FUNCIÓN: Obtener fecha actual en formato español
  const getCurrentDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return today.toLocaleDateString('es-ES', options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ═══════════════════════════════════════════════════════════════════
          TÍTULO PRINCIPAL: Bienvenida con nombre del sistema
          ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Bienvenido a{' '}
          <Box component="span" sx={{ color: '#2184be' }}>
            CMB
          </Box>
        </Typography>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          BANNER HERO: Imagen médica futurista (placeholder por ahora)
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          height: 400, // TAMAÑO: 400px de altura como especificado
          borderRadius: 2,
          // TODO: Reemplazar con imagen médica real cuando esté disponible
          background: 'linear-gradient(135deg, #2184be 0%, #1565c0 50%, #0d47a1 100%)',
          position: 'relative',
          overflow: 'hidden',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // PATRÓN: Fondo decorativo médico con cruces
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 1,
            position: 'relative'
          }}
        >
          Sistema de Gestión de Procedimientos Gastroenterológicos
        </Typography>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          SUBTÍTULO: Fecha dinámica del dashboard
          ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#666' }}>
          Quick Dashboard para hoy {getCurrentDate()}
        </Typography>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          GRID DE MÉTRICAS 2x2: Tarjetas principales del dashboard
          ═══════════════════════════════════════════════════════════════════ */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* CARD 1: Examenes Agendados (Superior Izquierda) */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={2}
            sx={{ 
              minHeight: 200, // UNIFORMIDAD: Altura mínima para todas las cards
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Examenes Agendados
                  </Typography>
                  {/* NÚMERO PRINCIPAL: Valor grande y destacado */}
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#2184be',
                      fontSize: 48 // TAMAÑO: 48px como especificado
                    }}
                  >
                    0
                  </Typography>
                </Box>
                {/* ÍCONO: Calendario para representar agenda */}
                <CalendarMonth sx={{ fontSize: 48, color: '#2184be', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CARD 2: Examenes del Día con gráfico (Superior Derecha) */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={2}
            sx={{ 
              minHeight: 200,
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: '#2184be' }} />
                <Typography variant="h6" color="text.secondary">
                  Examenes del Día
                </Typography>
              </Box>
              
              {/* ÁREA DE GRÁFICO: Simulación con líneas de referencia */}
              <Box sx={{ mt: 2, height: 120, position: 'relative' }}>
                <Box sx={{ 
                  height: '100%', 
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  position: 'relative',
                  backgroundColor: '#f8f9fa' // FONDO: Como especificado
                }}>
                  {/* LÍNEAS DE REFERENCIA: Valores -1.0 a 1.0 */}
                  {[-1.0, -0.5, 0, 0.5, 1.0].map((value, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'absolute',
                        top: `${(1 - (value + 1) / 2) * 100}%`,
                        left: 0,
                        right: 0,
                        height: '1px',
                        backgroundColor: value === 0 ? '#bdbdbd' : '#e0e0e0',
                        '&::after': {
                          content: `"${value}"`,
                          position: 'absolute',
                          left: '-25px',
                          top: '-8px',
                          fontSize: '10px',
                          color: '#757575'
                        }
                      }}
                    />
                  ))}
                  
                  {/* PLACEHOLDER: Área para futuros datos de gráfico */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#999',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    Datos del gráfico se mostrarán aquí
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CARD 3: Examenes Completados (Inferior Izquierda) */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={2}
            sx={{ 
              minHeight: 200,
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Examenes Completados
                  </Typography>
                  {/* NÚMERO PRINCIPAL: Valor grande y destacado */}
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#2184be',
                      fontSize: 48
                    }}
                  >
                    0
                  </Typography>
                </Box>
                {/* ÍCONO: Checklist para representar completados */}
                <AssignmentTurnedIn sx={{ fontSize: 48, color: '#2184be', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CARD 4: Notificaciones (Inferior Derecha) */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={2}
            sx={{ 
              minHeight: 200,
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Notificaciones
              </Typography>
              
              {/* LISTA DE NOTIFICACIONES: Por ahora solo mensaje vacío */}
              <Box sx={{ mt: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  • No tiene notificaciones pendientes
                </Typography>
              </Box>
              
              {/* PLACEHOLDER: Área para futuras notificaciones */}
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
                  Las notificaciones aparecerán aquí cuando estén disponibles
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER: Copyright e información de la empresa
          ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', mt: 6, py: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          © 2025 - Intellicare Peru
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;