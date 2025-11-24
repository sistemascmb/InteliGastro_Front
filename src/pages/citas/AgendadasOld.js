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
  Divider
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
  Email
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

const AgendadasOld = () => {
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
  const [selectedCita, setSelectedCita] = useState(null);

  // Estado para el formulario de edición
  const [editForm, setEditForm] = useState({
    fecha: '',
    hora: '',
    tipoCita: '',
    estado: '',
    notas: ''
  });

  // Estado para las citas
  const [citasAgendadas, setCitasAgendadas] = useState([
    {
      id: 1,
      indicadores: { urgente: true, primera_vez: false },
      paciente: {
        nombre: 'María Elena González',
        documento: '12345678',
        telefono: '987654321'
      },
      centro: 'Clínica María Belén - Sede Central',
      asignadoA: 'Dr. Carlos García Mendoza',
      tipoCita: 'Consulta Gastroenterológica',
      fecha: '2024-01-15',
      hora: '09:00',
      estado: 'Confirmada'
    },
    {
      id: 2,
      indicadores: { urgente: false, primera_vez: true },
      paciente: {
        nombre: 'Carlos Antonio Rodríguez',
        documento: '87654321',
        telefono: '912345678'
      },
      centro: 'Clínica María Belén - Sede Norte',
      asignadoA: 'Dra. Ana López Silva',
      tipoCita: 'Control Post-Operatorio',
      fecha: '2024-01-15',
      hora: '10:30',
      estado: 'Pendiente'
    },
    {
      id: 3,
      indicadores: { urgente: false, primera_vez: false },
      paciente: {
        nombre: 'Ana Patricia Martínez',
        documento: '11223344',
        telefono: '976543210'
      },
      centro: 'Clínica María Belén - Sede Central',
      asignadoA: 'Dr. Carlos García Mendoza',
      tipoCita: 'Consulta de Seguimiento',
      fecha: '2024-01-16',
      hora: '14:00',
      estado: 'Confirmada'
    },
    {
      id: 4,
      indicadores: { urgente: true, primera_vez: true },
      paciente: {
        nombre: 'José Miguel Vega',
        documento: '55667788',
        telefono: '965432109'
      },
      centro: 'Clínica María Belén - Sede Norte',
      asignadoA: 'Dr. Pedro Silva Rojas',
      tipoCita: 'Emergencia Gastroenterológica',
      fecha: '2024-01-16',
      hora: '08:00',
      estado: 'Urgente'
    }
  ]);

  // Funciones auxiliares
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Urgente':
        return 'error';
      case 'Cancelada':
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

  // Función para buscar citas
  const handleBuscarCitas = () => {
    // Aquí implementarías la lógica de búsqueda con el backend
    console.log('Buscando citas con filtros:', filters);
  };

  // Filtrar citas basado en los filtros
  const citasFiltradas = citasAgendadas.filter(cita => {
    const cumpleFechaInicio = !filters.fechaInicio || cita.fecha >= filters.fechaInicio;
    const cumpleFechaFin = !filters.fechaFin || cita.fecha <= filters.fechaFin;
    const cumpleBusqueda = !filters.searchTerm ||
      cita.paciente.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      cita.paciente.documento.includes(filters.searchTerm) ||
      cita.asignadoA.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      cita.centro.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return cumpleFechaInicio && cumpleFechaFin && cumpleBusqueda;
  });

  // Funciones para manejar modales
  const handleOpenDetailModal = (cita) => {
    setSelectedCita(cita);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedCita(null);
  };

  const handleOpenEditModal = (cita) => {
    setSelectedCita(cita);
    setEditForm({
      fecha: cita.fecha,
      hora: cita.hora,
      tipoCita: cita.tipoCita,
      estado: cita.estado,
      notas: cita.notas || ''
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCita(null);
    setEditForm({
      fecha: '',
      hora: '',
      tipoCita: '',
      estado: '',
      notas: ''
    });
  };

  const handleOpenDeleteConfirm = (cita) => {
    setSelectedCita(cita);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedCita(null);
  };

  // Función para actualizar cita
  const handleUpdateCita = () => {
    setCitasAgendadas(prev => prev.map(cita =>
      cita.id === selectedCita.id
        ? {
            ...cita,
            fecha: editForm.fecha,
            hora: editForm.hora,
            tipoCita: editForm.tipoCita,
            estado: editForm.estado,
            notas: editForm.notas
          }
        : cita
    ));
    handleCloseEditModal();
  };

  // Función para eliminar cita
  const handleDeleteCita = () => {
    setCitasAgendadas(prev => prev.filter(cita => cita.id !== selectedCita.id));
    handleCloseDeleteConfirm();
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
          href="/citas"
          onClick={(e) => {
            e.preventDefault();
            navigate('/citas');
          }}
        >
          Citas
        </Link>
        <Typography color="text.primary">Agendadas</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EventNote sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Citas Agendadas
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
                placeholder="Buscar por paciente, médico, centro..."
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
                onClick={handleBuscarCitas}
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
          <SectionHeader title={`Lista de Citas Agendadas (${citasFiltradas.length})`} />

          {/* Tabla con scroll */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Indicadores</strong></TableCell>
                    <TableCell><strong>Cita</strong></TableCell>
                    <TableCell><strong>Paciente</strong></TableCell>
                    <TableCell><strong>Centro</strong></TableCell>
                    <TableCell><strong>Asignado a</strong></TableCell>
                    <TableCell><strong>Tipo Cita</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {filters.fechaInicio || filters.fechaFin || filters.searchTerm
                            ? 'No se encontraron citas que coincidan con los filtros'
                            : 'No hay citas agendadas'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    citasFiltradas.map((cita) => (
                      <TableRow key={cita.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {getIndicadorIcon(cita.indicadores)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {cita.fecha} - {cita.hora}
                            </Typography>
                            <Chip
                              label={cita.estado}
                              color={getEstadoColor(cita.estado)}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {cita.paciente.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Doc: {cita.paciente.documento}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Tel: {cita.paciente.telefono}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Business sx={{ color: '#2184be', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">{cita.centro}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalHospital sx={{ color: '#4caf50', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">{cita.asignadoA}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{cita.tipoCita}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(cita.fecha).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cita.hora}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Editar"
                            onClick={() => handleOpenEditModal(cita)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                            onClick={() => handleOpenDetailModal(cita)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            title="Cancelar"
                            onClick={() => handleOpenDeleteConfirm(cita)}
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
          <Typography variant="h6" fontWeight="bold">Detalles de la Cita</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedCita && (
            <>
              {/* Información de la Cita */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información de la Cita
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Fecha y Hora</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {new Date(selectedCita.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} - {selectedCita.hora}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventNote sx={{ color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Tipo de Cita</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedCita.tipoCita}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Estado</Typography>
                        <Chip
                          label={selectedCita.estado}
                          color={getEstadoColor(selectedCita.estado)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Indicadores</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {getIndicadorIcon(selectedCita.indicadores)}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
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
                          {selectedCita.paciente.nombre}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Documento</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedCita.paciente.documento}
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
                          {selectedCita.paciente.telefono}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Información del Centro y Personal */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Centro y Personal Médico
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business sx={{ color: '#2184be', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Centro</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedCita.centro}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalHospital sx={{ color: '#4caf50', mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Asignado a</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedCita.asignadoA}
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

      {/* Modal para Editar Cita */}
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
          <Typography variant="h6" fontWeight="bold">Editar Cita</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {selectedCita && (
              <>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Paciente:</strong> {selectedCita.paciente.nombre}
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
                  <ResponsiveField label="Tipo de Cita" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.tipoCita}
                        onChange={(e) => handleEditFormChange('tipoCita', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        <MenuItem value="Consulta Gastroenterológica">Consulta Gastroenterológica</MenuItem>
                        <MenuItem value="Control Post-Operatorio">Control Post-Operatorio</MenuItem>
                        <MenuItem value="Consulta de Seguimiento">Consulta de Seguimiento</MenuItem>
                        <MenuItem value="Emergencia Gastroenterológica">Emergencia Gastroenterológica</MenuItem>
                        <MenuItem value="Procedimiento Diagnóstico">Procedimiento Diagnóstico</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={editForm.estado}
                        onChange={(e) => handleEditFormChange('estado', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="Confirmada">Confirmada</MenuItem>
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="Urgente">Urgente</MenuItem>
                        <MenuItem value="Cancelada">Cancelada</MenuItem>
                        <MenuItem value="Completada">Completada</MenuItem>
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
                    placeholder="Notas adicionales sobre la cita..."
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
            onClick={handleUpdateCita}
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

      {/* Modal de Confirmación para Eliminar */}
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
            ¿Está seguro de que desea cancelar la cita de{' '}
            <strong>"{selectedCita?.paciente?.nombre}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fecha: {selectedCita?.fecha} - {selectedCita?.hora}
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
            onClick={handleDeleteCita}
            startIcon={<Delete />}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AgendadasOld;