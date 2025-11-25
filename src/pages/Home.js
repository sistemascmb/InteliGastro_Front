import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid, 
  Card, 
  CardContent,
  Paper,
  Divider,
  Slider
} from '@mui/material';
import { 
  CalendarMonth, 
  AssignmentTurnedIn,
  BarChart
} from '@mui/icons-material';
import { appointmentsService } from 'services';
import { useNavigate } from 'react-router-dom';

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

  const [agendadosHoy, setAgendadosHoy] = useState(0);
  const [completadosHoy, setCompletadosHoy] = useState(0);
  const [dayStatusCounts, setDayStatusCounts] = useState({ agendado: 0, preparacion: 0, dictado: 0, completado: 0, alta: 0, otros: 0 });
  const [chartCols, setChartCols] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarConteosHoy = async () => {
      try {
        const today = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

        const [resAgendados, resCompletados] = await Promise.all([
          appointmentsService.getAll_Proc_Agendado(),
          appointmentsService.getAll_Proc_Completado()
        ]);

        const baseA = Array.isArray(resAgendados?.data) ? resAgendados.data : [];
        const baseC = Array.isArray(resCompletados?.data) ? resCompletados.data : [];

        const countA = baseA.filter((p) => String(p?.appointmentDate || '').slice(0, 10) === todayStr).length;
        const countC = baseC.filter((p) => String(p?.appointmentDate || '').slice(0, 10) === todayStr).length;

        setAgendadosHoy(countA);
        setCompletadosHoy(countC);
      } catch (error) {
        setAgendadosHoy(0);
        setCompletadosHoy(0);
      }
    };
    cargarConteosHoy();
  }, []);

  useEffect(() => {
    const cargarExamenesDelDia = async () => {
      try {
        const today = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

        const resTodos = await appointmentsService.getAll_Proc_Todos();
        const base = Array.isArray(resTodos?.data) ? resTodos.data : [];
        const filtered = base.filter((p) => {
          const v = p?.appointmentDate;
          const dt = new Date(v);
          if (!Number.isNaN(dt.getTime())) {
            return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` === todayStr;
          }
          return String(v || '').slice(0, 10) === todayStr;
        });
        const codes = filtered
          .map((p) => parseInt(p?.status, 10))
          .filter((n) => Number.isFinite(n));
        const inSet = (set) => codes.filter((s) => set.includes(s)).length;
        const counts = {
          agendado: inSet([10062, 10068]),
          preparacion: inSet([10063, 10064]),
          dictado: inSet([10069, 10070]),
          completado: inSet([10065]),
          alta: inSet([10066]),
          otros: filtered.length - (inSet([10062, 10068]) + inSet([10063, 10064]) + inSet([10069, 10070]) + inSet([10065]) + inSet([10066]))
        };
        setDayStatusCounts(counts);
      } catch (error) {
        setDayStatusCounts({ agendado: 0, preparacion: 0, dictado: 0, completado: 0, alta: 0, otros: 0 });
      }
    };
    cargarExamenesDelDia();
  }, []);

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
          height: 400,
          borderRadius: 2,
          backgroundImage: 'url(https://medicinasa.com.br/investimentos-cepon/cepon-2/)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.35)'
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
          Resumen para hoy {getCurrentDate()}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        <Grid item xs={12} md={12 - chartCols}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <Card 
                elevation={2}
                sx={{ 
                  minHeight: 150,
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                //onClick={() => navigate('/procedimientos/agendados')}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Examenes Agendados
                      </Typography>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#2184be',
                          fontSize: 48
                        }}
                      >
                        {agendadosHoy}
                      </Typography>
                    </Box>
                    <CalendarMonth sx={{ fontSize: 48, color: '#2184be', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
          </Grid>
        </Grid>
        <Grid item xs={12} md={chartCols}>
          <Card 
            elevation={2}
            sx={{ 
              minHeight: 330,
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <BarChart sx={{ mr: 1, color: '#2184be' }} />
                <Typography variant="h6" color="text.secondary">
                  Examenes del Día
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Ancho</Typography>
                  <Slider value={chartCols} min={4} max={12} step={1} onChange={(e, v) => setChartCols(v)} sx={{ width: 140 }} />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                {(() => {
                  const totalRaw = Object.values(dayStatusCounts).reduce((a, b) => a + b, 0);
                  const total = totalRaw || 1;
                  const items = [
                    { key: 'agendado', label: 'Agendados', color: '#2184be' },
                    { key: 'preparacion', label: 'Preparación', color: '#03a9f4' },
                    { key: 'dictado', label: 'Dictado', color: '#7b1fa2' },
                    { key: 'completado', label: 'Completados', color: '#2e7d32' },
                    { key: 'alta', label: 'Alta', color: '#6d4c41' },
                    { key: 'otros', label: 'Otros', color: '#9e9e9e' }
                  ];
                  if (totalRaw === 0) {
                    return (
                      <Box sx={{ p: 2, textAlign: 'center', color: '#777' }}>
                        Sin datos para hoy
                      </Box>
                    );
                  }
                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                      {items.map((it) => {
                        const value = dayStatusCounts[it.key] || 0;
                        const pct = Math.round((value / total) * 100);
                        const textColor = pct >= 15 ? '#fff' : '#333';
                        return (
                          <Box key={it.key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ minWidth: 150, color: '#444', fontSize: 14, fontWeight: 600 }}>{it.label}</Box>
                            <Box sx={{ flex: 1, height: 24, borderRadius: 1, backgroundColor: '#e9ecef', overflow: 'hidden', position: 'relative' }}>
                              <Box sx={{ width: `${pct}%`, height: '100%', backgroundColor: it.color }} />
                              <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: textColor }}>{value}</Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12 - chartCols}>
          <Grid container spacing={3} direction="column">
            
            <Grid item xs={12}>
              <Card 
                elevation={2}
                sx={{ 
                  minHeight: 150,
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
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#2184be',
                          fontSize: 48
                        }}
                      >
                        {completadosHoy}
                      </Typography>
                    </Box>
                    <AssignmentTurnedIn sx={{ fontSize: 48, color: '#2184be', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER: Copyright e información de la empresa
          ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ textAlign: 'center', mt: 6, py: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          © 2025 - CLINICA MARIA BELEN
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;