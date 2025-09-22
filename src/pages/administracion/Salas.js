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
  MeetingRoom
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

const Salas = () => {
  const navigate = useNavigate();

  // Estado para la lista de salas
  const [salas, setSalas] = useState([
    {
      id: 1,
      nombre: 'Sala de Endoscopía 1',
      descripcion: 'Sala equipada para procedimientos endoscópicos diagnósticos y terapéuticos',
      estado: 'activo',
      tipo: 'procedimiento',
      centro: 'centro-1'
    },
    {
      id: 2,
      nombre: 'Consultorio Gastroenterología A',
      descripcion: 'Consultorio para consultas ambulatorias de gastroenterología',
      estado: 'activo',
      tipo: 'consultorio',
      centro: 'centro-1'
    },
    {
      id: 3,
      nombre: 'Quirófano de Cirugía Menor',
      descripcion: 'Quirófano equipado para procedimientos quirúrgicos menores',
      estado: 'inactivo',
      tipo: 'cirugia',
      centro: 'centro-2'
    },
    {
      id: 4,
      nombre: 'Sala de Recuperación',
      descripcion: 'Área destinada para la recuperación post-procedimiento de pacientes',
      estado: 'activo',
      tipo: 'otro',
      centro: 'centro-1'
    }
  ]);

  // Datos simulados de centros
  const centros = [
    { value: 'centro-1', label: 'Clínica María Belén - Sede Central' },
    { value: 'centro-2', label: 'Clínica María Belén - Sede Norte' }
  ];

  // Estados para modales (solo editar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    tipo: '',
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
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo es obligatorio';
    }
    if (!formData.centro) {
      newErrors.centro = 'Centro es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (sala) => {
    setSelectedSala(sala);
    setFormData({
      nombre: sala.nombre,
      descripcion: sala.descripcion,
      estado: sala.estado,
      tipo: sala.tipo,
      centro: sala.centro
    });
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
  const handleCreateSala = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newSala = {
        id: Math.max(...salas.map(s => s.id)) + 1,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estado: formData.estado,
        tipo: formData.tipo,
        centro: formData.centro
      };

      setSalas(prev => [...prev, newSala]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar sala
  const handleEditSala = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSalas(prev => prev.map(s =>
        s.id === selectedSala.id
          ? {
              ...s,
              nombre: formData.nombre.trim(),
              descripcion: formData.descripcion.trim(),
              estado: formData.estado,
              tipo: formData.tipo,
              centro: formData.centro
            }
          : s
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar sala
  const handleDeleteSala = () => {
    setSalas(prev => prev.filter(s => s.id !== selectedSala.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar salas basado en la búsqueda
  const filteredSalas = salas.filter(sala =>
    sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sala.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'procedimiento': return 'primary';
      case 'consultorio': return 'secondary';
      case 'cirugia': return 'error';
      case 'otro': return 'default';
      default: return 'default';
    }
  };

  // Función para obtener el label del tipo
  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'procedimiento': return 'Procedimiento';
      case 'consultorio': return 'Consultorio';
      case 'cirugia': return 'Cirugía';
      case 'otro': return 'Otro';
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
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
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

                {/* Fila 2: Tipo, Centro */}
                <FieldRow>
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
                        <MenuItem value="procedimiento">Procedimiento</MenuItem>
                        <MenuItem value="consultorio">Consultorio</MenuItem>
                        <MenuItem value="cirugia">Cirugía</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

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
                            {sala.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {sala.descripcion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTipoLabel(sala.tipo)}
                            color={getTipoColor(sala.tipo)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getCentroLabel(sala.centro)}
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
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
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
                      <MenuItem value="procedimiento">Procedimiento</MenuItem>
                      <MenuItem value="consultorio">Consultorio</MenuItem>
                      <MenuItem value="cirugia">Cirugía</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

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
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Descripción" required>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    placeholder="Ingrese la descripción de la sala"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
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