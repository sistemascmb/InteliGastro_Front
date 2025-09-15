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
} from '@mui/material';
import {
  NavigateNext,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  Add,
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

const Roles = () => {
  const navigate = useNavigate();

  // Estado para la lista de roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: 'Administrador',
    },
    {
      id: 2,
      nombre: 'Médico',
    },
    {
      id: 3,
      nombre: 'Enfermero',
    }
  ]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (rol) => {
    setSelectedRol(rol);
    setFormData({
      nombre: rol.nombre,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRol(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (rol) => {
    setSelectedRol(rol);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedRol(null);
  };

  // Función para crear rol
  const handleCreateRol = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newRol = {
        id: Math.max(...roles.map(r => r.id)) + 1,
        nombre: formData.nombre.trim(),
      };

      setRoles(prev => [...prev, newRol]);
      clearForm();
    }
  };

  // Función para editar rol
  const handleEditRol = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setRoles(prev => prev.map(r =>
        r.id === selectedRol.id
          ? {
              ...r,
              nombre: formData.nombre.trim(),
            }
          : r
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar rol
  const handleDeleteRol = () => {
    setRoles(prev => prev.filter(r => r.id !== selectedRol.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar roles basado en la búsqueda
  const filteredRoles = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Typography color="text.primary">Roles</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Roles
      </Typography>

      {/* Formulario de Creación y Lista en una sola página */}
      <Paper sx={{ boxShadow: 2, mb: 3 }}>
        {/* Sección de Creación */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleCreateRol}>
            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Crear Nuevo Rol
              </Typography>

              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'end',
                mb: 2
              }}>
                <ResponsiveField label="Nombre del Rol" required sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre del rol"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    minWidth: '150px',
                    height: '40px'
                  }}
                >
                  Crear Rol
                </Button>
              </Box>
            </Paper>
          </form>

          {/* Barra de Búsqueda */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar rol por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: '#666', mr: 1 }} />
                ),
              }}
              sx={{
                maxWidth: '400px',
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
                {filteredRoles.length} resultado(s) de {roles.length} roles
              </Typography>
            )}
          </Box>

          {/* Tabla de Roles */}
          <Paper sx={{ boxShadow: 1 }}>
            <SectionHeader title="Lista de Roles" />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Nombre del Rol</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {searchTerm ? 'No se encontraron roles que coincidan con la búsqueda' : 'No hay roles registrados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((rol) => (
                    <TableRow key={rol.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {rol.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditModal(rol)}
                          sx={{ mr: 1 }}
                          title="Editar"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(rol)}
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
      </Paper>

      {/* Modal para Editar Rol */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
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
          <Typography variant="h6" fontWeight="bold">Editar Rol</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditRol}>
          <DialogContent dividers sx={{ p: 4 }}>
            <ResponsiveField label="Nombre del Rol" required>
              <TextField
                fullWidth
                required
                placeholder="Ingrese el nombre del rol"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                size="small"
              />
            </ResponsiveField>
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
            ¿Está seguro de que desea eliminar el rol{' '}
            <strong>"{selectedRol?.nombre}"</strong>?
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
            onClick={handleDeleteRol}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Roles;