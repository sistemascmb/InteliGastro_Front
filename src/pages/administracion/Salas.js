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
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  MeetingRoom
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { salasService } from '../../services/salasService';
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

const Salas = () => {
  const navigate = useNavigate();

  // Estado para la lista de estudios
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [centrosD, setCentrosCargados] = useState([]);
    const [EstadoD, setEstadoCargados] = useState([]);
    const [TipoAtencionD, setTipoAtencionCargados] = useState([]);

  // Estados para modales (solo editar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);

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

    const cargarTipoAtencion = async () => {
      try {
        const responseSystemParameter = await centrosService.getAllSystemParameterId(10018);
        console.log('✅ Respuesta de TipoAtencion:', responseSystemParameter);
        setTipoAtencionCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                         responseSystemParameter?.data || []);
      } catch (error) {
        console.error('❌ Error al cargar TipoAtencion:', error);
        setError(`Error al cargar TipoAtencion: ${error.message}`);
      }
    };

  // Estado para el formulario
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      status: '',
      type: '',
      centroId: ''
    });
  
    const [editFormData, setEditFormData] = useState({
      name: '',
      description: '',
      status: '',
      type: '',
      centroId: ''
    });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  const loadSalas = async () => {
      try {
        setLoading(true);
        setError('');
  
        console.log('🔄 Cargando estudios desde el backend...');
        const response = await salasService.getAll();
  
        // Obtener los nombres de los centros para cada personal
              const salasListCarga = await Promise.all(
                response.data.map(async (salas) => {
                  try {
                    const centroDatos = await centrosService.getById(salas.centroId);
                    
                    return {
                      ...salas,
                      nombreCentro: centroDatos.data.nombre
                      
                    };
                  } catch (error) {
                    console.error(`Error al obtener centro ${salas.centroId}:`, error);
                    return {
                      ...salas,
                      nombreCentro: 'Centro no encontrado',
                     
                    };
                  }
                })
              );

        console.log('✅ Estudios cargados:', salasListCarga);
        setSalas(salasListCarga || []);
  
      } catch (error) {
        console.error('❌ Error al cargar Salas:', error);
        setError(`Error al cargar Salas: ${error.message}`);
  
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        const cargarDatosIniciales = async () => {
          setLoading(true);
          cargarCentros();
          cargarEstados();
          cargarTipoAtencion();
          try {
            await Promise.all([
              loadSalas()
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
      estado: '',
      tipo: '',
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

  // Validación del formulario (TODOS los campos obligatorios)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descripcion es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = 'Nombre es obligatorio';
    }
    if (!editFormData.description.trim()) {
      newErrors.description = 'Descripción es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (sala) => {
    setSelectedSala(sala);
    const initialFormData = {
      name: sala.name,
      description: sala.description,
      status: sala.status,
      type: sala.type,
      centroId: sala.centroId
    };
    setEditFormData(initialFormData);

    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedSala(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (sala) => {
    setSelectedSala(sala);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedSala(null);
  };

  // Función para crear sala
  const handleCreateSala = async (e) => {
          e.preventDefault();
      
          if (validateForm()) {
            try {
              setLoading(true);
              console.log('📤 Creando Sala...');
      
              // Asegurarse de que estado sea un ID numérico
              const salaData = {
                ...formData,
                status: formData.status === 10007 ? true : false 
              };
      
              const nuevoSala = await salasService.create(salaData);
              console.log('✅ Sala creado:', nuevoSala);
      
              // Recargar la lista de centros
              await loadSalas();
      
              clearForm();
              // Cambiar automáticamente al tab de lista
              setActiveTab(0);
      
            } catch (error) {
              console.error('❌ Error al crear Sala:', error);
              setError(`Error al crear Sala: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }
        };

  // Función para editar sala
  const handleEditSala = async (e) => {
        e.preventDefault();
    
        if (validateEditForm()) {
          try {
            setLoading(true);
            console.log('📤 Editando Sala...');
    
            // Asegurarse de que estado sea un booleano
            const formDataToSend = {
              ...editFormData,
              status: editFormData.status === '10007', // Convertir a booleano basado en el valor del estado
            };
            const salaActualizado = await salasService.update(selectedSala.id, formDataToSend);
            console.log('✅ Sala actualizado:', salaActualizado);
    
            // Recargar la lista de Salas
            await loadSalas();
    
            handleCloseEditModal();
    
          } catch (error) {
            console.error('❌ Error al editar Sala:', error);
            setError(`Error al editar Sala: ${error.message}`);
          } finally {
            setLoading(false);
          }
        }
      };

  // Función para eliminar sala
  const handleDeleteSala = async () => {
        try {
          setLoading(true);
          console.log('📤 Eliminando Sala...');
    
          await salasService.delete(selectedSala.id);
          console.log('✅ Sala eliminado');
    
          // Recargar la lista de Estudio
          await loadSalas();
    
          handleCloseDeleteConfirm();
    
        } catch (error) {
          console.error('❌ Error al eliminar Sala:', error);
          setError(`Error al eliminar Sala: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

  // Filtrar salas basado en la búsqueda
  const filteredSalas = salas.filter(sala =>
    sala.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
  };

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 10019: return 'primary';
      case 10020: return 'secondary';
      case 10021: return 'error';
      case 10022: return 'default';
      default: return 'default';
    }
  };

  // Función para obtener el label del tipo
  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 10019: return 'Procedimiento';
      case 10020: return 'Consultorio';
      case 10021: return 'Cirugía';
      case 10022: return 'Otro';
      default: return tipo;
    }
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
        <Typography color="text.primary">Salas</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Salas
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
            label="Lista de Salas"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Sala"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Sala */}
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
            
            <form onSubmit={handleCreateSala}>
              {/* Sección: Información de la Sala */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información de la Sala
                </Typography>

                {/* Fila 1: Nombre, Estado */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required sx={{ flex: 2 }}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre de la sala"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      size="small"
                    />
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
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Tipo, Centro */}
                <FieldRow>
                  <ResponsiveField label="Tipo" required>
                    <FormControl fullWidth required error={!!errors.type} size="small">
                      <Select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.type ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(TipoAtencionD) && TipoAtencionD.map(tipo => (
                          <MenuItem key={tipo.parameterid} value={tipo.parameterid}>
                            {tipo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

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
                </FieldRow>

                {/* Fila 3: Descripción */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="Ingrese la descripción de la sala"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
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
                  Crear Sala
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Salas */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar salas por nombre o descripción..."
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
                  {filteredSalas.length} resultado(s) de {salas.length} salas
                </Typography>
              )}
            </Box>

            {/* Tabla de Salas */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Salas" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Centro</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSalas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron salas que coincidan con la búsqueda' : 'No hay salas registradas'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSalas.map((sala) => (
                      <TableRow key={sala.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {sala.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {sala.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTipoLabel(sala.type)}
                            color={getTipoColor(sala.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {sala.nombreCentro}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sala.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(sala.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(sala)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(sala)}
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

      {/* Modal para Editar Sala */}
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
          <Typography variant="h6" fontWeight="bold">Editar Sala</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSala}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información de la Sala
              </Typography>

              <FieldRow>
                <ResponsiveField label="Nombre" required sx={{ flex: 2 }}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre de la sala"
                    value={editFormData.name}
                    onChange={(e) => handleEditInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    size="small"
                  />
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
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Tipo" required>
                  <FormControl fullWidth required error={!!errors.type} size="small">
                    <Select
                      value={editFormData.type}
                      onChange={(e) => handleEditInputChange('type', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: editFormData.type ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(TipoAtencionD) && TipoAtencionD.map(tipo => (
                          <MenuItem key={tipo.parameterid} value={tipo.parameterid}>
                            {tipo.value1 || ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>

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
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Descripción" required>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    placeholder="Ingrese la descripción de la sala"
                    value={editFormData.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
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
            ¿Está seguro de que desea eliminar la sala{' '}
            <strong>"{selectedSala?.nombre}"</strong>?
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
            onClick={handleDeleteSala}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Salas;