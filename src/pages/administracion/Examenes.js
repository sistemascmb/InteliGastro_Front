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
  const [examenes, setExamenes] = useState([
    {
      id: 1,
      descripcion: 'Hemoglobina glucosilada (HbA1c)',
      abreviacion: 'HbA1c',
      estado: 'activo',
      tipo: 'laboratorio'
    },
    {
      id: 2,
      descripcion: 'Prueba de aliento para Helicobacter pylori',
      abreviacion: 'H. pylori',
      estado: 'activo',
      tipo: 'adicional'
    },
    {
      id: 3,
      descripcion: 'Perfil hepático completo',
      abreviacion: 'PH',
      estado: 'activo',
      tipo: 'laboratorio'
    },
    {
      id: 4,
      descripcion: 'Marcadores tumorales gastrointestinales',
      abreviacion: 'MTG',
      estado: 'inactivo',
      tipo: 'laboratorio'
    },
    {
      id: 5,
      descripcion: 'Test de intolerancia a lactosa',
      abreviacion: 'TIL',
      estado: 'activo',
      tipo: 'adicional'
    }
  ]);

  // Estados para modales (solo editar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedExamen, setSelectedExamen] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    abreviacion: '',
    estado: '',
    tipo: ''
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      descripcion: '',
      abreviacion: '',
      estado: '',
      tipo: ''
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

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.abreviacion.trim()) {
      newErrors.abreviacion = 'Abreviación es obligatoria';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (examen) => {
    setSelectedExamen(examen);
    setFormData({
      descripcion: examen.descripcion,
      abreviacion: examen.abreviacion,
      estado: examen.estado,
      tipo: examen.tipo
    });
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
  const handleCreateExamen = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newExamen = {
        id: Math.max(...examenes.map(e => e.id)) + 1,
        descripcion: formData.descripcion.trim(),
        abreviacion: formData.abreviacion.trim(),
        estado: formData.estado,
        tipo: formData.tipo
      };

      setExamenes(prev => [...prev, newExamen]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar examen
  const handleEditExamen = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setExamenes(prev => prev.map(e =>
        e.id === selectedExamen.id
          ? {
              ...e,
              descripcion: formData.descripcion.trim(),
              abreviacion: formData.abreviacion.trim(),
              estado: formData.estado,
              tipo: formData.tipo
            }
          : e
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar examen
  const handleDeleteExamen = () => {
    setExamenes(prev => prev.filter(e => e.id !== selectedExamen.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar exámenes basado en la búsqueda
  const filteredExamenes = examenes.filter(examen =>
    examen.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.abreviacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
  };

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'laboratorio': return 'primary';
      case 'adicional': return 'secondary';
      default: return 'default';
    }
  };

  // Función para obtener el label del tipo
  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'laboratorio': return 'Laboratorio';
      case 'adicional': return 'Adicional';
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
            label="Crear Examen"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Lista de Exámenes"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Examen */}
        {activeTab === 0 && (
          <Box sx={{ p: 4 }}>
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
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
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
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Abreviación, Tipo */}
                <FieldRow>
                  <ResponsiveField label="Abreviación" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la abreviación"
                      value={formData.abreviacion}
                      onChange={(e) => handleInputChange('abreviacion', e.target.value)}
                      error={!!errors.abreviacion}
                      helperText={errors.abreviacion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Tipo" required>
                    <FormControl fullWidth required error={!!errors.tipo} size="small">
                      <Select
                        value={formData.tipo}
                        onChange={(e) => handleInputChange('tipo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.tipo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        <MenuItem value="laboratorio">Laboratorio</MenuItem>
                        <MenuItem value="adicional">Adicional</MenuItem>
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
        {activeTab === 1 && (
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
                            {examen.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {examen.abreviacion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTipoLabel(examen.tipo)}
                            color={getTipoColor(examen.tipo)}
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
          <Typography variant="h6" fontWeight="bold">Editar Examen</Typography>
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
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion}
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
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Abreviación" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese la abreviación"
                    value={formData.abreviacion}
                    onChange={(e) => handleInputChange('abreviacion', e.target.value)}
                    error={!!errors.abreviacion}
                    helperText={errors.abreviacion}
                    size="small"
                  />
                </ResponsiveField>

                <ResponsiveField label="Tipo" required>
                  <FormControl fullWidth required error={!!errors.tipo} size="small">
                    <Select
                      value={formData.tipo}
                      onChange={(e) => handleInputChange('tipo', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.tipo ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                      <MenuItem value="laboratorio">Laboratorio</MenuItem>
                      <MenuItem value="adicional">Adicional</MenuItem>
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