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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Grid
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  Visibility
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

// Agregar displayName para mejor debugging
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

// Agregar displayName para mejor debugging
FieldRow.displayName = 'FieldRow';

const MedicosRef = () => {
  const navigate = useNavigate();

  // Estado para la lista de médicos referentes
  const [medicosRef, setMedicosRef] = useState([
    {
      id: 1,
      altId: 'MR001',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      sexo: 'masculino',
      fechaNacimiento: '1975-03-15',
      grado: 'Especialista en Gastroenterología',
      estado: 'activo',
      telefono: '+57 310 123 4567',
      fechaCreacion: '2024-01-15T10:30:00',
      creadoPor: 'Sistema'
    },
    {
      id: 2,
      altId: 'MR002',
      nombres: 'María Elena',
      apellidos: 'García Rodríguez',
      sexo: 'femenino',
      fechaNacimiento: '1980-07-22',
      grado: 'Médico General',
      estado: 'activo',
      telefono: '+57 320 987 6543',
      fechaCreacion: '2024-02-10T14:20:00',
      creadoPor: 'Sistema'
    },
    {
      id: 3,
      altId: 'MR003',
      nombres: 'Carlos Alberto',
      apellidos: 'Martínez López',
      sexo: 'masculino',
      fechaNacimiento: '1972-11-08',
      grado: 'Especialista en Medicina Interna',
      estado: 'inactivo',
      telefono: '+57 315 456 7890',
      fechaCreacion: '2024-01-20T16:45:00',
      creadoPor: 'admin'
    }
  ]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    altId: '',
    nombres: '',
    apellidos: '',
    sexo: '',
    fechaNacimiento: '',
    grado: '',
    estado: '',
    telefono: '',
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      altId: '',
      nombres: '',
      apellidos: '',
      sexo: '',
      fechaNacimiento: '',
      grado: '',
      estado: '',
      telefono: '',
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.altId.trim()) {
      newErrors.altId = 'AltId es obligatorio';
    }
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Nombres es obligatorio';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Apellidos es obligatorio';
    }
    if (!formData.sexo) {
      newErrors.sexo = 'Sexo es obligatorio';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Fecha de nacimiento es obligatoria';
    }
    if (!formData.grado.trim()) {
      newErrors.grado = 'Grado es obligatorio';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (medico) => {
    setSelectedMedico(medico);
    setFormData({
      altId: medico.altId,
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      sexo: medico.sexo,
      fechaNacimiento: medico.fechaNacimiento,
      grado: medico.grado,
      estado: medico.estado,
      telefono: medico.telefono,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedMedico(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (medico) => {
    setSelectedMedico(medico);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedMedico(null);
  };

  const handleOpenDetailsModal = (medico) => {
    setSelectedMedico(medico);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedMedico(null);
  };

  // Función para crear médico referente
  const handleCreateMedico = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newMedico = {
        id: Math.max(...medicosRef.map(m => m.id)) + 1,
        altId: formData.altId.trim(),
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        sexo: formData.sexo,
        fechaNacimiento: formData.fechaNacimiento,
        grado: formData.grado.trim(),
        estado: formData.estado,
        telefono: formData.telefono.trim(),
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'Sistema'
      };

      setMedicosRef(prev => [...prev, newMedico]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar médico referente
  const handleEditMedico = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setMedicosRef(prev => prev.map(m =>
        m.id === selectedMedico.id
          ? {
              ...m,
              altId: formData.altId.trim(),
              nombres: formData.nombres.trim(),
              apellidos: formData.apellidos.trim(),
              sexo: formData.sexo,
              fechaNacimiento: formData.fechaNacimiento,
              grado: formData.grado.trim(),
              estado: formData.estado,
              telefono: formData.telefono.trim(),
            }
          : m
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar médico referente
  const handleDeleteMedico = () => {
    setMedicosRef(prev => prev.filter(m => m.id !== selectedMedico.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar médicos referentes basado en la búsqueda
  const filteredMedicosRef = medicosRef.filter(medico =>
    medico.altId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.grado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.telefono.includes(searchTerm)
  );

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
  };

  // Función para obtener el color del sexo
  const getSexoColor = (sexo) => {
    return sexo === 'masculino' ? 'primary' : 'secondary';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Función para cambiar tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        <Typography color="text.primary">Médicos Referentes</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Médicos Referentes
      </Typography>

      {/* Tabs Deslizables */}
      <Paper sx={{ boxShadow: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              minHeight: '60px'
            }
          }}
        >
          <Tab
            label="Lista de Médicos Referentes"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Crear Médico Referente"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Médico Referente */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateMedico}>
              {/* Sección: Información Personal*/}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Médico Referente
                </Typography>

                {/* Fila 1: AltId, Nombres, Apellidos */}
                <FieldRow>
                  <ResponsiveField label="AltId" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: MR001"
                      value={formData.altId}
                      onChange={(e) => handleInputChange('altId', e.target.value)}
                      error={!!errors.altId}
                      helperText={errors.altId}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Nombres" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los nombres"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      error={!!errors.nombres}
                      helperText={errors.nombres}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellidos" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los apellidos"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      error={!!errors.apellidos}
                      helperText={errors.apellidos}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Sexo, Fecha de Nacimiento */}
                <FieldRow>
                  <ResponsiveField label="Sexo" required>
                    <FormControl fullWidth required error={!!errors.sexo} size="small">
                      <Select
                        value={formData.sexo}
                        onChange={(e) => handleInputChange('sexo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.sexo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar sexo</MenuItem>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="femenino">Femenino</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.sexo && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.sexo}
                      </Typography>
                    )}
                  </ResponsiveField>

                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: +57 310 123 4567"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      error={!!errors.fechaNacimiento}
                      helperText={errors.fechaNacimiento}
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Grado, Estado */}
                <FieldRow>
                  <ResponsiveField label="Grado" required sx={{ flex: 2 }}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: Especialista en Gastroenterología"
                      value={formData.grado}
                      onChange={(e) => handleInputChange('grado', e.target.value)}
                      error={!!errors.grado}
                      helperText={errors.grado}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.estado} size="small">
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.estado && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.estado}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Botón de Crear */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  size="large"
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    minWidth: '200px',
                    py: 1.5
                  }}
                >
                  Crear Médico Referente
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Médicos Referentes */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por AltId, nombres, apellidos, grado o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#666', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: '500px',
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
              {searchTerm && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {filteredMedicosRef.length} resultado(s) de {medicosRef.length} médicos referentes
                </Typography>
              )}
            </Box>

            {/* Tabla de Médicos Referentes */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Médicos Referentes" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>AltId</strong></TableCell>
                      <TableCell><strong>Nombre Completo</strong></TableCell>
                      <TableCell><strong>Grado</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMedicosRef.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron médicos referentes que coincidan con la búsqueda' : 'No hay médicos referentes registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMedicosRef.map((medico) => (
                      <TableRow key={medico.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {medico.altId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {medico.nombres} {medico.apellidos}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <Chip
                              label={medico.sexo === 'masculino' ? 'M' : 'F'}
                              size="small"
                              color={getSexoColor(medico.sexo)}
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '18px' }}
                            />
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {medico.grado.length > 30
                              ? `${medico.grado.substring(0, 30)}...`
                              : medico.grado
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={medico.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(medico.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(medico)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(medico)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(medico)}
                            title="Eliminar"
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
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Modal para Editar Médico Referente */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="lg"
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
          <Typography variant="h6" fontWeight="bold">Editar Médico Referente</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditMedico}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección: Información Personal*/}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información Personal
              </Typography>

              <FieldRow>
                <ResponsiveField label="AltId" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ej: MR001"
                    value={formData.altId}
                    onChange={(e) => handleInputChange('altId', e.target.value)}
                    error={!!errors.altId}
                    helperText={errors.altId}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Nombres" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese los nombres"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                    error={!!errors.nombres}
                    helperText={errors.nombres}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Apellidos" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese los apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Sexo" required>
                  <FormControl fullWidth required error={!!errors.sexo} size="small">
                    <Select
                      value={formData.sexo}
                      onChange={(e) => handleInputChange('sexo', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar sexo</MenuItem>
                      <MenuItem value="masculino">Masculino</MenuItem>
                      <MenuItem value="femenino">Femenino</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.sexo && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.sexo}
                    </Typography>
                  )}
                </ResponsiveField>

                <ResponsiveField label="Teléfono" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ej: +57 310 123 4567"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Fecha de Nacimiento" required>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                    error={!!errors.fechaNacimiento}
                    helperText={errors.fechaNacimiento}
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </ResponsiveField>
              </FieldRow>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, mt: 4, color: '#2184be' }}>
                Información Profesional
              </Typography>

              <FieldRow>
                <ResponsiveField label="Grado" required sx={{ flex: 2 }}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ej: Especialista en Gastroenterología"
                    value={formData.grado}
                    onChange={(e) => handleInputChange('grado', e.target.value)}
                    error={!!errors.grado}
                    helperText={errors.grado}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Estado" required>
                  <FormControl fullWidth required error={!!errors.estado} size="small">
                    <Select
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar estado</MenuItem>
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.estado && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.estado}
                    </Typography>
                  )}
                </ResponsiveField>
              </FieldRow>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseEditModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal de Detalles del Médico Referente */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
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
          backgroundColor: '#2196f3',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">Detalles del Médico Referente</Typography>
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedMedico && (
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                Información del Médico Referente
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>AltId:</strong> {selectedMedico.altId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Nombres:</strong> {selectedMedico.nombres}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Apellidos:</strong> {selectedMedico.apellidos}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Sexo:</strong> {selectedMedico.sexo === 'masculino' ? 'Masculino' : 'Femenino'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Fecha de Nacimiento:</strong> {formatDate(selectedMedico.fechaNacimiento)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Grado:</strong> {selectedMedico.grado}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Estado:</strong> {selectedMedico.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {selectedMedico.telefono}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDetailsModal}
          >
            Cerrar
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
          <Typography variant="h6" fontWeight="bold">Confirmar Eliminación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea eliminar al médico referente{' '}
            <strong>"{selectedMedico?.nombres} {selectedMedico?.apellidos}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
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
            onClick={handleDeleteMedico}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicosRef;