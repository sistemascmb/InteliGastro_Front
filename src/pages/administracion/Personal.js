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
import { centrosService } from '../../services/centrosService';
import { ubigeoService } from '../../services/ubigeoService';

// Componente para mostrar el valor de un parámetro
const ParametroTexto = ({ id }) => {
  const [valor, setValor] = useState('');

  useEffect(() => {
    const cargarParametro = async () => {
      if (!id) {
        setValor('');
        return;
      }

      try {
        // Si id es un número, lo usamos directamente
        if (id && !isNaN(id)) {
          try {
            const response = await centrosService.getSystemParameterId(id);
            if (response?.data?.value1) {
              setValor(response.data.value1);
              return;
            }
          } catch (error) {
            console.error(`Error al obtener parámetro con ID ${id}:`, error);
          }
        }

        // Si id es texto, intentamos obtener el ID numérico correspondiente
        const parametrosMap = {
          estado: 10006,    // Estados (activo/inactivo)
          genero: 10000,    // Géneros
          titulo: 10009,    // Títulos
          tipoTrabajo: 10003, // Tipos de trabajo
          pais: 1,         // Países
          departamento: 2,  // Departamentos
        };

        // Intentamos cargar todos los parámetros del tipo correspondiente
        for (const [tipo, parametroId] of Object.entries(parametrosMap)) {
          try {
            let response;
            if (tipo === 'departamento') {
              response = await centrosService.getAllSystemParameterIdRest(parametroId);
            } else {
              response = await centrosService.getAllSystemParameterId(parametroId);
            }

            const parametros = response.data || [];
            const parametro = parametros.find(p => {
              if (!p || !p.value1) return false;
              const matchValue = p.value1.toLowerCase() === (id || '').toLowerCase();
              const matchId = p.id && id ? p.id.toString() === id.toString() : false;
              return matchValue || matchId;
            });

            if (parametro) {
              setValor(parametro.value1);
              return;
            }
          } catch (innerError) {
            console.error(`Error al cargar parámetros de tipo ${tipo}:`, innerError);
          }
        }

        // Si no encontramos el parámetro en ninguna lista, mostramos el valor original
        setValor(id);
      } catch (error) {
        console.error('Error al obtener parámetro:', error);
        setValor(id); // En caso de error, mostramos el valor original
      }
    };

    cargarParametro();
  }, [id]);

  return valor || 'No especificado';
};

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
  const [sexosD, setGenerosCargados] = useState([]);
  const [centrosD, setCentrosCargados] = useState([]);
  const [EstadoD, setEstadoCargados] = useState([]);
  const [TituloD, setTituloCargados] = useState([]);
  const [TipoTrabajoD, setTipoTrabajoCargados] = useState([]);
  const [paisesD, setPaisesCargados] = useState([]);
  const [departamentosD, setDepartamentosCargados] = useState([]);
  const [provinciasD, setProvinciasCargados] = useState([]);
  const [distritosD, setDistritosCargados] = useState([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState([]);
   const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
   const [provinciasEditDisponibles, setProvinciasEditDisponibles] = useState([]);
    const [distritosEditDisponibles, setDistritosEditDisponibles] = useState([]);
   
  // Datos simulados de centros (normalmente vendrían del backend)

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState(null);

const cargarGeneros = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(10000);
      console.log('✅ Respuesta de Géneros:', responseSystemParameter);
      setGenerosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar géneros:', error);
      setError(`Error al cargar géneros: ${error.message}`);
    }
  };

  const cargarCentros = async () => {
    try {
      const responseSystemParameter = await centrosService.getAll();
      console.log('✅ Respuesta de Centros:', responseSystemParameter);
      setCentrosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar Centros:', error);
      setError(`Error al cargar Centros: ${error.message}`);
    }
  };

  const cargarEstados = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(10006);
      console.log('✅ Respuesta de Géneros:', responseSystemParameter);
      setEstadoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar estados:', error);
      setError(`Error al cargar estados: ${error.message}`);
    }
  };

  const cargarTitulos = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(10009);
      console.log('✅ Respuesta de Titulos:', responseSystemParameter);
      setTituloCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar titulos:', error);
      setError(`Error al cargar titulos: ${error.message}`);
    }
  };
  const tipoTrabajo = async () => {
    try {
      const responseSystemParameter = await centrosService.getAllSystemParameterId(10003);
      console.log('✅ Respuesta de tipoTrabajo:', responseSystemParameter);
      setTipoTrabajoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                       responseSystemParameter?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar tipoTrabajo:', error);
      setError(`Error al cargar tipoTrabajo: ${error.message}`);
    }
  };
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

  // Estado para el formulario
  const [formData, setFormData] = useState({
    centroId: '',
    documento: '',
    nombres: '',
    apellidos: '',
    fecNac: '',
    genero: '',
    telefono: '',
    celular: '',
    correo: '',
    direccion: '',
    estado: '10007', // activo
    titulo: '',
    grado: '',
    nLicencia: '',
    tipoTrabajo: '',
    departamento: '',
    provincia: '',
    distrito: '',
    pais: '',
    tipoDoc: '',
  });

  const [editFormData, setEditFormData] = useState({
      centroId: '',
      documento: '',
      nombres: '',
      apellidos: '',
      fecNac: '',
      genero: '',
      telefono: '',
      celular: '',
      correo: '',
      direccion: '',
      estado: '10007', // activo
      titulo: '',
      grado: '',
      nLicencia: '',
      tipoTrabajo: '',
      departamento: '',
      provincia: '',
      distrito: '',
      pais: '',
      tipoDoc: '',
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

      // Obtener los nombres de los centros para cada personal
      const personalConCentros = await Promise.all(
        response.data.map(async (persona) => {
          try {
            const centroDatos = await centrosService.getById(persona.centroId);
            const parTipoTrabj = await centrosService.getSystemParameterId(persona.tipoTrabajo);
            const sexoTrabj = await centrosService.getSystemParameterId(persona.genero);

            // Transformar el estado de texto a ID numérico
            const estadoNumerico = persona.estado === 'activo' ? '10007' : '10008';
            
            return {
              ...persona,
              nombreCentro: centroDatos.data.nombre,
              tipo: parTipoTrabj.data.value1,
              sexo: sexoTrabj.data.value1,
              estado: estadoNumerico // Usar el ID numérico en lugar del texto
            };
          } catch (error) {
            console.error(`Error al obtener centro ${persona.centroId}:`, error);
            return {
              ...persona,
              nombreCentro: 'Centro no encontrado',
              tipo: 'Tipo no especificado',
              sexo: 'No especificado',
              estado: '10007' // Por defecto activo si hay error
            };
          }
        })
      );

      console.log('✅ Personal cargado:', personalConCentros);
      setPersonal(personalConCentros || []);

    } catch (error) {
      console.error('❌ Error al cargar personal:', error);
      setError(`Error al cargar personal: ${error.message}`);

    } finally {
      setLoading(false);
    }
  };

  // Cargar personal al montar el componente
  useEffect(() => {
    loadPersonal();
    cargarGeneros();
    cargarCentros();
    cargarEstados();
    cargarTitulos();
    tipoTrabajo();
    cargarPaises();
    cargarDepartamentos();
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
      centroId: '',
      documento: '',
      nombres: '',
      apellidos: '',
      fecNac: '',
      genero: '',
      telefono: '',
      celular: '',
      correo: '',
      direccion: '',
      estado: '10007', // activo
      titulo: '',
      grado: '',
      nLicencia: '',
      tipoTrabajo: '',
      departamento: '',
      provincia: '',
      distrito: '',
      pais: '',
      tipoDoc: '',
    });
    setErrors({});
  };

  // Función para limpiar el formulario de edición
  const clearEditForm = () => {
    setEditFormData({
      centroId: '',
      documento: '',
      nombres: '',
      apellidos: '',
      fecNac: '',
      genero: '',
      telefono: '',
      celular: '',
      correo: '',
      direccion: '',
      estado: '10007', // activo
      titulo: '',
      grado: '',
      nLicencia: '',
      tipoTrabajo: '',
      departamento: '',
      provincia: '',
      distrito: '',
      pais: '',
      tipoDoc: '',
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
  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Información del Centro
    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento es obligatorio';
    }
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Nombres es obligatoria';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Apellidos es obligatoria';
    }
    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular es obligatorio';
    }
   
    // Dirección del Centro
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }
    // Validación del estado
    if (!formData.estado || !['10007', '10008'].includes(formData.estado)) {
      newErrors.estado = 'Estado debe ser un valor válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    // Información del Centro
    if (!editFormData.documento.trim()) {
      newErrors.documento = 'Documento es obligatorio';
    }
    if (!editFormData.nombres.trim()) {
      newErrors.nombres = 'Nombres es obligatoria';
    }
    if (!editFormData.apellidos.trim()) {
      newErrors.apellidos = 'Apellidos es obligatoria';
    }
    if (!editFormData.celular.trim()) {
      newErrors.celular = 'Celular es obligatorio';
    }
   
    // Dirección del Centro
    if (!editFormData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!editFormData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es obligatorio';
    }
    // Validación del estado
    if (!editFormData.estado || !['10007', '10008'].includes(editFormData.estado.toString())) {
      newErrors.estado = 'Estado debe ser un valor válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Funciones para manejar modales
  const handleOpenEditModal = async (person) => {
    setSelectedPersonal(person);

    try {
          // Inicializar editFormData con los valores del centro
          const initialFormData = {
            centroId: person.centroId,
            documento: person.documento,
            nombres: person.nombres,
            apellidos: person.apellidos,
            fecNac: person.fecNac ? new Date(person.fecNac).toISOString().split('T')[0] : '',
            genero: person.genero,
            telefono: person.telefono,
            celular: person.celular,
            correo: person.correo,
            direccion: person.direccion,
            estado: person.estado || '10007', // Usar 10007 como valor por defecto (activo)
            titulo: person.titulo,
            grado: person.grado,
            nLicencia: person.nLicencia,
            tipoTrabajo: person.tipoTrabajo,
            departamento: '',  // Se establecerá después de la validación
            provincia: '',     // Se establecerá después de cargar las provincias
            distrito: '',      // Se establecerá después de cargar los distritos
            pais: person.pais || '',
            tipoDoc: person.tipoDoc
          };
          setEditFormData(initialFormData);
    
          // Verificar si el departamento existe en departamentosD y obtener el ID correcto
          let departamentoId = '';
          if (person.departamento) {
            const departamentoStr = person.departamento.toString();
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
    
              if (person.provincia) {
                const provinciaStr = person.provincia.toString();
                const provinciaEncontrada = provinciasData.find(prov => 
                  prov.parameterid?.toString() === provinciaStr
                );
    
                if (provinciaEncontrada) {
                  initialFormData.provincia = provinciaEncontrada.parameterid;
    
                  // Cargar distritos
                  const responseDistritos = await centrosService.getAllSystemParameterIdParent(2, provinciaEncontrada.parameterid);
                  const distritosData = Array.isArray(responseDistritos) ? responseDistritos : responseDistritos?.data || [];
                  setDistritosEditDisponibles(distritosData);
    
                  if (person.distrito) {
                    const distritoStr = person.distrito.toString();
                    const distritoEncontrado = distritosData.find(dist => 
                      dist.parameterid?.toString() === distritoStr
                    );
    
                    if (distritoEncontrado) {
                      initialFormData.distrito = distritoEncontrado.parameterid;
                    } else {
                      console.warn('Distrito no encontrado:', {
                        distrito: person.distrito,
                        distritoStr,
                        opcionesDisponibles: distritosData.map(d => d.parameterid)
                      });
                    }
                  }
                } else {
                  console.warn('Provincia no encontrada:', {
                    provincia: person.provincia,
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
                departamento: person.departamento,
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
    
          // Asegurarnos de que el estado se mantenga como ID numérico
    initialFormData.estado = person.estado || '10007';

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
          console.log('📤 Creando Personal...');
  
          // Asegurarse de que estado sea un ID numérico
          const personalData = {
            ...formData,
            estado: formData.estado || '10007' // Usar 10007 (activo) como valor por defecto
          };
  
          const nuevoPersonal = await staffService.create(personalData);
          console.log('✅ Personal creado:', nuevoPersonal);
  
          // Recargar la lista de centros
          await loadPersonal();
  
          clearForm();
          // Cambiar automáticamente al tab de lista
          setActiveTab(0);
  
        } catch (error) {
          console.error('❌ Error al crear Personal:', error);
          setError(`Error al crear Personal: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

  // Función para editar personal
  const handleEditPersonal = async (e) => {
    e.preventDefault();

    if (validateEditForm()) {
      try {
        setLoading(true);
        console.log('📤 Editando personal...');

        // Asegurarse de que estado sea un ID numérico
        const formDataToSend = {
          ...editFormData,
          estado: editFormData.estado === 10007 ? true : false
        };
        const personalActualizado = await staffService.update(selectedPersonal.id, formDataToSend);
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
    (person?.Nombres || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person?.Apellidos || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person?.Documento || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person?.Correo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre legible de ubicación
  
  const getUbicacionTexto = (personal) => {
      return ubigeoService.formatUbicacionCompleta(
        personal.pais,
        personal.departamento,
        personal.provincia,
        personal.distrito
      );
    };

    const [parametrosCache, setParametrosCache] = useState({});

     const getParametroTexto = (id) => {
       const [valor, setValor] = useState('');

       useEffect(() => {
         const cargarParametro = async () => {
           try {
             if (!id) return;
             
             // Si ya tenemos el valor en cache, lo usamos
             if (parametrosCache[id]) {
               setValor(parametrosCache[id]);
               return;
             }

             const response = await centrosService.getSystemParameterId(id);
             const nuevoValor = response.data.value1;
             
             // Actualizamos el cache
             setParametrosCache(prev => ({
               ...prev,
               [id]: nuevoValor
             }));
             
             setValor(nuevoValor);
           } catch (error) {
             console.error('Error al obtener parámetro:', error);
             setValor('No especificado');
           }
         };

         cargarParametro();
       }, [id]);

       return valor;
     };


  // Función para cambiar tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getEstadoColor = (estado) => {
    return estado === '10007' ? 'success' : 'error';
  };

  const getSexoColor = (estado) => {
    return estado === 'FEMENINO' ? 'error' : 'info';
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
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      error={!!errors.nombres}
                      helperText={errors.nombres}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellido" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el apellido"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      error={!!errors.apellidos}
                      helperText={errors.apellidos}
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
                      value={formData.fecNac}
                      onChange={(e) => handleInputChange('fecNac', e.target.value)}
                      error={!!errors.fecNac}
                      helperText={errors.fecNac}
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
                        {Array.isArray(sexosD) && sexosD.map(sexo => (
                        <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                              {sexo.value1 || ''}
                          </MenuItem>
                        ))}
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
                    <FormControl fullWidth required error={!!errors.centroId} size="small">
                      <Select
                        value={formData.centroId}
                        onChange={(e) => handleInputChange('centroId', e.target.value)}
                        displayEmpty
                        defaultValue="1"
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.centroId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar centro</MenuItem>
                        {Array.isArray(centrosD) && centrosD.map(centro => (
                        <MenuItem key={centro.id} value={centro.id}>
                              {centro.nombre || ''}
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
                        <MenuItem value="">Seleccionar estatus</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                        <MenuItem key={estado.parameterid} value={estado.parameterid}>
                              {estado.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Título" required>
                    <FormControl fullWidth required error={!!errors.titulo} size="small">
                      <Select
                        value={formData.titulo}
                        onChange={(e) => handleInputChange('titulo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.titulo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar título</MenuItem>
                        {Array.isArray(TituloD) && TituloD.map(titulo => (
                        <MenuItem key={titulo.parameterid} value={titulo.parameterid}>
                              {titulo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                  
                  <ResponsiveField label="Grado" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: Bachiller, Doctora, Mg."
                      value={formData.grado}
                      onChange={(e) => handleInputChange('grado', e.target.value)}
                      error={!!errors.grado}
                      helperText={errors.grado}
                      size="small"
                    />
                  </ResponsiveField>

                  
                </FieldRow>

                {/* Fila 2: Número de Licencia, Tipo */}
                <FieldRow>
                  <ResponsiveField label="Número de Licencia" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: LIC-001-2024"
                      value={formData.nLicencia}
                      onChange={(e) => handleInputChange('nLicencia', e.target.value)}
                      error={!!errors.nLicencia}
                      helperText={errors.nLicencia}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Tipo" required>
                    <FormControl fullWidth required error={!!errors.tipoTrabajo} size="small">
                      <Select
                        value={formData.tipoTrabajo}
                        onChange={(e) => handleInputChange('tipoTrabajo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.tipoTrabajo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(TipoTrabajoD) && TipoTrabajoD.map(tipoTrabajo => (
                        <MenuItem key={tipoTrabajo.parameterid} value={tipoTrabajo.parameterid}>
                              {tipoTrabajo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Fechas de Contratación y Cese 
                <FieldRow>
                  <ResponsiveField label="Fecha de Contratación" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.FechaContratacion}
                      onChange={(e) => handleInputChange('FechaContratacion', e.target.value)}
                      error={!!errors.FechaContratacion}
                      helperText={errors.FechaContratacion}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Cese">
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.FechaCese}
                      onChange={(e) => handleInputChange('FechaCese', e.target.value)}
                      error={!!errors.FechaCese}
                      helperText={errors.FechaCese}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>
                </FieldRow>*/}
              </Paper>

              {/* Sección 4: Dirección */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  4. Dirección
                </Typography>

                

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
                      {errors.Departamento && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.Departamento}</Typography>}
                      </FormControl>
                  </ResponsiveField>
                                          
                </FieldRow>

                <FieldRow>
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
                      {errors.Provincia && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.Provincia}</Typography>}
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
                      {errors.Distrito && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.Distrito}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

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
{/*
                  <ResponsiveField label="Código Postal" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Código postal"
                      value={formData.CodPostal}
                      onChange={(e) => handleInputChange('CodPostal', e.target.value)}
                      error={!!errors.CodPostal}
                      helperText={errors.CodPostal}
                      size="small"
                    />
                  </ResponsiveField> */}
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
                      <TableCell><strong>Nombres</strong></TableCell>
                      <TableCell><strong>Sexo</strong></TableCell>
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
                          <TableCell>{person.nombres} {person.apellidos}</TableCell>
                          <TableCell>
                            <Chip
                              label={person.sexo === 'MASCULINO' ? 'M' : person.sexo === 'FEMENINO' ? 'F' : '-'}
                              color={getSexoColor(person.sexo)}
                              size="small"
                              sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                            />
                          </TableCell>

                          <TableCell>{person.nombreCentro}</TableCell>
                          <TableCell>{person.tipo}</TableCell>
                          <TableCell>
                            <Chip
                              label={person.estado === '10007' ? 'Activo' : person.estado === '10008' ? 'Inactivo' : 'En Licencia'}
                              color={getEstadoColor(person.estado)}
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
                      value={editFormData.documento}
                      onChange={(e) => handleEditInputChange('documento', e.target.value)}
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
                      value={editFormData.nombres}
                      onChange={(e) => handleEditInputChange('nombres', e.target.value)}
                      error={!!errors.nombres}
                      helperText={errors.nombres}
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
                      value={editFormData.apellidos}
                      onChange={(e) => handleEditInputChange('apellidos', e.target.value)}
                      error={!!errors.apellidos}
                      helperText={errors.apellidos}
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
                      value={editFormData.fecNac}
                      onChange={(e) => handleEditInputChange('fecNac', e.target.value)}
                      error={!!errors.fecNac}
                      helperText={errors.fecNac}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.Genero}>
                      <Select
                        value={editFormData.genero}
                        onChange={(e) => handleEditSelectChangeWithCascade('genero', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.genero ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar género</MenuItem>
                        {Array.isArray(sexosD) && sexosD.map(sexo => (
                        <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                              {sexo.value1 || ''}
                          </MenuItem>
                        ))}
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
                    <FormControl fullWidth required error={!!errors.CentroId}>
                      <Select
                        value={editFormData.centroId}
                        onChange={(e) => handleEditSelectChangeWithCascade('centroId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.centroId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {Array.isArray(centrosD) && centrosD.map(centro => (
                        <MenuItem key={centro.id} value={centro.id}>
                              {centro.nombre || ''}
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
                    <FormControl fullWidth required error={!!errors.estado}>
                      <Select
                        value={editFormData.estado}
                        onChange={(e) => handleEditSelectChangeWithCascade('estado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.estado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                        <MenuItem key={estado.parameterid} value={estado.parameterid}>
                              {estado.value1 || ''}
                          </MenuItem>
                        ))}
                        
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Titulo" required>
                    <FormControl fullWidth required error={!!errors.titulo}>
                      <Select
                        value={editFormData.titulo}
                        onChange={(e) => handleEditSelectChangeWithCascade('titulo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.titulo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar título</MenuItem>
                        {Array.isArray(TituloD) && TituloD.map(titulo => (
                        <MenuItem key={titulo.parameterid} value={titulo.parameterid}>
                              {titulo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Grado" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: Doctor, Doctora, Lic."
                      value={editFormData.grado}
                      onChange={(e) => handleEditInputChange('grado', e.target.value)}
                      error={!!errors.grado}
                      helperText={errors.grado}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  
                </FieldRow>

                {/* Fila 2: Número de Licencia, Tipo, Fecha de Contratación */}
                <FieldRow>
                  <ResponsiveField label="Número de Licencia" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ej: LIC-001-2024"
                      value={editFormData.nLicencia}
                      onChange={(e) => handleEditInputChange('nLicencia', e.target.value)}
                      error={!!errors.nLicencia}
                      helperText={errors.nLicencia}
                      sx={{
                        '& .MuiOutlinedInput-input::placeholder': {
                          color: '#999',
                          opacity: 1
                        }
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Tipo" required>
                    <FormControl fullWidth required error={!!errors.tipoTrabajo}>
                      <Select
                        value={editFormData.tipoTrabajo}
                        onChange={(e) => handleEditSelectChangeWithCascade('tipoTrabajo', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.tipoTrabajo ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar Tipo</MenuItem>
                        {Array.isArray(TipoTrabajoD) && TipoTrabajoD.map(tipo => (
                        <MenuItem key={tipo.parameterid} value={tipo.parameterid}>
                              {tipo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
{/*
                  <ResponsiveField label="Fecha de Contratación" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.FechaContratacion}
                      onChange={(e) => handleInputChange('FechaContratacion', e.target.value)}
                      error={!!errors.FechaContratacion}
                      helperText={errors.FechaContratacion}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>*/}
                </FieldRow>

                {/* Fila 3: Fecha de Cese 
                <FieldRow>
                  <ResponsiveField label="Fecha de Cese">
                    <TextField
                      fullWidth
                      type="date"
                      value={formData.FechaCese}
                      onChange={(e) => handleInputChange('FechaCese', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="  ">
                    {/* Espacio vacío para mantener alineación 
                  </ResponsiveField>
                </FieldRow> */}
              </Box>
            </Paper>

            {/* Dirección */}
            <Paper sx={{ mb: 3, boxShadow: 2 }}>
              <SectionHeader title="Dirección" />
              <Box sx={{ p: 4 }}>
                
                

                {/* Fila 2: País, Departamento */}
                <FieldRow>
                  <ResponsiveField label="País" required>
                    <FormControl fullWidth required error={!!errors.pais}>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {Array.isArray(departamentosD) && departamentosD.map(departamento => (
                          <MenuItem key={departamento.parameterid} value={departamento.parameterid?.toString()}>
                            {departamento.value1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Provincia, Distrito */}
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {Array.isArray(provinciasEditDisponibles) && provinciasEditDisponibles.map(provincia => (
                          <MenuItem key={provincia.parameterid} value={provincia.parameterid}>
                            {provincia.value1}
                          </MenuItem>
                        ))}
                      </Select>
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
                        <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                        {Array.isArray(distritosEditDisponibles) && distritosEditDisponibles.map(distrito => (
                          <MenuItem key={distrito.parameterid} value={distrito.parameterid}>
                              {distrito.value1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 1: Dirección, Código Postal */}
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
                      value={editFormData.telefono}
                      onChange={(e) => handleEditInputChange('telefono', e.target.value)}
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
                      value={editFormData.celular}
                      onChange={(e) => handleEditInputChange('Celular', e.target.value)}
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
                      value={editFormData.correo}
                      onChange={(e) => handleEditInputChange('correo', e.target.value)}
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
                      <strong>Nombre Completo:</strong> {selectedPersonal.nombres} {selectedPersonal.apellidos}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Fecha de Nacimiento:</strong> {selectedPersonal.fecNac}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        <strong>Género:</strong> <ParametroTexto id={selectedPersonal?.genero} />
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
                      <strong>Centro:</strong> {selectedPersonal.nombreCentro}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                       <strong>Estatus:</strong> <ParametroTexto id={selectedPersonal?.estado} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                       <strong>Título:</strong> <ParametroTexto id={selectedPersonal?.titulo} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                       <strong>Grado:</strong> <ParametroTexto id={selectedPersonal?.grado} />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                       <strong>Número de Licencia:</strong> {selectedPersonal?.nLicencia}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                       <strong>Tipo:</strong> <ParametroTexto id={selectedPersonal?.tipoTrabajo} />
                    </Typography>
                  </Grid>
                  {/*<Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Fecha de Contratación:</strong> {selectedPersonal.FechaContratacion}
                    </Typography>
                  </Grid>
                  {selectedPersonal.FechaCese && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1">
                        <strong>Fecha de Cese:</strong> {selectedPersonal.FechaCese}
                      </Typography>
                    </Grid>
                  )}*/}
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
            <strong>"{selectedPersonal?.Nombres} {selectedPersonal?.Apellidos}"</strong>?
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
