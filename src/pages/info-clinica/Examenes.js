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

const Examenes = () => {
  const navigate = useNavigate();

  // Estado para la lista de exámenes
  const [examenes, setExamenes] = useState([
    {
      id: 1,
      numeroExamen: 'EX-001',
      numeroDocumento: '12345678',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García'
    },
    {
      id: 2,
      numeroExamen: 'EX-002',
      numeroDocumento: '87654321',
      nombres: 'María Elena',
      apellidos: 'López Ruiz'
    },
    {
      id: 3,
      numeroExamen: 'EX-003',
      numeroDocumento: '11223344',
      nombres: 'Carlos Alberto',
      apellidos: 'Gómez Sánchez'
    }
  ]);

  // Estados para modales
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedExamen, setSelectedExamen] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    numeroExamen: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: ''
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      numeroExamen: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: ''
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

  // Validacián del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.numeroExamen.trim()) {
      newErrors.numeroExamen = 'Número de Examen es obligatorio';
    }
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = 'Número de Documento es obligatorio';
    }
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Nombres es obligatorio';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Apellidos es obligatorio';
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

  const handleOpenEditModal = (examen) => {
    setSelectedExamen(examen);
    setFormData({
      numeroExamen: examen.numeroExamen,
      numeroDocumento: examen.numeroDocumento,
      nombres: examen.nombres,
      apellidos: examen.apellidos
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

  // Función para agregar examen
  const handleAddExamen = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newExamen = {
        id: Math.max(...examenes.map(e => e.id)) + 1,
        numeroExamen: formData.numeroExamen.trim(),
        numeroDocumento: formData.numeroDocumento.trim(),
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim()
      };
      
      setExamenes(prev => [...prev, newExamen]);
      handleCloseAddModal();
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
              numeroExamen: formData.numeroExamen.trim(),
              numeroDocumento: formData.numeroDocumento.trim(),
              nombres: formData.nombres.trim(),
              apellidos: formData.apellidos.trim()
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
    examen.numeroExamen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    examen.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography color="text.primary">Exámenes</Typography>
      </Breadcrumbs>

      {/* Título Principal y Botón Nuevo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Exámenes
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
          placeholder="Buscar exámenes por námero de examen, documento, nombres o apellidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <Search sx={{ color: '#666', mr: 1 }} />
            ),
          }}
          sx={{
            maxWidth: '500px',
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
      <Paper sx={{ boxShadow: 2 }}>
        <SectionHeader title="Lista de Exámenes" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Número de Examen</strong></TableCell>
                <TableCell><strong>Número de Documento</strong></TableCell>
                <TableCell><strong>Nombres</strong></TableCell>
                <TableCell><strong>Apellidos</strong></TableCell>
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
                  <TableCell>{examen.numeroExamen}</TableCell>
                  <TableCell>{examen.numeroDocumento}</TableCell>
                  <TableCell>{examen.nombres}</TableCell>
                  <TableCell>{examen.apellidos}</TableCell>
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

      {/* Modal para Agregar Examen */}
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
          <Typography variant="h6" fontWeight="bold">Agregar Nuevo Examen</Typography>
          <IconButton onClick={handleCloseAddModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleAddExamen}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Número de Examen */}
              <TextField
                fullWidth
                required
                label="Número de Examen"
                placeholder="Ingrese el número de examen"
                value={formData.numeroExamen}
                onChange={(e) => handleInputChange('numeroExamen', e.target.value)}
                error={!!errors.numeroExamen}
                helperText={errors.numeroExamen}
              />

              {/* Número de Documento */}
              <TextField
                fullWidth
                required
                label="Número de Documento"
                placeholder="Ingrese el número de documento"
                value={formData.numeroDocumento}
                onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento}
              />

              {/* Nombres */}
              <TextField
                fullWidth
                required
                label="Nombres"
                placeholder="Ingrese los nombres"
                value={formData.nombres}
                onChange={(e) => handleInputChange('nombres', e.target.value)}
                error={!!errors.nombres}
                helperText={errors.nombres}
              />

              {/* Apellidos */}
              <TextField
                fullWidth
                required
                label="Apellidos"
                placeholder="Ingrese los apellidos"
                value={formData.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
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

      {/* Modal para Editar Examen */}
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
          <Typography variant="h6" fontWeight="bold">Editar Examen</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditExamen}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Número de Examen */}
              <TextField
                fullWidth
                required
                label="Número de Examen"
                placeholder="Ingrese el número de examen"
                value={formData.numeroExamen}
                onChange={(e) => handleInputChange('numeroExamen', e.target.value)}
                error={!!errors.numeroExamen}
                helperText={errors.numeroExamen}
              />

              {/* Número de Documento */}
              <TextField
                fullWidth
                required
                label="Número de Documento"
                placeholder="Ingrese el número de documento"
                value={formData.numeroDocumento}
                onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento}
              />

              {/* Nombres */}
              <TextField
                fullWidth
                required
                label="Nombres"
                placeholder="Ingrese los nombres"
                value={formData.nombres}
                onChange={(e) => handleInputChange('nombres', e.target.value)}
                error={!!errors.nombres}
                helperText={errors.nombres}
              />

              {/* Apellidos */}
              <TextField
                fullWidth
                required
                label="Apellidos"
                placeholder="Ingrese los apellidos"
                value={formData.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
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
            ¿Está seguro de que desea eliminar el examen{' '}
            <strong>"{selectedExamen?.numeroExamen}"</strong>?
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