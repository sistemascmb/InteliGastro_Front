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
  Grid,
  Tabs,
  Tab,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Visibility,
  Delete,
  Save,
  Close,
  Search,
  Build
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
  <Box sx={{ flex: 1, ...sx }}> {/* Combinamos el flex base con los estilos adicionales */}
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

const Recursos = () => {
  const navigate = useNavigate();

  // Estado para la lista de recursos
  const [recursos, setRecursos] = useState([
    {
      id: 1,
      nombre: 'Endoscopio Olympus CV-290',
      descripcion: 'Endoscopio de alta definición para procedimientos diagnósticos y terapéuticos',
      numeroSerie: 'OLY-CV290-001',
      locacionId: 'SALA-ENDO-01',
      centro: 'centro-1',
      estado: 'activo',
      procedimientos: ['colonoscopia', 'endoscopia-alta']
    },
    {
      id: 2,
      nombre: 'Ecógrafo Mindray DC-70',
      descripcion: 'Ecógrafo portátil con tecnología Doppler color para diagnóstico abdominal',
      numeroSerie: 'MDR-DC70-002',
      locacionId: 'SALA-ECO-02',
      centro: 'centro-1',
      estado: 'activo',
      procedimientos: ['ecografia-abdominal']
    },
    {
      id: 3,
      nombre: 'Monitor de Signos Vitales Philips',
      descripcion: 'Monitor multiparámetro para monitoreo continuo de pacientes',
      numeroSerie: 'PHI-MX450-003',
      locacionId: 'SALA-PROC-03',
      centro: 'centro-2',
      estado: 'inactivo',
      procedimientos: ['monitoreo-sedacion']
    }
  ]);

  // Datos simulados de centros
  const centros = [
    { value: 'centro-1', label: 'Clínica María Belén - Sede Central' },
    { value: 'centro-2', label: 'Clínica María Belén - Sede Norte' }
  ];

  // Datos simulados de procedimientos
  const procedimientosDisponibles = [
    { value: 'colonoscopia', label: 'Colonoscopía Diagnóstica' },
    { value: 'endoscopia-alta', label: 'Endoscopía Digestiva Alta' },
    { value: 'ecografia-abdominal', label: 'Ecografía Abdominal' },
    { value: 'monitoreo-sedacion', label: 'Monitoreo de Sedación' },
    { value: 'polipectomia', label: 'Polipectomía' },
    { value: 'biopsia-endoscopica', label: 'Biopsia Endoscópica' }
  ];

  // Estados para modales (solo editar, detallar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    numeroSerie: '',
    locacionId: '',
    centro: '',
    estado: '',
    procedimientos: []
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      numeroSerie: '',
      locacionId: '',
      centro: '',
      estado: '',
      procedimientos: []
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto (mismo patrón que NuevoPaciente)
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Función para manejar cambios en procedimientos (checkboxes)
  const handleProcedimientoChange = useCallback((procedimientoValue, checked) => {
    setFormData(prev => ({
      ...prev,
      procedimientos: checked
        ? [...prev.procedimientos, procedimientoValue]
        : prev.procedimientos.filter(p => p !== procedimientoValue)
    }));

    // Limpiar error si existe
    if (errors.procedimientos) {
      setErrors(prev => ({ ...prev, procedimientos: '' }));
    }
  }, [errors]);

  // 2. Memoiza los componentes de input
  const MemoizedTextField = memo(({
    value,
    onChange,
    error,
    helperText,
    ...props
  }) => (
    <TextField
      {...props}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      size="small"
    />
  ));

  MemoizedTextField.displayName = 'MemoizedTextField';

  // Validación del formulario (TODOS los campos obligatorios)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.numeroSerie.trim()) {
      newErrors.numeroSerie = 'Número de Serie es obligatorio';
    }
    if (!formData.locacionId.trim()) {
      newErrors.locacionId = 'Locación ID es obligatoria';
    }
    if (!formData.centro) {
      newErrors.centro = 'Centro es obligatorio';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (formData.procedimientos.length === 0) {
      newErrors.procedimientos = 'Debe seleccionar al menos un procedimiento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (recurso) => {
    setSelectedRecurso(recurso);
    setFormData({
      nombre: recurso.nombre,
      descripcion: recurso.descripcion,
      numeroSerie: recurso.numeroSerie,
      locacionId: recurso.locacionId,
      centro: recurso.centro,
      estado: recurso.estado,
      procedimientos: recurso.procedimientos || []
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRecurso(null);
    clearForm();
  };

  const handleOpenDetailModal = (recurso) => {
    setSelectedRecurso(recurso);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedRecurso(null);
  };

  const handleOpenDeleteConfirm = (recurso) => {
    setSelectedRecurso(recurso);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedRecurso(null);
  };

  // Función para crear recurso
  const handleCreateRecurso = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newRecurso = {
        id: Math.max(...recursos.map(r => r.id)) + 1,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        numeroSerie: formData.numeroSerie.trim(),
        locacionId: formData.locacionId.trim(),
        centro: formData.centro,
        estado: formData.estado,
        procedimientos: formData.procedimientos
      };

      setRecursos(prev => [...prev, newRecurso]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar recurso
  const handleEditRecurso = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setRecursos(prev => prev.map(r =>
        r.id === selectedRecurso.id
          ? {
              ...r,
              nombre: formData.nombre.trim(),
              descripcion: formData.descripcion.trim(),
              numeroSerie: formData.numeroSerie.trim(),
              locacionId: formData.locacionId.trim(),
              centro: formData.centro,
              estado: formData.estado,
              procedimientos: formData.procedimientos
            }
          : r
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar recurso
  const handleDeleteRecurso = () => {
    setRecursos(prev => prev.filter(r => r.id !== selectedRecurso.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar recursos basado en la búsqueda
  const filteredRecursos = recursos.filter(recurso =>
    recurso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recurso.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recurso.locacionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el label del centro
  const getCentroLabel = (centroValue) => {
    const centro = centros.find(c => c.value === centroValue);
    return centro ? centro.label : centroValue;
  };

  // Función para obtener los labels de los procedimientos
  const getProcedimientosLabels = (procedimientoValues) => {
    return procedimientoValues.map(value => {
      const proc = procedimientosDisponibles.find(p => p.value === value);
      return proc ? proc.label : value;
    }).join(', ');
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
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
        <Typography color="text.primary">Recursos</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Recursos
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
            label="Lista de Recursos"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Crear Recurso"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Recurso */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateRecurso}>
              {/* Sección 1: Información del Recurso */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Recurso
                </Typography>

                {/* Fila 1: Nombre, Número de Serie */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del recurso"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Número de Serie" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: OLY-CV290-001"
                      value={formData.numeroSerie}
                      onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                      error={!!errors.numeroSerie}
                      helperText={errors.numeroSerie}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Locación ID" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: SALA-ENDO-01"
                      value={formData.locacionId}
                      onChange={(e) => handleInputChange('locacionId', e.target.value)}
                      error={!!errors.locacionId}
                      helperText={errors.locacionId}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Descripción */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="Ingrese la descripción del recurso"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Centro y Estado */}
                <FieldRow>
                  <ResponsiveField label="Centro" required>
                    <FormControl fullWidth required error={!!errors.centro} size="small">
                      <Select
                        value={formData.centro}
                        onChange={(e) => handleInputChange('centro', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.centro ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {centros.map(centro => (
                          <MenuItem key={centro.value} value={centro.value}>
                            {centro.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                  </ResponsiveField>

                  <ResponsiveField>
                    {/* Espacio vacío para alineación */}
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 2: Procedimientos */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Procedimientos
                </Typography>

                <ResponsiveField label="Seleccione los procedimientos asociados al recurso" required>
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      {procedimientosDisponibles.map((procedimiento) => (
                        <Grid item xs={12} sm={6} md={4} key={procedimiento.value}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: formData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#fff',
                              border: formData.procedimientos.includes(procedimiento.value) ? '2px solid #2196f3' : '1px solid #e0e0e0',
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: formData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#f5f5f5',
                                transform: 'translateY(-1px)',
                                boxShadow: 2
                              }
                            }}
                            onClick={() => handleProcedimientoChange(procedimiento.value, !formData.procedimientos.includes(procedimiento.value))}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Checkbox
                                checked={formData.procedimientos.includes(procedimiento.value)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleProcedimientoChange(procedimiento.value, e.target.checked);
                                }}
                                size="small"
                                sx={{
                                  color: '#2196f3',
                                  '&.Mui-checked': {
                                    color: '#2196f3'
                                  },
                                  mr: 1
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: formData.procedimientos.includes(procedimiento.value) ? 'bold' : 'normal',
                                  color: formData.procedimientos.includes(procedimiento.value) ? '#1976d2' : '#333',
                                  fontSize: '0.85rem',
                                  lineHeight: 1.3
                                }}
                              >
                                {procedimiento.label}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  {errors.procedimientos && (
                    <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
                      {errors.procedimientos}
                    </Typography>
                  )}
                </ResponsiveField>
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
                  Crear Recurso
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Recursos */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar recursos por nombre, número de serie o locación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#666', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: '450px',
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
                  {filteredRecursos.length} resultado(s) de {recursos.length} recursos
                </Typography>
              )}
            </Box>

            {/* Tabla de Recursos */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Recursos" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Número de Serie</strong></TableCell>
                      <TableCell><strong>Locación</strong></TableCell>
                      <TableCell><strong>Centro</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecursos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron recursos que coincidan con la búsqueda' : 'No hay recursos registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecursos.map((recurso) => (
                      <TableRow key={recurso.id} hover>
                        <TableCell>{recurso.nombre}</TableCell>
                        <TableCell>{recurso.numeroSerie}</TableCell>
                        <TableCell>{recurso.locacionId}</TableCell>
                        <TableCell>{getCentroLabel(recurso.centro)}</TableCell>
                        <TableCell>
                          <Chip
                            label={recurso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(recurso.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(recurso)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailModal(recurso)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(recurso)}
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

      {/* Modal para Editar Recurso */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
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
          <Typography variant="h6" fontWeight="bold">Editar Recurso</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditRecurso}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección 1: Información del Recurso */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información del Recurso
              </Typography>

              <FieldRow>
                <ResponsiveField label="Nombre" required sx={{flex:2}}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre del recurso"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Número de Serie" required sx={{flex:1}}>
                  <TextField
                    fullWidth
                    required
                    value={formData.numeroSerie}
                    onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                    error={!!errors.numeroSerie}
                    helperText={errors.numeroSerie}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Locación ID" required sx={{flex:1}}>
                  <TextField
                    fullWidth
                    required
                    value={formData.locacionId}
                    onChange={(e) => handleInputChange('locacionId', e.target.value)}
                    error={!!errors.locacionId}
                    helperText={errors.locacionId}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Descripción" required>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    placeholder="Ingrese la descripción del recurso"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Centro" required>
                  <FormControl fullWidth required error={!!errors.centro} size="small">
                    <Select
                      value={formData.centro}
                      onChange={(e) => handleInputChange('centro', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.centro ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar centro</MenuItem>
                      {centros.map(centro => (
                        <MenuItem key={centro.value} value={centro.value}>
                          {centro.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                </ResponsiveField>

                <ResponsiveField>
                  {/* Espacio vacío para alineación */}
                </ResponsiveField>
              </FieldRow>
            </Paper>

            {/* Sección 2: Procedimientos */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Procedimientos
              </Typography>

              <ResponsiveField label="Seleccione los procedimientos asociados al recurso" required>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    {procedimientosDisponibles.map((procedimiento) => (
                      <Grid item xs={12} sm={6} md={4} key={procedimiento.value}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: formData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#fff',
                            border: formData.procedimientos.includes(procedimiento.value) ? '2px solid #2196f3' : '1px solid #e0e0e0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: formData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#f5f5f5',
                              transform: 'translateY(-1px)',
                              boxShadow: 2
                            }
                          }}
                          onClick={() => handleProcedimientoChange(procedimiento.value, !formData.procedimientos.includes(procedimiento.value))}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                              checked={formData.procedimientos.includes(procedimiento.value)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleProcedimientoChange(procedimiento.value, e.target.checked);
                              }}
                              size="small"
                              sx={{
                                color: '#2196f3',
                                '&.Mui-checked': {
                                  color: '#2196f3'
                                },
                                mr: 1
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: formData.procedimientos.includes(procedimiento.value) ? 'bold' : 'normal',
                                color: formData.procedimientos.includes(procedimiento.value) ? '#1976d2' : '#333',
                                fontSize: '0.85rem',
                                lineHeight: 1.3
                              }}
                            >
                              {procedimiento.label}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {errors.procedimientos && (
                  <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
                    {errors.procedimientos}
                  </Typography>
                )}
              </ResponsiveField>
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
          <Typography variant="h6" fontWeight="bold">Detalles del Recurso</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedRecurso && (
            <>
              {/* Sección 1: Información del Recurso */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Recurso
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedRecurso.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedRecurso.descripcion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Número de Serie:</strong> {selectedRecurso.numeroSerie}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Locación ID:</strong> {selectedRecurso.locacionId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Estado:</strong>
                      <Chip
                        label={selectedRecurso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        color={getEstadoColor(selectedRecurso.estado)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Centro:</strong> {getCentroLabel(selectedRecurso.centro)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Procedimientos */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Procedimientos Asociados
                </Typography>
                <Grid container spacing={2}>
                  {selectedRecurso.procedimientos && selectedRecurso.procedimientos.length > 0 ? (
                    selectedRecurso.procedimientos.map((proc, index) => {
                      const procedimiento = procedimientosDisponibles.find(p => p.value === proc);
                      return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Chip
                            label={procedimiento ? procedimiento.label : proc}
                            variant="outlined"
                            color="primary"
                            size="small"
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        No hay procedimientos asociados
                      </Typography>
                    </Grid>
                  )}
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
            ¿Está seguro de que desea eliminar el recurso{' '}
            <strong>"{selectedRecurso?.nombre}"</strong>?
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
            onClick={handleDeleteRecurso}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recursos;