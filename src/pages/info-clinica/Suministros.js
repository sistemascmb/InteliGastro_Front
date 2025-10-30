import React, { useState, useCallback, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  ArrowBack,
  Close,
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { suministrosService } from '../../services/suministrosService';

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

const Suministros = () => {
  const navigate = useNavigate();

  // Estados para la lista de suministros y carga
  const [suministros, setSuministros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Función para cargar los suministros
  const loadSuministros = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suministrosService.getAll();
      if (response.status === 'success') {
        // Mapear los datos del servicio al formato de la interfaz
        const mappedData = response.data.map(suministro => ({
          id: suministro.id,
          nombre: suministro.name,
          importe: suministro.price,
          comentarios: suministro.comments,
          cargo: suministro.quantity,
          estado: suministro.estado
        }));
        setSuministros(mappedData);
      }
    } catch (err) {
      console.error('Error al cargar suministros:', err);
      setError('Error al cargar los suministros. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar suministros al montar el componente
  useEffect(() => {
    loadSuministros();
  }, []);

  // Estados para modales
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedSuministro, setSelectedSuministro] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    importe: '',
    comentarios: '',
    cargo: '',
    estado: '10007' // Por defecto inactivo
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      importe: '',
      comentarios: '',
      cargo: '',
      estado: '10007'
    });
    setErrors({});
  };

  // Manejo de cambios en el formulario
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
    if (!formData.importe || parseFloat(formData.importe) <= 0) {
      newErrors.importe = 'Importe debe ser mayor a 0';
    }
    if (!formData.cargo || parseInt(formData.cargo) <= 0) {
      newErrors.cargo = 'Cantidad debe ser mayor a 0';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenAddModal = () => {
    clearForm();
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    clearForm();
  };

  const handleOpenEditModal = (suministro) => {
    setSelectedSuministro(suministro);
    setFormData({
      nombre: suministro.nombre,
      importe: suministro.importe.toString(),
      comentarios: suministro.comentarios || '',
      cargo: suministro.cargo.toString(),
      estado: suministro.estado
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedSuministro(null);
    clearForm();
  };


  const handleOpenDeleteConfirm = (suministro) => {
    setSelectedSuministro(suministro);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedSuministro(null);
  };

  // Función para agregar suministro
  const handleAddSuministro = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Preparar datos para el servicio
        const suministroData = {
          name: formData.nombre.trim(),
          price: parseFloat(formData.importe),
          comments: formData.comentarios ? formData.comentarios.trim() : '',
          quantity: parseInt(formData.cargo),
          status: formData.estado === '10006' // true para activo (10006), false para inactivo (10007)
        };

        const response = await suministrosService.create(suministroData);
        
        if (response.status === 'success') {
          // Actualizar la lista de suministros
          await loadSuministros();
          
          // Mostrar mensaje de éxito
          setSnackbar({
            open: true,
            message: 'Suministro creado exitosamente',
            severity: 'success'
          });
          
          handleCloseAddModal();
        }
      } catch (error) {
        console.error('Error al crear suministro:', error);
        setSnackbar({
          open: true,
          message: 'Error al crear el suministro. Por favor, intente nuevamente.',
          severity: 'error'
        });
      }
    }
  };

  // Función para editar suministro
  const handleEditSuministro = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Preparar datos para el servicio
        const suministroData = {
          name: formData.nombre.trim(),
          price: parseFloat(formData.importe),
          comments: formData.comentarios ? formData.comentarios.trim() : '',
          quantity: parseInt(formData.cargo),
          status: formData.estado === '10006' // true para activo (10006), false para inactivo (10007)
        };

        const response = await suministrosService.update(selectedSuministro.id, suministroData);
        
        if (response.status === 'success') {
          // Actualizar la lista de suministros
          await loadSuministros();
          
          // Mostrar mensaje de éxito
          setSnackbar({
            open: true,
            message: 'Suministro actualizado exitosamente',
            severity: 'success'
          });
          
          handleCloseEditModal();
        }
      } catch (error) {
        console.error('Error al actualizar suministro:', error);
        setSnackbar({
          open: true,
          message: 'Error al actualizar el suministro. Por favor, intente nuevamente.',
          severity: 'error'
        });
      }
    }
  };

  // Función para eliminar suministro
  const handleDeleteSuministro = async () => {
    try {
      const response = await suministrosService.delete(selectedSuministro.id);
      
      if (response.status === 'success') {
        // Actualizar la lista de suministros
        await loadSuministros();
        
        // Mostrar mensaje de éxito
        setSnackbar({
          open: true,
          message: 'Suministro eliminado exitosamente',
          severity: 'success'
        });
        
        handleCloseDeleteConfirm();
      }
    } catch (error) {
      console.error('Error al eliminar suministro:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el suministro. Por favor, intente nuevamente.',
        severity: 'error'
      });
    }
  };

  // Filtrar suministros basado en la búsqueda
  const filteredSuministros = suministros.filter(suministro => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      suministro.nombre.toLowerCase().includes(searchTermLower) ||
      (suministro.comentarios && suministro.comentarios.toLowerCase().includes(searchTermLower)) ||
      suministro.cargo.toString().includes(searchTerm)
    );
  });

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
        <Typography color="text.primary">Suministros</Typography>
      </Breadcrumbs>

      {/* Título Principal y Botón Nuevo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Suministros
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddModal}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#45a049'
            }
          }}
        >
          Nuevo
        </Button>
      </Box>

      {/* Barra de Búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar suministros por nombre, comentarios o cargo..."
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
            {filteredSuministros.length} resultado(s) de {suministros.length} suministros
          </Typography>
        )}
      </Box>

      {/* Tabla de Suministros */}
      <Paper sx={{ boxShadow: 2 }}>
        <SectionHeader title="Lista de Suministros" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Importe</strong></TableCell>
                <TableCell><strong>Comentarios</strong></TableCell>
                <TableCell><strong>Cantidad</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuministros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm ? 'No se encontraron suministros que coincidan con la búsqueda' : 'No hay suministros registrados'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuministros.map((suministro) => (
                <TableRow key={suministro.id} hover>
                  <TableCell>{suministro.nombre}</TableCell>
                  <TableCell>S/. {suministro.importe.toFixed(2)}</TableCell>
                  <TableCell>{suministro.comentarios}</TableCell>
                  <TableCell>{suministro.cargo}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEditModal(suministro)}
                      sx={{ mr: 1 }}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteConfirm(suministro)}
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

      {/* Modal para Agregar Suministro */}
      <Dialog 
        open={openAddModal} 
        onClose={handleCloseAddModal} 
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
          <Typography variant="h6" fontWeight="bold">Agregar Nuevo Suministro</Typography>
          <IconButton onClick={handleCloseAddModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleAddSuministro}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Nombre */}
              <TextField
                fullWidth
                required
                label="Nombre"
                placeholder="Ingrese el nombre del suministro"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />

              {/* Importe */}
              <TextField
                fullWidth
                required
                label="Importe"
                type="number"
                placeholder="0.00"
                value={formData.importe}
                onChange={(e) => handleInputChange('importe', e.target.value)}
                error={!!errors.importe}
                helperText={errors.importe}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>S/.</Typography>,
                }}
                inputProps={{
                  min: 0,
                  step: 0.01
                }}
              />

              {/* Comentarios */}
              <TextField
                fullWidth
                label="Comentarios"
                multiline
                rows={3}
                placeholder="Ingrese comentarios adicionales"
                value={formData.comentarios}
                onChange={(e) => handleInputChange('comentarios', e.target.value)}
              />

              {/* Cantidad */}
              <TextField
                fullWidth
                required
                label="Cantidad"
                placeholder="Ingrese el cargo o departamento"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                error={!!errors.cargo}
                helperText={errors.cargo}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCloseAddModal}
            >
              Atrás
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

      {/* Modal para Editar Suministro */}
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
          <Typography variant="h6" fontWeight="bold">Editar Suministro</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSuministro}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Nombre */}
              <TextField
                fullWidth
                required
                label="Nombre"
                placeholder="Ingrese el nombre del suministro"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />

              {/* Importe */}
              <TextField
                fullWidth
                required
                label="Importe"
                type="number"
                placeholder="0.00"
                value={formData.importe}
                onChange={(e) => handleInputChange('importe', e.target.value)}
                error={!!errors.importe}
                helperText={errors.importe}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>S/.</Typography>,
                }}
                inputProps={{
                  min: 0,
                  step: 0.01
                }}
              />

              {/* Comentarios */}
              <TextField
                fullWidth
                label="Comentarios"
                multiline
                rows={3}
                placeholder="Ingrese comentarios adicionales"
                value={formData.comentarios}
                onChange={(e) => handleInputChange('comentarios', e.target.value)}
              />

              {/* Cantidad */}
              <TextField
                fullWidth
                required
                label="Cantidad"
                placeholder="Ingrese el cargo o departamento"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                error={!!errors.cargo}
                helperText={errors.cargo}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCloseEditModal}
            >
              Atrás
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
            ¿Está seguro de que desea eliminar el suministro{' '}
            <strong>"{selectedSuministro?.nombre}"</strong>?
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
            onClick={handleDeleteSuministro}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de estado */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Indicador de carga */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Suministros;