import React, { useState, memo, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  NavigateNext,
  Search,
  Person,
  PersonAdd,
  Edit,
  ArrowBack,
  ArrowForward,
  Save,
  Phone,
  Email,
  MedicalServices,
  Home,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { patientsService } from '../../services/patientsService';
import { centrosService } from '../../services/centrosService';
import { staffService } from '../../services/staffService';
import { segurosService } from '../../services/segurosService';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';
import { medicosRefService } from 'services/medicosRefService';
import { salasService } from 'services/salasService';
import { recursosService } from 'services/recursosService';
import { estudiosService } from 'services/estudiosService';

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

FieldRow.displayName = 'FieldRow';

const ProcedimientoAdmision = () => {
  const navigate = useNavigate();

  // Estado del stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Paciente', 'Médico Ref./Seguros', 'Procedimiento'];

  const [centrosD, setCentrosCargados] = useState([]);
  const [medicosD, setMedicosCargados] = useState([]);
  const [seguroD, setSeguroCargados] = useState([]);
  const [tipopacD, setSTipoPacienteCargados] = useState([]);
  const [procedenciaD, setProcedenciaCargados] = useState([]);
  const [cartagarantiaD, setCartaGarantiaCargados] = useState([]);
  const [medicosRefD, setMedicosRefCargados] = useState([]);
  const [salaD, setSalaCargados] = useState([]);
  const [recursoD, setRecursoCargados] = useState([]);
  const [estudioD, seEstudioCargados] = useState([]);
  const [procedimmientoComplejidadD, setProcedimientoComplejidadCargados] = useState([]);
  const [urgenteSiNoD, seturgenteSiNoCargados] = useState([]);

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
    const cargarMedicos = async () => {
          try {
            const responseSystemParameter = await staffService.getAll();
            console.log('✅ Respuesta de Medicos:', responseSystemParameter);
            setMedicosCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Medicos:', error);
            setError(`Error al cargar Centros: ${error.message}`);
          }
        };    
    const cargarSeguros = async () => {
          try {
            const responseSystemParameter = await segurosService.getAll();
            console.log('✅ Respuesta de Seguros:', responseSystemParameter);
            setSeguroCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Seguros:', error);
            setError(`Error al cargar Seguros: ${error.message}`);
          }
        };  
  
    const cargarTipoPaciente = async () => {
            try {
              const responseSystemParameter = await centrosService.getAllSystemParameterId(10049);
              console.log('✅ Respuesta de TipoPaciente:', responseSystemParameter);
              setSTipoPacienteCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                               responseSystemParameter?.data || []);
            } catch (error) {
              console.error('❌ Error al cargar TipoPaciente:', error);
              setError(`Error al cargar TipoPaciente: ${error.message}`);
            }
          };
  
   const cargarCartaGarancia = async () => {
            try {
              const responseSystemParameter = await centrosService.getAllSystemParameterId(10041);
              console.log('✅ Respuesta de Procedencia Seguros:', responseSystemParameter);
              setProcedenciaCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                               responseSystemParameter?.data || []);
            } catch (error) {
              console.error('❌ Error al cargar Procedencia Seguros:', error);
              setError(`Error al cargar Procedencia Seguros: ${error.message}`);
            }
          };
    
    const cargarProcedenciaSeguros = async () => {
            try {
              const responseSystemParameter = await centrosService.getAllSystemParameterId(10044);
              console.log('✅ Respuesta de Procedencia Seguros:', responseSystemParameter);
              setCartaGarantiaCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                               responseSystemParameter?.data || []);
            } catch (error) {
              console.error('❌ Error al cargar Carta Garantia:', error);
              setError(`Error al cargar Carta Garantia: ${error.message}`);
            }
          };
  const cargarMedicosRef = async () => {
          try {
            const responseSystemParameter = await medicosRefService.getAll();
            console.log('✅ Respuesta de Medicos Referencia:', responseSystemParameter);
            setMedicosRefCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Medicos Referencia:', error);
            setError(`Error al cargar Centros Referencia: ${error.message}`);
          }
        };   
  const cargarSalas = async () => {
          try {
            const responseSystemParameter = await salasService.getAll();
            console.log('✅ Respuesta de Salas:', responseSystemParameter);
            setSalaCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Salas:', error);
            setError(`Error al cargar Salas: ${error.message}`);
          }
        };
  
  const cargarRecursos = async () => {
          try {
            const responseSystemParameter = await recursosService.getAll();
            console.log('✅ Respuesta de Recursos:', responseSystemParameter);
            setRecursoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Recursos:', error);
            setError(`Error al cargar Recursos: ${error.message}`);
          }
        }; 

  const cargarEstudios = async () => {
          try {
            const responseSystemParameter = await estudiosService.getAll();
            console.log('✅ Respuesta de Estudios:', responseSystemParameter);
            seEstudioCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                             responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar Estudios:', error);
            setError(`Error al cargar Estudios: ${error.message}`);
          }
        }; 

  const cargarProcedimientoComplejidad = async () => {
            try {
              const responseSystemParameter = await centrosService.getAllSystemParameterId(10054);
              console.log('✅ Respuesta de Procedimiento Complejidad:', responseSystemParameter);
              setProcedimientoComplejidadCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                               responseSystemParameter?.data || []);
            } catch (error) {
              console.error('❌ Error al cargar Procedimiento Complejidad:', error);
              setError(`Error al cargar Procedimiento Complejidad: ${error.message}`);
            }
          };
  const cargarUrgenteSiNo = async () => {
            try {
              const responseSystemParameter = await centrosService.getAllSystemParameterId(10058);
              console.log('✅ Respuesta de Urgencia:', responseSystemParameter);
              seturgenteSiNoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                               responseSystemParameter?.data || []);
            } catch (error) {
              console.error('❌ Error al cargar Urgencia:', error);
              setError(`Error al cargar Urgencia: ${error.message}`);
            }
          };
  // Estados para búsqueda de paciente
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Cargar datos iniciales
    useEffect(() => {
      cargarCentros();
      cargarMedicos();
      cargarSeguros();
      cargarTipoPaciente();
      cargarCartaGarancia();
      cargarProcedenciaSeguros();
      cargarMedicosRef();
      cargarSalas();
      cargarRecursos();
      cargarEstudios();
      cargarProcedimientoComplejidad();
      cargarUrgenteSiNo();
    }, []);

    {/*
  // Estados para Fase 2: Médico Ref./Seguros
  const [procedimientoDate, setMedicoSeguros] = useState({
    tipoPaciente: '',
    medicoReferente: '',
    centro: '',
    seguro: '',
    aseguradora: '',
    cartaGarantia: ''
  });

  // Estados para Fase 3: Procedimiento
  const [procedimientoDate, setProcedimiento] = useState({
    centro: '',
    sala: '',
    recurso: '',
    tipoProcedimiento: '',
    fecha: '',
    hora: '',
    notas: ''
  });
*/}

const [procedimientoDate, setMedicosFollows] = useState({
    // Horario
    centro: 1,
    centroNombre: '',
    medico: '',
    medicoNombre: '',
    tipoCita: '',
    tipoCitaNombre: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false,
      hourCycle: 'h23' 
    }).padStart(5, '0'),
    // Seguros
    tipoPaciente: '',
    tipoPacienteNombre: '',
    medicoReferente: '',
    medicoNombreRef: '',
    procedencia: '10042',
    procedenciaNombre: '',
    nombreProcedencia: '',
    aseguradora: 10,
    aseguradoraNombre: '',
    cartaGarantia: '10048',
    cartaGarantiaNombre: '',
    sala: '',
    salanombre:'',
    recurso: '',
    recursonombre:'',
    tipoProcedimiento: '',
    tipoProcedimientoNombre: '',
    tipoProcedimientoComplejidadId:'',
    tipoProcedimientoComplejidadNombre: '',
    urgenteId: '10060',
    urgenteValor: '',

  });
  // Modal de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Datos simulados de pacientes
    const pacientesSimulados = [
    {
      id: 1,
      documento: '12345678',
      nombres: 'María Elena',
      apellidos: 'González Martínez',
      fechaNacimiento: '1985-03-15',
      edad: 38,
      nacionalidad: 'Peruana',
      historiaClinica: 'HC-2024-001',
      // Domicilio
      calle: 'Av. Principal 123, Dpto. 201',
      codigoPostal: '15001',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'Miraflores',
      // Información de contacto
      telefono: '01-4567890',
      celular: '987654321',
      correo: 'maria.gonzalez@email.com'
    },
    {
      id: 2,
      documento: '87654321',
      nombres: 'Carlos Antonio',
      apellidos: 'Rodríguez Silva',
      fechaNacimiento: '1978-08-22',
      edad: 45,
      nacionalidad: 'Peruana',
      historiaClinica: 'HC-2024-002',
      // Domicilio
      calle: 'Jr. Los Andes 456',
      codigoPostal: '15036',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'San Isidro',
      // Información de contacto
      telefono: '01-2345678',
      celular: '912345678',
      correo: 'carlos.rodriguez@email.com'
    }
  ];
const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toISOString().split('T')[0];
  };
  // Función para buscar paciente
  {/*
  const handleBuscarPaciente = () => {
    setBusquedaRealizada(true);
    const pacienteEncontrado = pacientesSimulados.find(p =>
      p.documento.includes(searchTerm) ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPacienteSeleccionado(pacienteEncontrado || null);
  };*/}

  const handleBuscarPaciente = async () => {
      try {
        setBusquedaRealizada(true);
        const response = await patientsService.getByDocumentNumber(searchTerm);
        if (response && response.data) {
          const fechaNacimiento = formatearFecha(response.data.birthdate);
          const edad = calcularEdad(fechaNacimiento);
          
          // Obtener los valores de los parámetros del sistema
          const [
            generoResponse,
            estadoCivilResponse,
            paisResponse,
            departamentoResponse,
            provinciaResponse,
            distritoResponse
          ] = await Promise.all([
            centrosService.getSystemParameterId(response.data.gender),
            centrosService.getSystemParameterId(response.data.statusMarital),
            centrosService.getSystemParameterId(response.data.pais),
            centrosService.getSystemParameterId(response.data.department),
            centrosService.getSystemParameterId(response.data.province),
            centrosService.getSystemParameterId(response.data.district)
          ]);
          
          setPacienteSeleccionado({
            idPaciente: response.data.pacientid || response.data.id, // Usar pacientid o id de la respuesta
            nombres: response.data.names,
            apellidos: response.data.lastNames,
            documento: response.data.documentNumber,
            historiaClinica: response.data.medicalHistory,
            fechaNacimiento: fechaNacimiento,
            edad: edad,
            nacionalidad: response.data.nationality,
            genero: generoResponse.data.value1,
            estadocivil: estadoCivilResponse.data.value1,
  
            // Domicilio
            calle: response.data.address,
            pais: paisResponse.data.value1,
            departamento: departamentoResponse.data.value1,
            provincia: provinciaResponse.data.value1,
            distrito: distritoResponse.data.value1,
            // Información de contacto
            telefono: response.data.phoneNumber,
            correo: response.data.email
          });
        } else {
          setPacienteSeleccionado(null);
        }
      } catch (error) {
        console.error('Error al buscar paciente:', error);
        setPacienteSeleccionado(null);
      }
    };

  // Función para limpiar búsqueda
  const handleLimpiarBusqueda = () => {
    setSearchTerm('');
    setPacienteSeleccionado(null);
    setBusquedaRealizada(false);
  };

  // Funciones de navegación del stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMedicosFollowsChange = async (field, value) => {
    if (field === 'centro') {
      try {
        const centro = centrosD.find(c => c.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          centroNombre: centro ? centro.nombre : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del centro:', error);
      }
    } else if (field === 'medico') {
      try {
        const medico = medicosD.find(m => m.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          medicoNombre: medico ? `${medico.nombres} ${medico.apellidos}` : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del médico:', error);
      }
    }else if (field === 'medicoReferente') {
      try {
        const medico = medicosRefD.find(m => m.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          medicoNombreRef: medico ? `${medico.names} ${medico.surnames}` : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del médico:', error);
      }
    }
    else if (field === 'sala') {
      try {
        const medico = salaD.find(m => m.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          salanombre: medico ? `${medico.description}` : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del médico:', error);
      }
    }
    else if (field === 'recurso') {
      try {
        const medico = recursoD.find(m => m.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          recursonombre: medico ? `${medico.name}` : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del médico:', error);
      }
    }
    else if (field === 'tipoPaciente') {
      try {
        const tipo = tipopacD.find(t => t.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          tipoPacienteNombre: tipo ? tipo.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del tipo de cita:', error);
      }
    }
     else if (field === 'tipoCita') {
      try {
        const tipo = tipocitaD.find(t => t.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          tipoCitaNombre: tipo ? tipo.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del tipo de cita:', error);
      }
    } else if (field === 'procedencia') {
      try {
        const procedencia = procedenciaD.find(p => p.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          procedenciaNombre: procedencia ? procedencia.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información de la procedencia:', error);
      }
    } else if (field === 'aseguradora') {
      try {
        const aseguradora = seguroD.find(s => s.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          aseguradoraNombre: aseguradora ? aseguradora.name : ''
        }));
      } catch (error) {
        console.error('Error al obtener información de la aseguradora:', error);
      }
    } else if (field === 'cartaGarantia') {
      try {
        const carta = cartagarantiaD.find(c => c.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          cartaGarantiaNombre: carta ? carta.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información de la carta de garantía:', error);
      }
    }
    else if (field === 'tipoProcedimiento') {
      try {
        const procedimiento = estudioD.find(m => m.id === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          tipoProcedimientoNombre: procedimiento ? `${procedimiento.description}` : ''
        }));
      } catch (error) {
        console.error('Error al obtener información del médico:', error);
      }
    }else if (field === 'tipoProcedimientoComplejidadId') {
      try {
        const tipoProcedimiento = procedimmientoComplejidadD.find(c => c.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          tipoProcedimientoComplejidadNombre: tipoProcedimiento ? tipoProcedimiento.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información de Tipo Procedimiento Complejidad:', error);
      }
    } else if (field === 'urgenteId') {
      try {
        const urgencia = urgenteSiNoD.find(c => c.parameterid === value);
        setMedicosFollows(prev => ({
          ...prev,
          [field]: value,
          urgenteValor: urgencia ? urgencia.value1 : ''
        }));
      } catch (error) {
        console.error('Error al obtener información de Urgencia:', error);
      }
    } else {
      setMedicosFollows(prev => ({ ...prev, [field]: value }));
    }
  };

  // Función para crear procedimientoDate
  const handleCrearProcedimiento = () => {
    setOpenConfirmDialog(true);
  };

  // Función para confirmar creación
  const handleConfirmarCreacion = async () => {
      try {
        const appointmentData = {
          pacientId: pacienteSeleccionado.idPaciente,
          centroId: procedimientoDate.centro,
          personalId: procedimientoDate.medico,
          appointmentDate: procedimientoDate.fecha,
          hoursMedicalShedule: procedimientoDate.hora,

          //typeofAppointment: procedimientoDate.tipoCita,
          //originId: procedimientoDate.procedencia,
          //otherOrigins: procedimientoDate.nombreProcedencia || '',
          typeOfPatient: procedimientoDate.tipoPaciente,
          referral_doctorsId: procedimientoDate.medicoReferente,
          centerOfOriginId: procedimientoDate.procedencia,
          anotherCenter: procedimientoDate.anotherCenter || '',
          procedureRoomId: procedimientoDate.sala,
          resourcesId: procedimientoDate.recurso,
          studiesId: procedimientoDate.tipoProcedimiento,
          anotacionesAdicionales: (procedimientoDate.notas || '').trim(),
          otherOrigins: 'NO ASIGNADO', // agregando el campo requerido
          tipoProcedimientoId: procedimientoDate.tipoProcedimientoComplejidadId,
          urgenteId: procedimientoDate.urgenteId,          

          insuranceId: procedimientoDate.aseguradora || null,
          letterOfGuarantee: procedimientoDate.cartaGarantia || null,
          status: 1, //agendado
          typeOfAttention: 2, //procedimiento
        };
    
        const response = await appointmentsService.create_procedimiento(appointmentData);
        
        if (response.status === 'success') {
          // Mostrar mensaje de éxito
          toast.success('ProcedimientoDate médica creada exitosamente');
          // Redirigir a la lista de citas
          navigate('/procedimientos/agendados');
        } else {
          throw new Error('Error al crear el ProcedimientoDate');
        }
      } catch (error) {
        console.error('Error al crear la cita:', error);
        toast.error('Error al crear el ProcedimientoDate: ' + error.message);
      }
      
      setOpenConfirmDialog(false);
    };
{/*
  const handleConfirmarCreacion = () => {
    // Aquí iría la lógica para crear el procedimientoDate
    console.log('Creando procedimientoDate:', {
      paciente: pacienteSeleccionado,
      procedimientoDate,
      procedimientoDate
    });

    setOpenConfirmDialog(false);
    // Redirigir o mostrar mensaje de éxito
    navigate('/procedimientos/agendados');
  };*/}

  // Validaciones para cada paso
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return pacienteSeleccionado !== null;
      case 1:
        return procedimientoDate.tipoPaciente && procedimientoDate.medicoReferente;
      case 2:
        return procedimientoDate.centro && procedimientoDate.sala && procedimientoDate.tipoProcedimiento && procedimientoDate.tipoProcedimientoComplejidadId && procedimientoDate.urgenteId;
      default:
        return false;
    }
  };

  // Renderizar contenido de cada paso
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <SectionHeader title="Búsqueda de Paciente" />
            <Box sx={{ p: 3 }}>
              <FieldRow>
                <ResponsiveField label="Buscar Paciente" required sx={{ flex: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Ingrese DNI o nombre del paciente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleBuscarPaciente()}
                  />
                </ResponsiveField>
                <ResponsiveField label=" " sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleBuscarPaciente}
                      disabled={!searchTerm}
                      sx={{
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#45a049' }
                      }}
                    >
                      Buscar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleLimpiarBusqueda}
                      disabled={!busquedaRealizada}
                    >
                      Limpiar
                    </Button>
                  </Box>
                </ResponsiveField>
              </FieldRow>

              {busquedaRealizada && (
                <>
                  {pacienteSeleccionado ? (
                    <Card sx={{ mt: 3, border: '2px solid #4caf50' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                            <Person />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}
                            </Typography>
                            <Chip
                              label="Paciente Encontrado"
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => navigate('/pacientes/nuevo-paciente', {
                              state: { editMode: true, paciente: pacienteSeleccionado }
                            })}
                            sx={{ mr: 1 }}
                          >
                            Editar
                          </Button>
                        </Box>

                        <Divider sx={{ mb: 2 }} />
                        {/* Información del Paciente */}
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be', mb: 2 }}>
                              Información del Paciente
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Person sx={{ color: '#2184be', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Nombres:</strong> {pacienteSeleccionado.nombres}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Person sx={{ color: '#2184be', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Apellidos:</strong> {pacienteSeleccionado.apellidos}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Fecha Nacimiento:</strong> {pacienteSeleccionado.fechaNacimiento}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Edad:</strong> {pacienteSeleccionado.edad} años
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Nacionalidad:</strong> {pacienteSeleccionado.nacionalidad}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Historia Clínica:</strong> {pacienteSeleccionado.historiaClinica}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Domicilio */}
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be', mb: 2 }}>
                              Domicilio
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Home sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Calle:</strong> {pacienteSeleccionado.calle}
                              </Typography>
                            </Box>
                            {/*
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOn sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Código Postal:</strong> {pacienteSeleccionado.codigoPostal}
                              </Typography>
                            </Box>*/}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>País:</strong> {pacienteSeleccionado.pais}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Departamento:</strong> {pacienteSeleccionado.departamento}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Provincia:</strong> {pacienteSeleccionado.provincia}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Distrito:</strong> {pacienteSeleccionado.distrito}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Información de Contacto */}
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be', mb: 2 }}>
                              Información de Contacto
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Celular:</strong> {pacienteSeleccionado.telefono}
                              </Typography>
                            </Box>
                          </Grid>
                          {/*
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone sx={{ color: '#2196f3', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Celular:</strong> {pacienteSeleccionado.celular}
                              </Typography>
                            </Box>
                          </Grid>*/}
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Email sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Correo:</strong> {pacienteSeleccionado.correo}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ mt: 3 }}
                      action={
                        <Button
                          color="inherit"
                          size="small"
                          startIcon={<PersonAdd />}
                          onClick={() => navigate('/pacientes/pacientes', { state: { createMode: true } })}
                        >
                          Nuevo Paciente
                        </Button>
                      }
                    >
                      No se encontró ningún paciente con los criterios de búsqueda.
                    </Alert>
                  )}
                </>
              )}

              {!busquedaRealizada && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Ingrese el DNI o nombre del paciente para comenzar la búsqueda
                  </Typography>
                  <Button
                    variant="text"
                    startIcon={<PersonAdd />}
                    onClick={() => navigate('/pacientes/pacientes', { state: { createMode: true } })}
                    sx={{ mt: 2 }}
                  >
                    ¿Paciente nuevo? Registrar aquí
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        );
      case 1:
        return (
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <SectionHeader title="Médico Referente y Seguros" />
            <Box sx={{ p: 3 }}>
              <FieldRow>
                <ResponsiveField label="Tipo de Paciente" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.tipoPaciente}
                      onChange={(e) => handleMedicosFollowsChange('tipoPaciente', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                      {Array.isArray(tipopacD) && tipopacD.map(estado => (
                        <MenuItem key={estado.parameterid} value={estado.parameterid}>
                          {estado.value1 || ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Médico Referente" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.medicoReferente}
                      onChange={(e) => handleMedicosFollowsChange('medicoReferente', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar médico</MenuItem>
                      {Array.isArray(medicosRefD) && medicosRefD.map(medico => (
                        <MenuItem key={medico.id} value={medico.id}>
                            {medico.names + ' ' + medico.surnames}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Centro de Referencia">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.procedencia}
                      onChange={(e) => handleMedicosFollowsChange('procedencia', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar procedencia</MenuItem>
                      {Array.isArray(procedenciaD) && procedenciaD.map(procedencia => (
                        <MenuItem key={procedencia.parameterid} value={procedencia.parameterid}>
                          {procedencia.value1 || ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>
{/*
                <ResponsiveField label="Seguro">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.seguro}
                      onChange={(e) => handleMedicosFollowsChange('seguro', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Sin seguro</MenuItem>
                      <MenuItem value="essalud">EsSalud</MenuItem>
                      <MenuItem value="particular">Seguro Particular</MenuItem>
                      <MenuItem value="rimac">Rímac Seguros</MenuItem>
                      <MenuItem value="pacifico">Pacífico Seguros</MenuItem>
                      <MenuItem value="sis">SIS</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>*/}
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Aseguradora">
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={procedimientoDate.aseguradora}
                                      onChange={(e) => handleMedicosFollowsChange('aseguradora', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="">Seleccionar Aseguradora</MenuItem>
                                                                  {Array.isArray(seguroD) && seguroD.map(seguro => (
                                                                    <MenuItem key={seguro.id} value={seguro.id}>
                                                                      {seguro.name}
                                                                    </MenuItem>
                                                                  ))}
                                    </Select>
                                  </FormControl>
                                </ResponsiveField>

                <ResponsiveField label="Carta de Garantía">
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={procedimientoDate.cartaGarantia}
                                      onChange={(e) => handleMedicosFollowsChange('cartaGarantia', e.target.value)}
                                      displayEmpty
                                      disabled={!procedimientoDate.aseguradora}
                                    >
                                      <MenuItem value="">Selecciona tipo de Carta</MenuItem>
                                      {Array.isArray(cartagarantiaD) && cartagarantiaD.map(estado => (
                                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                                            {estado.value1 || ''}
                                          </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </ResponsiveField>
              </FieldRow>

              {/* Información del paciente seleccionado */}
              {pacienteSeleccionado && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Paciente seleccionado:</strong> {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                    - DNI: {pacienteSeleccionado.documento}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        );

      case 2:
        return (
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <SectionHeader title="Información del Procedimiento" />
            <Box sx={{ p: 3 }}>
              <FieldRow>
                <ResponsiveField label="Centro" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.centro}
                      onChange={(e) => handleMedicosFollowsChange('centro', e.target.value)}
                      displayEmpty
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
              <FieldRow>
                <ResponsiveField label="Médico" required>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={procedimientoDate.medico}
                                      onChange={(e) => handleMedicosFollowsChange('medico', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="">Seleccionar médico</MenuItem>
                                                                  {Array.isArray(medicosD) && medicosD.map(medico => (
                                                                    <MenuItem key={medico.id} value={medico.id}>
                                                                      {medico.nombres + ' ' + medico.apellidos}
                                                                    </MenuItem>
                                                                  ))}
                                    </Select>
                                  </FormControl>
                                </ResponsiveField>
                <ResponsiveField label="Sala" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.sala}
                      onChange={(e) => handleMedicosFollowsChange('sala', e.target.value)}
                      displayEmpty
                      disabled={!procedimientoDate.centro}
                    >
                      <MenuItem value="">Seleccionar sala</MenuItem>
                      {Array.isArray(salaD) && salaD.map(sala => (
                        <MenuItem key={sala.id} value={sala.id}>
                          {sala.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Recurso">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.recurso}
                      onChange={(e) => handleMedicosFollowsChange('recurso', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar recurso</MenuItem>
                      {Array.isArray(recursoD) && recursoD.map(recurso => (
                        <MenuItem key={recurso.id} value={recurso.id}>
                          {recurso.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Procedimiento" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.tipoProcedimiento}
                      onChange={(e) => handleMedicosFollowsChange('tipoProcedimiento', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar procedimientoDate</MenuItem>
                      {Array.isArray(estudioD) && estudioD.map(estudio => (
                        <MenuItem key={estudio.id} value={estudio.id}>
                          {estudio.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>
              <FieldRow>
                <ResponsiveField label="Tipo de Procedimmiento">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.tipoProcedimientoComplejidadId}
                      onChange={(e) => handleMedicosFollowsChange('tipoProcedimientoComplejidadId', e.target.value)}
                      displayEmpty
                    >
                    <MenuItem value="">Selecciona tipo de Procedimiento</MenuItem>
                    {Array.isArray(procedimmientoComplejidadD) && procedimmientoComplejidadD.map(estado => (
                      <MenuItem key={estado.parameterid} value={estado.parameterid}>
                        {estado.value1 || ''}
                      </MenuItem>
                    ))}
                    </Select>
                    </FormControl>
                  </ResponsiveField>
              </FieldRow>
              <FieldRow>
                <ResponsiveField label="Fecha del Procedimiento" required>
                  <TextField
                    fullWidth
                    type="date"
                    value={procedimientoDate.fecha}
                    onChange={(e) => handleMedicosFollowsChange('fecha', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>

                <ResponsiveField label="Hora del Procedimiento" required>
                  <TextField
                    fullWidth
                    type="time"
                    value={procedimientoDate.hora}
                    onChange={(e) => handleMedicosFollowsChange('hora', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>
              </FieldRow>
              <FieldRow>
                <ResponsiveField label="¿ES URGENTE?">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimientoDate.urgenteId}
                      onChange={(e) => handleMedicosFollowsChange('urgenteId', e.target.value)}
                      displayEmpty
                    >
                    <MenuItem value="">Selecciona Urgencia</MenuItem>
                    {Array.isArray(urgenteSiNoD) && urgenteSiNoD.map(estado => (
                      <MenuItem key={estado.parameterid} value={estado.parameterid}>
                        {estado.value1 || ''}
                      </MenuItem>
                    ))}
                    </Select>
                    </FormControl>
                  </ResponsiveField>
              </FieldRow>
              <ResponsiveField label="Notas e Indicaciones">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={procedimientoDate.notas}
                  onChange={(e) => handleMedicosFollowsChange('notas', e.target.value)}
                  placeholder="Instrucciones especiales, preparación del paciente, observaciones..."
                  size="small"
                />
              </ResponsiveField>

              {/* Resumen de información */}
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Resumen de la Admisión:
                </Typography>
                <Typography variant="body2">
                  <strong>Paciente:</strong> {pacienteSeleccionado?.nombres} {pacienteSeleccionado?.apellidos}<br/>
                  <strong>Médico:</strong> {procedimientoDate.medicoNombre || 'No asignado'}<br/>
                  <strong>Procedimiento:</strong> {procedimientoDate.tipoProcedimientoNombre || 'No seleccionado'}<br/>
                  <strong>Fecha:</strong> {procedimientoDate.fecha || 'No programada'} {procedimientoDate.hora && `- ${procedimientoDate.hora}`}
                </Typography>
              </Alert>
            </Box>
          </Paper>
        );

      default:
        return 'Paso desconocido';
    }
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
        <Link
          underline="hover"
          color="inherit"
          href="/admision"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admision');
          }}
        >
          Admisión
        </Link>
        <Typography color="text.primary">Procedimiento</Typography>
      </Breadcrumbs>

      {/* Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <MedicalServices sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
          Admisión de Procedimiento
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '1rem',
                    fontWeight: activeStep === index ? 'bold' : 'normal'
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Contenido del paso actual */}
      <Box sx={{ mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>

      {/* Botones de navegación */}
      <Paper sx={{ p: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Anterior
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCrearProcedimiento}
                disabled={!isStepValid(activeStep)}
                startIcon={<Save />}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Crear Procedimiento
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: '#2184be',
                  '&:hover': { backgroundColor: '#1976d2' }
                }}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal de Confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          backgroundColor: '#2184be',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">
            Confirmar Creación de Procedimiento
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            ¿Confirma la creación del procedimientoDate con los siguientes datos?
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Información del Paciente:
              </Typography>
              <Typography variant="body2">
                <strong>Nombre:</strong> {pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellidos}
              </Typography>
              <Typography variant="body2">
                <strong>Documento:</strong> {pacienteSeleccionado?.documento}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Médico y Seguros:
              </Typography>
              <Typography variant="body2">
                <strong>Tipo de Paciente:</strong> {procedimientoDate.tipoPacienteNombre}
              </Typography>
              <Typography variant="body2">
                <strong>Médico Referente:</strong> {procedimientoDate.medicoNombreRef}
              </Typography>
              {procedimientoDate.seguro && (
                <Typography variant="body2">
                  <strong>Seguro:</strong> {procedimientoDate.seguro}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Procedimiento:
              </Typography>
              <Typography variant="body2">
                <strong>Medico Tratante:</strong> {procedimientoDate.medicoNombre}
              </Typography>
              <Typography variant="body2">
                <strong>Procedimiento:</strong> {procedimientoDate.tipoProcedimientoNombre}
              </Typography>
              <Typography variant="body2">
                <strong>Equipo:</strong> {procedimientoDate.recursonombre}
              </Typography>
              <Typography variant="body2">
                <strong>Sala:</strong> {procedimientoDate.salanombre}
              </Typography>
              <Typography variant="body2">
                <strong>Tipo Procedimiento:</strong> {procedimientoDate.tipoProcedimientoComplejidadNombre}
              </Typography>
              <Typography variant="body2">
                <strong>¿Urgente?:</strong> {procedimientoDate.urgenteValor}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha y Hora:</strong> {procedimientoDate.fecha} - {procedimientoDate.hora}
              </Typography>
              <Typography variant="body2">
                <strong>Centro:</strong> {procedimientoDate.centroNombre || (Array.isArray(centrosD) ? (centrosD.find(c => c.id === procedimientoDate.centro)?.nombre || '') : '')}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenConfirmDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmarCreacion}
            startIcon={<Save />}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Confirmar y Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProcedimientoAdmision;