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
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  NavigateNext,
  Search,
  Edit,
  Visibility,
  Delete,
  CalendarToday,
  EventNote,
  Person,
  Business,
  LocalHospital,
  Close,
  Save,
  AccessTime,
  Phone,
  Email,
  PlayArrow,
  Pause,
  CheckCircle,
  MedicalServices
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

const AgendaHoy = () => {
  const navigate = useNavigate();

  // Estado para filtros de búsqueda
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    searchTerm: ''
  });

  // Estados para modales
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);

  // Estado para el formulario de edición
  const [editForm, setEditForm] = useState({
    fecha: '',
    hora: '',
    tipoProcedimiento: '',
    estado: '',
    sala: '',
    preparacion: '',
    notas: ''
  });

  // Estado para los procedimientos
  const [procedimientos, setProcedimientos] = useState([
    {
      id: 1,
      indicadores: { urgente: false, primera_vez: true },
      paciente: {
        nombre: 'María Elena González',
        documento: '12345678',
        telefono: '987654321'
      },
      procedimiento: {
        tipo: 'Endoscopia Alta',
        duracion: '45 min'
      },
      medico: 'Dr. Carlos García Mendoza',
      fecha: '2024-01-16',
      hora: '08:00',
      sala: 'Sala de Endoscopia 1',
      preparacion: 'Completa',
      estado: 'En Proceso',
      progreso: 60
    },
    {
      id: 2,
      indicadores: { urgente: false, primera_vez: false },
      paciente: {
        nombre: 'Carlos Antonio Rodríguez',
        documento: '87654321',
        telefono: '912345678'
      },
      procedimiento: {
        tipo: 'Colonoscopia Diagnóstica',
        duracion: '60 min'
      },
      medico: 'Dra. Ana López Silva',
      fecha: '2024-01-16',
      hora: '09:30',
      sala: 'Sala de Endoscopia 2',
      preparacion: 'Pendiente',
      estado: 'Programado',
      progreso: 0
    },
    {
      id: 3,
      indicadores: { urgente: true, primera_vez: false },
      paciente: {
        nombre: 'Ana Patricia Martínez',
        documento: '11223344',
        telefono: '976543210'
      },
      procedimiento: {
        tipo: 'Biopsia Gástrica',
        duracion: '30 min'
      },
      medico: 'Dr. Pedro Silva Rojas',
      fecha: '2024-01-16',
      hora: '11:00',
      sala: 'Sala de Procedimientos',
      preparacion: 'Completa',
      estado: 'Esperando',
      progreso: 0
    },
    {
      id: 4,
      indicadores: { urgente: false, primera_vez: false },
      paciente: {
        nombre: 'José Miguel Vega',
        documento: '55667788',
        telefono: '965432109'
      },
      procedimiento: {
        tipo: 'Endoscopia Baja',
        duracion: '45 min'
      },
      medico: 'Dr. Carlos García Mendoza',
      fecha: '2024-01-16',
      hora: '14:00',
      sala: 'Sala de Endoscopia 1',
      preparacion: 'Completa',
      estado: 'Finalizado',
      progreso: 100
    }
  ]);

  // Funciones auxiliares
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'En Proceso':
        return 'info';
      case 'Finalizado':
        return 'success';
      case 'Esperando':
        return 'warning';
      case 'Programado':
        return 'default';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPreparacionColor = (preparacion) => {
    switch (preparacion) {
      case 'Completa':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Incompleta':
        return 'error';
      default:
        return 'default';
    }
  };

  const getIndicadorIcon = (indicadores) => {
    const icons = [];
    if (indicadores.urgente) {
      icons.push(
        <Chip
          key="urgente"
          label="URGENTE"
          color="error"
          size="small"
          sx={{ fontSize: '10px', height: '20px', mr: 0.5 }}
        />
      );
    }
    if (indicadores.primera_vez) {
      icons.push(
        <Chip
          key="primera"
          label="1RA VEZ"
          color="info"
          size="small"
          sx={{ fontSize: '10px', height: '20px', mr: 0.5 }}
        />
      );
    }
    return icons.length > 0 ? icons : <Typography variant="caption" color="text.secondary">-</Typography>;
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Función para buscar procedimientos
  const handleBuscarProcedimientos = () => {
    console.log('Buscando procedimientos con filtros:', filters);
  };

  // Filtrar procedimientos basado en los filtros
  const procedimientosFiltrados = procedimientos.filter(proc => {
    const cumpleFechaInicio = !filters.fechaInicio || proc.fecha >= filters.fechaInicio;
    const cumpleFechaFin = !filters.fechaFin || proc.fecha <= filters.fechaFin;
    const cumpleBusqueda = !filters.searchTerm ||
      proc.paciente.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      proc.paciente.documento.includes(filters.searchTerm) ||
      proc.medico.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      proc.procedimiento.tipo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      proc.sala.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return cumpleFechaInicio && cumpleFechaFin && cumpleBusqueda;
  });

  // Funciones para manejar modales
  const handleOpenDetailModal = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedProcedimiento(null);
  };

  const handleOpenEditModal = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setEditForm({
      fecha: procedimiento.fecha,
      hora: procedimiento.hora,
      tipoProcedimiento: procedimiento.procedimiento.tipo,
      estado: procedimiento.estado,
      sala: procedimiento.sala,
      preparacion: procedimiento.preparacion,
      notas: procedimiento.notas || ''
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProcedimiento(null);
    setEditForm({
      fecha: '',
      hora: '',
      tipoProcedimiento: '',
      estado: '',
      sala: '',
      preparacion: '',
      notas: ''
    });
  };

  const handleOpenDeleteConfirm = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedProcedimiento(null);
  };

  // Función para actualizar procedimiento
  const handleUpdateProcedimiento = () => {
    setProcedimientos(prev => prev.map(proc =>
      proc.id === selectedProcedimiento.id
        ? {
            ...proc,
            fecha: editForm.fecha,
            hora: editForm.hora,
            procedimiento: { ...proc.procedimiento, tipo: editForm.tipoProcedimiento },
            estado: editForm.estado,
            sala: editForm.sala,
            preparacion: editForm.preparacion,
            notas: editForm.notas
          }
        : proc
    ));
    handleCloseEditModal();
  };

  // Función para eliminar procedimiento
  const handleDeleteProcedimiento = () => {
    setProcedimientos(prev => prev.filter(proc => proc.id !== selectedProcedimiento.id));
    handleCloseDeleteConfirm();
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Funciones para controlar el estado del procedimiento
  const handleIniciarProcedimiento = (id) => {
    setProcedimientos(prev => prev.map(proc =>
      proc.id === id ? { ...proc, estado: 'En Proceso', progreso: 10 } : proc
    ));
  };

  const handlePausarProcedimiento = (id) => {
    setProcedimientos(prev => prev.map(proc =>
      proc.id === id ? { ...proc, estado: 'Pausado' } : proc
    ));
  };

  const handleCompletarProcedimiento = (id) => {
    setProcedimientos(prev => prev.map(proc =>
      proc.id === id ? { ...proc, estado: 'Finalizado', progreso: 100 } : proc
    ));
  };

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
          href="/procedimientos"
          onClick={(e) => {
            e.preventDefault();
            navigate('/procedimientos');
          }}
        >
          Procedimientos
        </Link>
        <Typography color="text.primary">Agenda de Hoy</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MedicalServices sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Agenda de Hoy
            </Typography>
          </Box>

          {/* Filtros de Rango de Fechas */}
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

            <ResponsiveField label="Búsqueda">
              <TextField
                fullWidth
                placeholder="Buscar por paciente, médico, procedimiento..."
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

            <ResponsiveField label=" " sx={{ flex: 0.5 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={handleBuscarProcedimientos}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#45a049'
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
        <Paper sx={{ flex: 1, boxShadow: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title={`Lista de Procedimientos de Hoy (${procedimientosFiltrados.length})`} />

          {/* Tabla con scroll */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Indicadores</strong></TableCell>
                    <TableCell><strong>Procedimiento</strong></TableCell>
                    <TableCell><strong>Paciente</strong></TableCell>
                    <TableCell><strong>Médico</strong></TableCell>
                    <TableCell><strong>Fecha/Hora</strong></TableCell>
                    <TableCell><strong>Sala</strong></TableCell>
                    <TableCell><strong>Preparación</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedimientosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {filters.fechaInicio || filters.fechaFin || filters.searchTerm
                            ? 'No se encontraron procedimientos que coincidan con los filtros'
                            : 'No hay procedimientos programados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    procedimientosFiltrados.map((procedimiento) => (
                      <TableRow key={procedimiento.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {getIndicadorIcon(procedimiento.indicadores)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {procedimiento.procedimiento.tipo}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {procedimiento.paciente.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Doc: {procedimiento.paciente.documento}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Tel: {procedimiento.paciente.telefono}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalHospital sx={{ color: '#4caf50', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">{procedimiento.medico}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(procedimiento.fecha).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {procedimiento.hora}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Business sx={{ color: '#2184be', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">{procedimiento.sala}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={procedimiento.preparacion}
                            color={getPreparacionColor(procedimiento.preparacion)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={procedimiento.estado}
                            color={getEstadoColor(procedimiento.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* Botones de control de procedimiento */}
                          {procedimiento.estado === 'Programado' && (
                            <IconButton
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                              title="Iniciar"
                              onClick={() => handleIniciarProcedimiento(procedimiento.id)}
                            >
                              <PlayArrow />
                            </IconButton>
                          )}
                          {procedimiento.estado === 'En Proceso' && (
                            <IconButton
                              color="warning"
                              size="small"
                              sx={{ mr: 1 }}
                              title="Pausar"
                              onClick={() => handlePausarProcedimiento(procedimiento.id)}
                            >
                              <Pause />
                            </IconButton>
                          )}
                          {(procedimiento.estado === 'En Proceso' || procedimiento.estado === 'Esperando') && (
                            <IconButton
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              title="Completar"
                              onClick={() => handleCompletarProcedimiento(procedimiento.id)}
                            >
                              <CheckCircle />
                            </IconButton>
                          )}

                          {/* Botones CRUD estándar */}
                          <IconButton
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Editar"
                            onClick={() => handleOpenEditModal(procedimiento)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                            onClick={() => handleOpenDetailModal(procedimiento)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            title="Cancelar"
                            onClick={() => handleOpenDeleteConfirm(procedimiento)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>

      {/* Modal para Ver Detalles */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2184be',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">Detalles del Procedimiento</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedProcedimiento && (
            <>
              {/* Información del Procedimiento */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Procedimiento
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MedicalServices sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Tipo de Procedimiento</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.procedimiento.tipo}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duración Estimada</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.procedimiento.duracion}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Fecha y Hora</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {new Date(selectedProcedimiento.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} - {selectedProcedimiento.hora}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Sala</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.sala}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Estado</Typography>
                        <Chip
                          label={selectedProcedimiento.estado}
                          color={getEstadoColor(selectedProcedimiento.estado)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Preparación</Typography>
                        <Chip
                          label={selectedProcedimiento.preparacion}
                          color={getPreparacionColor(selectedProcedimiento.preparacion)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Indicadores</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {getIndicadorIcon(selectedProcedimiento.indicadores)}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  {selectedProcedimiento.estado === 'En Proceso' && (
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Progreso del Procedimiento
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={selectedProcedimiento.progreso}
                          sx={{ mb: 1, height: 8 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {selectedProcedimiento.progreso}% completado
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Información del Paciente */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Paciente
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.paciente.nombre}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Documento</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.paciente.documento}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.paciente.telefono}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Información del Personal Médico */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Personal Médico Asignado
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalHospital sx={{ color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Médico Responsable</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProcedimiento.medico}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDetailModal}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Editar Procedimiento */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2184be',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">Editar Procedimiento</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {selectedProcedimiento && (
              <>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Paciente:</strong> {selectedProcedimiento.paciente.nombre}
                </Typography>
                <Divider />

                <FieldRow>
                  <ResponsiveField label="Fecha" required>
                    <TextField
                      fullWidth
                      type="date"
                      value={editForm.fecha}
                      onChange={(e) => handleEditFormChange('fecha', e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Hora" required>
                    <TextField
                      fullWidth
                      type="time"
                      value={editForm.hora}
                      onChange={(e) => handleEditFormChange('hora', e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Tipo de Procedimiento" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.tipoProcedimiento}
                        onChange={(e) => handleEditFormChange('tipoProcedimiento', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        <MenuItem value="Endoscopia Alta">Endoscopia Alta</MenuItem>
                        <MenuItem value="Endoscopia Baja">Endoscopia Baja</MenuItem>
                        <MenuItem value="Colonoscopia Diagnóstica">Colonoscopia Diagnóstica</MenuItem>
                        <MenuItem value="Biopsia Gástrica">Biopsia Gástrica</MenuItem>
                        <MenuItem value="CPRE">CPRE</MenuItem>
                        <MenuItem value="Polipectomía">Polipectomía</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Sala" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.sala}
                        onChange={(e) => handleEditFormChange('sala', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar sala</MenuItem>
                        <MenuItem value="Sala de Endoscopia 1">Sala de Endoscopia 1</MenuItem>
                        <MenuItem value="Sala de Endoscopia 2">Sala de Endoscopia 2</MenuItem>
                        <MenuItem value="Sala de Procedimientos">Sala de Procedimientos</MenuItem>
                        <MenuItem value="Sala de Cirugía Menor">Sala de Cirugía Menor</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.estado}
                        onChange={(e) => handleEditFormChange('estado', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="Programado">Programado</MenuItem>
                        <MenuItem value="En Proceso">En Proceso</MenuItem>
                        <MenuItem value="Esperando">Esperando</MenuItem>
                        <MenuItem value="Finalizado">Finalizado</MenuItem>
                        <MenuItem value="Cancelado">Cancelado</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Preparación" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.preparacion}
                        onChange={(e) => handleEditFormChange('preparacion', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar preparación</MenuItem>
                        <MenuItem value="Completa">Completa</MenuItem>
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="Incompleta">Incompleta</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                <ResponsiveField label="Notas">
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editForm.notas}
                    onChange={(e) => handleEditFormChange('notas', e.target.value)}
                    placeholder="Notas adicionales sobre el procedimiento..."
                    size="small"
                  />
                </ResponsiveField>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseEditModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleUpdateProcedimiento}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación para Cancelar */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#f44336',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Confirmar Cancelación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea cancelar el procedimiento de{' '}
            <strong>"{selectedProcedimiento?.paciente?.nombre}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Procedimiento: {selectedProcedimiento?.procedimiento?.tipo}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fecha: {selectedProcedimiento?.fecha} - {selectedProcedimiento?.hora}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteConfirm}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProcedimiento}
            startIcon={<Delete />}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AgendaHoy;