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
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  InputLabel,
  ListItemText
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  Code,
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

const Macros = () => {
  const navigate = useNavigate();

  // Datos mock para personal
  const [personales] = useState([
    { id: 1, nombre: 'Dr. Juan Pérez', cargo: 'Médico Gastroenterólogo' },
    { id: 2, nombre: 'Dra. María García', cargo: 'Enfermera Jefe' },
    { id: 3, nombre: 'Carlos Rodriguez', cargo: 'Administrador' },
    { id: 4, nombre: 'Ana Martínez', cargo: 'Recepcionista' },
    { id: 5, nombre: 'Dr. Luis Fernández', cargo: 'Médico General' }
  ]);

  // Estado para la lista de macros
  const [macros, setMacros] = useState([
    {
      id: 1,
      nombre: 'Saludo Inicial',
      descripcion: 'Macro para saludo estándar de pacientes',
      asignadoIds: [1, 2],
      asignadoNombres: ['Dr. Juan Pérez', 'Dra. María García'],
      macro: 'Buenos días {nombre_paciente}, bienvenido/a a nuestra clínica. ¿En qué podemos ayudarle hoy?',
      fechaCreacion: '2024-01-10T08:30:00',
      creadoPor: 'Sistema'
    },
    {
      id: 2,
      nombre: 'Instrucciones Pre-Examen',
      descripcion: 'Instrucciones estándar antes de procedimientos',
      asignadoIds: [1, 5],
      asignadoNombres: ['Dr. Juan Pérez', 'Dr. Luis Fernández'],
      macro: 'Antes del examen debe: 1) Ayuno de 12 horas, 2) No tomar medicamentos, 3) Traer exámenes previos',
      fechaCreacion: '2024-02-05T14:15:00',
      creadoPor: 'jperez'
    }
  ]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedMacro, setSelectedMacro] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    asignadoIds: [],
    macro: '',
  });

  const [errors, setErrors] = useState({});
  const [selectAllPersonal, setSelectAllPersonal] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      asignadoIds: [],
      macro: '',
    });
    setErrors({});
    setSelectAllPersonal(false);
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Función para manejar selección múltiple de personal
  const handlePersonalChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, asignadoIds: typeof value === 'string' ? value.split(',') : value }));

    // Actualizar el estado del checkbox "Todos"
    setSelectAllPersonal(value.length === personales.length);

    // Limpiar error si existe
    if (errors.asignadoIds) {
      setErrors(prev => ({ ...prev, asignadoIds: '' }));
    }
  };

  // Función para manejar "Seleccionar todos"
  const handleSelectAllPersonal = (event) => {
    const checked = event.target.checked;
    setSelectAllPersonal(checked);

    if (checked) {
      setFormData(prev => ({ ...prev, asignadoIds: personales.map(p => p.id) }));
    } else {
      setFormData(prev => ({ ...prev, asignadoIds: [] }));
    }

    // Limpiar error si existe
    if (errors.asignadoIds) {
      setErrors(prev => ({ ...prev, asignadoIds: '' }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (formData.asignadoIds.length === 0) {
      newErrors.asignadoIds = 'Debe asignar al menos un personal';
    }
    if (!formData.macro.trim()) {
      newErrors.macro = 'Macro es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (macro) => {
    setSelectedMacro(macro);
    setFormData({
      nombre: macro.nombre,
      descripcion: macro.descripcion,
      asignadoIds: macro.asignadoIds,
      macro: macro.macro,
    });
    setSelectAllPersonal(macro.asignadoIds.length === personales.length);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedMacro(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (macro) => {
    setSelectedMacro(macro);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedMacro(null);
  };

  const handleOpenDetailsModal = (macro) => {
    setSelectedMacro(macro);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedMacro(null);
  };

  // Función para crear macro
  const handleCreateMacro = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const asignadosNombres = personales
        .filter(p => formData.asignadoIds.includes(p.id))
        .map(p => p.nombre);

      const newMacro = {
        id: Math.max(...macros.map(m => m.id)) + 1,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        asignadoIds: formData.asignadoIds,
        asignadoNombres: asignadosNombres,
        macro: formData.macro.trim(),
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'Sistema'
      };

      setMacros(prev => [...prev, newMacro]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar macro
  const handleEditMacro = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const asignadosNombres = personales
        .filter(p => formData.asignadoIds.includes(p.id))
        .map(p => p.nombre);

      setMacros(prev => prev.map(m =>
        m.id === selectedMacro.id
          ? {
              ...m,
              nombre: formData.nombre.trim(),
              descripcion: formData.descripcion.trim(),
              asignadoIds: formData.asignadoIds,
              asignadoNombres: asignadosNombres,
              macro: formData.macro.trim(),
            }
          : m
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar macro
  const handleDeleteMacro = () => {
    setMacros(prev => prev.filter(m => m.id !== selectedMacro.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar macros basado en la búsqueda
  const filteredMacros = macros.filter(macro =>
    macro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    macro.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    macro.asignadoNombres.some(nombre => nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <Typography color="text.primary">Macros</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Macros
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
            label="Crear Macro"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Lista de Macros"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Macro */}
        {activeTab === 0 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateMacro}>
              {/* Sección: Información de la Macro*/}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información de la Macro
                </Typography>

                {/* Fila 1: Nombre, Descripción */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre de la macro"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la descripción de la macro"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Asignar Personal */}
                <FieldRow>
                  <ResponsiveField label="Asignar a Personal" required sx={{ flex: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAllPersonal}
                            onChange={handleSelectAllPersonal}
                            color="primary"
                          />
                        }
                        label="Seleccionar todos"
                      />
                    </Box>
                    <FormControl fullWidth required error={!!errors.asignadoIds} size="small">
                      <InputLabel>Personal asignado</InputLabel>
                      <Select
                        multiple
                        value={formData.asignadoIds}
                        onChange={handlePersonalChange}
                        input={<OutlinedInput label="Personal asignado" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const personal = personales.find(p => p.id === value);
                              return (
                                <Chip
                                  key={value}
                                  label={personal?.nombre}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {personales.map((personal) => (
                          <MenuItem key={personal.id} value={personal.id}>
                            <Checkbox checked={formData.asignadoIds.indexOf(personal.id) > -1} />
                            <ListItemText primary={`${personal.nombre} - ${personal.cargo}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.asignadoIds && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.asignadoIds}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Contenido de la Macro */}
                <FieldRow>
                  <ResponsiveField label="Contenido de la Macro" required sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      placeholder="Escriba el contenido de la macro. Puede usar variables como {nombre_paciente}, {fecha}, etc."
                      value={formData.macro}
                      onChange={(e) => handleInputChange('macro', e.target.value)}
                      error={!!errors.macro}
                      helperText={errors.macro || "Tip: Use {variable} para contenido dinámico"}
                      size="small"
                    />
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
                  Crear Macro
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Macros */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar macro por nombre, descripción o personal asignado..."
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
                  {filteredMacros.length} resultado(s) de {macros.length} macros
                </Typography>
              )}
            </Box>

            {/* Tabla de Macros */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Macros" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Personal Asignado</strong></TableCell>
                      <TableCell><strong>Contenido</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMacros.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron macros que coincidan con la búsqueda' : 'No hay macros registradas'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMacros.map((macro) => (
                      <TableRow key={macro.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {macro.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {macro.descripcion.length > 50
                              ? `${macro.descripcion.substring(0, 50)}...`
                              : macro.descripcion
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {macro.asignadoNombres.slice(0, 2).map((nombre, index) => (
                              <Chip
                                key={index}
                                label={nombre.split(' ')[0]}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                            {macro.asignadoNombres.length > 2 && (
                              <Chip
                                label={`+${macro.asignadoNombres.length - 2}`}
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {macro.macro.length > 40
                              ? `${macro.macro.substring(0, 40)}...`
                              : macro.macro
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(macro)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(macro)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(macro)}
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

      {/* Modal para Editar Macro */}
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
          <Typography variant="h6" fontWeight="bold">Editar Macro</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditMacro}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información de la Macro
              </Typography>

              <FieldRow>
                <ResponsiveField label="Nombre" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre de la macro"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Descripción" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese la descripción de la macro"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Asignar a Personal" required sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectAllPersonal}
                          onChange={handleSelectAllPersonal}
                          color="primary"
                        />
                      }
                      label="Seleccionar todos"
                    />
                  </Box>
                  <FormControl fullWidth required error={!!errors.asignadoIds} size="small">
                    <InputLabel>Personal asignado</InputLabel>
                    <Select
                      multiple
                      value={formData.asignadoIds}
                      onChange={handlePersonalChange}
                      input={<OutlinedInput label="Personal asignado" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const personal = personales.find(p => p.id === value);
                            return (
                              <Chip
                                key={value}
                                label={personal?.nombre}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {personales.map((personal) => (
                        <MenuItem key={personal.id} value={personal.id}>
                          <Checkbox checked={formData.asignadoIds.indexOf(personal.id) > -1} />
                          <ListItemText primary={`${personal.nombre} - ${personal.cargo}`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.asignadoIds && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.asignadoIds}
                    </Typography>
                  )}
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Contenido de la Macro" required sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    placeholder="Escriba el contenido de la macro. Puede usar variables como {nombre_paciente}, {fecha}, etc."
                    value={formData.macro}
                    onChange={(e) => handleInputChange('macro', e.target.value)}
                    error={!!errors.macro}
                    helperText={errors.macro || "Tip: Use {variable} para contenido dinámico"}
                    size="small"
                  />
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

      {/* Modal de Detalles de la Macro */}
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
          <Typography variant="h6" fontWeight="bold">Detalles de la Macro</Typography>
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedMacro && (
            <Box>
              {/* Información General */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                  Información General
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Nombre:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedMacro.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Fecha de Creación:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedMacro.fechaCreacion ?
                        new Date(selectedMacro.fechaCreacion).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No disponible'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Descripción:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedMacro.descripcion}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ my: 2 }} />

              {/* Personal Asignado */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f7ff' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                  Personal Asignado ({selectedMacro.asignadoNombres.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedMacro.asignadoNombres.map((nombre, index) => (
                    <Chip
                      key={index}
                      label={nombre}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Contenido de la Macro */}
              <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#f57c00' }}>
                  <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Contenido de la Macro
                </Typography>
                <Box sx={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 2
                }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.9rem',
                      lineHeight: 1.6
                    }}
                  >
                    {selectedMacro.macro}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Variables disponibles: {'{nombre_paciente}'}, {'{fecha}'}, {'{hora}'}, {'{medico}'}
                </Typography>
              </Paper>

              {/* Estadísticas */}
              <Paper sx={{ p: 3, mt: 3, backgroundColor: '#e8f5e8' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2e7d32' }}>
                  Estadísticas
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {Math.floor((new Date() - new Date(selectedMacro.fechaCreacion)) / (1000 * 60 * 60 * 24))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Días desde creación
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {selectedMacro.asignadoNombres.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Personal asignado
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {selectedMacro.macro.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Caracteres en macro
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseDetailsModal}
            sx={{
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
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
            ¿Está seguro de que desea eliminar la macro{' '}
            <strong>"{selectedMacro?.nombre}"</strong>?
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
            onClick={handleDeleteMacro}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Macros;