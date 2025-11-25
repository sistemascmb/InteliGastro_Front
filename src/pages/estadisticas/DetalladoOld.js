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
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  NavigateNext,
  Search,
  BarChart,
  GetApp
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

const EstadisticasDetalladoOld = () => {
  const navigate = useNavigate();

  // Estado para filtros de búsqueda
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    centro: '',
    estado: '',
    procedimiento: '',
    searchTerm: ''
  });

  // Estado para los datos estadísticos detallados
  const [estadisticasDetalladas] = useState([
    {
      id: 1,
      examenNumero: 'EX-2024-001',
      estado: 'Completado',
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Endoscopia 1',
      recurso: 'Endoscopio Olympus EVIS X1',
      pacienteNombre: 'María Elena González Martínez',
      procedimiento: 'Endoscopia Alta',
      cie10: 'K25.9',
      seguro: 'EsSalud',
      medicoReferente: 'Dr. Carlos García Mendoza',
      fechaExamen: '2024-01-15',
      horaExamen: '09:00',
      fechaCreado: '2024-01-10 14:30',
      fechaLlegada: '2024-01-15 08:45',
      inicioPreparacion: '2024-01-15 08:50',
      finPreparacion: '2024-01-15 09:00',
      inicioProcedimiento: 'Dra. Ana López Silva - 2024-01-15 09:05',
      finProcedimiento: 'Dra. Ana López Silva - 2024-01-15 09:35',
      reporteGenerado: 'Dr. Carlos García - 2024-01-15 10:15',
      alta: '2024-01-15 11:00'
    },
    {
      id: 2,
      examenNumero: 'EX-2024-002',
      estado: 'Agendado',
      centro: 'Clínica María Belén - Sede Norte',
      sala: 'Sala de Endoscopia 2',
      recurso: 'Colonoscopio Pentax',
      pacienteNombre: 'Carlos Antonio Rodríguez Vega',
      procedimiento: 'Colonoscopia Diagnóstica',
      cie10: 'K59.0',
      seguro: 'Particular',
      medicoReferente: 'Dr. Pedro Silva Rojas',
      fechaExamen: '2024-01-16',
      horaExamen: '14:30',
      fechaCreado: '2024-01-12 16:20',
      fechaLlegada: '-',
      inicioPreparacion: '-',
      finPreparacion: '-',
      inicioProcedimiento: '-',
      finProcedimiento: '-',
      reporteGenerado: '-',
      alta: '-'
    },
    {
      id: 3,
      examenNumero: 'EX-2024-003',
      estado: 'En Progreso',
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Procedimientos',
      recurso: 'Equipo de Biopsia',
      pacienteNombre: 'Ana Patricia Martínez Torres',
      procedimiento: 'Biopsia Gástrica',
      cie10: 'K31.9',
      seguro: 'Rimac Seguros',
      medicoReferente: 'Dra. Carmen Martínez Torres',
      fechaExamen: '2024-01-17',
      horaExamen: '11:00',
      fechaCreado: '2024-01-13 09:15',
      fechaLlegada: '2024-01-17 10:30',
      inicioPreparacion: '2024-01-17 10:35',
      finPreparacion: '2024-01-17 10:50',
      inicioProcedimiento: 'Dr. Pedro Silva - 2024-01-17 11:00',
      finProcedimiento: '-',
      reporteGenerado: '-',
      alta: '-'
    },
    {
      id: 4,
      examenNumero: 'EX-2024-004',
      estado: 'Alta',
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Endoscopia 1',
      recurso: 'Endoscopio Olympus EVIS X1',
      pacienteNombre: 'Roberto Luis Fernández Silva',
      procedimiento: 'CPRE Diagnóstica',
      cie10: 'K87.1',
      seguro: 'SIS',
      medicoReferente: 'Dr. Luis Martínez Torres',
      fechaExamen: '2024-01-14',
      horaExamen: '08:00',
      fechaCreado: '2024-01-09 11:45',
      fechaLlegada: '2024-01-14 07:45',
      inicioPreparacion: '2024-01-14 07:50',
      finPreparacion: '2024-01-14 08:00',
      inicioProcedimiento: 'Dra. Ana Lopez Silva - 2024-01-14 08:05',
      finProcedimiento: 'Dra. Ana Lopez Silva - 2024-01-14 09:20',
      reporteGenerado: 'Dr. Carlos García - 2024-01-14 10:30',
      alta: '2024-01-15 14:00'
    },
    {
      id: 5,
      examenNumero: 'EX-2024-005',
      estado: 'Cancelado',
      centro: 'Clínica María Belén - Sede Norte',
      sala: 'Sala de Endoscopia 2',
      recurso: 'Colonoscopio Pentax',
      pacienteNombre: 'Carmen Elena Vargas Ruiz',
      procedimiento: 'Colonoscopia Terapéutica',
      cie10: 'K59.0',
      seguro: 'Pacifico Seguros',
      medicoReferente: 'Dra. Carmen Ruiz Mendoza',
      fechaExamen: '2024-01-13',
      horaExamen: '15:30',
      fechaCreado: '2024-01-08 13:20',
      fechaLlegada: '-',
      inicioPreparacion: '-',
      finPreparacion: '-',
      inicioProcedimiento: '-',
      finProcedimiento: '-',
      reporteGenerado: '-',
      alta: '-'
    }
  ]);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'success';
      case 'Agendado':
        return 'info';
      case 'En Progreso':
        return 'warning';
      case 'Alta':
        return 'secondary';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Función para buscar estadísticas
  const handleBuscarEstadisticas = () => {
    console.log('Buscando estadísticas con filtros:', filters);
  };

  // Función para exportar a Excel
  const handleExportarExcel = () => {
    console.log('Exportando estadísticas a Excel...');

    // Crear datos para exportar
    const dataToExport = estadisticasFiltradas.map(item => ({
      'Examen #': item.examenNumero,
      'Estado': item.estado,
      'Centro': item.centro,
      'Sala': item.sala,
      'Recurso': item.recurso,
      'Paciente': item.pacienteNombre,
      'Procedimiento': item.procedimiento,
      'CIE-10': item.cie10,
      'Seguro': item.seguro,
      'Médico Ref.': item.medicoReferente,
      'Fecha de Examen': `${item.fechaExamen} ${item.horaExamen}`,
      'Creado': item.fechaCreado,
      'Llegada': item.fechaLlegada,
      'Inicio Preparación': item.inicioPreparacion,
      'Fin Preparación': item.finPreparacion,
      'Inicio Procedimiento': item.inicioProcedimiento,
      'Fin Procedimiento': item.finProcedimiento,
      'Reporte Generado': item.reporteGenerado,
      'Alta': item.alta
    }));

    // Simular descarga de Excel
    const fileName = `Estadisticas_Detalladas_${new Date().toISOString().split('T')[0]}.xlsx`;
    console.log(`Generando archivo: ${fileName}`);
    console.log('Datos a exportar:', dataToExport);

    // En producción aquí se implementará la lógica real de exportación
    alert(`Exportando ${dataToExport.length} registros a Excel: ${fileName}`);
  };

  // Filtrar estadísticas basado en los filtros
  const estadisticasFiltradas = estadisticasDetalladas.filter(item => {
    const cumpleFechaInicio = !filters.fechaInicio || item.fechaExamen >= filters.fechaInicio;
    const cumpleFechaFin = !filters.fechaFin || item.fechaExamen <= filters.fechaFin;
    const cumpleCentro = !filters.centro || item.centro.toLowerCase().includes(filters.centro.toLowerCase());
    const cumpleEstado = !filters.estado || item.estado === filters.estado;
    const cumpleProcedimiento = !filters.procedimiento || item.procedimiento.toLowerCase().includes(filters.procedimiento.toLowerCase());
    const cumpleBusqueda = !filters.searchTerm ||
      item.pacienteNombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.examenNumero.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.medicoReferente.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return cumpleFechaInicio && cumpleFechaFin && cumpleCentro && cumpleEstado && cumpleProcedimiento && cumpleBusqueda;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
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
        <Typography color="text.primary">Detallado</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
                Estadísticas Detalladas
              </Typography>
            </Box>

            {/* Botón de Exportar */}
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleExportarExcel}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                },
                minHeight: '40px'
              }}
            >
              Exportar Excel
            </Button>
          </Box>

          {/* Filtros de Búsqueda */}
          <FieldRow>
            <ResponsiveField label="Fecha Inicio" required>
              <TextField
                fullWidth
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
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
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
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

            <ResponsiveField label="Centro">
              <FormControl fullWidth size="small">
                <Select
                  value={filters.centro}
                  onChange={(e) => handleFilterChange('centro', e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }}
                >
                  <MenuItem value="">Todos los centros</MenuItem>
                  <MenuItem value="Sede Central">Clínica María Belén - Sede Central</MenuItem>
                  <MenuItem value="Sede Norte">Clínica María Belén - Sede Norte</MenuItem>
                  <MenuItem value="Sede Sur">Clínica María Belén - Sede Sur</MenuItem>
                </Select>
              </FormControl>
            </ResponsiveField>

            <ResponsiveField label="Estado">
              <FormControl fullWidth size="small">
                <Select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="Agendado">Agendado</MenuItem>
                  <MenuItem value="En Progreso">En Progreso</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                  <MenuItem value="Alta">Alta</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </ResponsiveField>
          </FieldRow>

          <FieldRow>
            <ResponsiveField label="Procedimiento">
              <FormControl fullWidth size="small">
                <Select
                  value={filters.procedimiento}
                  onChange={(e) => handleFilterChange('procedimiento', e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }}
                >
                  <MenuItem value="">Todos los procedimientos</MenuItem>
                  <MenuItem value="Endoscopia Alta">Endoscopia Alta</MenuItem>
                  <MenuItem value="Colonoscopia">Colonoscopia</MenuItem>
                  <MenuItem value="Biopsia Gástrica">Biopsia Gástrica</MenuItem>
                  <MenuItem value="CPRE">CPRE</MenuItem>
                  <MenuItem value="Polipectomía">Polipectomía</MenuItem>
                </Select>
              </FormControl>
            </ResponsiveField>

            <ResponsiveField label="Buscar" sx={{ flex: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar por paciente, examen o médico..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
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
                startIcon={<Search />}
                onClick={handleBuscarEstadisticas}
                sx={{
                  backgroundColor: '#2184be',
                  '&:hover': {
                    backgroundColor: '#1e75a6'
                  },
                  minHeight: '40px'
                }}
              >
                Buscar
              </Button>
            </ResponsiveField>
          </FieldRow>
        </Paper>

        {/* Contenido - 80% */}
        <Paper sx={{ flex: 1, boxShadow: 3}}>
          <SectionHeader title={`Estadísticas Detalladas (${estadisticasFiltradas.length} registros)`} />

          {/* Tabla con scroll horizontal */}
          <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
            <Table stickyHeader sx={{ minWidth: '2000' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ minWidth: 120, position: 'sticky', left: 0, backgroundColor: '#f5f5f5', zIndex: 10 }}>
                    <strong>Examen #</strong>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}><strong>Estado</strong></TableCell>
                  <TableCell sx={{ minWidth: 250 }}><strong>Centro [Sala] {'{Recurso}'}</strong></TableCell>
                  <TableCell sx={{ minWidth: 250 }}><strong>Paciente</strong></TableCell>
                  <TableCell sx={{ minWidth: 200 }}><strong>Procedimiento [CIE-10]</strong></TableCell>
                  <TableCell sx={{ minWidth: 150 }}><strong>Seguro</strong></TableCell>
                  <TableCell sx={{ minWidth: 200 }}><strong>Médico Ref.</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Fecha de Examen</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Creado</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Llegada</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Inicio Preparación</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Fin Preparación</strong></TableCell>
                  <TableCell sx={{ minWidth: 250 }}><strong>Inicio Procedimiento</strong></TableCell>
                  <TableCell sx={{ minWidth: 250 }}><strong>Fin Procedimiento</strong></TableCell>
                  <TableCell sx={{ minWidth: 250 }}><strong>Reporte Generado</strong></TableCell>
                  <TableCell sx={{ minWidth: 160 }}><strong>Alta</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estadisticasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {filters.fechaInicio || filters.fechaFin || filters.centro || filters.estado || filters.procedimiento || filters.searchTerm
                          ? 'No se encontraron registros que coincidan con los filtros'
                          : 'No hay datos estadísticos disponibles'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  estadisticasFiltradas.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 9 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.examenNumero}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.estado}
                          color={getEstadoColor(item.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {item.centro}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            [{item.sala}] {'{' + item.recurso + '}'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {item.pacienteNombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {item.procedimiento}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            [{item.cie10}]
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.seguro}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.medicoReferente}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {new Date(item.fechaExamen).toLocaleDateString('es-ES')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.horaExamen}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.fechaCreado}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.fechaLlegada === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.fechaLlegada}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.inicioPreparacion === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.inicioPreparacion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.finPreparacion === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.finPreparacion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.inicioProcedimiento === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.inicioProcedimiento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.finProcedimiento === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.finProcedimiento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.reporteGenerado === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.reporteGenerado}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={item.alta === '-' ? 'text.secondary' : 'text.primary'}>
                          {item.alta}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default EstadisticasDetalladoOld;