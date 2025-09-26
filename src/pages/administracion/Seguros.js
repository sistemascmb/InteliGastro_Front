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
  CircularProgress,
  Alert
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
import { segurosService } from '../../services/segurosService';

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

const Seguros = () => {
  const navigate = useNavigate();

  // Estado para la lista de seguros
  const [seguros, setSeguros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedSeguro, setSelectedSeguro] = useState(null);

  // Estados para formularios separados
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    descripcion: '',
    direccion: '',
    estado: '',
  });

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    identificacion: '',
    descripcion: '',
    direccion: '',
    estado: '',
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar seguros del backend
  const loadSeguros = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando seguros desde el backend...');
      const response = await segurosService.getAll();

      console.log('✅ Seguros cargados:', response.data);
      setSeguros(response.data || []);

    } catch (error) {
      console.error('❌ Error al cargar seguros:', error);
      setError(`Error al cargar seguros: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar seguros al montar el componente
  useEffect(() => {
    loadSeguros();
  }, []);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      identificacion: '',
      descripcion: '',
      direccion: '',
      estado: '',
    });
    setErrors({});
  };

  // Función para limpiar el formulario de edición
  const clearEditForm = () => {
    setEditFormData({
      nombre: '',
      identificacion: '',
      descripcion: '',
      direccion: '',
      estado: '',
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto (formulario crear)
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Función genérica para manejar cambios en campos de texto (formulario editar)
  const handleEditInputChange = useCallback((field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  // Validación del formulario de crear
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.identificacion.trim()) {
      newErrors.identificacion = 'Identificación es obligatoria';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Dirección es obligatoria';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación del formulario de editar
  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!editFormData.identificacion.trim()) {
      newErrors.identificacion = 'Identificación es obligatoria';
    }
    if (!editFormData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!editFormData.direccion.trim()) {
      newErrors.direccion = 'Dirección es obligatoria';
    }
    if (!editFormData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (seguro) => {
    setSelectedSeguro(seguro);
    setEditFormData({
      nombre: seguro.nombre,
      identificacion: seguro.identificacion,
      descripcion: seguro.descripcion,
      direccion: seguro.direccion,
      estado: seguro.estado,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedSeguro(null);
    clearEditForm();
  };

  const handleOpenDetailsModal = (seguro) => {
    setSelectedSeguro(seguro);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedSeguro(null);
  };

  const handleOpenDeleteConfirm = (seguro) => {
    setSelectedSeguro(seguro);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedSeguro(null);
  };

  // Función para crear seguro
  const handleCreateSeguro = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        console.log('📤 Creando seguro...');

        const nuevoSeguro = await segurosService.create(formData);
        console.log('✅ Seguro creado:', nuevoSeguro);

        // Recargar la lista de seguros
        await loadSeguros();

        clearForm();
        // Cambiar automáticamente al tab de lista
        setActiveTab(1);

      } catch (error) {
        console.error('❌ Error al crear seguro:', error);
        setError(`Error al crear seguro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para editar seguro
  const handleEditSeguro = async (e) => {
    e.preventDefault();

    if (validateEditForm()) {
      try {
        setLoading(true);
        console.log('📤 Editando seguro...');

        const seguroActualizado = await segurosService.update(selectedSeguro.id, editFormData);
        console.log('✅ Seguro actualizado:', seguroActualizado);

        // Recargar la lista de seguros
        await loadSeguros();

        handleCloseEditModal();

      } catch (error) {
        console.error('❌ Error al editar seguro:', error);
        setError(`Error al editar seguro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para eliminar seguro
  const handleDeleteSeguro = async () => {
    try {
      setLoading(true);
      console.log('📤 Eliminando seguro...');

      await segurosService.delete(selectedSeguro.id);
      console.log('✅ Seguro eliminado');

      // Recargar la lista de seguros
      await loadSeguros();

      handleCloseDeleteConfirm();

    } catch (error) {
      console.error('❌ Error al eliminar seguro:', error);
      setError(`Error al eliminar seguro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar seguros basado en la búsqueda
  const filteredSeguros = seguros.filter(seguro =>
    seguro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seguro.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seguro.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seguro.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seguro.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Typography color="text.primary">Seguros</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Seguros
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
            label="Lista de Seguros"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Seguro"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Seguro */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            {/* Mostrar errores */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Mostrar loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress />
              </Box>
            )}

            <form onSubmit={handleCreateSeguro}>
              {/* Sección: Información del Seguro*/}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Seguro
                </Typography>

                {/* Fila 1: Nombre, Identificación */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del seguro"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Identificación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: EPS, SCTR, etc."
                      value={formData.identificacion}
                      onChange={(e) => handleInputChange('identificacion', e.target.value)}
                      error={!!errors.identificacion}
                      helperText={errors.identificacion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Dirección, Estado */}
                <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección del seguro"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
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

                {/* Fila 3: Descripción */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="Ingrese la descripción del seguro"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
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
                  Crear Seguro
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Seguros */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Mostrar errores */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Mostrar loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar seguro por nombre, identificación, descripción o dirección..."
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
                  {filteredSeguros.length} resultado(s) de {seguros.length} seguros
                </Typography>
              )}
            </Box>

            {/* Tabla de Seguros */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Seguros" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Identificación</strong></TableCell>
                      <TableCell><strong>Dirección</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSeguros.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron seguros que coincidan con la búsqueda' : 'No hay seguros registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSeguros.map((seguro) => (
                      <TableRow key={seguro.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {seguro.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {seguro.identificacion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {seguro.direccion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={seguro.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(seguro.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(seguro)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(seguro)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(seguro)}
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

      {/* Modal para Editar Seguro */}
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
          <Typography variant="h6" fontWeight="bold">Editar Seguro</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSeguro}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información del Seguro
              </Typography>

              {/* Fila 1: Nombre, Identificación */}
              <FieldRow>
                <ResponsiveField label="Nombre" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre del seguro"
                    value={editFormData.nombre}
                    onChange={(e) => handleEditInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Identificación" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ej: EPS, SCTR, etc."
                    value={editFormData.identificacion}
                    onChange={(e) => handleEditInputChange('identificacion', e.target.value)}
                    error={!!errors.identificacion}
                    helperText={errors.identificacion}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              {/* Fila 2: Dirección, Estado */}
              <FieldRow>
                <ResponsiveField label="Dirección" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese la dirección del seguro"
                    value={editFormData.direccion}
                    onChange={(e) => handleEditInputChange('direccion', e.target.value)}
                    error={!!errors.direccion}
                    helperText={errors.direccion}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Estado" required>
                  <FormControl fullWidth required error={!!errors.estado} size="small">
                    <Select
                      value={editFormData.estado}
                      onChange={(e) => handleEditInputChange('estado', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: editFormData.estado ? '#000' : '#999'
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

              {/* Fila 3: Descripción */}
              <FieldRow>
                <ResponsiveField label="Descripción" required sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    placeholder="Ingrese la descripción del seguro"
                    value={editFormData.descripcion}
                    onChange={(e) => handleEditInputChange('descripcion', e.target.value)}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
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
            ¿Está seguro de que desea eliminar el seguro{' '}
            <strong>"{selectedSeguro?.nombre}"</strong>?
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
            onClick={handleDeleteSeguro}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Ver Detalles */}
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
          <Typography variant="h6" fontWeight="bold">Detalles del Seguro</Typography>
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedSeguro && (
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                Información del Seguro
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    Nombre:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSeguro.nombre}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    Identificación:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSeguro.identificacion}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    Dirección:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSeguro.direccion}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    Estado:
                  </Typography>
                  <Chip
                    label={selectedSeguro.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    color={getEstadoColor(selectedSeguro.estado)}
                    size="small"
                    sx={{ mt: 0.5, mb: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    Descripción:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedSeguro.descripcion}
                  </Typography>
                </Box>

                {selectedSeguro.fechaCreacion && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Fecha de Creación:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedSeguro.fechaCreacion).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                )}

                {selectedSeguro.creadoPor && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Creado Por:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeguro.creadoPor}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
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
    </Container>
  );
};

export default Seguros;