import React, { useState, useCallback } from 'react';
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
  DialogActions
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

  // Estado para la lista de suministros
  const [suministros, setSuministros] = useState([
    {
      id: 1,
      nombre: 'Guantes de Látex',
      importe: 25.50,
      comentarios: 'Caja de 100 unidades, talla M',
      cargo: 'Enfermera'
    },
    {
      id: 2,
      nombre: 'Jeringas Desechables 10ml',
      importe: 45.00,
      comentarios: 'Paquete de 50 unidades estériles',
      cargo: 'Procedimientos'
    },
    {
      id: 3,
      nombre: 'Mascarillas Quirúrgicas',
      importe: 35.75,
      comentarios: 'Caja de 50 unidades, 3 capas',
      cargo: 'General'
    }
  ]);

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
    cargo: ''
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
      cargo: ''
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
    if (!formData.importe || formData.importe <= 0) {
      newErrors.importe = 'Importe debe ser mayor a 0';
    }
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo es obligatorio';
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
      comentarios: suministro.comentarios,
      cargo: suministro.cargo
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
  const handleAddSuministro = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newSuministro = {
        id: Math.max(...suministros.map(s => s.id)) + 1,
        nombre: formData.nombre.trim(),
        importe: parseFloat(formData.importe),
        comentarios: formData.comentarios.trim(),
        cargo: formData.cargo.trim()
      };
      
      setSuministros(prev => [...prev, newSuministro]);
      handleCloseAddModal();
    }
  };

  // Función para editar suministro
  const handleEditSuministro = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSuministros(prev => prev.map(s => 
        s.id === selectedSuministro.id 
          ? {
              ...s,
              nombre: formData.nombre.trim(),
              importe: parseFloat(formData.importe),
              comentarios: formData.comentarios.trim(),
              cargo: formData.cargo.trim()
            }
          : s
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar suministro
  const handleDeleteSuministro = () => {
    setSuministros(prev => prev.filter(s => s.id !== selectedSuministro.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar suministros basado en la búsqueda
  const filteredSuministros = suministros.filter(suministro => 
    suministro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suministro.comentarios.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suministro.cargo.toLowerCase().includes(searchTerm.toLowerCase())
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
                <TableCell><strong>Cargo</strong></TableCell>
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

              {/* Cargo */}
              <TextField
                fullWidth
                required
                label="Cargo"
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

              {/* Cargo */}
              <TextField
                fullWidth
                required
                label="Cargo"
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
    </Container>
  );
};

export default Suministros;