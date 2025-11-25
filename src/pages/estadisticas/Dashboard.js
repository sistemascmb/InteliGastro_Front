import React, { useState, useCallback, memo, useEffect } from 'react';
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
  Grid,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  NavigateNext,
  BarChart as BarChartIcon,
  Timeline,
  Download
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from 'services';
import estudiosService from 'services/estudiosService';

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
  const maxValue = Math.max(1, ...data.map(d => Math.max(d.completados, d.cancelados)));
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
            const percentage = total > 0 ? (item.cantidad / total) * 100 : 0;
            const angle = total > 0 ? (item.cantidad / total) * 360 : 0;

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

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const [barChartData, setBarChartData] = useState(monthNames.map(m => ({ mes: m, completados: 0, cancelados: 0 })));

  // Datos simulados para el gráfico circular (Exámenes por tipo de procedimiento)
  const [pieChartData, setPieChartData] = useState([]);

  const handleGenerarGraficos = useCallback(async () => {
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${selectedYear}-12-31`;
    const res = await appointmentsService.getAll_Proc_Buscados_Fechas({ startDate, endDate });
    const list = Array.isArray(res?.data) ? res.data : [];
    const counters = monthNames.map((mes) => ({ mes, completados: 0, cancelados: 0 }));
    list.forEach((p) => {
      const d = p?.appointmentDate ? new Date(p.appointmentDate) : null;
      if (!d || Number.isNaN(d.getTime())) return;
      const m = d.getMonth();
      const statusCode = Number(p?.status);
      if (statusCode === 10065) counters[m].completados += 1;
      else if (statusCode === 10067) counters[m].cancelados += 1;
    });
    setBarChartData(counters);

    const completed = list.filter((p) => Number(p?.status) === 10065);
    const byStudy = new Map();
    completed.forEach((p) => {
      const id = p?.studiesId;
      if (id == null) return;
      byStudy.set(id, (byStudy.get(id) || 0) + 1);
    });
    const uniqueIds = Array.from(byStudy.keys());
    const namesMap = new Map();
    await Promise.all(uniqueIds.map(async (id) => {
      try {
        const r = await estudiosService.getById(id);
        const name = r?.data?.name || String(id);
        namesMap.set(id, name);
      } catch {
        namesMap.set(id, String(id));
      }
    }));
    const pieData = uniqueIds.map((id) => ({ tipo: namesMap.get(id) || String(id), cantidad: byStudy.get(id) || 0 }));
    setPieChartData(pieData.sort((a, b) => b.cantidad - a.cantidad));
  }, [selectedYear]);

  const handleDownloadBarChartImage = () => {
    const width = 1200;
    const height = 400;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#2184be';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Exámenes Completados vs Cancelados por Mes (${selectedYear})`, width / 2, 30);
    const marginLeft = 60;
    const marginBottom = 60;
    const marginTop = 50;
    const marginRight = 20;
    const chartW = width - marginLeft - marginRight;
    const chartH = height - marginTop - marginBottom;
    const maxVal = Math.max(1, ...barChartData.map(d => Math.max(d.completados, d.cancelados)));
    const groupCount = barChartData.length;
    const groupWidth = chartW / groupCount;
    const barWidth = Math.min(32, groupWidth / 3);
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, marginTop + chartH);
    ctx.lineTo(marginLeft + chartW, marginTop + chartH);
    ctx.stroke();
    barChartData.forEach((item, i) => {
      const gx = marginLeft + i * groupWidth + groupWidth / 2;
      const compH = (item.completados / maxVal) * (chartH - 20);
      const cancH = (item.cancelados / maxVal) * (chartH - 20);
      ctx.fillStyle = '#2184be';
      ctx.fillRect(gx - barWidth - 4, marginTop + chartH - compH, barWidth, compH);
      ctx.fillStyle = '#2184be';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(String(item.completados), gx - barWidth - 4 + barWidth / 2, marginTop + chartH - compH - 8);
      ctx.fillStyle = '#f44336';
      ctx.fillRect(gx + 4, marginTop + chartH - cancH, barWidth, cancH);
      ctx.fillStyle = '#f44336';
      ctx.fillText(String(item.cancelados), gx + 4 + barWidth / 2, marginTop + chartH - cancH - 8);
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(item.mes, gx, marginTop + chartH + 16);
    });
    const legendY = height - 24;
    ctx.fillStyle = '#2184be';
    ctx.fillRect(marginLeft, legendY - 10, 12, 12);
    ctx.fillStyle = '#333';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Completados', marginLeft + 18, legendY);
    ctx.fillStyle = '#f44336';
    ctx.fillRect(marginLeft + 130, legendY - 10, 12, 12);
    ctx.fillStyle = '#333';
    ctx.fillText('Cancelados', marginLeft + 148, legendY);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `completados_cancelados_${selectedYear}.png`;
    a.click();
  };

  const handleDownloadBarTableExcel = () => {
    const headers = ['Mes', 'Completados', 'Cancelados', 'Total'];
    const rows = barChartData.map(i => [i.mes, i.completados, i.cancelados, i.completados + i.cancelados]);
    const totalsRow = [
      'TOTAL',
      barChartData.reduce((sum, item) => sum + item.completados, 0),
      barChartData.reduce((sum, item) => sum + item.cancelados, 0),
      barChartData.reduce((sum, item) => sum + item.completados + item.cancelados, 0)
    ];
    const aoa = [headers, ...rows, totalsRow];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen');
    XLSX.writeFile(wb, `resumen_mensual_${selectedYear}.xlsx`);
  };

  const handleDownloadPieChartImage = () => {
    const width = 800;
    const height = 500;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#2184be';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Exámenes por Tipo de Procedimiento (${selectedYear})`, width / 2, 30);
    const colors = ['#2184be', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];
    const total = pieChartData.reduce((s, i) => s + i.cantidad, 0) || 1;
    let angle = -Math.PI / 2;
    const cx = 240;
    const cy = 260;
    const r = 160;
    pieChartData.forEach((item, idx) => {
      const frac = item.cantidad / total;
      const next = angle + frac * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, next);
      ctx.closePath();
      ctx.fillStyle = colors[idx % colors.length];
      ctx.fill();
      angle = next;
    });
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 2;
    ctx.stroke();
    let lx = 460;
    let ly = 120;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    pieChartData.forEach((item, idx) => {
      const pct = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : '0.0';
      ctx.fillStyle = colors[idx % colors.length];
      ctx.fillRect(lx, ly - 10, 12, 12);
      ctx.fillStyle = '#333';
      ctx.fillText(`${item.tipo}: ${item.cantidad} (${pct}%)`, lx + 18, ly);
      ly += 22;
      if (ly > height - 40) {
        ly = 120;
        lx += 280;
      }
    });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `procedimientos_${selectedYear}.png`;
    a.click();
  };

  const handleDownloadPieTableExcel = () => {
    const total = pieChartData.reduce((sum, item) => sum + item.cantidad, 0);
    const headers = ['Tipo de Procedimiento', 'Cantidad', 'Porcentaje'];
    const rows = pieChartData.map(i => [i.tipo, i.cantidad, total ? `${((i.cantidad / total) * 100).toFixed(1)}%` : '0.0%']);
    const totalsRow = ['TOTAL', total, '100.0%'];
    const aoa = [headers, ...rows, totalsRow];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Distribución');
    XLSX.writeFile(wb, `procedimientos_${selectedYear}.xlsx`);
  };

  useEffect(() => {
    handleGenerarGraficos();
  }, []);

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

      {/* Header: selección de año */}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Timeline sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
            Dashboard de Estadísticas
          </Typography>
        </Box>

        {/* Controles de Año */}
        <FieldRow>
          <ResponsiveField label="Año" required>
            <FormControl fullWidth size="small">
              <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadBarChartImage}>Descargar gráfico</Button>
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadBarTableExcel}>Descargar tabla</Button>
            </Box>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadPieChartImage}>Descargar gráfico</Button>
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadPieTableExcel}>Descargar tabla</Button>
            </Box>
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