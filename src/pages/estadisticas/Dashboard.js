import React, { useState, useCallback, memo } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid
} from '@mui/material';
import {
  NavigateNext,
  BarChart as BarChartIcon,
  Timeline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Componente de header de sección
const SectionHeader = ({ title }) => (
  <Box
    sx={{
      backgroundColor: '#2184be',
      color: 'white',
      padding: '12px 20px',
      marginBottom: 0,
      borderRadius: '8px 8px 0 0'
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
  </Box>
);

// Componente ResponsiveField memoizado
const ResponsiveField = memo(({ label, children, required = false, sx = {} }) => (
  <Box sx={{ flex: 1, ...sx }}>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 'bold',
        color: '#333',
        mb: 1
      }}
    >
      {label}{required && ' *'}
    </Typography>
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  </Box>
));

ResponsiveField.displayName = 'ResponsiveField';

// Componente FieldRow memoizado
const FieldRow = memo(({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      mb: 3,
      width: '100%'
    }}
  >
    {children}
  </Box>
));

FieldRow.displayName = 'FieldRow';

// Componente simple de gráfico de barras
const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.completados, d.cancelados)));
  const chartHeight = 280;
  const barWidth = 32;
  const spacing = 15;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center', color: '#2184be' }}>
        {title}
      </Typography>

      <Box sx={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        height: chartHeight,
        gap: `${spacing}px`,
        borderBottom: '2px solid #ddd',
        borderLeft: '2px solid #ddd',
        pl: 1,
        pb: 1,
        overflowX: 'auto',
        maxWidth: '100%'
      }}>
        {data.map((item, index) => {
          const completadosHeight = (item.completados / maxValue) * (chartHeight - 50);
          const canceladosHeight = (item.cancelados / maxValue) * (chartHeight - 50);

          return (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: '70px' }}>
              <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.5 }}>
                {/* Barra Completados (Azul) */}
                <Box
                  sx={{
                    width: barWidth,
                    height: completadosHeight,
                    backgroundColor: '#2184be',
                    borderRadius: '3px 3px 0 0',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: '#1e75a6',
                      cursor: 'pointer'
                    }
                  }}
                  title={`Completados: ${item.completados}`}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: -18,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                      color: '#2184be',
                      fontSize: '10px'
                    }}
                  >
                    {item.completados}
                  </Typography>
                </Box>

                {/* Barra Cancelados (Rojo) */}
                <Box
                  sx={{
                    width: barWidth,
                    height: canceladosHeight,
                    backgroundColor: '#f44336',
                    borderRadius: '3px 3px 0 0',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                      cursor: 'pointer'
                    }
                  }}
                  title={`Cancelados: ${item.cancelados}`}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: -18,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                      color: '#f44336',
                      fontSize: '10px'
                    }}
                  >
                    {item.cancelados}
                  </Typography>
                </Box>
              </Box>

              {/* Etiqueta del mes */}
              <Typography variant="caption" fontWeight="bold" sx={{ mt: 0.5 }}>
                {item.mes}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Leyenda */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 14, height: 14, backgroundColor: '#2184be', borderRadius: 1 }} />
          <Typography variant="caption">Completados</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 14, height: 14, backgroundColor: '#f44336', borderRadius: 1 }} />
          <Typography variant="caption">Cancelados</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Componente simple de gráfico circular
const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.cantidad, 0);
  let currentAngle = 0;
  const radius = 70;
  const centerX = 90;
  const centerY = 90;

  const colors = ['#2184be', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center', color: '#2184be' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <svg viewBox="0 0 180 180" style={{ width: "100%", height: "auto", maxWidth: "400px" }}>
          {data.map((item, index) => {
            const percentage = (item.cantidad / total) * 100;
            const angle = (item.cantidad / total) * 360;

            const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);

            const x2 = centerX + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                title={`${item.tipo}: ${item.cantidad} (${percentage.toFixed(1)}%)`}
              />
            );
          })}

          {/* Centro del gráfico */}
          <circle cx={centerX} cy={centerY} r="22" fill="white" stroke="#ddd" strokeWidth="2" />
          <text x={centerX} y={centerY - 4} textAnchor="middle" className="text-sm font-bold" fill="#666" fontSize="12">
            Total
          </text>
          <text x={centerX} y={centerY + 8} textAnchor="middle" className="text-sm" fill="#666" fontSize="14">
            {total}
          </text>
        </svg>
      </Box>

      {/* Leyenda */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, alignItems: 'flex-start', width: '100%' }}>
        {data.map((item, index) => {
          const percentage = ((item.cantidad / total) * 100).toFixed(1);
          return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Box sx={{
                width: 12,
                height: 12,
                backgroundColor: colors[index % colors.length],
                borderRadius: 1,
                flexShrink: 0
              }} />
              <Typography variant="caption" sx={{ fontSize: '11px' }}>
                {item.tipo}: {item.cantidad} ({percentage}%)
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Estado para el rango de fechas
  const [dateRange, setDateRange] = useState({
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31'
  });

  // Datos simulados para el gráfico de barras (Completados vs Cancelados por mes)
  const [barChartData, setBarChartData] = useState([
    { mes: 'Ene', completados: 45, cancelados: 8 },
    { mes: 'Feb', completados: 52, cancelados: 12 },
    { mes: 'Mar', completados: 38, cancelados: 6 },
    { mes: 'Abr', completados: 61, cancelados: 15 },
    { mes: 'May', completados: 48, cancelados: 9 },
    { mes: 'Jun', completados: 55, cancelados: 11 },
    { mes: 'Jul', completados: 42, cancelados: 7 },
    { mes: 'Ago', completados: 58, cancelados: 13 },
    { mes: 'Sep', completados: 47, cancelados: 10 },
    { mes: 'Oct', completados: 53, cancelados: 8 },
    { mes: 'Nov', completados: 49, cancelados: 14 },
    { mes: 'Dic', completados: 44, cancelados: 6 }
  ]);

  // Datos simulados para el gráfico circular (Exámenes por tipo de procedimiento)
  const [pieChartData, setPieChartData] = useState([
    { tipo: 'Endoscopia', cantidad: 245 },
    { tipo: 'Laparoscopia', cantidad: 89 },
    { tipo: 'Hepatología', cantidad: 156 },
    { tipo: 'Gastroscopia', cantidad: 132 }
  ]);

  // Función para manejar cambios en el rango de fechas
  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  }, []);

  // Función para generar los gráficos
  const handleGenerarGraficos = () => {
    console.log('Generando gráficos para el rango:', dateRange);
    // Aquí simularíamos la actualización de datos basado en el rango de fechas
    alert(`Gráficos generados para el período: ${dateRange.fechaInicio} a ${dateRange.fechaFin}`);
  };

  return (
    <Container maxWidth={false} sx={{ py: 1, px: 2, width: '100%', maxWidth: 'none' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Inicio
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/estadisticas"
          onClick={(e) => {
            e.preventDefault();
            navigate('/estadisticas');
          }}
        >
          Estadísticas
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>

      {/* Header con rango de fechas */}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Timeline sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
            Dashboard de Estadísticas
          </Typography>
        </Box>

        {/* Controles de Rango de Fechas */}
        <FieldRow>
          <ResponsiveField label="Fecha Inicio" required>
            <TextField
              fullWidth
              type="date"
              value={dateRange.fechaInicio}
              onChange={(e) => handleDateRangeChange('fechaInicio', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                  }
                }
              }}
            />
          </ResponsiveField>

          <ResponsiveField label="Fecha Fin" required>
            <TextField
              fullWidth
              type="date"
              value={dateRange.fechaFin}
              onChange={(e) => handleDateRangeChange('fechaFin', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                  }
                }
              }}
            />
          </ResponsiveField>

          <ResponsiveField label=" " sx={{ flex: 1 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<BarChartIcon />}
              onClick={handleGenerarGraficos}
              sx={{
                backgroundColor: '#2184be',
                '&:hover': {
                  backgroundColor: '#1e75a6'
                },
                minHeight: '40px'
              }}
            >
              Generar
            </Button>
          </ResponsiveField>
        </FieldRow>
      </Paper>

      {/* Gráficos */}
        {/* Gráfico de Barras - Completados vs Cancelados */}
        <Grid item xs={12}>
          <Paper sx={{ boxShadow: 3, mb: 2 }}>
            <SimpleBarChart
              data={barChartData}
              title="Exámenes Completados vs Cancelados por Mes"
            />

            {/* Tabla debajo del gráfico de barras */}
            <Box sx={{ p: 2, pt: 0 }}>
              <SectionHeader title="Resumen Mensual" />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Mes</strong></TableCell>
                      <TableCell align="center"><strong>Completados</strong></TableCell>
                      <TableCell align="center"><strong>Cancelados</strong></TableCell>
                      <TableCell align="center"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {barChartData.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="caption" fontWeight="bold">
                            {item.mes}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="caption" sx={{ color: '#2184be', fontWeight: 'bold' }}>
                            {item.completados}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                            {item.cancelados}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="caption" fontWeight="bold">
                            {item.completados + item.cancelados}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Fila de totales */}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>
                        <Typography variant="caption" fontWeight="bold">
                          TOTAL
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" sx={{ color: '#2184be', fontWeight: 'bold' }}>
                          {barChartData.reduce((sum, item) => sum + item.completados, 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                          {barChartData.reduce((sum, item) => sum + item.cancelados, 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" fontWeight="bold">
                          {barChartData.reduce((sum, item) => sum + item.completados + item.cancelados, 0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

      {/* Sección de Gráfico Circular y Tabla */}
        <Grid item xs={12}>
          <Paper sx={{ boxShadow: 3 }}>
            <SimplePieChart
              data={pieChartData}
              title="Exámenes por Tipo de Procedimiento"
            />

            {/* Tabla debajo del gráfico circular */}
            <Box sx={{ p: 2, pt: 0 }}>
              <SectionHeader title="Distribución por Procedimiento" />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Tipo de Procedimiento</strong></TableCell>
                      <TableCell align="center"><strong>Cantidad</strong></TableCell>
                      <TableCell align="center"><strong>Porcentaje</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pieChartData.map((item, index) => {
                      const total = pieChartData.reduce((sum, d) => sum + d.cantidad, 0);
                      const percentage = ((item.cantidad / total) * 100).toFixed(1);
                      return (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{
                                width: 12,
                                height: 12,
                                backgroundColor: ['#2184be', '#4caf50', '#ff9800', '#f44336', '#9c27b0'][index % 5],
                                borderRadius: 1
                              }} />
                              <Typography variant="body2" fontWeight="bold">
                                {item.tipo}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {item.cantidad}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {percentage}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Fila de total */}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          TOTAL
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {pieChartData.reduce((sum, item) => sum + item.cantidad, 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          100.0%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
    </Container>
  );
};

export default Dashboard;