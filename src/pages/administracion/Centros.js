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
  CircularProgress,
  Alert,
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
  Search,
  Directions
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { centrosService } from '../../services/centrosService';
import { ubigeoService } from '../../services/ubigeoService';

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

const Centros = () => {
  const navigate = useNavigate();

  // Estado para la lista de centros
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paisesD, setPaisesCargados] = useState([]);
  const [departamentosD, setDepartamentosCargados] = useState([]);
  const [provinciasD, setProvinciasCargados] = useState([]);
  const [distritosD, setDistritosCargados] = useState([]);
  // Función para cargar países
  const cargarPaises = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(1);
      console.log('✅ Respuesta de países:', responseSystemParameter);
      setPaisesCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar países:', error);
      setError(`Error al cargar países: ${error.message}`);
    }
  };

  const cargarDepartamentos = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterIdRest(2);
      console.log('✅ Respuesta de Departamentos:', responseSystemParameter);
      setDepartamentosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar Departamentos:', error);
      setError(`Error al cargar Departamentos: ${error.message}`);
    }
  };

  const cargarProvincias = async (departamentoId) => {
    if (!departamentoId) {
      console.log('No hay departamento seleccionado para cargar provincias');
      setProvinciasCargados([]);
      return;
    }

    try {
      console.log('🔄 Cargando provincias para departamento:', departamentoId);
      const responseSystemParameter = await centrosService.getAllSystemParameterIdParent(2, departamentoId);
      
      if (!responseSystemParameter) {
        console.error('❌ No se recibió respuesta del servidor');
        setError('Error al cargar provincias: No se recibió respuesta del servidor');
        setProvinciasCargados([]);
        return;
      }

      const provinciasData = Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || [];
      
      console.log('✅ Provincias cargadas:', provinciasData);
      setProvinciasCargados(provinciasData);
      
      // Limpiar error si existe
      if (error && error.includes('Error al cargar provincias')) {
        setError('');
      }
    } catch (error) {
      console.error('❌ Error al cargar provincias:', error);
      setError(`Error al cargar provincias: ${error.message}`);
      setProvinciasCargados([]);
    }
  };

  const cargarDistritos = async (provinciaId) => {
    if (!provinciaId) {
      console.log('No hay provincia seleccionado para cargar distrito');
      setDistritosCargados([]);
      return;
    }

    try {
      console.log('🔄 Cargando distritos para provincia:', provinciaId);
      const responseSystemParameter = await centrosService.getAllSystemParameterIdParent(2, provinciaId);
      
      if (!responseSystemParameter) {
        console.error('❌ No se recibió respuesta del servidor');
        setError('Error al cargar distritos: No se recibió respuesta del servidor');
        setDistritosCargados([]);
        return;
      }

      const distritosData = Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || [];
      
      console.log('✅ Distritos cargadas:', distritosData);
      setDistritosCargados(distritosData);
      
      // Limpiar error si existe
      if (error && error.includes('Error al cargar distritos')) {
        setError('');
      }
    } catch (error) {
      console.error('❌ Error al cargar distritos:', error);
      setError(`Error al cargar distritos: ${error.message}`);
      setDistritosCargados([]);
    }
  };




  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState(null);

  // Estados para formularios separados
  const [formData, setFormData] = useState({
    // Información del Centro
    nombre: '',
    descripcion: '',
    abreviatura: '',
    inicioAtencion: '',
    finAtencion: '',
    // Dirección del Centro
    direccion: '',
    codPostal: '',
    telefono: '',
    ruc: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    estado: 'activo'
  });

  const [editFormData, setEditFormData] = useState({
    nombre: '',
    descripcion: '',
    abreviatura: '',
    inicioAtencion: '',
    finAtencion: '',
    direccion: '',
    codPostal: '',
    telefono: '',
    ruc: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar centros del backend
  const loadCentros = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📄 Cargando centros desde el backend...');
      const response = await centrosService.getAll();

      console.log('✅ Centros cargados:', response.data);
      setCentros(response.data || []);

    } catch (error) {
      console.error('❌ Error al cargar centros:', error);
      setError(`Error al cargar centros: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadCentros(),
          cargarPaises(),
          cargarDepartamentos()
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

  // Datos UBIGEO para cascading dropdowns
  const paises = ubigeoService.paises;
  const departamentos = ubigeoService.departamentos;

  // Estados para datos dinámicos

  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState([]);
  const [provinciasEditDisponibles, setProvinciasEditDisponibles] = useState([]);
  const [distritosEditDisponibles, setDistritosEditDisponibles] = useState([]);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      abreviatura: '',
      inicioAtencion: '',
      finAtencion: '',
      direccion: '',
      codPostal: '',
      telefono: '',
      ruc: '',
      pais: '',
      departamento: '',
      provincia: '',
      distrito: '',
      estado: 'activo'
    });
    setErrors({});
  };

  // Función para limpiar el formulario de edición
  const clearEditForm = () => {
    setEditFormData({
      nombre: '',
      descripcion: '',
      abreviatura: '',
      inicioAtencion: '',
      finAtencion: '',
      direccion: '',
      codPostal: '',
      telefono: '',
      ruc: '',
      pais: '',
      departamento: '',
      provincia: '',
      distrito: '',
      estado: 'activo'
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto (formulario crear)
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

  // Función para manejar cambios en selects con lógica de cascada (crear)
  const handleSelectChangeWithCascade = useCallback((field, value) => {
    // Lógica especial para cascading dropdowns UBIGEO
    if (field === 'pais') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        departamento: '',
        provincia: '',
        distrito: ''
      }));
      setProvinciasDisponibles([]);
      setDistritosDisponibles([]);
    } 
    
    if (field === 'departamento') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        provincia: '',
        distrito: ''
      }));
      
      if (value) {
        cargarProvincias(value);
      } else {
        setProvinciasCargados([]);
      }
      setDistritosDisponibles([]);
    } else if (field === 'provincia') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        distrito: ''
      }));
      if (value) {
        cargarDistritos(value);
      } else {
        setDistritosCargados([]);
      }
      setDistritosDisponibles([]);
      // Cargar distritos de la provincia seleccionada
      const nuevosDistritos = ubigeoService.getDistritosByProvincia(parseInt(value));
      setDistritosDisponibles(nuevosDistritos);
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

  // Función para manejar cambios en selects con lógica de cascada (editar)
  const handleEditSelectChangeWithCascade = useCallback(async (field, value) => {
    try {
      // Lógica especial para cascading dropdowns UBIGEO
      if (field === 'pais') {
        setEditFormData(prev => ({
          ...prev,
          [field]: value,
          departamento: '',
          provincia: '',
          distrito: ''
        }));
        setProvinciasEditDisponibles([]);
        setDistritosEditDisponibles([]);
      } else if (field === 'departamento') {
        setEditFormData(prev => ({
          ...prev,
          [field]: value?.toString() || '',
          provincia: '',
          distrito: ''
        }));

        // Cargar provincias del departamento seleccionado usando centrosService
        if (value) {
          const responseProvincias = await centrosService.getAllSystemParameterIdParent(2, value);
          const provinciasData = Array.isArray(responseProvincias) ? responseProvincias : responseProvincias?.data || [];
          setProvinciasEditDisponibles(provinciasData);
        } else {
          setProvinciasEditDisponibles([]);
        }
        setDistritosEditDisponibles([]);
      } else if (field === 'provincia') {
        setEditFormData(prev => ({
          ...prev,
          [field]: value,
          distrito: ''
        }));

        // Cargar distritos de la provincia seleccionada usando centrosService
        if (value) {
          const responseDistritos = await centrosService.getAllSystemParameterIdParent(2, value);
          const distritosData = Array.isArray(responseDistritos) ? responseDistritos : responseDistritos?.data || [];
          setDistritosEditDisponibles(distritosData);
        } else {
          setDistritosEditDisponibles([]);
        }
      } else {
        setEditFormData(prev => ({
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
    } catch (error) {
      console.error('Error al cargar datos de ubicación:', error);
      setError('Error al cargar datos de ubicación');
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


  // Validación del formulario de crear
  const validateForm = () => {
    const newErrors = {};

    // Información del Centro
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.abreviatura.trim()) {
      newErrors.abreviatura = 'Abreviatura es obligatoria';
    }
    if (!formData.inicioAtencion.trim()) {
      newErrors.inicioAtencion = 'Inicio de Atención es obligatorio';
    }
    if (!formData.finAtencion.trim()) {
      newErrors.finAtencion = 'Fin de Atención es obligatorio';
    }

    // Dirección del Centro
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación del formulario de editar
  const validateEditForm = () => {
    const newErrors = {};

    // Información del Centro
    if (!editFormData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }
    if (!editFormData.descripcion.trim()) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!editFormData.abreviatura.trim()) {
      newErrors.abreviatura = 'Abreviatura es obligatoria';
    }
    if (!editFormData.inicioAtencion.trim()) {
      newErrors.inicioAtencion = 'Inicio de Atención es obligatorio';
    }
    if (!editFormData.finAtencion.trim()) {
      newErrors.finAtencion = 'Fin de Atención es obligatorio';
    }

    // Dirección del Centro
    if (!editFormData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!editFormData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = async (centro) => {
    setSelectedCentro(centro);
    
    try {
      // Inicializar editFormData con los valores del centro
      const initialFormData = {
        nombre: centro.nombre || '',
        descripcion: centro.descripcion || '',
        abreviatura: centro.abreviatura || '',
        inicioAtencion: centro.inicioAtencion || '',
        finAtencion: centro.finAtencion || '',
        direccion: centro.direccion || '',
        codPostal: centro.codPostal || '',
        telefono: centro.telefono || '',
        ruc: centro.ruc || '',
        pais: centro.pais || '',
        departamento: '',  // Se establecerá después de la validación
        provincia: '',     // Se establecerá después de cargar las provincias
        distrito: '',      // Se establecerá después de cargar los distritos
        estado: centro.estado || 'activo'
      };
      setEditFormData(initialFormData);

      // Verificar si el departamento existe en departamentosD y obtener el ID correcto
      let departamentoId = '';
      if (centro.departamento) {
        const departamentoStr = centro.departamento.toString();
        const departamentoEncontrado = departamentosD.find(dep => 
          dep.parameterid?.toString() === departamentoStr
        );

        if (departamentoEncontrado) {
          departamentoId = departamentoEncontrado.parameterid?.toString();
          console.log('Departamento encontrado:', departamentoEncontrado);
          initialFormData.departamento = departamentoId;

          // Cargar provincias
          const responseProvincias = await centrosService.getAllSystemParameterIdParent(2, departamentoId);
          const provinciasData = Array.isArray(responseProvincias) ? responseProvincias : responseProvincias?.data || [];
          setProvinciasEditDisponibles(provinciasData);

          if (centro.provincia) {
            const provinciaStr = centro.provincia.toString();
            const provinciaEncontrada = provinciasData.find(prov => 
              prov.parameterid?.toString() === provinciaStr
            );

            if (provinciaEncontrada) {
              initialFormData.provincia = provinciaEncontrada.parameterid;

              // Cargar distritos
              const responseDistritos = await centrosService.getAllSystemParameterIdParent(2, provinciaEncontrada.parameterid);
              const distritosData = Array.isArray(responseDistritos) ? responseDistritos : responseDistritos?.data || [];
              setDistritosEditDisponibles(distritosData);

              if (centro.distrito) {
                const distritoStr = centro.distrito.toString();
                const distritoEncontrado = distritosData.find(dist => 
                  dist.parameterid?.toString() === distritoStr
                );

                if (distritoEncontrado) {
                  initialFormData.distrito = distritoEncontrado.parameterid;
                } else {
                  console.warn('Distrito no encontrado:', {
                    distrito: centro.distrito,
                    distritoStr,
                    opcionesDisponibles: distritosData.map(d => d.parameterid)
                  });
                }
              }
            } else {
              console.warn('Provincia no encontrada:', {
                provincia: centro.provincia,
                provinciaStr,
                opcionesDisponibles: provinciasData.map(p => p.parameterid)
              });
              setDistritosEditDisponibles([]);
            }
          } else {
            setDistritosEditDisponibles([]);
          }
        } else {
          console.warn('Departamento no encontrado:', {
            departamento: centro.departamento,
            departamentoStr,
            opcionesDisponibles: departamentosD.map(d => d.parameterid)
          });
          setProvinciasEditDisponibles([]);
          setDistritosEditDisponibles([]);
        }
      } else {
        setProvinciasEditDisponibles([]);
        setDistritosEditDisponibles([]);
      }

      // Actualizar el formulario con todos los valores validados
      setEditFormData(initialFormData);
    } catch (error) {
      console.error('Error al cargar datos de ubicación:', error);
      setError('Error al cargar datos de ubicación');
      setProvinciasEditDisponibles([]);
      setDistritosEditDisponibles([]);
    }
  
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCentro(null);
    clearEditForm();
  };

  const handleOpenDetailModal = (centro) => {
    setSelectedCentro(centro);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedCentro(null);
  };

  const handleOpenDeleteConfirm = (centro) => {
    setSelectedCentro(centro);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedCentro(null);
  };

  // Función para crear centro
  const handleCreateCentro = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        console.log('📤 Creando centro...');

        const nuevoCentro = await centrosService.create(formData);
        console.log('✅ Centro creado:', nuevoCentro);

        // Recargar la lista de centros
        await loadCentros();

        clearForm();
        // Cambiar automáticamente al tab de lista
        setActiveTab(0);

      } catch (error) {
        console.error('❌ Error al crear centro:', error);
        setError(`Error al crear centro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para editar centro
  const handleEditCentro = async (e) => {
    e.preventDefault();

    if (validateEditForm()) {
      try {
        setLoading(true);
        console.log('📤 Editando centro...');

        const centroActualizado = await centrosService.update(selectedCentro.id, editFormData);
        console.log('✅ Centro actualizado:', centroActualizado);

        // Recargar la lista de centros
        await loadCentros();

        handleCloseEditModal();

      } catch (error) {
        console.error('❌ Error al editar centro:', error);
        setError(`Error al editar centro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para eliminar centro
  const handleDeleteCentro = async () => {
    try {
      setLoading(true);
      console.log('📤 Eliminando centro...');

      await centrosService.delete(selectedCentro.id);
      console.log('✅ Centro eliminado');

      // Recargar la lista de centros
      await loadCentros();

      handleCloseDeleteConfirm();

    } catch (error) {
      console.error('❌ Error al eliminar centro:', error);
      setError(`Error al eliminar centro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar centros basado en la búsqueda
  const filteredCentros = centros.filter(centro => 
    centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.abreviatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.telefono.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre legible de ubicación usando UBIGEO
  const getUbicacionTexto = (centro) => {
    return ubigeoService.formatUbicacionCompleta(
      centro.pais,
      centro.departamento,
      centro.provincia,
      centro.distrito
    );
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
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
        <Typography color="text.primary">Centros</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Centros
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
            label="Lista de Centros" 
            icon={<Search />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab 
            label="Crear Centro" 
            icon={<Add />} 
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Centro */}
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

            <form onSubmit={handleCreateCentro}>
              {/* Sección 1: Información del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  1. Información del Centro
                </Typography>

                {/* Fila 1: Nombre, Abreviatura, Horarios */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre del centro"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Abreviatura" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: CMB-CENTRAL"
                      value={formData.abreviatura}
                      onChange={(e) => handleInputChange('abreviatura', e.target.value)}
                      error={!!errors.abreviatura}
                      helperText={errors.abreviatura}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Inicio de Atención" required>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.inicioAtencion}
                      onChange={(e) => handleInputChange('inicioAtencion', e.target.value)}
                      error={!!errors.inicioAtencion}
                      helperText={errors.inicioAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fin de Atención" required>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={formData.finAtencion}
                      onChange={(e) => handleInputChange('finAtencion', e.target.value)}
                      error={!!errors.finAtencion}
                      helperText={errors.finAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Descripción */}
                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      placeholder="Ingrese la descripción del centro"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Sección 2: Dirección del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Dirección del Centro
                </Typography>

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

                  <ResponsiveField label="RUC">
                    <TextField
                      fullWidth
                      placeholder="Número de RUC"
                      value={formData.ruc}
                      onChange={(e) => handleInputChange('ruc', e.target.value)}
                      error={!!errors.ruc}
                      helperText={errors.ruc}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

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
                        {Array.isArray(paisesD) && paisesD.map(pais => (
                           <MenuItem key={pais.parameterid} value={pais.parameterid}>
                             {pais.value1 || ''}
                           </MenuItem>
                         ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>


                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required error={!!errors.departamento} size="small">
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
                        {Array.isArray(departamentosD) && departamentosD.map(departamento => (
                           <MenuItem key={departamento.parameterid} value={departamento.parameterid?.toString()}>
                             {departamento.value1 || ''}
                           </MenuItem>
                         ))}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required error={!!errors.provincia} size="small">
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
                        {Array.isArray(provinciasD) && provinciasD.map(provincia => (
                           <MenuItem key={provincia.parameterid} value={provincia.parameterid}>
                             {provincia.value1 || ''}
                           </MenuItem>
                         ))}
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.provincia} error={!!errors.distrito} size="small">
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
                        {Array.isArray(distritosD) && distritosD.map(distrito => (
                          <MenuItem key={distrito.parameterid} value={distrito.parameterid}>
                            {distrito.value1}
                          </MenuItem>
                        ))}
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
                  Crear Centro
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Centros */}
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
                placeholder="Buscar centros por nombre, abreviatura o teléfono..."
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
                  {filteredCentros.length} resultado(s) de {centros.length} centros
                </Typography>
              )}
            </Box>

            {/* Tabla de Centros */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Centros" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Abreviatura</strong></TableCell>
                      <TableCell><strong>Horario</strong></TableCell>
                      <TableCell><strong>Teléfono</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCentros.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron centros que coincidan con la búsqueda' : 'No hay centros registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCentros.map((centro) => (
                      <TableRow key={centro.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {centro.nombre}
                            </Typography>
                            {centro.estado && (
                              <Chip
                                label={centro.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                color={getEstadoColor(centro.estado)}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{centro.abreviatura}</TableCell>
                        <TableCell>{centro.inicioAtencion} - {centro.finAtencion}</TableCell>
                        <TableCell>{centro.telefono}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(centro)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailModal(centro)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(centro)}
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

      {/* Modal para Editar Centro */}
      <Dialog 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
        inert={!openEditModal}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#2184be', 
          color: 'white' 
        }}>
          <Typography variant="h6" fontWeight="bold">Editar Centro</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditCentro}>
          <DialogContent dividers sx={{ p: 4 }}>
            {/* Sección 1: Información del Centro */}
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                1. Información del Centro
              </Typography>
              {/* Fila 1: Nombre, Abreviatura, Horarios */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      placeholder="Ingrese la descripción del centro"
                      value={editFormData.nombre}
                      onChange={(e) => handleEditInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Inicio de Atención" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={editFormData.inicioAtencion}
                      onChange={(e) => handleEditInputChange('inicioAtencion', e.target.value)}
                      error={!!errors.inicioAtencion}
                      helperText={errors.inicioAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fin de Atención" required sx={{flex:1}}>
                    <TextField
                      fullWidth
                      required
                      type="time"
                      value={editFormData.finAtencion}
                      onChange={(e) => handleEditInputChange('finAtencion', e.target.value)}
                      error={!!errors.finAtencion}
                      helperText={errors.finAtencion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Abreviatura" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: CMB-CENTRAL"
                      value={editFormData.abreviatura}
                      onChange={(e) => handleEditInputChange('abreviatura', e.target.value)}
                      error={!!errors.abreviatura}
                      helperText={errors.abreviatura}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField>
                    {/* Espacio vacío para alinear con la fila superior */}
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
                      placeholder="Ingrese la descripción del centro"
                      value={editFormData.descripcion}
                      onChange={(e) => handleEditInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
            </Paper>

            {/* Sección 2: Dirección del Centro */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                2. Dirección del Centro
              </Typography>
              <FieldRow>
                  <ResponsiveField label="Dirección" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese la dirección completa"
                      value={editFormData.direccion}
                      onChange={(e) => handleEditInputChange('direccion', e.target.value)}
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Teléfono" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Número de teléfono"
                      value={editFormData.telefono}
                      onChange={(e) => handleEditInputChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="RUC">
                    <TextField
                      fullWidth
                      placeholder="Número de RUC"
                      value={editFormData.ruc}
                      onChange={(e) => handleEditInputChange('ruc', e.target.value)}
                      error={!!errors.ruc}
                      helperText={errors.ruc}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais} size="small">
                      <Select
                        value={editFormData.pais}
                        onChange={(e) => handleEditSelectChangeWithCascade('pais', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.pais ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar país</MenuItem>
                        {Array.isArray(paisesD) && paisesD.map(pais => (
                          <MenuItem key={pais.parameterid} value={pais.parameterid}>
                            {pais.value1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Departamento" required>
                    <FormControl fullWidth required error={!!errors.departamento} size="small">
                      <Select
                        value={editFormData.departamento}
                        onChange={(e) => handleEditSelectChangeWithCascade('departamento', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.departamento ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar departamento</MenuItem>
                        {Array.isArray(departamentosD) && departamentosD.map(departamento => (
                          <MenuItem key={departamento.parameterid} value={departamento.parameterid?.toString()}>
                            {departamento.value1}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.departamento}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                              
                </FieldRow>

                <FieldRow>
                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required error={!!errors.provincia} size="small">
                      <Select
                        value={editFormData.provincia}
                        onChange={(e) => handleEditSelectChangeWithCascade('provincia', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.provincia ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar provincia</MenuItem>
                        {Array.isArray(provinciasEditDisponibles) && provinciasEditDisponibles.map(provincia => (
                          <MenuItem key={provincia.parameterid} value={provincia.parameterid}>
                            {provincia.value1}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.provincia}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required error={!!errors.distrito} size="small">
                      <Select
                        value={editFormData.distrito}
                        onChange={(e) => handleEditSelectChangeWithCascade('distrito', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.distrito ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar distrito</MenuItem>
                        {Array.isArray(distritosEditDisponibles) && distritosEditDisponibles.map(distrito => (
                          <MenuItem key={distrito.parameterid} value={distrito.parameterid}>
                            {distrito.value1}
                          </MenuItem>
                        ))}
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
        inert={!openDetailModal}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#2184be', 
          color: 'white' 
        }}>
          <Typography variant="h6" fontWeight="bold">Detalles del Centro</Typography>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedCentro && (
            <>
              {/* Sección 1: Información del Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Centro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Nombre:</strong> {selectedCentro.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>RUC:</strong> {selectedCentro.ruc}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedCentro.descripcion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Abreviatura:</strong> {selectedCentro.abreviatura}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Inicio de Atención:</strong> {selectedCentro.inicioAtencion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body1">
                      <strong>Fin de Atención:</strong> {selectedCentro.finAtencion}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Dirección del Centro */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Dirección del Centro
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Direccion:</strong> {selectedCentro.direccion}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Teléfono:</strong> {selectedCentro.telefono}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Ubicación:</strong> {getUbicacionTexto(selectedCentro)}
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
        inert={!openDeleteConfirm}
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
            ¿Está seguro de que desea eliminar el centro{' '}
            <strong>"{selectedCentro?.nombre}"</strong>?
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
            onClick={handleDeleteCentro}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Centros;