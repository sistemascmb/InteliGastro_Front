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
  Grid,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Visibility,
  Delete,
  Save,
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

const Pacientes = () => {
  const navigate = useNavigate();

  // Estado para la lista de pacientes
  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      // Información del Paciente
      estado: 'activo',
      tipoDocumento: 'DNI',
      documento: '71717171',
      nombres : 'Juan Carlos',
      apellidos: 'Pérez Gómez',
      fechaNacimiento: '1985-06-15',
      genero: 'masculino',
      estadoMarital: 'soltero',
      nacionalidad: 'Peruana',

      // Centro
      nombreCentro: 'Centro Médico Central',

      // Informacion de Residencia
      calle: 'Av. Siempre Viva 123',
      codPostal: '14001',
      pais: 'peru',
      departamento: 'cajamarca',
      provincia: 'cajabamba',
      distrito: 'cajabamba_distrito',

      // Informacion de contacto
      telefono: '00 51 123456789',
      celular: '+51 912345678',
      correo: ''
    }
  ]);

  // Estados para modales (solo editar, detallar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPaciente, setselectedPaciente] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    // Información Básica
    estado: '',
    tipoDocumento: '',
    documento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: null,
    genero: '',
    estadoMarital: '',
    nacionalidad: '',
    
    // Centro
    nombreCentro: '',
    
    // Información de Residencia
    calle: '',
    codPostal: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    
    // Información de Contacto
    telefono: '',
    celular: '',
    correo: ''
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Datos para cascading dropdowns
  const provincias = {
    cajamarca: [
      { value: 'cajabamba', label: 'Cajabamba' },
      { value: 'bambamarca', label: 'Bambamarca' }
    ]
  };

  const distritos = {
    cajabamba: [
      { value: 'cajabamba_distrito', label: 'Cajabamba' },
      { value: 'cachachi', label: 'Cachachi' }
    ],
    bambamarca: [
      { value: 'bambamarca_distrito', label: 'Bambamarca' },
      { value: 'chugur', label: 'Chugur' }
    ]
  };

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      estado: '',
      tipoDocumento: '',
      documento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: null,
      genero: '',
      estadoMarital: '',
      nacionalidad: '',
      nombreCentro: '',
      calle: '',
      codPostal: '',
      pais: '',
      departamento: '',
      provincia: '',
      distrito: '',
      telefono: '',
      celular: '',
      correo: ''
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

  // Función para manejar cambios en selects con lógica de cascada
  const handleSelectChangeWithCascade = useCallback((field, value) => {
    // Lógica especial para cascading dropdowns
    if (field === 'pais') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        departamento: '',
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'departamento') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'provincia') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        distrito: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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


  // Validación del formulario (para los campos obligatorios)
  const validateForm = () => {
    const newErrors = {};

    // Información del Paciente
    if (!formData.estado) {
      newErrors.estado = 'El estado es obligatorio';
    }

    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = 'El tipo de documento es obligatorio';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'El número de documento es obligatorio';
    }

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
    }

    // Centro
    if (!formData.nombreCentro.trim()) {
      newErrors.nombreCentro = 'El nombre del centro es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (paciente) => {
    setselectedPaciente(paciente);
    setFormData({
      estado: paciente.estado,
      tipoDocumento: paciente.tipoDocumento,
      documento: paciente.documento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: paciente.fechaNacimiento,
      genero: paciente.genero,
      estadoMarital: paciente.estadoMarital,
      nacionalidad: paciente.nacionalidad,
      nombreCentro: paciente.nombreCentro,
      calle: paciente.calle,
      codPostal: paciente.codPostal,
      pais: paciente.pais,
      departamento: paciente.departamento,
      provincia: paciente.provincia,
      distrito: paciente.distrito,
      telefono: paciente.telefono,
      celular: paciente.celular,
      correo: paciente.correo
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setselectedPaciente(null);
    clearForm();
  };

  const handleOpenDetailModal = (paciente) => {
    setselectedPaciente(paciente);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setselectedPaciente(null);
  };

  const handleOpenDeleteConfirm = (paciente) => {
    setselectedPaciente(paciente);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setselectedPaciente(null);
  };

  // Función para crear paciente
  const handleCreatePaciente = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newPaciente = {
        id: Math.max(...pacientes.map(c => c.id)) + 1,
        estado: formData.estado,
        tipoDocumento: formData.tipoDocumento,
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        estadoMarital: formData.estadoMarital,
        nacionalidad: formData.nacionalidad,
        nombreCentro: formData.nombreCentro.trim(),
        calle: formData.calle.trim(),
        codPostal: formData.codPostal.trim(),
        pais: formData.pais,
        departamento: formData.departamento,
        provincia: formData.provincia,
        distrito: formData.distrito,
        telefono: formData.telefono.trim(),
        celular: formData.celular.trim(),
        correo: formData.correo.trim()
      };
      
      setPacientes(prev => [...prev, newPaciente]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar paciente
  const handleEditPaciente = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setPacientes(prev => prev.map(p => 
        p.id === selectedPaciente.id 
          ? {
              ...p,
              estado: formData.estado,
              tipoDocumento: formData.tipoDocumento,
              documento: formData.documento.trim(),
              nombres: formData.nombres.trim(),
              apellidos: formData.apellidos.trim(),
              fechaNacimiento: formData.fechaNacimiento,
              genero: formData.genero,
              estadoMarital: formData.estadoMarital,
              nacionalidad: formData.nacionalidad,
              nombreCentro: formData.nombreCentro.trim(),
              calle: formData.calle.trim(),
              codPostal: formData.codPostal.trim(),
              pais: formData.pais,
              departamento: formData.departamento,
              provincia: formData.provincia,
              distrito: formData.distrito,
              telefono: formData.telefono.trim(),
              celular: formData.celular.trim(),
              correo: formData.correo.trim()
            }
          : p
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar paciente
  const handleDeletePaciente = () => {
    setPacientes(prev => prev.filter(c => c.id !== selectedPaciente.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar pacientes basado en la búsqueda
  const filteredPacientes = pacientes.filter(paciente => 
    paciente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.documento.toLowerCase().includes(searchTerm.toLowerCase())

  );

  // Función para obtener el nombre legible de ubicación
  const getUbicacionTexto = (paciente) => {
    const provinciaObj = provincias.cajamarca?.find(p => p.value === paciente.provincia);
    const distritoObj = distritos[paciente.provincia]?.find(d => d.value === paciente.distrito);
    
    return `${distritoObj?.label || ''}, ${provinciaObj?.label || ''}, Cajamarca`;
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
        <Typography color="text.primary">Pacientes</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Pacientes
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
            label="Lista de Pacientes" 
            icon={<Search />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab 
            label="Crear Paciente" 
            icon={<Add />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Paciente */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreatePaciente}>
              {/* Sección 1: Información del Paciente */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Paciente
                </Typography>

                {/* Fila 1: Nombres, Apellidos, Genero */}
                <FieldRow>
                  <ResponsiveField label="Nombres" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los nombres del paciente"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      error={!!errors.nombres}
                      helperText={errors.nombres}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellidos" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los apellidos del paciente"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      error={!!errors.apellidos}
                      helperText={errors.apellidos}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.genero} size="small">
                      <Select
                        value={formData.genero}
                        onChange={(e) => handleSelectChangeWithCascade('genero', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.genero ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar género</MenuItem>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="femenino">Femenino</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                      {errors.genero && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.genero}</Typography>}
                    </FormControl>
                  </ResponsiveField>  
                </FieldRow>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento */}
                <FieldRow>
                  <ResponsiveField label="Tipo de Documento" required>
                    <FormControl fullWidth required error={!!errors.tipoDocumento} size="small">
                      <Select
                        value={formData.tipoDocumento}
                        onChange={(e) => handleSelectChangeWithCascade('tipoDocumento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.tipoDocumento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        <MenuItem value="DNI">DNI</MenuItem>
                        <MenuItem value="Carnet de Extranjería">Carnet de Extranjería</MenuItem>
                        <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                      </Select>
                      {errors.tipoDocumento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.tipoDocumento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Número de Documento" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el número de documento"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      error={!!errors.documento}
                      helperText={errors.documento}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaNacimiento || ''}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      error={!!errors.fechaNacimiento}
                      helperText={errors.fechaNacimiento}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Nacionalidad, Estado marital, Estado */}
                <FieldRow>
                  <ResponsiveField label="Nacionalidad">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la nacionalidad"
                      value={formData.nacionalidad}
                      onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Estado Marital">
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.estadoMarital}
                        onChange={(e) => handleSelectChangeWithCascade('estadoMarital', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estadoMarital ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="soltero">Soltero(a)</MenuItem>
                        <MenuItem value="casado">Casado(a)</MenuItem>
                        <MenuItem value="divorciado">Divorciado(a)</MenuItem>
                        <MenuItem value="viudo">Viudo(a)</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.estado} size="small">
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleSelectChangeWithCascade('estado', e.target.value)}
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
                      {errors.estado && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.estado}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 2: Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Centro
                </Typography>
                <FieldRow>
                  <ResponsiveField label="Nombre del Centro" required>
                    <TextField

                      fullWidth
                      required
                      placeholder="Ingrese el nombre del centro"
                      value={formData.nombreCentro}
                      onChange={(e) => handleInputChange('nombreCentro', e.target.value)}
                      error={!!errors.nombreCentro}
                      helperText={errors.nombreCentro}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField>
                    {/* Espacio vacío para alinear con la fila superior */}
                  </ResponsiveField>
                </FieldRow>
              </Paper>
              {/* Sección 3: Información de Residencia */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  3. Información de Residencia
                </Typography>

                {/*Calle, Codigo postal, Pais*/}
                <FieldRow>
                  <ResponsiveField label="Calle">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la calle o avenida"
                      value={formData.calle}
                      onChange={(e) => handleInputChange('calle', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Código Postal">
                    <TextField
                      fullWidth
                      placeholder="Ingrese el código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais} size="small">
                      <Select
                        value={formData.pais}
                        onChange={(e) => handleSelectChangeWithCascade('pais', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.pais ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar país</MenuItem>
                        <MenuItem value="peru">Perú</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
                {/* Departamento, Provincia, Distrito */}
                <FieldRow>
                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required disabled={formData.pais !== 'peru'} error={!!errors.departamento} size="small">
                      <Select
                        value={formData.departamento}
                        onChange={(e) => handleSelectChangeWithCascade('departamento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.departamento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar departamento</MenuItem>
                        {formData.pais === 'peru' && (
                          <MenuItem value="cajamarca">Cajamarca</MenuItem>
                        )}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required disabled={formData.departamento !== 'cajamarca'} error={!!errors.provincia} size="small">
                      <Select
                        value={formData.provincia}
                        onChange={(e) => handleSelectChangeWithCascade('provincia', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.provincia ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar provincia</MenuItem>
                        {formData.departamento === 'cajamarca' &&
                          provincias.cajamarca.map(provincia => (
                            <MenuItem key={provincia.value} value={provincia.value}>
                              {provincia.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia || !distritos[formData.provincia]} error={!!errors.distrito} size="small">
                      <Select
                        value={formData.distrito}
                        onChange={(e) => handleSelectChangeWithCascade('distrito', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.distrito ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar distrito</MenuItem>
                        {formData.provincia && distritos[formData.provincia] &&
                          distritos[formData.provincia].map(distrito => (
                            <MenuItem key={distrito.value} value={distrito.value}>
                              {distrito.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.distrito && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.distrito}</Typography>}
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
                  Crear Paciente
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Pacientes */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar pacientes por nombres, apellidos o número de documento"
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
                  {filteredPacientes.length} resultado(s) de {pacientes.length} pacientes
                </Typography>
              )}
            </Box>

            {/* Tabla de Pacientes con los atributos mas importantes y en detallar todos sus atributos*/}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Pacientes" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombres</strong></TableCell>
                      <TableCell><strong>Apellidos</strong></TableCell>
                      <TableCell><strong>Número de documento</strong></TableCell>
                      <TableCell><strong>Documento</strong></TableCell>
                      <TableCell><strong>Celular</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPacientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPacientes.map((paciente) => (
                      <TableRow key={paciente.id} hover>
                        <TableCell>{paciente.nombres}</TableCell>
                        <TableCell>{paciente.apellidos}</TableCell>
                        <TableCell>{paciente.tipoDocumento}</TableCell>
                        <TableCell>{paciente.documento}</TableCell>
                        <TableCell>{paciente.celular}</TableCell>
                        <TableCell>
                          <Chip
                            label={paciente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={paciente.estado === 'activo' ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(paciente)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailModal(paciente)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(paciente)}
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

      {/* Modal para Editar Paciente */}
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
          <Typography variant="h6" fontWeight="bold">Editar Paciente</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditPaciente}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección 1: Información del Paciente */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                1. Información del Paciente
              </Typography>
              {/* Fila 1: Nombre, Abreviatura, Horarios */}
                <FieldRow>
                  <ResponsiveField label="Nombres" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los nombres del paciente"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      error={!!errors.nombres}
                      helperText={errors.nombres}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellidos" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los apellidos del paciente"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      error={!!errors.apellidos}
                      helperText={errors.apellidos}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.genero} size="small">
                      <Select
                        value={formData.genero}
                        onChange={(e) => handleSelectChangeWithCascade('genero', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.genero ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar género</MenuItem>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="femenino">Femenino</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                      {errors.genero && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.genero}</Typography>}
                    </FormControl>
                  </ResponsiveField>  
                </FieldRow>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento */}
                <FieldRow>
                  <ResponsiveField label="Tipo de Documento" required>
                    <FormControl fullWidth required error={!!errors.tipoDocumento} size="small">
                      <Select
                        value={formData.tipoDocumento}
                        onChange={(e) => handleSelectChangeWithCascade('tipoDocumento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.tipoDocumento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        <MenuItem value="DNI">DNI</MenuItem>
                        <MenuItem value="Carnet de Extranjería">Carnet de Extranjería</MenuItem>
                        <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                      </Select>
                      {errors.tipoDocumento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.tipoDocumento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Número de Documento" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el número de documento"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      error={!!errors.documento}
                      helperText={errors.documento}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaNacimiento || ''}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      error={!!errors.fechaNacimiento}
                      helperText={errors.fechaNacimiento}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Nacionalidad, Estado marital, Estado */}
                <FieldRow>
                  <ResponsiveField label="Nacionalidad">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la nacionalidad"
                      value={formData.nacionalidad}
                      onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Estado Marital">
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.estadoMarital}
                        onChange={(e) => handleSelectChangeWithCascade('estadoMarital', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estadoMarital ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="soltero">Soltero(a)</MenuItem>
                        <MenuItem value="casado">Casado(a)</MenuItem>
                        <MenuItem value="divorciado">Divorciado(a)</MenuItem>
                        <MenuItem value="viudo">Viudo(a)</MenuItem>
                        <MenuItem value="otro">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.estado} size="small">
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleSelectChangeWithCascade('estado', e.target.value)}
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
                      {errors.estado && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.estado}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
            </Paper>

            {/* Sección 2: Dirección del Paciente */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                2. Centro
              </Typography>
              <FieldRow>
                  <ResponsiveField label="Nombre del Centro" required>
                    <TextField

                      fullWidth
                      required
                      placeholder="Ingrese el nombre del centro"
                      value={formData.nombreCentro}
                      onChange={(e) => handleInputChange('nombreCentro', e.target.value)}
                      error={!!errors.nombreCentro}
                      helperText={errors.nombreCentro}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField>
                    {/* Espacio vacío para alinear con la fila superior */}
                  </ResponsiveField>
                </FieldRow>
            </Paper>
            {/*Sección 3: Informacion de Residencia */}
            <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                3. Información de Residencia
              </Typography>

              {/*Calle, Codigo postal, Pais*/}
              <FieldRow>
                  <ResponsiveField label="Calle">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la calle o avenida"
                      value={formData.calle}
                      onChange={(e) => handleInputChange('calle', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Código Postal">
                    <TextField
                      fullWidth
                      placeholder="Ingrese el código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais} size="small">
                      <Select
                        value={formData.pais}
                        onChange={(e) => handleSelectChangeWithCascade('pais', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.pais ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar país</MenuItem>
                        <MenuItem value="peru">Perú</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
                {/* Departamento, Provincia, Distrito */}
                <FieldRow>
                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required disabled={formData.pais !== 'peru'} error={!!errors.departamento} size="small">
                      <Select
                        value={formData.departamento}
                        onChange={(e) => handleSelectChangeWithCascade('departamento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.departamento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar departamento</MenuItem>
                        {formData.pais === 'peru' && (
                          <MenuItem value="cajamarca">Cajamarca</MenuItem>
                        )}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required disabled={formData.departamento !== 'cajamarca'} error={!!errors.provincia} size="small">
                      <Select
                        value={formData.provincia}
                        onChange={(e) => handleSelectChangeWithCascade('provincia', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.provincia ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar provincia</MenuItem>
                        {formData.departamento === 'cajamarca' &&
                          provincias.cajamarca.map(provincia => (
                            <MenuItem key={provincia.value} value={provincia.value}>
                              {provincia.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia || !distritos[formData.provincia]} error={!!errors.distrito} size="small">
                      <Select
                        value={formData.distrito}
                        onChange={(e) => handleSelectChangeWithCascade('distrito', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.distrito ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar distrito</MenuItem>
                        {formData.provincia && distritos[formData.provincia] &&
                          distritos[formData.provincia].map(distrito => (
                            <MenuItem key={distrito.value} value={distrito.value}>
                              {distrito.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                      {errors.distrito && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.distrito}</Typography>}
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
          <Typography variant="h6" fontWeight="bold">Detalles del Paciente</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedPaciente && (
            <>
              {/* Sección 1: Información del Paciente */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Paciente
                </Typography>
                {/* Fila 1: Nombre, Abreviatura, Horarios .Con grid espacions proporcionables*/}
                <Grid container spacing={17} sx={{ mb: 3 }}> {/* Increased spacing between grid items and bottom margin */}
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Nombres</Typography> {/* Made title bold and added margin bottom */}
                    <Typography variant="subtitle1">{selectedPaciente.nombres || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Apellidos</Typography>
                    <Typography variant="subtitle1">{selectedPaciente.apellidos || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Género</Typography>
                    <Typography variant="subtitle1">
                      {selectedPaciente.genero ? selectedPaciente.genero.charAt(0).toUpperCase() + selectedPaciente.genero.slice(1) : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento. Con grid espacions proporcionables*/}

                <Grid container spacing={10} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Tipo de Documento</Typography>
                    <Typography variant="subtitle1"> {selectedPaciente.tipoDocumento || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Número de Documento</Typography>
                    <Typography variant="subtitle1"> {selectedPaciente.documento || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Fecha de Nacimiento</Typography>
                    <Typography variant="subtitle1">
                      {selectedPaciente.fechaNacimiento ? new Date(selectedPaciente.fechaNacimiento).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                {/* Fila 3: Nacionalidad, Estado marital, Estado. Con grid espacions proporcionables*/}
                <Grid container spacing={16} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Nacionalidad</Typography>
                     <Typography variant="subtitle1">{selectedPaciente.nacionalidad ? selectedPaciente.nacionalidad.charAt(0).toUpperCase() + selectedPaciente.nacionalidad.slice(1) : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Estado Marital</Typography>
                    <Typography variant="subtitle1">
                      {selectedPaciente.estadoMarital ? selectedPaciente.estadoMarital.charAt(0).toUpperCase() + selectedPaciente.estadoMarital.slice(1) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Estado</Typography>
                    <Chip
                      label={selectedPaciente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      color={selectedPaciente.estado === 'activo' ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Nombre del centro */}
              <Paper sx={{ p: 3, mb:3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Centro
                </Typography>
                <Grid container spacing={15} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Nombre del Centro</Typography>
                    <Typography variant="subtitle1">{selectedPaciente.nombreCentro || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Seccion 3: Calle, cod postal, pais, departamento, distrito, provincia */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  3. Dirección del Paciente
                </Typography>
                
                {/*Calle, Codigo postal, Pais. Con grid espacions proporcionables*/}
                <Grid container spacing={15} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Calle</Typography>
                    <Typography variant="subtitle1">{selectedPaciente.calle || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Código Postal</Typography>
                    <Typography variant="subtitle1">{selectedPaciente.codPostal || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>País</Typography>
                     <Typography variant="subtitle1">{selectedPaciente.pais ? selectedPaciente.pais.charAt(0).toUpperCase() + selectedPaciente.pais.slice(1) : 'N/A'}</Typography>
                  </Grid>
                </Grid>
                {/* Departamento, Provincia, Distrito. Con grid espacions proporcionables*/}
                <Grid container spacing={20} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Departamento</Typography>
                     <Typography variant="subtitle1">{selectedPaciente.departamento ? selectedPaciente.departamento.charAt(0).toUpperCase() + selectedPaciente.departamento.slice(1) : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Provincia</Typography>
                     <Typography variant="subtitle1">{selectedPaciente.provincia ? selectedPaciente.provincia.charAt(0).toUpperCase() + selectedPaciente.provincia.slice(1) : 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Distrito</Typography>
                     <Typography variant="subtitle1">{selectedPaciente.distrito ? selectedPaciente.distrito.split('_')[0].charAt(0).toUpperCase() + selectedPaciente.distrito.split('_')[0].slice(1) : 'N/A'}</Typography>
                  </Grid>
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
          <Typography variant="h6" fontWeight="bold">Confirmar Eliminación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea eliminar el paciente{' '}
            <strong>"{selectedPaciente?.nombre}"</strong>?
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
            onClick={handleDeletePaciente}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pacientes;