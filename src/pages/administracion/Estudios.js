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
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
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
import { estudiosService } from '../../services/estudiosService';
import { centrosService } from '../../services/centrosService';

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
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [centrosD, setCentrosCargados] = useState([]);
  const [EstadoD, setEstadoCargados] = useState([]);
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

  const cargarCentros = async () => {
    try {
      const responseSystemParameter = await centrosService.getAll();
      console.log('✅ Respuesta de Centros:', responseSystemParameter);
      setCentrosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar Centros:', error);
      setError(`Error al cargar Centros: ${error.message}`);
    }
  };

const cargarEstados = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(10006);
      console.log('✅ Respuesta de Géneros:', responseSystemParameter);
      setEstadoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar estados:', error);
      setError(`Error al cargar estados: ${error.message}`);
    }
  };
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    description: '',
    operatingHours: '',
    status: '',
    informedConsent: '',
    consentimientoInformado: '',
    centroId: '',
    price: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    abbreviation: '',
    description: '',
    operatingHours: '',
    status: '',
    informedConsent: '',
    centroId: '',
    price: ''
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);


const loadEstudios = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando estudios desde el backend...');
      const response = await estudiosService.getAll();

      // Obtener los nombres de los centros para cada personal
            const estudiosListCarga = await Promise.all(
              response.data.map(async (estudio) => {
                try {
                  const centroDatos = await centrosService.getById(estudio.centroId);
                  
                  return {
                    ...estudio,
                    nombreCentro: centroDatos.data.nombre
                    
                  };
                } catch (error) {
                  console.error(`Error al obtener centro ${estudio.centroId}:`, error);
                  return {
                    ...estudio,
                    nombreCentro: 'Centro no encontrado',
                   
                  };
                }
              })
            );
      



      
      console.log('✅ Estudios cargados:', estudiosListCarga);
      setEstudios(estudiosListCarga || []);

    } catch (error) {
      console.error('❌ Error al cargar Estudios:', error);
      setError(`Error al cargar Estudios: ${error.message}`);

    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      cargarCentros();
      cargarEstados();
      try {
        await Promise.all([
          loadEstudios()
        ]);
      } catch (error) {
        console.error('❌ Error al cargar datos iniciales:', error);
        setError(`Error al cargar datos iniciales: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, []);


  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      name: '',
      abbreviation: '',
      description: '',
      operatingHours: '',
      status: '',
      informedConsent: '',
      centroId: '',
      price: ''
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

  const handleEditSelectChangeWithCascade = useCallback(async (field, value) => {
          try {
            // Lógica especial para cascading dropdowns UBIGEO
                 
            // Limpiar error si existe
            if (errors[field]) {
              setErrors(prev => ({
                ...prev,
                [field]: ''
              }));
            }
          } catch (error) {
            console.error('Error al cargar datos de ubicación:', error);
            setError('Error al cargar datos de ubicación');
          }
        }, [errors]);

  // Validación del formulario (TODOS los campos obligatorios)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }
    if (!formData.abbreviation.trim()) {
      newErrors.abbreviation = 'Abreviación es obligatoria';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }
    if (!editFormData.abbreviation.trim()) {
      newErrors.abbreviation = 'Abreviación es obligatoria';
    }
    if (!editFormData.description.trim()) {
      newErrors.description = 'Descripción es obligatoria';
    }
    if (!editFormData.operatingHours) {
      newErrors.operatingHours = 'Duración es obligatoria';
    }
    if (!editFormData.price) {
      newErrors.price = 'Precio es obligatorio';
    }
    if (!editFormData.status) {
      newErrors.status = 'Estado es obligatorio';
    }
    if (!editFormData.centroId) {
      newErrors.centroId = 'Centro es obligatorio';
    }
    if (editFormData.informedConsent === '') {
      newErrors.informedConsent = 'Consentimiento Informado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (estudio) => {
    setSelectedEstudio(estudio);
    const initialFormData = {
      name: estudio.name,
      abbreviation: estudio.abbreviation,
      description: estudio.description,
      operatingHours: estudio.operatingHours,
      status: estudio.status,
      informedConsent: estudio.informedConsent,
      centroId: estudio.centroId,
      price: estudio.price
    };
    setEditFormData(initialFormData);

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
  const handleCreateEstudio = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
          try {
            setLoading(true);
            console.log('📤 Creando Estudio...');
    
            // Asegurarse de que estado sea un ID numérico
            const estudioData = {
              ...formData,
              status: formData.status === 10007 ? true : false 
            };
    
            const nuevoEstudio = await estudiosService.create(estudioData);
            console.log('✅ Estudio creado:', nuevoEstudio);
    
            // Recargar la lista de centros
            await loadEstudios();
    
            clearForm();
            // Cambiar automáticamente al tab de lista
            setActiveTab(0);
    
          } catch (error) {
            console.error('❌ Error al crear Estudio:', error);
            setError(`Error al crear Estudio: ${error.message}`);
          } finally {
            setLoading(false);
          }
        }
      };

  // Función para editar Estudio
    const handleEditEstudio = async (e) => {
      e.preventDefault();
  
      if (validateEditForm()) {
        try {
          setLoading(true);
          console.log('📤 Editando Estudio...');
  
          // Asegurarse de que estado sea un booleano
          const formDataToSend = {
            ...editFormData,
            status: editFormData.status === '10007', // Convertir a booleano basado en el valor del estado
            informedConsent: editFormData.informedConsent === 'true' || editFormData.informedConsent === true
          };
          const personalActualizado = await estudiosService.update(selectedEstudio.id, formDataToSend);
          console.log('✅ Estudio actualizado:', personalActualizado);
  
          // Recargar la lista de Estudio
          await loadEstudios();
  
          handleCloseEditModal();
  
        } catch (error) {
          console.error('❌ Error al editar Estudio:', error);
          setError(`Error al editar Estudio: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

  // Función para eliminar estudio
    const handleDeleteEstudio = async () => {
      try {
        setLoading(true);
        console.log('📤 Eliminando Estudio...');
  
        await estudiosService.delete(selectedEstudio.id);
        console.log('✅ Estudio eliminado');
  
        // Recargar la lista de Estudio
        await loadEstudios();
  
        handleCloseDeleteConfirm();
  
      } catch (error) {
        console.error('❌ Error al eliminar Estudio:', error);
        setError(`Error al eliminar Estudio: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

  // Filtrar estudios basado en la búsqueda
  const filteredEstudios = estudios.filter(estudio =>
    (estudio.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (estudio.abbreviation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (estudio.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Abreviación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: EDA, COLO"
                      value={formData.abbreviation}
                      onChange={(e) => handleInputChange('abbreviation', e.target.value)}
                      error={!!errors.abbreviation}
                      helperText={errors.abbreviation}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Duración (minutos)" required>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      placeholder="30"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      error={!!errors.operatingHours}
                      helperText={errors.operatingHours}
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
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      error={!!errors.price}
                      helperText={errors.price}
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
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
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
                    <FormControl fullWidth required error={!!errors.centroId} size="small">
                      <Select
                        value={formData.centroId}
                        onChange={(e) => handleInputChange('centroId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.centroId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {Array.isArray(centrosD) && centrosD.map(centro => (
                          <MenuItem key={centro.id} value={centro.id}>
                            {centro.nombre || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.status} size="small">
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.status ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Consentimiento Informado" required>
                    <FormControl fullWidth required error={!!errors.informedConsent} size="small">
                      <Select
                        value={formData.informedConsent}
                        onChange={(e) => handleInputChange('informedConsent', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.informedConsent ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar opción</MenuItem>
                        <MenuItem value= {true}>Sí</MenuItem>
                        <MenuItem value= {false}>No</MenuItem>
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
                        <TableCell>{estudio.name}</TableCell>
                        <TableCell>{estudio.abbreviation}</TableCell>
                        <TableCell>{estudio.operatingHours} min</TableCell>
                        <TableCell>S/. {estudio.price}</TableCell>
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
                      value={editFormData.name}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Duración (min)" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      value={editFormData.operatingHours}
                      onChange={(e) => handleEditInputChange('operatingHours', e.target.value)}
                      error={!!errors.operatingHours}
                      helperText={errors.operatingHours}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Precio (S/.)" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      step="0.01"
                      value={editFormData.price}
                      onChange={(e) => handleEditInputChange('price', e.target.value)}
                      error={!!errors.price}
                      helperText={errors.price}
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
                      value={editFormData.abbreviation}
                      onChange={(e) => handleEditInputChange('abbreviation', e.target.value)}
                      error={!!errors.abbreviation}
                      helperText={errors.abbreviation}
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
                      value={editFormData.description}
                      onChange={(e) => handleEditInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
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
                    <FormControl fullWidth required error={!!errors.centroId} size="small">
                      <Select
                        value={editFormData.centroId}
                        onChange={(e) => handleEditInputChange('centroId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.centroId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {Array.isArray(centrosD) && centrosD.map(centro => (
                          <MenuItem key={centro.id} value={centro.id}>
                            {centro.nombre || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.status} size="small">
                      <Select
                        value={editFormData.status}
                        onChange={(e) => handleEditInputChange('status', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.status ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid.toString()}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                     
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Consentimiento Informado" required>
                    <FormControl fullWidth required error={!!errors.informedConsent} size="small">
                      <Select
                        value={editFormData.informedConsent}
                        onChange={(e) => handleEditInputChange('informedConsent', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.informedConsent ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar opción</MenuItem>
                        <MenuItem value= {true}>Sí</MenuItem>
                        <MenuItem value= {false}>No</MenuItem>
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
        <DialogTitle 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2184be',
            color: 'white',
            '& .MuiTypography-root': {
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }
          }}
        >
          Detalles del Estudio
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
                <Grid container spacing={3} sx={{ width: '100%' }}>
                  <Grid size={12}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedEstudio.name}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedEstudio.description}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body1">
                      <strong>Abreviación:</strong> {selectedEstudio.abbreviation}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body1">
                      <strong>Duración:</strong> {selectedEstudio.operatingHours} minutos
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body1">
                      <strong>Precio:</strong> S/. {selectedEstudio.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Estado y Centro */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Estado y Centro
                </Typography>
                <Grid container spacing={3} sx={{ width: '100%' }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1">
                      <strong>Centro:</strong> {selectedEstudio.nombreCentro}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" component="span">
                          <strong>Estado:</strong>
                        </Typography>
                        <Chip
                          label={selectedEstudio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          color={getEstadoColor(selectedEstudio.estado)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
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