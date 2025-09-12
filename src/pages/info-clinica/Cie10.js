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

const Cie10 = () => {
  const navigate = useNavigate();

  // Estado para la lista de códigos CIE-10
  const [codigos, setCodigos] = useState([
    {
      id: 1,
      codigo: 'A00',
      descripcion: 'Cólera'
    },
    {
      id: 2,
      codigo: 'A01.0',
      descripcion: 'Fiebre tifoidea'
    },
    {
      id: 3,
      codigo: 'A02.0',
      descripcion: 'Enteritis debida a Salmonella'
    },
    {
      id: 4,
      codigo: 'B34.2',
      descripcion: 'Infección por coronavirus, sitio no especificado'
    },
    {
      id: 5,
      codigo: 'J44.1',
      descripcion: 'Enfermedad pulmonar obstructiva crónica con exacerbación aguda'
    }
  ]);

  // Estados para modales
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      codigo: '',
      descripcion: ''
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
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
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

  const handleOpenEditModal = (codigo) => {
    setSelectedCodigo(codigo);
    setFormData({
      codigo: codigo.codigo,
      descripcion: codigo.descripcion
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCodigo(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (codigo) => {
    setSelectedCodigo(codigo);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedCodigo(null);
  };

  // Función para agregar Código
  const handleAddCodigo = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newCodigo = {
        id: Math.max(...codigos.map(c => c.id)) + 1,
        codigo: formData.codigo.trim(),
        descripcion: formData.descripcion.trim()
      };
      
      setCodigos(prev => [...prev, newCodigo]);
      handleCloseAddModal();
    }
  };

  // Función para editar Código
  const handleEditCodigo = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setCodigos(prev => prev.map(c => 
        c.id === selectedCodigo.id 
          ? {
              ...c,
              codigo: formData.codigo.trim(),
              descripcion: formData.descripcion.trim()
            }
          : c
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar Código
  const handleDeleteCodigo = () => {
    setCodigos(prev => prev.filter(c => c.id !== selectedCodigo.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar códigos basado en la búsqueda
  const filteredCodigos = codigos.filter(codigo => 
    codigo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    codigo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography color="text.primary">CIE-10</Typography>
      </Breadcrumbs>

      {/* Título Principal y Botón Nuevo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          CIE-10
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

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar códigos CIE-10 por Código o Descripción..."
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
            {filteredCodigos.length} resultado(s) de {codigos.length} códigos CIE-10
          </Typography>
        )}
      </Box>

      {/* Tabla de códigos CIE-10 */}
      <Paper sx={{ boxShadow: 2 }}>
        <SectionHeader title="Lista de códigos CIE-10" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCodigos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm ? 'No se encontraron códigos CIE-10 que coincidan con la búsqueda' : 'No hay códigos CIE-10 registrados'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCodigos.map((codigo) => (
                <TableRow key={codigo.id} hover>
                  <TableCell>{codigo.codigo}</TableCell>
                  <TableCell>{codigo.descripcion}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEditModal(codigo)}
                      sx={{ mr: 1 }}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteConfirm(codigo)}
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

      {/* Modal para Agregar Código CIE-10 */}
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
          <Typography variant="h6" fontWeight="bold">Agregar Nuevo Código CIE-10</Typography>
          <IconButton onClick={handleCloseAddModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleAddCodigo}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Código */}
              <TextField
                fullWidth
                required
                label="Código"
                placeholder="Ingrese el Código CIE-10 (ej: A00, B34.2)"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                error={!!errors.codigo}
                helperText={errors.codigo}
              />

              {/* Descripción */}
              <TextField
                fullWidth
                required
                label="Descripción"
                multiline
                rows={3}
                placeholder="Ingrese la Descripción del diagnóstico"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
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

      {/* Modal para Editar Código CIE-10 */}
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
          <Typography variant="h6" fontWeight="bold">Editar Código CIE-10</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditCodigo}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Código */}
              <TextField
                fullWidth
                required
                label="Código"
                placeholder="Ingrese el Código CIE-10 (ej: A00, B34.2)"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                error={!!errors.codigo}
                helperText={errors.codigo}
              />

              {/* Descripción */}
              <TextField
                fullWidth
                required
                label="Descripción"
                multiline
                rows={3}
                placeholder="Ingrese la Descripción del diagnóstico"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
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
            ¿Está seguro de que desea eliminar el Código{' '}
            <strong>"{selectedCodigo?.codigo}"</strong>?
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
            onClick={handleDeleteCodigo}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cie10;