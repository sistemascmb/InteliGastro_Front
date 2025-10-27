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
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Alert
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
import { recursosService } from '../../services/recursosService';
import { centrosService } from '../../services/centrosService';
import { salasService } from '../../services/salasService';


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
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [centrosD, setCentrosCargados] = useState([]);
  const [EstadoD, setEstadoCargados] = useState([]);
  const [SalasD, setSalasCargados] = useState([]);

  // Datos de centros (simplificado para usar con la API)

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

  const cargarSalas = async () => {
      try {
        const responseSystemParameter = await salasService.getAll();
        console.log('✅ Respuesta de Salas:', responseSystemParameter);
        setSalasCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                         responseSystemParameter?.data || []);
      } catch (error) {
        console.error('❌ Error al cargar Salas:', error);
        setError(`Error al cargar Salas: ${error.message}`);
      }
    };
    
  const centros = [
    { value: 1, label: 'Clínica María Belén - Sede Central' }
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

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  // Estados para formularios separados
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    numeroSerie: '',
    locacionId: '',
    centro: '',
    estado: 'activo',
    status: '',
    procedimientos: []
  });

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    descripcion: '',
    numeroSerie: '',
    locacionId: '',
    centro: '',
    estado: 'activo',
    status: '10007', // Inicializado con valor por defecto
    procedimientos: []
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar recursos del backend
  const loadRecursos = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando recursos desde el backend...');
      const response = await recursosService.getAll();

      const busquedasId = await Promise.all(
              response.data.map(async (recursos) => {
                try {
                  const centroDatos = await centrosService.getById(recursos.centroId);
                  const salaDatos = await salasService.getById(recursos.procedureroomid);

                  
                  return {
                    ...recursos,
                    nombreCentro: centroDatos.data.nombre,
                    nombreSala: salaDatos.data.name
                  };
                } catch (error) {
                  console.error(`Error al obtener centro ${recursos.centroId}:`, error);
                  return {
                    ...recursos,
                    nombreCentro: 'Centro no encontrado',
                    nombreSala: 'Sala no encontrado'
                  };
                }
              })
            );



      console.log('✅ Recursos cargados:', busquedasId);
      setRecursos(busquedasId || []);

    } catch (error) {
      console.error('❌ Error al cargar recursos:', error);
      setError(`Error al cargar recursos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar recursos al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      cargarCentros();
      cargarEstados();
      cargarSalas();

      try {
        await Promise.all([
          loadRecursos()
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
      nombre: '',
      descripcion: '',
      numeroSerie: '',
      locacionId: '',
      centro: '1',
      status: '', // Valor por defecto para el estado
      procedimientos: []
    });
    setErrors({});
  };

  // Función para limpiar el formulario de edición
  const clearEditForm = () => {
    setEditFormData({
      nombre: '',
      descripcion: '',
      numeroSerie: '',
      locacionId: '',
      centro: '',
      status: '10007', // Valor por defecto para el estado
      procedimientos: []
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

  // Función para manejar cambios en procedimientos (checkboxes) - crear
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

  // Función para manejar cambios en procedimientos (checkboxes) - editar
  const handleEditProcedimientoChange = useCallback((procedimientoValue, checked) => {
    setEditFormData(prev => ({
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

  // Validación del formulario de crear
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
    if (!formData.status) {
      newErrors.status = 'Estado es obligatorio';
    }
    // Nota: locacionId y centro son opcionales por ahora ya que el backend maneja defaults
    // Nota: procedimientos son opcionales ya que el backend aún no los maneja

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación del formulario de editar
  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!editFormData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!editFormData.numeroSerie.trim()) {
      newErrors.numeroSerie = 'Número de Serie es obligatorio';
    }
    if (!editFormData.status) {
      newErrors.status = 'Estado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (recurso) => {
    setSelectedRecurso(recurso);
    setEditFormData({
      nombre: recurso.nombre || '',
      descripcion: recurso.descripcion || '',
      numeroSerie: recurso.numeroSerie || '',
      locacionId: recurso.locacionId || '',
      centro: recurso.centroId > 0 ? recurso.centroId.toString() : '1',
      status: recurso.status || '10007',  // Aseguramos un valor por defecto
      procedimientos: recurso.procedimientos || []
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRecurso(null);
    setEditFormData({
      nombre: '',
      descripcion: '',
      numeroSerie: '',
      locacionId: '',
      centro: '',
      status: '10007',
      procedimientos: []
    });
    setErrors({});
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
  const handleCreateRecurso = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        console.log('📤 Creando recurso...');

        const recursosData = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            numeroSerie: formData.numeroSerie,
            status: formData.status === 10007 ? true : false ,
            estado: formData.status === '10007', // Convertir a booleano basado en el valor del estado
            centro: Math.max(1, parseInt(formData.centro) || 1), // Aseguramos que sea un número mayor a 0
            locacionId: parseInt(formData.locacionId) || 1 // Valor por defecto si no está definido
          };

        const nuevoRecurso = await recursosService.create(recursosData);
        console.log('✅ Recurso creado:', nuevoRecurso);

        // Recargar la lista de recursos
        await loadRecursos();

        clearForm();
        // Cambiar automáticamente al tab de lista
        setActiveTab(0);

      } catch (error) {
        console.error('❌ Error al crear recurso:', error);
        setError(`Error al crear recurso: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para editar recurso
const handleEditRecurso = async (e) => {
        e.preventDefault();
    
        if (validateEditForm()) {
          try {
            setLoading(true);
            console.log('📤 Editando recurso...');
    
            // Asegurarse de que estado sea un booleano
            const formDataToSend = {
              ...editFormData,
              status: editFormData.status === 10007 ? true : false 
            };
            const salaActualizado = await recursosService.update(selectedRecurso.id, formDataToSend);
            console.log('✅ Sala actualizado:', salaActualizado);
    
            // Recargar la lista de Salas
            await loadRecursos();
    
            handleCloseEditModal();
    
          } catch (error) {
            console.error('❌ Error al editar recurso:', error);
            setError(`Error al editar recurso: ${error.message}`);
          } finally {
            setLoading(false);
          }
        }
      };


  

  // Función para eliminar recurso
  const handleDeleteRecurso = async () => {
    try {
      setLoading(true);
      console.log('📤 Eliminando recurso...');

      await recursosService.delete(selectedRecurso.id);
      console.log('✅ Recurso eliminado');

      // Recargar la lista de recursos
      await loadRecursos();

      handleCloseDeleteConfirm();

    } catch (error) {
      console.error('❌ Error al eliminar recurso:', error);
      setError(`Error al eliminar recurso: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
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

                  <ResponsiveField label="Sala" required>
                    <FormControl fullWidth required error={!!errors.locacionId} size="small">
                      <Select
                        value={formData.locacionId}
                        onChange={(e) => handleInputChange('locacionId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.locacionId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {Array.isArray(SalasD) && SalasD.map(salas => (
                          <MenuItem key={salas.id} value={salas.id}>
                              {salas.name || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                        {Array.isArray(centrosD) && centrosD.map(centro => (
                          <MenuItem key={centro.id} value={centro.id}>
                              {centro.nombre || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.estado} size="small">
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
                        <MenuItem value="">Seleccionar estatus</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
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
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    minWidth: '200px',
                    py: 1.5
                  }}
                >
                  {loading ? 'Creando...' : 'Crear Recurso'}
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Recursos */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <CircularProgress />
              </Box>
            )}
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredRecursos.length === 0 ? (
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
                        <TableCell>{recurso.nombreSala}</TableCell>
                        <TableCell>{recurso.nombreCentro}</TableCell>
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
          <Box sx={{ typography: 'h6', fontWeight: 'bold' }}>Editar Recurso</Box>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditRecurso}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Sección 1: Información del Recurso */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Box sx={{ typography: 'h6', fontWeight: 'bold', mb: 3, color: '#2184be' }}>
                Información del Recurso
              </Box>

              <FieldRow>
                <ResponsiveField label="Nombre" required sx={{flex:2}}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre del recurso"
                    value={editFormData.nombre}
                    onChange={(e) => handleEditInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Número de Serie" required sx={{flex:1}}>
                  <TextField
                    fullWidth
                    required
                    value={editFormData.numeroSerie}
                    onChange={(e) => handleEditInputChange('numeroSerie', e.target.value)}
                    error={!!errors.numeroSerie}
                    helperText={errors.numeroSerie}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Sala" required>
                    <FormControl fullWidth required error={!!errors.locacionId} size="small">
                      <Select
                        value={editFormData.locacionId}
                        onChange={(e) => handleEditInputChange('locacionId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.locacionId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {Array.isArray(SalasD) && SalasD.map(salas => (
                          <MenuItem key={salas.id} value={salas.id}>
                              {salas.name || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    value={editFormData.descripcion}
                    onChange={(e) => handleEditInputChange('descripcion', e.target.value)}
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
                      value={editFormData.centro}
                      onChange={(e) => handleEditInputChange('centro', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: editFormData.centro ? '#000' : '#999'
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
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
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
              <Box sx={{ typography: 'h6', fontWeight: 'bold', mb: 3, color: '#2184be' }}>
                Procedimientos
              </Box>

              <ResponsiveField label="Seleccione los procedimientos asociados al recurso" required>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    {procedimientosDisponibles.map((procedimiento) => (
                      <Grid item xs={12} sm={6} md={4} key={procedimiento.value}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: editFormData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#fff',
                            border: editFormData.procedimientos.includes(procedimiento.value) ? '2px solid #2196f3' : '1px solid #e0e0e0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: editFormData.procedimientos.includes(procedimiento.value) ? '#e3f2fd' : '#f5f5f5',
                              transform: 'translateY(-1px)',
                              boxShadow: 2
                            }
                          }}
                          onClick={() => handleEditProcedimientoChange(procedimiento.value, !editFormData.procedimientos.includes(procedimiento.value))}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                              checked={editFormData.procedimientos.includes(procedimiento.value)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleEditProcedimientoChange(procedimiento.value, e.target.checked);
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
                                fontWeight: editFormData.procedimientos.includes(procedimiento.value) ? 'bold' : 'normal',
                                color: editFormData.procedimientos.includes(procedimiento.value) ? '#1976d2' : '#333',
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              disabled={loading}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
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
          <Box sx={{ typography: 'h6', fontWeight: 'bold' }}>Detalles del Recurso</Box>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedRecurso && (
            <>
              {/* Sección 1: Información del Recurso */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ typography: 'h6', fontWeight: 'bold', mb: 3, color: '#2184be' }}>
                  Información del Recurso
                </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', typography: 'body1' }}>
                      <strong>Estado:</strong>
                      <Chip
                        label={selectedRecurso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        color={getEstadoColor(selectedRecurso.estado)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
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
                <Box sx={{ typography: 'h6', fontWeight: 'bold', mb: 3, color: '#2184be' }}>
                  Procedimientos Asociados
                </Box>
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
          <Box sx={{ typography: 'h6', fontWeight: 'bold' }}>Confirmar Eliminación</Box>
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
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Recursos;