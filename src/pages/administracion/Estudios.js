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
  Chip
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
  LocalHospital
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

const Estudios = () => {
  const navigate = useNavigate();

  // Estado para la lista de estudios
  const [estudios, setEstudios] = useState([
    {
      id: 1,
      nombre: 'Colonoscopía Diagnóstica',
      abreviacion: 'COLO-DX',
      descripcion: 'Examen endoscópico para evaluación del colon y recto',
      duracion: '45',
      precio: '350.00',
      estado: 'activo',
      consentimientoInformado: 'si',
      centro: 'centro-1'
    },
    {
      id: 2,
      nombre: 'Endoscopía Digestiva Alta',
      abreviacion: 'EDA',
      descripcion: 'Exploración endoscópica del tracto digestivo superior',
      duracion: '30',
      precio: '280.00',
      estado: 'activo',
      consentimientoInformado: 'si',
      centro: 'centro-1'
    },
    {
      id: 3,
      nombre: 'Ecografía Abdominal',
      abreviacion: 'ECO-ABD',
      descripcion: 'Estudio ultrasonográfico del abdomen',
      duracion: '25',
      precio: '150.00',
      estado: 'inactivo',
      consentimientoInformado: 'no',
      centro: 'centro-2'
    }
  ]);

  // Datos simulados de centros
  const centros = [
    { value: 'centro-1', label: 'Clínica María Belén - Sede Central' },
    { value: 'centro-2', label: 'Clínica María Belén - Sede Norte' }
  ];

  // Estados para modales (solo editar, detallar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedEstudio, setSelectedEstudio] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    abreviacion: '',
    descripcion: '',
    duracion: '',
    precio: '',
    estado: '',
    consentimientoInformado: '',
    centro: ''
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
      abreviacion: '',
      descripcion: '',
      duracion: '',
      precio: '',
      estado: '',
      consentimientoInformado: '',
      centro: ''
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
    if (!formData.abreviacion.trim()) {
      newErrors.abreviacion = 'Abreviación es obligatoria';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.duracion.trim()) {
      newErrors.duracion = 'Duración es obligatoria';
    }
    if (!formData.precio.trim()) {
      newErrors.precio = 'Precio es obligatorio';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.consentimientoInformado) {
      newErrors.consentimientoInformado = 'Consentimiento informado es obligatorio';
    }
    if (!formData.centro) {
      newErrors.centro = 'Centro es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (estudio) => {
    setSelectedEstudio(estudio);
    setFormData({
      nombre: estudio.nombre,
      abreviacion: estudio.abreviacion,
      descripcion: estudio.descripcion,
      duracion: estudio.duracion,
      precio: estudio.precio,
      estado: estudio.estado,
      consentimientoInformado: estudio.consentimientoInformado,
      centro: estudio.centro
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedEstudio(null);
    clearForm();
  };

  const handleOpenDetailModal = (estudio) => {
    setSelectedEstudio(estudio);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedEstudio(null);
  };

  const handleOpenDeleteConfirm = (estudio) => {
    setSelectedEstudio(estudio);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedEstudio(null);
  };

  // Función para crear estudio
  const handleCreateEstudio = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newEstudio = {
        id: Math.max(...estudios.map(c => c.id)) + 1,
        nombre: formData.nombre.trim(),
        abreviacion: formData.abreviacion.trim(),
        descripcion: formData.descripcion.trim(),
        duracion: formData.duracion.trim(),
        precio: formData.precio.trim(),
        estado: formData.estado,
        consentimientoInformado: formData.consentimientoInformado,
        centro: formData.centro
      };

      setEstudios(prev => [...prev, newEstudio]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar estudio
  const handleEditEstudio = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setEstudios(prev => prev.map(e =>
        e.id === selectedEstudio.id
          ? {
              ...e,
              nombre: formData.nombre.trim(),
              abreviacion: formData.abreviacion.trim(),
              descripcion: formData.descripcion.trim(),
              duracion: formData.duracion.trim(),
              precio: formData.precio.trim(),
              estado: formData.estado,
              consentimientoInformado: formData.consentimientoInformado,
              centro: formData.centro
            }
          : e
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar estudio
  const handleDeleteEstudio = () => {
    setEstudios(prev => prev.filter(e => e.id !== selectedEstudio.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar estudios basado en la búsqueda
  const filteredEstudios = estudios.filter(estudio =>
    estudio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudio.abreviacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el label del centro
  const getCentroLabel = (centroValue) => {
    const centro = centros.find(c => c.value === centroValue);
    return centro ? centro.label : centroValue;
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
        <Typography color="text.primary">Estudios</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Estudios
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
            label="Lista de Estudios"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Crear Estudio"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Estudio */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateEstudio}>
              {/* Sección 1: Información del Estudio */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Estudio
                </Typography>

                {/* Fila 1: Nombre, Abreviación */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del estudio"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Abreviación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: EDA, COLO"
                      value={formData.abreviacion}
                      onChange={(e) => handleInputChange('abreviacion', e.target.value)}
                      error={!!errors.abreviacion}
                      helperText={errors.abreviacion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Duración (minutos)" required>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      placeholder="30"
                      value={formData.duracion}
                      onChange={(e) => handleInputChange('duracion', e.target.value)}
                      error={!!errors.duracion}
                      helperText={errors.duracion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Precio (S/.)" required>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.precio}
                      onChange={(e) => handleInputChange('precio', e.target.value)}
                      error={!!errors.precio}
                      helperText={errors.precio}
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
                      placeholder="Ingrese la descripción del estudio"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 2: Información del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Información del Centro y Estado
                </Typography>

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

                  <ResponsiveField label="Consentimiento Informado" required>
                    <FormControl fullWidth required error={!!errors.consentimientoInformado} size="small">
                      <Select
                        value={formData.consentimientoInformado}
                        onChange={(e) => handleInputChange('consentimientoInformado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.consentimientoInformado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar opción</MenuItem>
                        <MenuItem value="si">Sí</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
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
                  Crear Estudio
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Estudios */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar estudios por nombre, abreviación o descripción..."
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
                  {filteredEstudios.length} resultado(s) de {estudios.length} estudios
                </Typography>
              )}
            </Box>

            {/* Tabla de Estudios */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Estudios" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Abreviación</strong></TableCell>
                      <TableCell><strong>Duración</strong></TableCell>
                      <TableCell><strong>Precio</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEstudios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron estudios que coincidan con la búsqueda' : 'No hay estudios registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEstudios.map((estudio) => (
                      <TableRow key={estudio.id} hover>
                        <TableCell>{estudio.nombre}</TableCell>
                        <TableCell>{estudio.abreviacion}</TableCell>
                        <TableCell>{estudio.duracion} min</TableCell>
                        <TableCell>S/. {estudio.precio}</TableCell>
                        <TableCell>
                          <Chip
                            label={estudio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(estudio.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(estudio)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailModal(estudio)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(estudio)}
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

      {/* Modal para Editar Estudio */}
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
          <Typography variant="h6" fontWeight="bold">Editar Estudio</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditEstudio}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección 1: Información del Estudio */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información del Estudio
              </Typography>
              {/* Fila 1: Nombre, Abreviación */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required sx={{flex:2}}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del estudio"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Duración (min)" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      value={formData.duracion}
                      onChange={(e) => handleInputChange('duracion', e.target.value)}
                      error={!!errors.duracion}
                      helperText={errors.duracion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Precio (S/.)" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => handleInputChange('precio', e.target.value)}
                      error={!!errors.precio}
                      helperText={errors.precio}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Abreviación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: EDA, COLO"
                      value={formData.abreviacion}
                      onChange={(e) => handleInputChange('abreviacion', e.target.value)}
                      error={!!errors.abreviacion}
                      helperText={errors.abreviacion}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField>
                    {/* Espacio vacío para alinear con la fila superior */}
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Descripción */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="Ingrese la descripción del estudio"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
            </Paper>

            {/* Sección 2: Centro y Estado */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Centro y Estado
              </Typography>
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

                  <ResponsiveField label="Consentimiento Informado" required>
                    <FormControl fullWidth required error={!!errors.consentimientoInformado} size="small">
                      <Select
                        value={formData.consentimientoInformado}
                        onChange={(e) => handleInputChange('consentimientoInformado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.consentimientoInformado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar opción</MenuItem>
                        <MenuItem value="si">Sí</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
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
          <Typography variant="h6" fontWeight="bold">Detalles del Estudio</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedEstudio && (
            <>
              {/* Sección 1: Información del Estudio */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Estudio
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedEstudio.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedEstudio.descripcion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Abreviación:</strong> {selectedEstudio.abreviacion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Duración:</strong> {selectedEstudio.duracion} minutos
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Precio:</strong> S/. {selectedEstudio.precio}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Estado y Centro */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Estado y Centro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Centro:</strong> {getCentroLabel(selectedEstudio.centro)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1">
                      <strong>Estado:</strong>
                      <Chip
                        label={selectedEstudio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        color={getEstadoColor(selectedEstudio.estado)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1">
                      <strong>Consentimiento:</strong> {selectedEstudio.consentimientoInformado === 'si' ? 'Sí' : 'No'}
                    </Typography>
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
            ¿Está seguro de que desea eliminar el estudio{' '}
            <strong>"{selectedEstudio?.nombre}"</strong>?
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
            onClick={handleDeleteEstudio}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Estudios;