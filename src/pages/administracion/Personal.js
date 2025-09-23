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
  Grid,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Visibility,
  Delete,
  Save,
  Close,
  Search,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staffService';

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
const ResponsiveField = memo(({ label, children, required = false }) => (
  <Box sx={{ flex: 1 }}>
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

const Personal = () => {
  const navigate = useNavigate();

  // Estado para la lista de personal
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos simulados de centros (normalmente vendrían del backend)
  const centros = [
    { value: 'centro-1', label: 'Clínica María Belén - Sede Central' },
    { value: 'centro-2', label: 'Clínica María Belén - Sede Norte' }
  ];

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    // Información
    documento: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    // Centro
    centro: '',
    // Información del Personal
    estatus: '',
    titulo: '',
    grado: '',
    numeroLicencia: '',
    tipo: '',
    fechaContratacion: '',
    fechaCese: '',
    // Dirección
    direccion: '',
    codPostal: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    // Información Personal
    telefono: '',
    celular: '',
    correo: ''
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar personal del backend
  const loadPersonal = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando personal desde el backend...');
      const response = await staffService.getAll();

      console.log('✅ Personal cargado:', response.data);
      setPersonal(response.data || []);

    } catch (error) {
      console.error('❌ Error al cargar personal:', error);
      setError(`Error al cargar personal: ${error.message}`);

      // Datos de prueba en caso de error (para desarrollo)
      const datosPrueba = [
        {
          id: 1,
          documento: '12345678',
          nombre: 'María Elena',
          apellido: 'González Pérez',
          fechaNacimiento: '1985-03-15',
          genero: 'femenino',
          centro: 'centro-1',
          estatus: 'activo',
          titulo: 'Doctora',
          grado: 'especialista',
          numeroLicencia: 'LIC-001-2020',
          tipo: 'medico',
          fechaContratacion: '2020-01-15',
          fechaCese: '',
          direccion: 'Av. Los Médicos 456',
          codPostal: '06001',
          pais: 'peru',
          departamento: 'cajamarca',
          provincia: 'cajabamba',
          distrito: 'cajabamba_distrito',
          telefono: '076-123456',
          celular: '987654321',
          correo: 'maria.gonzalez@clinica.com'
        },
        {
          id: 2,
          documento: '87654321',
          nombre: 'Carlos Antonio',
          apellido: 'Rodríguez Silva',
          fechaNacimiento: '1978-08-22',
          genero: 'masculino',
          centro: 'centro-2',
          estatus: 'activo',
          titulo: 'Doctor',
          grado: 'especialista',
          numeroLicencia: 'LIC-002-2018',
          tipo: 'medico',
          fechaContratacion: '2018-03-10',
          fechaCese: '',
          direccion: 'Jr. Salud 789',
          codPostal: '06002',
          pais: 'peru',
          departamento: 'cajamarca',
          provincia: 'bambamarca',
          distrito: 'bambamarca_distrito',
          telefono: '076-789012',
          celular: '912345678',
          correo: 'carlos.rodriguez@clinica.com'
        }
      ];
      setPersonal(datosPrueba);

    } finally {
      setLoading(false);
    }
  };

  // Cargar personal al montar el componente
  useEffect(() => {
    loadPersonal();
  }, []);

  // Datos para cascading dropdowns (igual que en Centros)
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
      documento: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      genero: '',
      centro: '',
      estatus: '',
      titulo: '',
      grado: '',
      numeroLicencia: '',
      tipo: '',
      fechaContratacion: '',
      fechaCese: '',
      direccion: '',
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

  // Función genérica para manejar cambios en campos de texto
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

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Información
    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento es obligatorio';
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'Apellido es obligatorio';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Fecha de nacimiento es obligatoria';
    }
    if (!formData.genero) {
      newErrors.genero = 'Género es obligatorio';
    }
    
    // Centro
    if (!formData.centro) {
      newErrors.centro = 'Centro es obligatorio';
    }
    
    // Información del Personal
    if (!formData.estatus) {
      newErrors.estatus = 'Estatus es obligatorio';
    }
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título es obligatorio';
    }
    if (!formData.grado) {
      newErrors.grado = 'Grado es obligatorio';
    }
    if (!formData.numeroLicencia.trim()) {
      newErrors.numeroLicencia = 'Número de licencia es obligatorio';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo es obligatorio';
    }
    if (!formData.fechaContratacion) {
      newErrors.fechaContratacion = 'Fecha de contratación es obligatoria';
    }
    
    // Dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Dirección es obligatoria';
    }
    if (!formData.codPostal.trim()) {
      newErrors.codPostal = 'Código postal es obligatorio';
    }
    if (!formData.pais) {
      newErrors.pais = 'País es obligatorio';
    }
    if (!formData.departamento) {
      newErrors.departamento = 'Departamento es obligatorio';
    }
    if (!formData.provincia) {
      newErrors.provincia = 'Provincia es obligatoria';
    }
    if (!formData.distrito) {
      newErrors.distrito = 'Distrito es obligatorio';
    }
    
    // Información Personal
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }
    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular es obligatorio';
    }
    if (!formData.correo.trim()) {
      newErrors.correo = 'Correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Correo electrónico no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (person) => {
    setSelectedPersonal(person);
    setFormData({
      documento: person.documento,
      nombre: person.nombre,
      apellido: person.apellido,
      fechaNacimiento: person.fechaNacimiento,
      genero: person.genero,
      centro: person.centro,
      estatus: person.estatus,
      titulo: person.titulo,
      grado: person.grado,
      numeroLicencia: person.numeroLicencia,
      tipo: person.tipo,
      fechaContratacion: person.fechaContratacion,
      fechaCese: person.fechaCese,
      direccion: person.direccion,
      codPostal: person.codPostal,
      pais: person.pais,
      departamento: person.departamento,
      provincia: person.provincia,
      distrito: person.distrito,
      telefono: person.telefono,
      celular: person.celular,
      correo: person.correo
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedPersonal(null);
    clearForm();
  };

  const handleOpenDetailModal = (person) => {
    setSelectedPersonal(person);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedPersonal(null);
  };

  const handleOpenDeleteConfirm = (person) => {
    setSelectedPersonal(person);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedPersonal(null);
  };

  // Función para crear personal
  const handleCreatePersonal = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        console.log('📤 Creando personal...');

        const nuevoPersonal = await staffService.create(formData);
        console.log('✅ Personal creado:', nuevoPersonal);

        // Recargar la lista de personal
        await loadPersonal();

        clearForm();
        // Cambiar automáticamente al tab de lista
        setActiveTab(0);

      } catch (error) {
        console.error('❌ Error al crear personal:', error);
        setError(`Error al crear personal: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para editar personal
  const handleEditPersonal = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        console.log('📤 Editando personal...');

        const personalActualizado = await staffService.update(selectedPersonal.id, formData);
        console.log('✅ Personal actualizado:', personalActualizado);

        // Recargar la lista de personal
        await loadPersonal();

        handleCloseEditModal();

      } catch (error) {
        console.error('❌ Error al editar personal:', error);
        setError(`Error al editar personal: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para eliminar personal
  const handleDeletePersonal = async () => {
    try {
      setLoading(true);
      console.log('📤 Eliminando personal...');

      await staffService.delete(selectedPersonal.id);
      console.log('✅ Personal eliminado');

      // Recargar la lista de personal
      await loadPersonal();

      handleCloseDeleteConfirm();

    } catch (error) {
      console.error('❌ Error al eliminar personal:', error);
      setError(`Error al eliminar personal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar personal basado en la búsqueda
  const filteredPersonal = personal.filter(person => 
    person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre legible de ubicación
  const getUbicacionTexto = (person) => {
    const provinciaObj = provincias.cajamarca?.find(p => p.value === person.provincia);
    const distritoObj = distritos[person.provincia]?.find(d => d.value === person.distrito);
    
    return `${distritoObj?.label || ''}, ${provinciaObj?.label || ''}, Cajamarca`;
  };

  // Función para obtener el nombre del centro
  const getCentroTexto = (centroValue) => {
    const centro = centros.find(c => c.value === centroValue);
    return centro ? centro.label : centroValue;
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
        <Typography color="text.primary">Personal</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Personal
      </Typography>

      {/* Tabs */}
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
            label="Lista de Personal" 
            icon={<Search />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab 
            label="Crear Personal" 
            icon={<Add />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Personal */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreatePersonal}>
              {/* Sección 1: Información */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información
                </Typography>

                {/* Fila 1: Documento, Nombre, Apellido */}
                <FieldRow>
                  <ResponsiveField label="Documento" required>
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

                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellido" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Fecha de Nacimiento, Género */}
                <FieldRow>
                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      error={!!errors.fechaNacimiento}
                      helperText={errors.fechaNacimiento}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.genero} size="small">
                      <Select
                        value={formData.genero}
                        onChange={(e) => handleInputChange('genero', e.target.value)}
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
                      </Select>
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
                  <ResponsiveField label="Seleccione el Centro" required>
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
              </Paper>

              {/* Sección 3: Información del Personal */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  3. Información del Personal
                </Typography>

                {/* Fila 1: Estatus, Título, Grado */}
                <FieldRow>
                  <ResponsiveField label="Estatus" required>
                    <FormControl fullWidth required error={!!errors.estatus} size="small">
                      <Select
                        value={formData.estatus}
                        onChange={(e) => handleInputChange('estatus', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estatus ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estatus</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                        <MenuItem value="licencia">En Licencia</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Título" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: Doctor, Doctora, Lic."
                      value={formData.titulo}
                      onChange={(e) => handleInputChange('titulo', e.target.value)}
                      error={!!errors.titulo}
                      helperText={errors.titulo}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Grado" required>
                    <FormControl fullWidth required error={!!errors.grado} size="small">
                      <Select
                        value={formData.grado}
                        onChange={(e) => handleInputChange('grado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.grado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar grado</MenuItem>
                        <MenuItem value="residente">Residente</MenuItem>
                        <MenuItem value="especialista">Especialista</MenuItem>
                        <MenuItem value="subespecialista">Subespecialista</MenuItem>
                        <MenuItem value="jefe_servicio">Jefe de Servicio</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Número de Licencia, Tipo */}
                <FieldRow>
                  <ResponsiveField label="Número de Licencia" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: LIC-001-2024"
                      value={formData.numeroLicencia}
                      onChange={(e) => handleInputChange('numeroLicencia', e.target.value)}
                      error={!!errors.numeroLicencia}
                      helperText={errors.numeroLicencia}
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
                        <MenuItem value="medico">Médico</MenuItem>
                        <MenuItem value="enfermero">Enfermero</MenuItem>
                        <MenuItem value="tecnico">Técnico</MenuItem>
                        <MenuItem value="administrativo">Administrativo</MenuItem>
                        <MenuItem value="auxiliar">Auxiliar</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Fechas de Contratación y Cese */}
                <FieldRow>
                  <ResponsiveField label="Fecha de Contratación" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaContratacion}
                      onChange={(e) => handleInputChange('fechaContratacion', e.target.value)}
                      error={!!errors.fechaContratacion}
                      helperText={errors.fechaContratacion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Cese">
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.fechaCese}
                      onChange={(e) => handleInputChange('fechaCese', e.target.value)}
                      error={!!errors.fechaCese}
                      helperText={errors.fechaCese}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 4: Dirección */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  4. Dirección
                </Typography>

                {/* Fila 1: Dirección, Código Postal */}
                <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección completa"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Código Postal" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      error={!!errors.codPostal}
                      helperText={errors.codPostal}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: País, Departamento, Provincia, Distrito */}
                <FieldRow>
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
                </FieldRow>

                <FieldRow>
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

              {/* Sección 5: Información Personal */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  5. Información Personal
                </Typography>

                <FieldRow>
                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Celular" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de celular"
                      value={formData.celular}
                      onChange={(e) => handleInputChange('celular', e.target.value)}
                      error={!!errors.celular}
                      helperText={errors.celular}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Correo" required>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.correo}
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                      error={!!errors.correo}
                      helperText={errors.correo}
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
                  Crear Personal
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Personal */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
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

            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar personal por nombre, apellido, documento o correo..."
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
                  {filteredPersonal.length} resultado(s) de {personal.length} personal
                </Typography>
              )}
            </Box>

            {/* Tabla de Personal */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Personal" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Documento</strong></TableCell>
                      <TableCell><strong>Nombre Completo</strong></TableCell>
                      <TableCell><strong>Centro</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Estatus</strong></TableCell>
                      <TableCell><strong>Correo</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPersonal.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontró personal que coincida con la búsqueda' : 'No hay personal registrado'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPersonal.map((person) => (
                        <TableRow key={person.id} hover>
                          <TableCell>{person.documento}</TableCell>
                          <TableCell>{person.nombre} {person.apellido}</TableCell>
                          <TableCell>{getCentroTexto(person.centro)}</TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{person.tipo}</TableCell>
                          <TableCell>
                            <Chip
                              label={person.estatus === 'activo' ? 'Activo' : person.estatus === 'inactivo' ? 'Inactivo' : 'En Licencia'}
                              color={person.estatus === 'activo' ? 'success' : person.estatus === 'inactivo' ? 'default' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>{person.correo}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenEditModal(person)}
                              sx={{ mr: 1 }}
                              title="Editar"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => handleOpenDetailModal(person)}
                              sx={{ mr: 1 }}
                              title="Ver Detalles"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDeleteConfirm(person)}
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

      {/* Modal para Editar Personal - Versión simplificada usando Grid */}
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
          <Typography variant="h6" fontWeight="bold">Editar Personal</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditPersonal}>
          <DialogContent dividers sx={{ p: 4, maxHeight: '80vh', overflowY: 'auto' }}>
            
            {/* Información Básica */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Información Básica" />
              <Box sx={{ p: 4 }}>
                
                {/* Fila 1: Documento, Nombre, Apellido */}
                <FieldRow>
                  <ResponsiveField label="Documento" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el número de documento"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      error={!!errors.documento}
                      helperText={errors.documento}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellido" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Fecha de Nacimiento, Género */}
                <FieldRow>
                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      error={!!errors.fechaNacimiento}
                      helperText={errors.fechaNacimiento}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.genero}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="femenino">Femenino</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
              </Box>
            </Paper>

            {/* Centro */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Centro" />
              <Box sx={{ p: 4 }}>
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <FormControl fullWidth required error={!!errors.centro}>
                      <Select
                        value={formData.centro}
                        onChange={(e) => handleSelectChangeWithCascade('centro', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.centro ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {centros.map(centro => (
                          <MenuItem key={centro.value} value={centro.value}>
                            {centro.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="  ">
                    {/* Espacio vacío para mantener alineación */}
                  </ResponsiveField>
                </FieldRow>
              </Box>
            </Paper>

            {/* Información del Personal */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Información del Personal" />
              <Box sx={{ p: 4 }}>
                
                {/* Fila 1: Estatus, Título, Grado */}
                <FieldRow>
                  <ResponsiveField label="Estatus" required>
                    <FormControl fullWidth required error={!!errors.estatus}>
                      <Select
                        value={formData.estatus}
                        onChange={(e) => handleSelectChangeWithCascade('estatus', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estatus ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                        <MenuItem value="suspendido">Suspendido</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Título" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: Doctor, Doctora, Lic."
                      value={formData.titulo}
                      onChange={(e) => handleInputChange('titulo', e.target.value)}
                      error={!!errors.titulo}
                      helperText={errors.titulo}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Grado" required>
                    <FormControl fullWidth required error={!!errors.grado}>
                      <Select
                        value={formData.grado}
                        onChange={(e) => handleSelectChangeWithCascade('grado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.grado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        <MenuItem value="especialista">Especialista</MenuItem>
                        <MenuItem value="residente">Residente</MenuItem>
                        <MenuItem value="interno">Interno</MenuItem>
                        <MenuItem value="tecnico">Técnico</MenuItem>
                        <MenuItem value="auxiliar">Auxiliar</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Número de Licencia, Tipo, Fecha de Contratación */}
                <FieldRow>
                  <ResponsiveField label="Número de Licencia" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: LIC-001-2024"
                      value={formData.numeroLicencia}
                      onChange={(e) => handleInputChange('numeroLicencia', e.target.value)}
                      error={!!errors.numeroLicencia}
                      helperText={errors.numeroLicencia}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Tipo" required>
                    <FormControl fullWidth required error={!!errors.tipo}>
                      <Select
                        value={formData.tipo}
                        onChange={(e) => handleSelectChangeWithCascade('tipo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.tipo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        <MenuItem value="medico">Médico</MenuItem>
                        <MenuItem value="enfermera">Enfermera</MenuItem>
                        <MenuItem value="tecnico">Técnico</MenuItem>
                        <MenuItem value="administrativo">Administrativo</MenuItem>
                        <MenuItem value="limpieza">Limpieza</MenuItem>
                        <MenuItem value="seguridad">Seguridad</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Contratación" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.fechaContratacion}
                      onChange={(e) => handleInputChange('fechaContratacion', e.target.value)}
                      error={!!errors.fechaContratacion}
                      helperText={errors.fechaContratacion}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Fecha de Cese */}
                <FieldRow>
                  <ResponsiveField label="Fecha de Cese">
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.fechaCese}
                      onChange={(e) => handleInputChange('fechaCese', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="  ">
                    {/* Espacio vacío para mantener alineación */}
                  </ResponsiveField>
                </FieldRow>
              </Box>
            </Paper>

            {/* Dirección */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Dirección" />
              <Box sx={{ p: 4 }}>
                
                {/* Fila 1: Dirección, Código Postal */}
                <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección completa"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Código Postal" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Código postal"
                      value={formData.codPostal}
                      onChange={(e) => handleInputChange('codPostal', e.target.value)}
                      error={!!errors.codPostal}
                      helperText={errors.codPostal}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: País, Departamento */}
                <FieldRow>
                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        <MenuItem value="peru">Perú</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required disabled={formData.pais !== 'peru'} error={!!errors.departamento}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {formData.pais === 'peru' && (
                          <MenuItem value="cajamarca">Cajamarca</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Provincia, Distrito */}
                <FieldRow>
                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required disabled={formData.departamento !== 'cajamarca'} error={!!errors.provincia}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {formData.departamento === 'cajamarca' && 
                          provincias.cajamarca.map(provincia => (
                            <MenuItem key={provincia.value} value={provincia.value}>
                              {provincia.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia || !distritos[formData.provincia]} error={!!errors.distrito}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {formData.provincia && distritos[formData.provincia] &&
                          distritos[formData.provincia].map(distrito => (
                            <MenuItem key={distrito.value} value={distrito.value}>
                              {distrito.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
              </Box>
            </Paper>

            {/* Información Personal */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Información Personal" />
              <Box sx={{ p: 4 }}>
                
                {/* Fila 1: Teléfono, Celular, Correo */}
                <FieldRow>
                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Celular" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de celular"
                      value={formData.celular}
                      onChange={(e) => handleInputChange('celular', e.target.value)}
                      error={!!errors.celular}
                      helperText={errors.celular}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Correo" required>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.correo}
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                      error={!!errors.correo}
                      helperText={errors.correo}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>
                </FieldRow>
              </Box>
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
          <Typography variant="h6" fontWeight="bold">Detalles del Personal</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedPersonal && (
            <>
              {/* Información Personal */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información Personal
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Documento:</strong> {selectedPersonal.documento}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1">
                      <strong>Nombre Completo:</strong> {selectedPersonal.nombre} {selectedPersonal.apellido}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Fecha de Nacimiento:</strong> {selectedPersonal.fechaNacimiento}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      <strong>Género:</strong> {selectedPersonal.genero}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Información Profesional */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información Profesional
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Centro:</strong> {getCentroTexto(selectedPersonal.centro)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      <strong>Estatus:</strong> {selectedPersonal.estatus}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Título:</strong> {selectedPersonal.titulo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      <strong>Grado:</strong> {selectedPersonal.grado}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Número de Licencia:</strong> {selectedPersonal.numeroLicencia}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      <strong>Tipo:</strong> {selectedPersonal.tipo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Fecha de Contratación:</strong> {selectedPersonal.fechaContratacion}
                    </Typography>
                  </Grid>
                  {selectedPersonal.fechaCese && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Fecha de Cese:</strong> {selectedPersonal.fechaCese}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Información de Contacto */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información de Contacto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Dirección:</strong> {selectedPersonal.direccion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Ubicación:</strong> {getUbicacionTexto(selectedPersonal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Teléfono:</strong> {selectedPersonal.telefono}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Celular:</strong> {selectedPersonal.celular}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Correo:</strong> {selectedPersonal.correo}
                    </Typography>
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
            ¿Está seguro de que desea eliminar a{' '}
            <strong>"{selectedPersonal?.nombre} {selectedPersonal?.apellido}"</strong>?
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
            onClick={handleDeletePersonal}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Personal;
