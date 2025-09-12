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
  Tab
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
  Directions
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

const Centros = () => {
  const navigate = useNavigate();

  // Estado para la lista de centros
  const [centros, setCentros] = useState([
    {
      id: 1,
      // Información del Centro
      nombre: 'Clínica María Belén - Sede Central',
      descripcion: 'Sede principal de la clínica con servicios de gastroenterología especializada',
      abreviatura: 'CMB-CENTRAL',
      inicioAtencion: '08:00',
      finAtencion: '18:00',
      // Dirección del Centro
      direccion: 'Av. Principal 123',
      codPostal: '06001',
      telefono: '076-123456',
      pais: 'peru',
      departamento: 'cajamarca',
      provincia: 'cajabamba',
      distrito: 'cajabamba_distrito'
    },
    {
      id: 2,
      nombre: 'Clínica María Belén - Sede Norte',
      descripcion: 'Sucursal con servicios ambulatorios y consulta externa',
      abreviatura: 'CMB-NORTE',
      inicioAtencion: '07:00',
      finAtencion: '16:00',
      direccion: 'Jr. Los Andes 456',
      codPostal: '06002',
      telefono: '076-789012',
      pais: 'peru',
      departamento: 'cajamarca',
      provincia: 'bambamarca',
      distrito: 'bambamarca_distrito'
    }
  ]);

  // Estados para modales (solo editar, detallar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    // Información del Centro
    nombre: '',
    descripcion: '',
    abreviatura: '',
    inicioAtencion: '',
    finAtencion: '',
    // Dirección del Centro
    direccion: '',
    codPostal: '',
    telefono: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: ''
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Datos para cascading dropdowns
  const provincias = {
    cajamarca: [
      { value: 'cajabamba', label: 'Cajabamba' },
      { value: 'bambamarca', label: 'Bambamarca' }
    ]
  };

  const distritos = {
    cajabamba: [
      { value: 'cajabamba_distrito', label: 'Cajabamba' },
      { value: 'cachachi', label: 'Cachachi' }
    ],
    bambamarca: [
      { value: 'bambamarca_distrito', label: 'Bambamarca' },
      { value: 'chugur', label: 'Chugur' }
    ]
  };

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      abreviatura: '',
      inicioAtencion: '',
      finAtencion: '',
      direccion: '',
      codPostal: '',
      telefono: '',
      pais: '',
      departamento: '',
      provincia: '',
      distrito: ''
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

  // Función para manejar cambios en selects con lógica de cascada
  const handleSelectChangeWithCascade = useCallback((field, value) => {
    // Lógica especial para cascading dropdowns
    if (field === 'pais') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        departamento: '',
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'departamento') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'provincia') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        distrito: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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
    
    // Información del Centro
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.abreviatura.trim()) {
      newErrors.abreviatura = 'Abreviatura es obligatoria';
    }
    if (!formData.inicioAtencion.trim()) {
      newErrors.inicioAtencion = 'Inicio de Atención es obligatorio';
    }
    if (!formData.finAtencion.trim()) {
      newErrors.finAtencion = 'Fin de Atención es obligatorio';
    }
    
    // Dirección del Centro
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!formData.codPostal.trim()) {
      newErrors.codPostal = 'Código Postal es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }
    if (!formData.pais) {
      newErrors.pais = 'País es obligatorio';
    }
    if (!formData.departamento) {
      newErrors.departamento = 'Departamento es obligatorio';
    }
    if (!formData.provincia) {
      newErrors.provincia = 'Provincia es obligatoria';
    }
    if (!formData.distrito) {
      newErrors.distrito = 'Distrito es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (centro) => {
    setSelectedCentro(centro);
    setFormData({
      nombre: centro.nombre,
      descripcion: centro.descripcion,
      abreviatura: centro.abreviatura,
      inicioAtencion: centro.inicioAtencion,
      finAtencion: centro.finAtencion,
      direccion: centro.direccion,
      codPostal: centro.codPostal,
      telefono: centro.telefono,
      pais: centro.pais,
      departamento: centro.departamento,
      provincia: centro.provincia,
      distrito: centro.distrito
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCentro(null);
    clearForm();
  };

  const handleOpenDetailModal = (centro) => {
    setSelectedCentro(centro);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedCentro(null);
  };

  const handleOpenDeleteConfirm = (centro) => {
    setSelectedCentro(centro);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedCentro(null);
  };

  // Función para crear centro
  const handleCreateCentro = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newCentro = {
        id: Math.max(...centros.map(c => c.id)) + 1,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        abreviatura: formData.abreviatura.trim(),
        inicioAtencion: formData.inicioAtencion.trim(),
        finAtencion: formData.finAtencion.trim(),
        direccion: formData.direccion.trim(),
        codPostal: formData.codPostal.trim(),
        telefono: formData.telefono.trim(),
        pais: formData.pais,
        departamento: formData.departamento,
        provincia: formData.provincia,
        distrito: formData.distrito
      };
      
      setCentros(prev => [...prev, newCentro]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar centro
  const handleEditCentro = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setCentros(prev => prev.map(c => 
        c.id === selectedCentro.id 
          ? {
              ...c,
              nombre: formData.nombre.trim(),
              descripcion: formData.descripcion.trim(),
              abreviatura: formData.abreviatura.trim(),
              inicioAtencion: formData.inicioAtencion.trim(),
              finAtencion: formData.finAtencion.trim(),
              direccion: formData.direccion.trim(),
              codPostal: formData.codPostal.trim(),
              telefono: formData.telefono.trim(),
              pais: formData.pais,
              departamento: formData.departamento,
              provincia: formData.provincia,
              distrito: formData.distrito
            }
          : c
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar centro
  const handleDeleteCentro = () => {
    setCentros(prev => prev.filter(c => c.id !== selectedCentro.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar centros basado en la búsqueda
  const filteredCentros = centros.filter(centro => 
    centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.abreviatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre legible de ubicación
  const getUbicacionTexto = (centro) => {
    const provinciaObj = provincias.cajamarca?.find(p => p.value === centro.provincia);
    const distritoObj = distritos[centro.provincia]?.find(d => d.value === centro.distrito);
    
    return `${distritoObj?.label || ''}, ${provinciaObj?.label || ''}, Cajamarca`;
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
        <Typography color="text.primary">Centros</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Centros
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
            label="Crear Centro" 
            icon={<Add />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab 
            label="Lista de Centros" 
            icon={<Search />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Centro */}
        {activeTab === 0 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateCentro}>
              {/* Sección 1: Información del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Centro
                </Typography>

                {/* Fila 1: Nombre, Abreviatura, Horarios */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del centro"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Abreviatura" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: CMB-CENTRAL"
                      value={formData.abreviatura}
                      onChange={(e) => handleInputChange('abreviatura', e.target.value)}
                      error={!!errors.abreviatura}
                      helperText={errors.abreviatura}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Inicio de Atención" required>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.inicioAtencion}
                      onChange={(e) => handleInputChange('inicioAtencion', e.target.value)}
                      error={!!errors.inicioAtencion}
                      helperText={errors.inicioAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fin de Atención" required>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.finAtencion}
                      onChange={(e) => handleInputChange('finAtencion', e.target.value)}
                      error={!!errors.finAtencion}
                      helperText={errors.finAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
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
                      placeholder="Ingrese la descripción del centro"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 2: Dirección del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Dirección del Centro
                </Typography>

                <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección completa"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Código Postal" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      error={!!errors.codPostal}
                      helperText={errors.codPostal}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais} size="small">
                      <Select
                        value={formData.pais}
                        onChange={(e) => handleSelectChangeWithCascade('pais', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.pais ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar país</MenuItem>
                        <MenuItem value="peru">Perú</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required disabled={formData.pais !== 'peru'} error={!!errors.departamento} size="small">
                      <Select
                        value={formData.departamento}
                        onChange={(e) => handleSelectChangeWithCascade('departamento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.departamento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar departamento</MenuItem>
                        {formData.pais === 'peru' && (
                          <MenuItem value="cajamarca">Cajamarca</MenuItem>
                        )}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required disabled={formData.departamento !== 'cajamarca'} error={!!errors.provincia} size="small">
                      <Select
                        value={formData.provincia}
                        onChange={(e) => handleSelectChangeWithCascade('provincia', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.provincia ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar provincia</MenuItem>
                        {formData.departamento === 'cajamarca' &&
                          provincias.cajamarca.map(provincia => (
                            <MenuItem key={provincia.value} value={provincia.value}>
                              {provincia.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia || !distritos[formData.provincia]} error={!!errors.distrito} size="small">
                      <Select
                        value={formData.distrito}
                        onChange={(e) => handleSelectChangeWithCascade('distrito', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.distrito ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar distrito</MenuItem>
                        {formData.provincia && distritos[formData.provincia] &&
                          distritos[formData.provincia].map(distrito => (
                            <MenuItem key={distrito.value} value={distrito.value}>
                              {distrito.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.distrito && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.distrito}</Typography>}
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
                  Crear Centro
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Centros */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar centros por nombre, abreviatura o teléfono..."
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
                  {filteredCentros.length} resultado(s) de {centros.length} centros
                </Typography>
              )}
            </Box>

            {/* Tabla de Centros */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Centros" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Abreviatura</strong></TableCell>
                      <TableCell><strong>Horario</strong></TableCell>
                      <TableCell><strong>Teléfono</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCentros.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron centros que coincidan con la búsqueda' : 'No hay centros registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCentros.map((centro) => (
                      <TableRow key={centro.id} hover>
                        <TableCell>{centro.nombre}</TableCell>
                        <TableCell>{centro.abreviatura}</TableCell>
                        <TableCell>{centro.inicioAtencion} - {centro.finAtencion}</TableCell>
                        <TableCell>{centro.telefono}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(centro)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailModal(centro)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(centro)}
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

      {/* Modal para Editar Centro */}
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
          <Typography variant="h6" fontWeight="bold">Editar Centro</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditCentro}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección 1: Información del Centro */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                1. Información del Centro
              </Typography>
              {/* Fila 1: Nombre, Abreviatura, Horarios */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required sx={{flex:2}}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del centro"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Inicio de Atención" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.inicioAtencion}
                      onChange={(e) => handleInputChange('inicioAtencion', e.target.value)}
                      error={!!errors.inicioAtencion}
                      helperText={errors.inicioAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fin de Atención" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.finAtencion}
                      onChange={(e) => handleInputChange('finAtencion', e.target.value)}
                      error={!!errors.finAtencion}
                      helperText={errors.finAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Abreviatura" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: CMB-CENTRAL"
                      value={formData.abreviatura}
                      onChange={(e) => handleInputChange('abreviatura', e.target.value)}
                      error={!!errors.abreviatura}
                      helperText={errors.abreviatura}
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
                      placeholder="Ingrese la descripción del centro"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
            </Paper>

            {/* Sección 2: Dirección del Centro */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                2. Dirección del Centro
              </Typography>
              <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección completa"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Código Postal" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      error={!!errors.codPostal}
                      helperText={errors.codPostal}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais} size="small">
                      <Select
                        value={formData.pais}
                        onChange={(e) => handleSelectChangeWithCascade('pais', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.pais ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar país</MenuItem>
                        <MenuItem value="peru">Perú</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required disabled={formData.pais !== 'peru'} error={!!errors.departamento} size="small">
                      <Select
                        value={formData.departamento}
                        onChange={(e) => handleSelectChangeWithCascade('departamento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.departamento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar departamento</MenuItem>
                        {formData.pais === 'peru' && (
                          <MenuItem value="cajamarca">Cajamarca</MenuItem>
                        )}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required disabled={formData.departamento !== 'cajamarca'} error={!!errors.provincia} size="small">
                      <Select
                        value={formData.provincia}
                        onChange={(e) => handleSelectChangeWithCascade('provincia', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.provincia ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar provincia</MenuItem>
                        {formData.departamento === 'cajamarca' &&
                          provincias.cajamarca.map(provincia => (
                            <MenuItem key={provincia.value} value={provincia.value}>
                              {provincia.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia || !distritos[formData.provincia]} error={!!errors.distrito} size="small">
                      <Select
                        value={formData.distrito}
                        onChange={(e) => handleSelectChangeWithCascade('distrito', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.distrito ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar distrito</MenuItem>
                        {formData.provincia && distritos[formData.provincia] &&
                          distritos[formData.provincia].map(distrito => (
                            <MenuItem key={distrito.value} value={distrito.value}>
                              {distrito.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.distrito && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.distrito}</Typography>}
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
          <Typography variant="h6" fontWeight="bold">Detalles del Centro</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedCentro && (
            <>
              {/* Sección 1: Información del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Centro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedCentro.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedCentro.descripcion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Abreviatura:</strong> {selectedCentro.abreviatura}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Inicio de Atención:</strong> {selectedCentro.inicioAtencion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Fin de Atención:</strong> {selectedCentro.finAtencion}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Dirección del Centro */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Dirección del Centro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Direccion:</strong> {selectedCentro.direccion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1">
                      <strong>Código Postal:</strong> {selectedCentro.codPostal}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body1">
                      <strong>Teléfono:</strong> {selectedCentro.telefono}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Ubicación:</strong> {getUbicacionTexto(selectedCentro)}
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
            ¿Está seguro de que desea eliminar el centro{' '}
            <strong>"{selectedCentro?.nombre}"</strong>?
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
            onClick={handleDeleteCentro}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Centros;