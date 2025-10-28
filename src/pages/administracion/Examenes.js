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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { salasService } from '../../services/salasService';
import { centrosService } from '../../services/centrosService';
import examenesService from 'services/examenesService';

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

const Examenes = () => {
  const navigate = useNavigate();

  // Estado para la lista de exámenes
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [EstadoD, setEstadoCargados] = useState([]);
  const [TipoAtencionD, setTipoAtencionCargados] = useState([]);

  // Estados para modales (solo editar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedExamen, setSelectedExamen] = useState(null);

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
          const responseSystemParameter = await centrosService.getAllSystemParameterId(10023);
          console.log('✅ Respuesta de TipoCons:', responseSystemParameter);
          setTipoAtencionCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || []);
        } catch (error) {
          console.error('❌ Error al cargar TipoCons:', error);
          setError(`Error al cargar TipoCons: ${error.message}`);
        }
      };
  
      
  // Estado para el formulario
  const [formData, setFormData] = useState({
    description: '',
    abbreviation: '',
    status: '10007', // Valor por defecto para estado
    type: '10024'    // Valor por defecto para tipo
  });

  const [editFormData, setEditFormData] = useState({
    description: '',
    abbreviation: '',
    status: '10007', // Valor por defecto para estado
    type: '10024'    // Valor por defecto para tipo
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  const loadExamenes = async () => {
        try {
          setLoading(true);
          setError('');
    
          console.log('🔄 Cargando Examenes desde el backend...');
          const response = await examenesService.getAll();
    
          console.log('✅ Examenes cargados:', response.data);
          setExamenes(response.data || []);
    
        } catch (error) {
          console.error('❌ Error al cargar Examenes:', error);
          setError(`Error al cargar Examenes: ${error.message}`);
    
        } finally {
          setLoading(false);
        }
      };

useEffect(() => {
        const cargarDatosIniciales = async () => {
          setLoading(true);
          cargarEstados();
          cargarTipoAtencion();
          try {
            await Promise.all([
              loadExamenes()
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
      description: '',
      abbreviation: '',
      status: '10007', // Mantener valor por defecto para estado
      type: '10024'    // Mantener valor por defecto para tipo
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

    if (!formData.description.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.abbreviation.trim()) {
      newErrors.abreviacion = 'Abreviación es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.description?.trim()) {
      newErrors.description = 'Descripción es obligatoria';
    }
    if (!editFormData.abbreviation?.trim()) {
      newErrors.abbreviation = 'Abreviación es obligatoria';
    }
        
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (examen) => {
    setSelectedExamen(examen);
    const initialFormData = {
      description: examen.description || '',
      abbreviation: examen.abbreviation || '',
      status: examen.status || '',
      type: examen.type || ''
    };
    setEditFormData(initialFormData);

    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedExamen(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (examen) => {
    setSelectedExamen(examen);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedExamen(null);
  };

  // Función para crear examen
const handleCreateExamen = async (e) => {
          e.preventDefault();
      
          if (validateForm()) {
            try {
              setLoading(true);
              console.log('📤 Creando Examen...');
      
              // Asegurarse de que estado sea un ID numérico
              const examenData = {
                ...formData,
                status: formData.status === 10007 ? true : false 
              };
      
              const nuevoSala = await examenesService.create(examenData);
              console.log('✅ Examen creado:', nuevoSala);
      
              // Recargar la lista de centros
              await loadExamenes();
      
              clearForm();
              // Cambiar automáticamente al tab de lista
              setActiveTab(0);
      
            } catch (error) {
              console.error('❌ Error al crear Examen:', error);
              setError(`Error al crear Examen: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }
        };

  // Función para editar examen
  const handleEditExamen = async (e) => {
    e.preventDefault();
    
    if (validateEditForm()) {
      try {
        setLoading(true);
        console.log('📤 Editando Examen...', editFormData);

        // Preparar datos para enviar
        const formDataToSend = {
          description: editFormData.description,
          abbreviation: editFormData.abbreviation,
          status: editFormData.status === '10007', // Convertir a booleano basado en el valor del estado
          type: editFormData.type
        };

        console.log('📤 Datos a enviar:', formDataToSend);
        const examenActualizado = await examenesService.update(selectedExamen.id, formDataToSend);
        console.log('✅ Examen actualizado:', examenActualizado);

        // Recargar la lista de exámenes
        await loadExamenes();

        handleCloseEditModal();

      } catch (error) {
        console.error('❌ Error al editar Examen:', error);
        setError(`Error al editar Examen: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para eliminar examen
const handleDeleteExamen = async () => {
        try {
          setLoading(true);
          console.log('📤 Eliminando Examen...');
    
          await examenesService.delete(selectedExamen.id);
          console.log('✅ Examen eliminado');
    
          // Recargar la lista de Estudio
          await loadExamenes();
    
          handleCloseDeleteConfirm();
    
        } catch (error) {
          console.error('❌ Error al eliminar Examen:', error);
          setError(`Error al eliminar Examen: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };


  // Filtrar exámenes basado en la búsqueda
  const filteredExamenes = examenes.filter(examen =>
    (examen.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (examen.abbreviation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    if (!estado) return 'default';
    return estado === 'activo' ? 'success' : 'error';
  };

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    if (!tipo) return 'default';
    const tipoNum = parseInt(tipo);
    switch (tipoNum) {
      case 10024: return 'primary';
      case 10025: return 'secondary';
      default: return 'default';
    }
  };

  // Función para obtener el label del tipo
  const getTipoLabel = (tipo) => {
    if (!tipo) return 'No definido';
    const tipoNum = parseInt(tipo);
    switch (tipoNum) {
      case 10024: return 'Laboratorio';
      case 10025: return 'Adicional';
      default: return 'Otro';
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
        <Typography color="text.primary">Exámenes</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Exámenes
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
            label="Lista de Exámenes"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Examen"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Examen */}
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
            <form onSubmit={handleCreateExamen}>
              {/* Sección: Información del Examen */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Examen
                </Typography>

                {/* Fila 1: Descripción, Estado */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required sx={{ flex: 2 }}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la descripción del examen"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                      size="small"
                    />
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
                </FieldRow>

                {/* Fila 2: Abreviación, Tipo */}
                <FieldRow>
                  <ResponsiveField label="Abreviación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la abreviación"
                      value={formData.abbreviation}
                      onChange={(e) => handleInputChange('abbreviation', e.target.value)}
                      error={!!errors.abbreviation}
                      helperText={errors.abbreviation}
                      size="small"
                    />
                  </ResponsiveField>

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
                  Crear Examen
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Exámenes */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar exámenes por descripción o abreviación..."
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
                  {filteredExamenes.length} resultado(s) de {examenes.length} exámenes
                </Typography>
              )}
            </Box>

            {/* Tabla de Exámenes */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Exámenes" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell><strong>Abreviación</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExamenes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron exámenes que coincidan con la búsqueda' : 'No hay exámenes registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExamenes.map((examen) => (
                      <TableRow key={examen.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {examen.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {examen.abbreviation}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTipoLabel(examen.type)}
                            color={getTipoColor(examen.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={examen.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(examen.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(examen)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(examen)}
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

      {/* Modal para Editar Examen */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="edit-exam-title"
        container={() => document.getElementById('modal-root')}
        disableEnforceFocus
        disableAutoFocus
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
          <Typography id="edit-exam-title" variant="h6" fontWeight="bold">Editar Examen</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditExamen}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información del Examen
              </Typography>

              <FieldRow>
                <ResponsiveField label="Descripción" required sx={{ flex: 2 }}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese la descripción del examen"
                    value={editFormData.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
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
                <ResponsiveField label="Abreviación" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese la abreviación"
                    value={editFormData.abbreviation}
                    onChange={(e) => handleEditInputChange('abbreviation', e.target.value)}
                    error={!!errors.abbreviation}
                    helperText={errors.abbreviation}
                    size="small"
                  />
                </ResponsiveField>

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
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-description"
        container={() => document.getElementById('modal-root')}
        disableEnforceFocus
        disableAutoFocus
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#f44336',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography id="delete-confirm-title" variant="h6" fontWeight="bold">Confirmar Eliminación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography id="delete-confirm-description" variant="body1">
            ¿Está seguro de que desea eliminar el examen{' '}
            <strong>"{selectedExamen?.descripcion}"</strong>?
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
            onClick={handleDeleteExamen}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Examenes;