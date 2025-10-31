import { useState, useCallback, memo, useEffect } from 'react';
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
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { patientsService } from '../../services/patientsService';
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
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sexosD, setGenerosCargados] = useState([]);
  const [centrosD, setCentrosCargados] = useState([]);
  const [EstadoD, setEstadoCargados] = useState([]);
  const [EstadoMaritalD, setEstadoMaritalCargados] = useState([]);
  const [TipoDocumentoD, setTipoDocumentoCargados] = useState([]);
  const [paisesD, setPaisesCargados] = useState([]);
  const [departamentosD, setDepartamentosCargados] = useState([]);
  const [provinciasD, setProvinciasCargados] = useState([]);
  const [distritosD, setDistritosCargados] = useState([]);
  const [distritosDisponibles, setDistritosDisponibles] = useState([]);
  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [provinciasEditDisponibles, setProvinciasEditDisponibles] = useState([]);
  const [distritosEditDisponibles, setDistritosEditDisponibles] = useState([]);
   
  // Estados para modales (solo editar, detallar y eliminar)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPaciente, setselectedPaciente] = useState(null);

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
        console.log('✅ Respuesta de Estados:', responseSystemParameter);
        const estados = Array.isArray(responseSystemParameter) ? responseSystemParameter : responseSystemParameter?.data || [];
        // Asegurarse de que los estados incluyan los IDs 10007 y 10008
        const estadosNecesarios = estados.filter(estado => estado.parameterid === '10007' || estado.parameterid === '10008');
        if (estadosNecesarios.length < 2) {
          console.warn('⚠️ No se encontraron todos los estados necesarios (10007 y 10008)');
        }
        setEstadoCargados(estados);
      } catch (error) {
        console.error('❌ Error al cargar estados:', error);
        setError(`Error al cargar estados: ${error.message}`);
      }
    };

    const cargarEstadoMarital = async () => {
        try {
          const responseSystemParameter = await centrosService.getAllSystemParameterId(10031);
          console.log('✅ Respuesta de EstadoMarital:', responseSystemParameter);
          setEstadoMaritalCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || []);
        } catch (error) {
          console.error('❌ Error al cargar EstadoMarital:', error);
          setError(`Error al cargar EstadoMarital: ${error.message}`);
        }
      };
  const cargartipoDocumento = async () => {
        try {
          const responseSystemParameter = await centrosService.getAllSystemParameterId(10026);
          console.log('✅ Respuesta de tipoDocumento:', responseSystemParameter);
          setTipoDocumentoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || []);
        } catch (error) {
          console.error('❌ Error al cargar tipoDocumento:', error);
          setError(`Error al cargar tipoDocumento: ${error.message}`);
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
    // Información Básica
    typeDoc: '',
    documentNumber: '',
    names: '',
    lastNames: '',
    birthdate: '',
    gender: '',
    statusMarital: '',
    nationality: '',
    centroId: '',
    address: '',
    pais: '',
    department: '',
    province: '',
    district: '',
    phoneNumber: '',
    email: '',
    status: '',
    medicalHistory: '',
  });

  const [editFormData, setEditFormData] = useState({
    // Información Básica
    typeDoc: '',
    documentNumber: '',
    names: '',
    lastNames: '',
    birthdate: '',
    gender: '',
    statusMarital: '',
    nationality: '',
    centroId: '',
    address: '',
    pais: '',
    department: '',
    province: '',
    district: '',
    phoneNumber: '',
    email: '',
    status: '',
    medicalHistory: '',
  });

  const [errors, setErrors] = useState({});
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para cargar pacientes del backend
  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando pacientes desde el backend...');
      const response = await patientsService.getAll();

      // Obtener los nombres de los centros para cada paciente
            const listasPacient = await Promise.all(
              response.data.map(async (persona) => {
                try {
                  const centroDatos = await centrosService.getById(persona.centroId);
                  const tipoDoc = await centrosService.getSystemParameterId(persona.typeDoc);
                  const sexoTrabj = await centrosService.getSystemParameterId(persona.gender);
                  const statusMarital = await centrosService.getSystemParameterId(persona.statusMarital);

                  // Transformar el estado a ID numérico, manejando tanto booleano como texto
                  const estadoNumerico = (persona.status === true || persona.status === 'activo') ? '10007' : '10008';
                  
                  return {
                    ...persona,
                    nombreCentro: centroDatos.data.nombre,
                    tipoDocumento: tipoDoc.data.value1,
                    sexo: sexoTrabj.data.value1,
                    estado: estadoNumerico, // Usar el ID numérico en lugar del texto
                    status: estadoNumerico, // Asegurar que ambos campos tengan el mismo valor
                    estadoCivil: statusMarital.data.value1,

                  };
                } catch (error) {
                  console.error(`Error al obtener centro ${persona.centroId}:`, error);
                  return {
                    ...persona,
                    nombreCentro: 'Centro no encontrado',
                    tipoDocumento: 'Tipo Doc no especificado',
                    sexo: 'No especificado',
                    estado: '10007', // Por defecto activo si hay error
                    estadoCivil: 'Estado Civil no encontrado.'
                  };
                }
              })
            );


      console.log('✅ Pacientes cargados:', listasPacient);
      console.log('📊 Número de pacientes recibidos:', listasPacient?.length || 0);
      console.log('🔍 Primer paciente:', listasPacient[0]);

      setPacientes(listasPacient || []);

      // Log después de setear
      console.log('🎯 Estado de pacientes actualizado. Longitud:', response.data?.length || 0);

    } catch (error) {
      console.error('❌ Error al cargar pacientes:', error);
      setError(`Error al cargar pacientes: ${error.message}`);

      // Datos de prueba en caso de error (para desarrollo)
      const datosPrueba = [
        {
          pacientid: 999,
          typeDoc: 1,
          documentNumber: '12345678',
          names: 'DEMO',
          lastNames: 'USUARIO',
          birthdate: '1990-01-01T00:00:00.000Z',
          gender: 1,
          statusMarital: 1,
          nationality: 'PERUANO',
          centroId: 1,
          address: 'DIRECCIÓN DEMO',
          pais: 1,
          department: 1,
          province: 1,
          district: 1,
          phoneNumber: '999999999',
          email: 'demo@email.com',
          status: true,
          medicalHistory: 'DEMO001',
          createdAt: '2025-01-01T00:00:00.000Z',
          createdBy: 'DEMO',
          isDeleted: false
        }
      ];
      setPacientes(datosPrueba);

    } finally {
      setLoading(false);
    }
  };

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPacientes();
    cargarGeneros();
    cargarCentros();
    cargarEstados();
    cargarEstadoMarital();
    cargartipoDocumento();
    cargarPaises();
    cargarDepartamentos();
  }, []);

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
      typeDoc: '',
      documentNumber: '',
      names: '',
      lastNames: '',
      birthdate: '',
      gender: '',
      statusMarital: '',
      nationality: '',
      centroId: '',
      address: '',
      pais: '',
      department: '',
      province: '',
      district: '',
      phoneNumber: '',
      email: '',
      status: '10007',
      medicalHistory: '',
    });
    setErrors({});
  };

  const clearEditForm = () => {
    setEditFormData({
      typeDoc: '',
      documentNumber: '',
      names: '',
      lastNames: '',
      birthdate: '',
      gender: '',
      statusMarital: '',
      nationality: '',
      centroId: '',
      address: '',
      pais: '',
      department: '',
      province: '',
      district: '',
      phoneNumber: '',
      email: '',
      status: '10007',
      medicalHistory: '',
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

// Función genérica para manejar cambios en campos de texto (formulario editar)
    const handleEditInputChange = useCallback((field, value) => {
      setEditFormData(prev => ({ ...prev, [field]: value }));
      // Limpiar error si existe
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }, [errors]);

  // Función para manejar cambios en selects con lógica de cascada
  const handleSelectChangeWithCascade = useCallback((field, value) => {
        // Lógica especial para cascading dropdowns UBIGEO
        if (field === 'pais') {
          setFormData(prev => ({
            ...prev,
            [field]: value,
            department: '',
            province: '',
            district: ''
          }));
          setProvinciasDisponibles([]);
          setDistritosDisponibles([]);
        } 
        
        if (field === 'department') {
          setFormData(prev => ({
            ...prev,
            [field]: value,
            province: '',
            district: ''
          }));
          
          if (value) {
            cargarProvincias(value);
          } else {
            setProvinciasCargados([]);
          }
          setDistritosDisponibles([]);
        } else if (field === 'province') {
          setFormData(prev => ({
            ...prev,
            [field]: value,
            district: ''
          }));
          if (value) {
            cargarDistritos(value);
          } else {
            setDistritosCargados([]);
          }
          setDistritosDisponibles([]);
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
                department: '',
                province: '',
                district: ''
              }));
              setProvinciasEditDisponibles([]);
              setDistritosEditDisponibles([]);
            } else if (field === 'department') {
              setEditFormData(prev => ({
                ...prev,
                [field]: value?.toString() || '',
                province: '',
                district: ''
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
            } else if (field === 'province') {
              setEditFormData(prev => ({
                ...prev,
                [field]: value,
                district: ''
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


  // Validación del formulario (para los campos obligatorios)
  const validateForm = () => {
    const newErrors = {};

    // Información del Paciente
    if (!formData.status) {
      newErrors.status = 'El estado es obligatorio';
    }

    if (!formData.typeDoc) {
      newErrors.typeDoc = 'El tipo de documento es obligatorio';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es obligatorio';
    }

    if (!formData.names.trim()) {
      newErrors.names = 'Los nombres son obligatorios';
    }

    if (!formData.lastNames.trim()) {
      newErrors.lastNames = 'Los apellidos son obligatorios';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.gender) {
      newErrors.gender = 'El género es obligatorio';
    }

    // Centro
    if (!formData.centroId) {
      newErrors.centroId = 'El nombre del centro es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    // Información del Paciente
    if (!editFormData.status) {
      newErrors.status = 'El estado es obligatorio';
    }

    if (!editFormData.typeDoc) {
      newErrors.typeDoc = 'El tipo de documento es obligatorio';
    }

    if (!editFormData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es obligatorio';
    }

    if (!editFormData.names.trim()) {
      newErrors.names = 'Los nombres son obligatorios';
    }

    if (!editFormData.lastNames.trim()) {
      newErrors.lastNames = 'Los apellidos son obligatorios';
    }

    if (!editFormData.birthdate) {
      newErrors.birthdate = 'La fecha de nacimiento es obligatoria';
    }

    if (!editFormData.gender) {
      newErrors.gender = 'El género es obligatorio';
    }

    // Centro
    if (!editFormData.centroId) {
      newErrors.centroId = 'El nombre del centro es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = async (paciente) => {
      setselectedPaciente(paciente);
  
      try {
            // Inicializar editFormData con los valores del centro
            const initialFormData = {
              typeDoc: paciente.typeDoc || paciente.tipoDocumento,
              centroId: paciente.centroId,
              documentNumber: paciente.documentNumber,
              names: paciente.names,
              lastNames: paciente.lastNames,
              birthdate: paciente.birthdate ? new Date(paciente.birthdate.split('T')[0]).toISOString().split('T')[0] : '',
              gender: paciente.gender,
              statusMarital : paciente.statusMarital,
              nationality: paciente.nationality,
              centroId: paciente.centroId,
              address: paciente.address,
              pais: paciente.pais || '',
              department: '',  // Se establecerá después de la validación
              province: '',     // Se establecerá después de cargar las provincias
              district: '',      // Se establecerá después de cargar los distritos
              phoneNumber: paciente.phoneNumber,
              email: paciente.email,
              status: paciente.status == '10007' ? 10007: 10008, // Usar el ID numérico del estado
              medicalHistory: paciente.medicalHistory,
            };
            setEditFormData(initialFormData);
      
            // Verificar si el departamento existe en departamentosD y obtener el ID correcto
            let departamentoId = '';
            if (paciente.department) {
              const departamentoStr = paciente.department.toString();
              const departamentoEncontrado = departamentosD.find(dep => 
                dep.parameterid?.toString() === departamentoStr
              );
      
              if (departamentoEncontrado) {
                departamentoId = departamentoEncontrado.parameterid?.toString();
                console.log('Departamento encontrado:', departamentoEncontrado);
                initialFormData.department = departamentoId;
      
                // Cargar provincias
                const responseProvincias = await centrosService.getAllSystemParameterIdParent(2, departamentoId);
                const provinciasData = Array.isArray(responseProvincias) ? responseProvincias : responseProvincias?.data || [];
                setProvinciasEditDisponibles(provinciasData);
      
                if (paciente.province) {
                  const provinciaStr = paciente.province.toString();
                  const provinciaEncontrada = provinciasData.find(prov => 
                    prov.parameterid?.toString() === provinciaStr
                  );
      
                  if (provinciaEncontrada) {
                    initialFormData.province = provinciaEncontrada.parameterid;
      
                    // Cargar distritos
                    const responseDistritos = await centrosService.getAllSystemParameterIdParent(2, provinciaEncontrada.parameterid);
                    const distritosData = Array.isArray(responseDistritos) ? responseDistritos : responseDistritos?.data || [];
                    setDistritosEditDisponibles(distritosData);
      
                    if (paciente.district) {
                      const distritoStr = paciente.district.toString();
                      const distritoEncontrado = distritosData.find(dist => 
                        dist.parameterid?.toString() === distritoStr
                      );
      
                      if (distritoEncontrado) {
                        initialFormData.district = distritoEncontrado.parameterid;
                      } else {
                        console.warn('Distrito no encontrado:', {
                          distrito: paciente.district,
                          distritoStr,
                          opcionesDisponibles: distritosData.map(d => d.parameterid)
                        });
                      }
                    }
                  } else {
                    console.warn('Provincia no encontrada:', {
                      provincia: paciente.province,
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
                  departamento: paciente.department,
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
      // Manejar tanto el caso booleano como el caso de texto
      //initialFormData.status = (paciente.status === true || paciente.status === 'activo') ? '10007' : '10008';

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
const handleCreatePaciente = async (e) => {
      e.preventDefault();
  
      if (validateForm()) {
        try {
          setLoading(true);
          console.log('📤 Creando paciente...');
  
          // Asegurarse de que estado sea un ID numérico
          const pacientData = {
            ...formData,
            status: formData.status === 10007 ? true : false 
          };
  
          const nuevoPaciente = await patientsService.create(pacientData);
          console.log('✅ Personal creado:', nuevoPaciente);
  
          // Recargar la lista de centros
          await loadPacientes();
  
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

  // Función para editar paciente
  const handleEditPaciente = async (e) => {
      e.preventDefault();
  
      if (validateEditForm()) {
        try {
          setLoading(true);
          console.log('📤 Editando paciente...');
  
          // Asegurarse de que estado sea un booleano (true para activo, false para inactivo)
          const formDataToSend = {
            ...editFormData,
            status: editFormData.status === 10007 ? true : false 
          };
          const pacienteActualizado = await patientsService.update(selectedPaciente.id, formDataToSend);
          console.log('✅ Paciente actualizado:', pacienteActualizado);
  
          // Recargar la lista de paciente
          await loadPacientes();
  
          handleCloseEditModal();
  
        } catch (error) {
          console.error('❌ Error al editar paciente:', error);
          setError(`Error al editar paciente: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

  

  // Función para eliminar paciente
  const handleDeletePaciente = async () => {
      try {
        setLoading(true);
        console.log('📤 Eliminando paciente...');
  
        await patientsService.delete(selectedPaciente.id);
        console.log('✅ Paciente eliminado');
  
        // Recargar la lista de paciente
        await loadPacientes();
  
        handleCloseDeleteConfirm();
  
      } catch (error) {
        console.error('❌ Error al eliminar Paciente:', error);
        setError(`Error al eliminar Paciente: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

  

  // Filtrar pacientes basado en la búsqueda
  console.log('🔍 DEBUG - Estado pacientes antes del filtro:', pacientes.length, pacientes);
  console.log('🔍 DEBUG - searchTerm:', searchTerm);

  const filteredPacientes = pacientes.filter(person => 
    (person?.names || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person?.lastNames || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person?.documentNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  console.log('🔍 DEBUG - Pacientes después del filtro:', filteredPacientes.length, filteredPacientes);

  // Función para obtener el nombre legible de ubicación
const getUbicacionTexto = (paciente) => {
      return ubigeoService.formatUbicacionCompleta(
        paciente.pais,
        paciente.department,
        paciente.province,
        paciente.district
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

 
  const getSexoColor = (sexo) => {
    // Asumiendo que el ID 10001 es masculino y 10002 es femenino en el SystemParameter
    return sexo === 10001 ? 'primary' : 'secondary';
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
                      value={formData.names}
                      onChange={(e) => handleInputChange('names', e.target.value)}
                      error={!!errors.names}
                      helperText={errors.names}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellidos" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los apellidos del paciente"
                      value={formData.lastNames}
                      onChange={(e) => handleInputChange('lastNames', e.target.value)}
                      error={!!errors.lastNames}
                      helperText={errors.lastNames}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.gender} size="small">
                      <Select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.gender ? '#000' : '#999'
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
                      {errors.gender && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.gender}</Typography>}
                    </FormControl>
                  </ResponsiveField>  
                </FieldRow>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento */}
                <FieldRow>
                  <ResponsiveField label="Tipo de Documento" required>
                    <FormControl fullWidth required error={!!errors.typeDoc} size="small">
                      <Select
                        value={formData.typeDoc}
                        onChange={(e) => handleInputChange('typeDoc', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.typeDoc ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(TipoDocumentoD) && TipoDocumentoD.map(sexo => (
                          <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                            {sexo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.typeDoc && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.typeDoc}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Número de Documento" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el número de documento"
                      value={formData.documentNumber}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      error={!!errors.documentNumber}
                      helperText={errors.documentNumber}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={formData.birthdate || ''}
                      onChange={(e) => handleEditInputChange('birthdate', e.target.value)}
                      error={!!errors.birthdate}
                      helperText={errors.birthdate}
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
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      error={!!errors.nationality}
                      helperText={errors.nationality}
                      size="small"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Estado Marital">
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.statusMarital}
                        onChange={(e) => handleInputChange('statusMarital', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.statusMarital ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        {Array.isArray(EstadoMaritalD) && EstadoMaritalD.map(sexo => (
                          <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                            {sexo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.status} size="small">
                      <Select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.status ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
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
                            
                            
              {/* Sección 3: Información de Residencia */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  3. Información de Residencia
                </Typography>

                {/*Calle, Pais, Departamento*/}
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
                    <FormControl fullWidth required error={!!errors.department} size="small">
                      <Select
                        value={formData.department}
                        onChange={(e) => handleSelectChangeWithCascade('department', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.department ? '#000' : '#999'
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
                      {errors.department && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.department}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                  
                </FieldRow>
                {/* Provincia, Distrito, Codigo postal*/}
                <FieldRow>
                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required error={!!errors.province} size="small">
                      <Select
                        value={formData.province}
                        onChange={(e) => handleSelectChangeWithCascade('province', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.province ? '#000' : '#999'
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
                      {errors.province && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.province}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required disabled={!formData.province} error={!!errors.district} size="small">
                      <Select
                        value={formData.district}
                        onChange={(e) => handleSelectChangeWithCascade('district', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.district ? '#000' : '#999'
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
                        {errors.district && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.district}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  
                </FieldRow>
                <FieldRow>
                  <ResponsiveField label="Direccion">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la Dirección "
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      error={!!errors.address}
                      helperText={errors.address}
                      size="small"
                    />
                  </ResponsiveField>

                </FieldRow>
              </Paper>

              {/* Sección 4: Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  4. Adicionales
                </Typography>
              
              <FieldRow>
                    <ResponsiveField label="Celular">
                      <TextField
                        fullWidth
                        placeholder="Ingrese número de celular/teléfono."
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        size="small"
                      />
                    </ResponsiveField>

                
                    <ResponsiveField label="E-mail">
                      <TextField
                        fullWidth
                        placeholder="Ingrese correo Electrónico "
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
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
                  Crear Paciente
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Pacientes */}
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
                      <TableCell><strong>Sexo</strong></TableCell>
                      <TableCell><strong>T. Documento</strong></TableCell>
                      <TableCell><strong># Documento</strong></TableCell>
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
                      <TableRow key={paciente.pacientid} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {paciente.names} {paciente.lastNames}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                                <Chip
                                  label={paciente.gender === 10001 ? 'M' : 'F'}
                                  size="small"
                                  color={getSexoColor(paciente.gender)}
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: '18px' }}
                                />
                              </Typography>
                            </TableCell>
                        <TableCell>{paciente.tipoDocumento}</TableCell>
                        <TableCell>{paciente.documento || paciente.documentNumber || 'N/A'}</TableCell>
                        <TableCell>{paciente.telefono || paciente.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={paciente.estado === '10007' ? 'Activo' : 'Inactivo'}
                            color={paciente.estado === '10007' ? 'success' : 'default'}
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
                      value={editFormData.names}
                      onChange={(e) => handleEditInputChange('names', e.target.value)}
                      error={!!errors.names}
                      helperText={errors.names}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Apellidos" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese los apellidos del paciente"
                      value={editFormData.lastNames}
                      onChange={(e) => handleEditInputChange('lastNames', e.target.value)}
                      error={!!errors.lastNames}
                      helperText={errors.lastNames}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Género" required>
                    <FormControl fullWidth required error={!!errors.gender} size="small">
                      <Select
                        value={editFormData.gender}
                        onChange={(e) => handleEditSelectChangeWithCascade('gender', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.gender ? '#000' : '#999'
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
                      {errors.gender && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.gender}</Typography>}
                    </FormControl>
                  </ResponsiveField>  
                </FieldRow>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento */}
                <FieldRow>
                  <ResponsiveField label="Tipo de Documento" required>
                    <FormControl fullWidth required error={!!errors.typeDoc} size="small">
                      <Select
                        value={editFormData.typeDoc}
                        onChange={(e) => handleEditSelectChangeWithCascade('typeDoc', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.typeDoc ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(TipoDocumentoD) && TipoDocumentoD.map(sexo => (
                          <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                            {sexo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.gender}</Typography>}
                    </FormControl>
                  </ResponsiveField>  

                  <ResponsiveField label="Número de Documento" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el número de documento"
                      value={editFormData.documentNumber}
                      onChange={(e) => handleEditInputChange('documentNumber', e.target.value)}
                      error={!!errors.documentNumber}
                      helperText={errors.documentNumber}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Fecha de Nacimiento" required>
                    <TextField
                      fullWidth
                      required
                      type="date"
                      value={editFormData.birthdate || ''}
                      onChange={(e) => handleEditInputChange('birthdate', e.target.value)}
                      error={!!errors.birthdate}
                      helperText={errors.birthdate}
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
                      value={editFormData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Tipo de Documento" required>
                    <FormControl fullWidth required error={!!errors.statusMarital} size="small">
                      <Select
                        value={editFormData.statusMarital}
                        onChange={(e) => handleEditSelectChangeWithCascade('statusMarital', e.target.value)} 
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.statusMarital ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar tipo</MenuItem>
                        {Array.isArray(EstadoMaritalD) && EstadoMaritalD.map(sexo => (
                          <MenuItem key={sexo.parameterid} value={sexo.parameterid}>
                            {sexo.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.gender}</Typography>}
                    </FormControl>
                  </ResponsiveField> 

                  <ResponsiveField label="Estatus" required>
                                      <FormControl fullWidth required error={!!errors.status}>
                                        <Select
                                          value={editFormData.status}
                                          onChange={(e) => handleEditSelectChangeWithCascade('status', e.target.value)}
                                          displayEmpty
                                          sx={{
                                            '& .MuiSelect-select': {
                                              color: editFormData.status ? '#000' : '#999'
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
                </FieldRow>
            </Paper>

            {/* Sección 2: Dirección del Paciente */}
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                2. Centro
              </Typography>
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

              {/*Calle, Pais, Departamento*/}
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
                    <FormControl fullWidth required error={!!errors.department} size="small">
                      <Select
                        value={editFormData.department}
                        onChange={(e) => handleEditSelectChangeWithCascade('department', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.department ? '#000' : '#999'
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
                      {errors.department && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.department}</Typography>}
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
                
                {/* Departamento, Provincia, Distrito */}
                <FieldRow>
                  <ResponsiveField label="Provincia" required>
                    <FormControl fullWidth required error={!!errors.province} size="small">
                      <Select
                        value={editFormData.province}
                        onChange={(e) => handleEditSelectChangeWithCascade('province', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.province ? '#000' : '#999'
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
                      {errors.province && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.province}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  <ResponsiveField label="Distrito" required>
                    <FormControl fullWidth required error={!!errors.district} size="small">
                      <Select
                        value={editFormData.district}
                        onChange={(e) => handleEditSelectChangeWithCascade('district', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: editFormData.district ? '#000' : '#999'
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
                      {errors.district && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.district}</Typography>}
                    </FormControl>
                  </ResponsiveField>

                  
                </FieldRow>
                <FieldRow>
                  <ResponsiveField label="Calle">
                    <TextField
                      fullWidth
                      placeholder="Ingrese la calle o avenida"
                      value={editFormData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
                </Paper>

                <Paper>
                

                {/* Sección 4: Info */}
              <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                4. Información de Adicionales
              </Typography>

                  <FieldRow>
                    <ResponsiveField label="Celular">
                      <TextField
                        fullWidth
                        placeholder="Ingrese número de celular/teléfono."
                        value={editFormData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        size="small"
                      />
                    </ResponsiveField>

                
                    <ResponsiveField label="E-mail">
                      <TextField
                        fullWidth
                        placeholder="Ingrese correo Electrónico "
                        value={editFormData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        size="small"
                      />
                    </ResponsiveField>

                </FieldRow>
              </Paper>
                          
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
                {/* Fila 1: Nombres, Apellidos, Género */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Nombres</Typography>
                    <Typography variant="body1">{selectedPaciente.names || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Apellidos</Typography>
                    <Typography variant="body1">{selectedPaciente.lastNames || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Género</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.gender} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Fecha de Nacimiento</Typography>
                    <Typography variant="body1">
                      {selectedPaciente.birthdate ? new Date(selectedPaciente.birthdate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Estado Marital</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.statusMarital} />
                    </Typography>
                  </Grid>
                </Grid>

                {/* Fila 2: Tipo documento, Documento, Fecha nacimiento */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Tipo de Documento</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.typeDoc} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Número de Documento</Typography>
                    <Typography variant="body1">{selectedPaciente.documentNumber || 'N/A'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Nacionalidad</Typography>
                    <Typography variant="body1">{selectedPaciente.nationality || 'N/A'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Estado</Typography>
                    <Chip
                      label={selectedPaciente.status ? 'Activo' : 'Inactivo'}
                      color={selectedPaciente.status ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Centro */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  2. Centro
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Centro Médico</Typography>
                    <Typography variant="body1">
                      {selectedPaciente.centroId ? (
                        centrosD.find(centro => centro.id === selectedPaciente.centroId)?.nombre || 'N/A'
                      ) : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Historia Clínica</Typography>
                    <Typography variant="body1">{selectedPaciente.medicalHistory || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 3: Información de Residencia */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  3. Información de Residencia
                </Typography>
                
                {/* Fila 1: País, Departamento */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>País</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.pais} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Departamento</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.department} />
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Provincia</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.province} />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Distrito</Typography>
                    <Typography variant="body1">
                      <ParametroTexto id={selectedPaciente.district} />
                    </Typography>
                  </Grid>
                </Grid>

                {/* Fila 2: Dirección */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Dirección</Typography>
                    <Typography variant="body1">{selectedPaciente.address || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 4: Información de Contacto */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  4. Información de Contacto
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Teléfono/Celular</Typography>
                    <Typography variant="body1">{selectedPaciente.phoneNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>Correo Electrónico</Typography>
                    <Typography variant="body1">{selectedPaciente.email || 'N/A'}</Typography>
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