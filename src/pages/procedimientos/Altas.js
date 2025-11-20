import React, { useState, useCallback, memo , useEffect} from 'react';
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
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  NavigateNext,
  Search,
  MedicalServices,
  CheckCircle,
  AddCircle,
  Schedule,
  CloudUpload,
  Cancel,
  Assignment,
  Close,
  History,
  Assessment,
  Delete,
  Save,
  Description,
  Email,
  SlowMotionVideoRounded,
  ExitToAppRounded,
  ExitToApp 
} from '@mui/icons-material';
import Download from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';
import { appointmentsService, patientsService, staff, staffService } from 'services';
import archivodigitalService from 'services/archivodigitalService';
import examenesService from 'services/examenesService';
import centrosService from 'services/centrosService';
import estudiosService from 'services/estudiosService';
import salasService from 'services/salasService';
import recursosService from 'services/recursosService';
import medicosRefService from 'services/medicosRefService';
import segurosService from 'services/segurosService';

const ParametroTexto = ({ id }) => {
  const [valor, setValor] = useState('');
  useEffect(() => {
    const cargarParametro = async () => {
      if (!id) { setValor(''); return; }
      try {
        if (id && !isNaN(id)) {
          try {
            const response = await centrosService.getSystemParameterId(id);
            if (response?.data?.value1) { setValor(response.data.value1); return; }
          } catch {}
        }
        const parametrosMap = { estado: 10006, genero: 10000, titulo: 10009, tipoTrabajo: 10003, pais: 1, departamento: 2 };
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
              const matchId = p.parameterid && id ? p.parameterid.toString() === id.toString() : false;
              return matchValue || matchId;
            });
            if (parametro) { setValor(parametro.value1); return; }
          } catch {}
        }
        setValor(id);
      } catch { setValor(id); }
    };
    cargarParametro();
  }, [id]);
  return valor || 'No especificado';
};

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

const Altas = () => {
  const navigate = useNavigate();

  // Estado para filtros de búsqueda
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const [filters, setFilters] = useState({
    fechaInicio: todayStr,
    fechaFin: todayStr,
    sala: '',
    procedimiento: '',
    searchTerm: ''
  });

  // Estados para modales
  const [openPatientHistoryModal, setOpenPatientHistoryModal] = useState(false);
  const [openExamHistoryModal, setOpenExamHistoryModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openCie10Modal, setOpenCie10Modal] = useState(false);
  const [openConfirmPresentModal, setOpenConfirmPresentModal] = useState(false);
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  
  const [openEmailModal, setOpenEmailModal] = useState(false);

  const [medicosD, setMedicosCargados] = useState([]);
  const [salaD, setSalaCargados] = useState([]);
  const [recursoD, setRecursoCargados] = useState([]);
  const [estudioD, seEstudioCargados] = useState([]);

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

  // Estados para reagendar
  const [rescheduleForm, setRescheduleForm] = useState({
    medico: '',
    sala: '',
    equipo: '',
    fecha: '',
    hora: ''
  });

  // Estados para subir archivos
  const [uploadForm, setUploadForm] = useState({
    selectedFile: null,
    tipoArchivo: '',
    descripcion: ''
  });

  const [archivosSubidos, setArchivosSubidos] = useState([
    {
      id: 1,
      nombre: 'Resultado_Laboratorio_001.pdf',
      tipo: 'Laboratorio',
      fechaCreacion: '2024-01-10',
      tamaño: '2.5 MB'
    },
    {
      id: 2,
      nombre: 'Imagen_Endoscopia_001.jpg',
      tipo: 'Imagen',
      fechaCreacion: '2024-01-09',
      tamaño: '1.8 MB'
    }
  ]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estados para CIE-10
  const [cie10Form, setCie10Form] = useState({
    codigoSeleccionado: '',
    descripcionSeleccionada: ''
  });

  const [cie10Seleccionados, setCie10Seleccionados] = useState([]);

  // Base de datos simulada de códigos CIE-10
  const codigosCie10 = [
    { codigo: 'K25.0', descripcion: 'Úlcera gástrica aguda con hemorragia' },
    { codigo: 'K25.1', descripcion: 'Úlcera gástrica aguda con perforación' },
    { codigo: 'K25.9', descripcion: 'Úlcera gástrica sin complicaciones' },
    { codigo: 'K26.0', descripcion: 'Úlcera duodenal aguda con hemorragia' },
    { codigo: 'K26.9', descripcion: 'Úlcera duodenal sin complicaciones' },
    { codigo: 'K29.0', descripcion: 'Gastritis hemorrágica aguda' },
    { codigo: 'K29.1', descripcion: 'Gastritis y duodenitis atrófica' },
    { codigo: 'K29.5', descripcion: 'Gastritis crónica no especificada' },
    { codigo: 'K31.9', descripcion: 'Enfermedad del estómago y duodeno no especificada' },
    { codigo: 'K50.0', descripcion: 'Enfermedad de Crohn del intestino delgado' },
    { codigo: 'K51.0', descripcion: 'Colitis ulcerativa (pancolitis)' },
    { codigo: 'K59.0', descripcion: 'Estreñimiento' },
    { codigo: 'K92.0', descripcion: 'Hematemesis' },
    { codigo: 'K92.1', descripcion: 'Melena' },
    { codigo: 'K92.2', descripcion: 'Hemorragia gastrointestinal sin especificación' }
  ];

  // Estado para los procedimientos agendados
  const [procedimientosAgendados, setProcedimientosAgendados] = useState([]);

  const cargarProcedimientos = async () => {
        try {
          const procedimientos = await appointmentsService.getAll_Proc_Completado();
          
          const listaAgendasProcedimientos = await Promise.all(
              procedimientos.data.map(async (procedimientoDat) => {
                try {
                  const examenDatos = await estudiosService.getById(procedimientoDat.studiesId);
                  const centroDatos = await centrosService.getById(procedimientoDat.centroId);
                  const pacienteDatos = await patientsService.getById(procedimientoDat.pacientId);
                  const estadoAgenda = await centrosService.getSystemParameterId(procedimientoDat.status);
                  const salaDatos = await salasService.getById(procedimientoDat.procedureRoomId);
                  const recursosDatos = await recursosService.getById(procedimientoDat.resourcesId);
                  
                  const medicoTratDatos = await staffService.getById(procedimientoDat.personalId);
                  const medicoRefDatos = await medicosRefService.getById(procedimientoDat.referral_doctorsId);

                  const seguroDatos = await segurosService.getById(procedimientoDat.insuranceId);
                  const tipoAtencion = await centrosService.getSystemParameterId(procedimientoDat.typeOfPatient);
                  const tipoProced = await centrosService.getSystemParameterId(procedimientoDat.tipoProcedimientoId);

                  
                  // Transformar el estado a ID numérico, manejando tanto booleano como texto
                  
                  return {
                    ...procedimientoDat,
                    //
                    codigo: procedimientoDat.medicalscheduleid,
                    tipo: examenDatos.data.name,
                    estado: estadoAgenda.data.value1,
                    //
                    centro: centroDatos.data.nombre,
                    //
                    nombre: pacienteDatos.data.names + ' ' + pacienteDatos.data.lastNames,
                    documento: pacienteDatos.data.documentNumber,
                    fechaNac: pacienteDatos.data.birthdate,
                    genero: pacienteDatos.data.gender == '10001' ?'MASCULINO':'FEMENINO',
                    medicalHistory: pacienteDatos.data.medicalHistory,
                    tipoAtencion: tipoAtencion.data.value1,
                    seguro: seguroDatos.data.name,
                    tipoProcedimiento: tipoProced.data.value1,
                    tiempo: examenDatos.data.operatingHours,
                    //
                    sala: salaDatos.data.name,
                    recurso: recursosDatos.data.name,
                    procedimiento: examenDatos.data.name,
                    //
                    medicoReferente: medicoRefDatos.data.names + ' ' + medicoRefDatos.data.surnames,
                    gastroenterologo:  medicoTratDatos.data.nombres + ' ' +  medicoTratDatos.data.apellidos,
                    //
                    fechaExamen: procedimientoDat.appointmentDate,
                    horaExamen: procedimientoDat.hoursMedicalShedule,
                    urgente: procedimientoDat.urgenteId == '10059' ?true: false,
                    fechaCompletado: procedimientoDat.updatedAt,


                  };
                } catch (error) {
                  console.error(`Error al obtener centro ${procedimientoDat.personalId}:`, error);
                  return {
                    ...procedimientoDat,
                    //
                    codigo: 'Codigo no encontrado',
                    tipo: 'Estudio no encontrado',
                    estado:'Estado no encontrado',
                    //
                    centro: 'Centro no encontrado',
                    //
                    tipoDocumento: 'Tipo Doc no especificado',
                    nombre: 'Paciente no encontrado',
                    documento: 'Documento no encontrado',
                    fechaNac: '',
                    genero: '',
                    medicalHistory:'',
                    tipoAtencion: '',
                    seguro: '',
                    tipoProc: '',
                    //
                    sala: '',
                    recurso: '',
                    procedimiento: '',
                    //
                    medicoReferente: '',
                    gastroenterologo: ''
                  };
                }
              })
            );



          console.log('✅ Respuesta de Centros:', listaAgendasProcedimientos);
          setProcedimientosAgendados(Array.isArray(listaAgendasProcedimientos) ? listaAgendasProcedimientos : 
                           listaAgendasProcedimientos?.data || []);
        } catch (error) {
          console.error('❌ Error al cargar Centros:', error);
          setError(`Error al cargar Centros: ${error.message}`);
        }
      };
    
  useEffect(() => {    
     cargarProcedimientos();
     cargarMedicos();
     cargarRecursos();
     cargarSalas();
     cargarEstudios();
  }, []);

  const handleReporte = (procedimiento) => {
    // Simular descarga de PDF
    const fileName = `Reporte_${procedimiento.codigo}_${procedimiento.nombre.replace(/\s+/g, '_')}.pdf`;

    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = '#'; // En producción aquí iría la URL del PDF generado
    link.download = fileName;

    // Simular la descarga (en producción esto sería una URL real del servidor)
    console.log(`Descargando reporte: ${fileName}`);
    alert(`Descargando reporte: ${fileName}`);

    // En producción sería algo como:
    // link.href = `/api/reportes/pdf/${procedimiento.id}`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const [procedimientosAgendados_old, setProcedimientosAgendados_old] = useState([
    {
      id: 1,
      indicadores: { urgente: true, primera_vez: false },
      examen: {
        codigo: 'EX-2024-001',
        tipo: 'Endoscopia Alta',
        estado: 'Agendado'
      },
      paciente: {
        nombre: 'María Elena González',
        documento: '12345678',
        telefono: '987654321',
        edad: 38,
        historiaClinica: 'HC-2024-001'
      },
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Endoscopia 1',
      recurso: 'Endoscopio Olympus EVIS X1',
      procedimiento: 'Endoscopia Alta',
      cie10: 'K25.9',
      medicoReferente: 'Dr. Carlos García Mendoza',
      gastroenterologo: 'Dra. Ana López Silva',
      fechaExamen: '2024-01-15',
      horaExamen: '09:00'
    },
    {
      id: 2,
      indicadores: { urgente: false, primera_vez: true },
      examen: {
        codigo: 'EX-2024-002',
        tipo: 'Colonoscopia',
        estado: 'Agendado'
      },
      paciente: {
        nombre: 'Carlos Antonio Rodríguez',
        documento: '87654321',
        telefono: '912345678',
        edad: 45,
        historiaClinica: 'HC-2024-002'
      },
      centro: 'Clínica María Belén - Sede Norte',
      sala: 'Sala de Endoscopia 2',
      recurso: 'Colonoscopio',
      procedimiento: 'Colonoscopia Diagnóstica',
      cie10: 'K59.0',
      medicoReferente: 'Dr. Pedro Silva Rojas',
      gastroenterologo: 'Dr. Carlos García Mendoza',
      fechaExamen: '2024-01-16',
      horaExamen: '14:30'
    },
    {
      id: 3,
      indicadores: { urgente: false, primera_vez: false },
      examen: {
        codigo: 'EX-2024-003',
        tipo: 'Biopsia Gástrica',
        estado: 'Agendado'
      },
      paciente: {
        nombre: 'Ana Patricia Martínez',
        documento: '11223344',
        telefono: '976543210',
        edad: 52,
        historiaClinica: 'HC-2024-003'
      },
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Procedimientos',
      recurso: 'Equipo de Biopsia',
      procedimiento: 'Biopsia Gástrica',
      cie10: 'K31.9',
      medicoReferente: 'Dra. Carmen Martínez Torres',
      gastroenterologo: 'Dr. Pedro Silva Rojas',
      fechaExamen: '2024-01-17',
      horaExamen: '11:00'
    }
  ]);

  // Datos simulados para información del paciente
  const pacienteCompleto = {
    registro: 'REG-2024-001',
    documento: '12345678',
    mrn: 'MRN-001234',
    nombres: 'María Elena',
    apellidos: 'González Martínez',
    estadoCivil: 'Casada',
    genero: 'Femenino',
    fechaNacimiento: '1985-03-15',
    edad: 38,
    tipo: 'Particular',
    nacionalidad: 'Peruana',
    direccion: 'Av. Principal 123, Dpto. 201',
    distrito: 'Miraflores',
    codPostal: '15001',
    provincia: 'Lima',
    departamento: 'Lima',
    pais: 'Perú',
    correo: 'maria.gonzalez@email.com',
    telefonoCelular: '987654321',
    fechaHistoriaMedica: '2023-01-15',
    fechaUltimoTriaje: '2024-01-10'
  };

  // Datos simulados para información médica del examen
  const examenCompleto = {
    id: 'EX-001',
    numeroAcceso: 'ACC-2024-001',
    paciente: 'María Elena González',
    hc: 'HC-2024-001',
    fechaNacimiento: '1985-03-15',
    edad: 38,
    centro: 'Clínica María Belén - Sede Central',
    salaRecurso: 'Sala de Endoscopia 1 / Endoscopio Olympus',
    procedimiento: 'Endoscopia Alta',
    medicoAsignado: 'Dra. Ana López Silva',
    fechaExamen: '2024-01-15',
    estado: 'Agendado',
    estadoReporte: 'Pendiente',
    medicoRef: 'Dr. Carlos García Mendoza',
    suministros: 'Sedación, Biopsia Kit',
    cie10: 'K25.9',
    urgente: 'Sí',
    adenda: 'No',
    reporte: 'No',
    archivosMultimedia: 'Pendiente'
  };

  // Funciones auxiliares
  const getIndicadorIcon = (indicadores) => {
    const icons = [];
    if (indicadores) {
      icons.push(
        <Chip
          key="urgente"
          label="URGENTE"
          color="error"
          size="small"
          sx={{ fontSize: '10px', height: '20px', mr: 0.5 }}
        />
      );
    }
    if (indicadores.primera_vez) {
      icons.push(
        <Chip
          key="primera"
          label="1RA VEZ"
          color="info"
          size="small"
          sx={{ fontSize: '10px', height: '20px', mr: 0.5 }}
        />
      );
    }
    return icons.length > 0 ? icons : <Typography variant="caption" color="text.secondary">-</Typography>;
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Función para buscar procedimientos
  const handleBuscarProcedimientos = () => {
    console.log('Buscando procedimientos con filtros:', filters);
  };

  // Filtrar procedimientos basado en los filtros (comparando fechas con Date y fin de día inclusivo)
  const procedimientosFiltrados = procedimientosAgendados.filter(proc => {
    const fechaExamenRaw = proc?.fechaExamen;

    // Parsear fechas como locales para evitar desfases por timezone y comparar solo día
    const parseLocalDate = (val) => {
      if (!val) return null;
      if (typeof val === 'string') {
        const m = val.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
        if (m) {
          return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
        }
        return new Date(val);
      }
      if (val instanceof Date) {
        return new Date(val.getFullYear(), val.getMonth(), val.getDate());
      }
      return null;
    };

    const examDate = parseLocalDate(fechaExamenRaw);
    const startDate = parseLocalDate(filters.fechaInicio);
    const endDate = parseLocalDate(filters.fechaFin);

    const toStartOfDay = (d) => (d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null);
    const toEndOfDay = (d) => (d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999) : null);

    const normalizedExam = toStartOfDay(examDate);
    const cumpleFechaInicio = !startDate || (normalizedExam && normalizedExam >= toStartOfDay(startDate));
    const cumpleFechaFin = !endDate || (normalizedExam && normalizedExam <= toEndOfDay(endDate));

    const sala = (proc?.sala || '').toLowerCase();
    const cumpleSala = !filters.sala || sala.includes((filters.sala || '').toLowerCase());
    const procedimiento = (proc?.procedimiento || '').toLowerCase();
    const cumpleProcedimiento = !filters.procedimiento || procedimiento.includes((filters.procedimiento || '').toLowerCase());
    const nombrePaciente = proc?.paciente?.nombre || '';
    const documentoPaciente = proc?.paciente?.documento || '';
    const search = (filters.searchTerm || '').toLowerCase();
    const cumpleBusqueda = !filters.searchTerm ||
      nombrePaciente.toLowerCase().includes(search) ||
      documentoPaciente.includes(filters.searchTerm);

    return cumpleFechaInicio && cumpleFechaFin && cumpleSala && cumpleProcedimiento && cumpleBusqueda;
  });

  // Funciones para manejar modales
  const handleOpenPatientHistory = async (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenPatientHistoryModal(true);
    try {
      setLoadingPaciente(true);
      let resp;
      if (procedimiento.pacientId) {
        resp = await patientsService.getById(procedimiento.pacientId);
      } else if (procedimiento.pacientid) {
        resp = await patientsService.getById(procedimiento.pacientid);
      } else if (procedimiento.documento) {
        resp = await patientsService.getByDocumentNumber(procedimiento.documento);
      }
      const data = resp?.data || null;
      if (data && data.centroId) {
        try {
          const centroResp = await centrosService.getById(data.centroId);
          data.centroNombre = centroResp?.data?.nombre || '';
        } catch {}
      }
      setSelectedPaciente(data);
    } catch {
      setSelectedPaciente(null);
    } finally {
      setLoadingPaciente(false);
    }
  };

  const handleClosePatientHistory = () => {
    setOpenPatientHistoryModal(false);
    setSelectedProcedimiento(null);
    setSelectedPaciente(null);
    setLoadingPaciente(false);
  };

  const handleOpenExamHistory = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenExamHistoryModal(true);
  };

  const handleCloseExamHistory = () => {
    setOpenExamHistoryModal(false);
    setSelectedProcedimiento(null);
  };

  // Funciones para las acciones
  const handlePacientePresente = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenConfirmPresentModal(true);
  };

  const handleConfirmPacienteInicio = async(e) => {

    e.preventDefault();

    console.log('Paciente se presentó:', selectedProcedimiento);
    // Mover el procedimiento de Agendados a Completados
    // Actualizar el estado del procedimiento
    const procedimientoCompletado = {
      ...selectedProcedimiento,
      status: 10064,
    };

    // Aquí normalmente harías una llamada a la API para mover el procedimiento
    // y luego actualizarías la lista local

    // Remover de la lista de agendados
    //setProcedimientosAgendados(prev =>
    //  prev.filter(proc => proc.id !== selectedProcedimiento.id)
    //);

    const procedimientoActualizado = await appointmentsService.update_Estado_Proc(selectedProcedimiento.id, procedimientoCompletado);
    
    console.log('✅ Procedimiento actualizado:', procedimientoActualizado);


    await cargarProcedimientos();

    // En un sistema real, aquí también añadirías el procedimiento a la lista de completados
    // Esto se haría a través de una API call o context/store
    //console.log('Procedimiento movido a Completados:', procedimientoCompletado);

    handleCloseConfirmPresentModal();

    // Opcional: mostrar mensaje de éxito
    // alert(`Procedimiento completado: ${selectedProcedimiento.paciente.nombre}`);
  };

  const handleReagendar = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);

    // Normalizar fecha y hora del procedimiento actual
    const fechaActual = (() => {
      const f = procedimiento?.appointmentDate || procedimiento?.fechaExamen || '';
      if (!f) return '';
      if (typeof f === 'string') {
        const parts = f.split('T');
        return parts[0] || '';
      }
      if (f instanceof Date) {
        const y = f.getFullYear();
        const m = String(f.getMonth() + 1).padStart(2, '0');
        const d = String(f.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return '';
    })();

    const horaActual = (() => {
      const h = procedimiento?.hoursMedicalShedule || procedimiento?.horaExamen || '';
      if (!h) return '';
      if (typeof h === 'string') {
        // Asegurar formato HH:mm
        const hhmm = h.substring(0,5);
        return hhmm;
      }
      return '';
    })();

    setRescheduleForm({
      id: procedimiento.id,
      medico: procedimiento?.personalId || '',
      sala: procedimiento?.procedureRoomId || '',
      equipo: procedimiento?.resourcesId || '',
      fecha: fechaActual,
      hora: horaActual
    });

    setOpenRescheduleModal(true);
  };

  const handleSubirArchivos = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    cargarArchivos(procedimiento?.codigo);
    setUploadForm({
      selectedFile: null,
      tipoArchivo: '',
      descripcion: ''
    });
    setOpenUploadModal(true);
  };

  const handleSubirArchivo = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    cargarArchivos(procedimiento?.codigo);
    setUploadForm({
      selectedFile: null,
      tipoArchivo: '',
      descripcion: ''
    });
    setOpenUploadModal(true);
  };

  // Estado para el formulario de correo
    const [emailForm, setEmailForm] = useState({
      destinatario: ''
    });

  const handleEnviarCorreo = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setEmailForm({
      destinatario: ''
    });
    setOpenEmailModal(true);
  };

  // Funciones para manejar el modal de email
  const handleCloseEmailModal = () => {
    setOpenEmailModal(false);
    setSelectedProcedimiento(null);
    setEmailForm({
      destinatario: ''
    });
  };

  const handleEmailFormChange = (field, value) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendEmail = () => {
    console.log('Enviando correo:', {
      procedimiento: selectedProcedimiento,
      email: emailForm
    });
    // Aquí implementarías la lógica para enviar el correo
    handleCloseEmailModal();
  };
  
  const handleAltaExamen = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenCancelModal(true);
  };

  const handleCie10 = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setCie10Form({
      codigoSeleccionado: '',
      descripcionSeleccionada: ''
    });
    setCie10Seleccionados([]);
    setOpenCie10Modal(true);
  };

  // Funciones para cerrar modales
  const handleCloseAltaModal = () => {
    setOpenCancelModal(false);
    setSelectedProcedimiento(null);
  };

  const handleCloseRescheduleModal = () => {
    setOpenRescheduleModal(false);
    setSelectedProcedimiento(null);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setSelectedProcedimiento(null);
  };

  const handleCloseCie10Modal = () => {
    setOpenCie10Modal(false);
    setSelectedProcedimiento(null);
  };

  const handleCloseConfirmPresentModal = () => {
    setOpenConfirmPresentModal(false);
    setSelectedProcedimiento(null);
  };

  // Función para confirmar cancelación
  const handleConfirmAlta = async(e) => {
    e.preventDefault();

    console.log('Se cancela atención:', selectedProcedimiento);

    const procedimientoCompletado = {
      ...selectedProcedimiento,
      status: 10066,
    };

    const procedimientoActualizado = await appointmentsService.update_Estado_Proc(selectedProcedimiento.id, procedimientoCompletado);
    
    console.log('✅ Procedimiento cancelado:', procedimientoActualizado);


    await cargarProcedimientos();

    handleCloseAltaModal();
    
    {/*
    console.log('Examen cancelado:', selectedProcedimiento);
    // Aquí actualizarías el estado del procedimiento a cancelado
    setProcedimientosAgendados(prev =>
      prev.filter(proc => proc.id !== selectedProcedimiento.id)
    );
    handleCloseAltaModal();
    */}
  };

  // Función para confirmar reagendamiento
  const handleConfirmReschedule = async(e) => {
    console.log('Procedimiento reagendado:', rescheduleForm);

    const procedimientoCompletado = {
      ...rescheduleForm,
      status: 10068,
      personalId: rescheduleForm.medico,
      procedureRoomId: rescheduleForm.sala,
      resourcesId: rescheduleForm.equipo,
      appointmentDate: rescheduleForm.fecha,
      hoursMedicalShedule: rescheduleForm.hora
    };
    
    const procedimientoActualizado = await appointmentsService.update_Sala_med_equipo_fecha_hora_Proc(rescheduleForm.id, procedimientoCompletado);
    
    console.log('✅ Procedimiento cancelado:', procedimientoActualizado);
    await cargarProcedimientos();
    // Aquí actualizarías el procedimiento con los nuevos datos
    handleCloseRescheduleModal();
  };

  // Función para manejar selección de archivos
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setUploadForm(prev => ({ ...prev, selectedFile: file }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result || '';
        const str = typeof result === 'string' ? result : '';
        const mimeMatch = str.match(/^data:(.+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : (file && file.type) || '';
        resolve({ dataUrl: str, mime });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const cargarArchivos = async (codigoEstudio) => {
    try {
      if (!codigoEstudio) return;
      const response = await archivodigitalService.searchByEstudioId_Otros(codigoEstudio);
      const list = Array.isArray(response) ? response : (response?.data || []);
      setArchivosSubidos(list);
    } catch (error) {
      console.error('❌ Error al cargar archivos:', error);
      setArchivosSubidos([]);
      try { setSnackbar({ open: true, message: 'Error al cargar archivos', severity: 'error' }); } catch {}
    }
  };

  const handleUploadFile = async () => {
    const file = uploadForm.selectedFile;
    if (file && uploadForm.tipoArchivo) {
      try {
        const { dataUrl, mime } = await fileToBase64(file);
        const payload = {
          date: new Date().toISOString(),
          hour: new Date().getHours() + ':'+ new Date().getMinutes(),
          estudioId: selectedProcedimiento.codigo,
          nombre: file.name,
          mimeType: mime,
          tipoArchivo: uploadForm.tipoArchivo,
          archive: dataUrl,
          fechaCreacion: new Date().toISOString().split('T')[0],
          tamaño: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          createdAt: new Date().toISOString(),
        };

        try {
          const nuevoArchivo = await archivodigitalService.create_CaptureImagenes(payload);
          console.log('✅ Archivo creado:', nuevoArchivo);
          setSnackbar({ open: true, message: 'Guardado correcto', severity: 'success' });
          setUploadForm({ selectedFile: null, tipoArchivo: '', descripcion: '' });
          await cargarArchivos(selectedProcedimiento?.codigo);
        } catch (err) {
          console.log('Payload preparado para envío:', payload);
          setSnackbar({ open: true, message: 'Error al guardar archivo', severity: 'error' });
        }
      } catch {
        console.error('Error al convertir archivo a Base64');
        setSnackbar({ open: true, message: 'Error al convertir archivo', severity: 'error' });
      }
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await archivodigitalService.delete(fileId);
      setSnackbar({ open: true, message: 'Eliminado correcto', severity: 'success' });
      await cargarArchivos(selectedProcedimiento?.codigo);
    } catch (error) {
      console.error('❌ Error al eliminar Archivo Digital:', error);
    }
  };

  // Funciones para CIE-10
  const handleAgregarCie10 = () => {
    if (cie10Form.codigoSeleccionado && cie10Form.descripcionSeleccionada) {
      const nuevoCie10 = {
        id: cie10Seleccionados.length + 1,
        codigo: cie10Form.codigoSeleccionado,
        descripcion: cie10Form.descripcionSeleccionada
      };

      // Verificar que no esté ya agregado
      const yaExiste = cie10Seleccionados.some(item => item.codigo === nuevoCie10.codigo);
      if (!yaExiste) {
        setCie10Seleccionados(prev => [...prev, nuevoCie10]);
        setCie10Form({
          codigoSeleccionado: '',
          descripcionSeleccionada: ''
        });
      }
    }
  };

  const handleEliminarCie10 = (id) => {
    setCie10Seleccionados(prev => prev.filter(item => item.id !== id));
  };

  const handleCie10SelectChange = (codigoSeleccionado) => {
    const cie10Encontrado = codigosCie10.find(item => item.codigo === codigoSeleccionado);
    setCie10Form({
      codigoSeleccionado,
      descripcionSeleccionada: cie10Encontrado ? cie10Encontrado.descripcion : ''
    });
  };

  // Función para guardar CIE-10
  const handleGuardarCie10 = () => {
    console.log('CIE-10 guardados:', cie10Seleccionados);
    // Aquí actualizarías los códigos CIE-10 del procedimiento
    // En un sistema real, harías una llamada a la API
    handleCloseCie10Modal();
  };

  const getTipoColor = (tipo) => {
    if (!tipo) return 'default';
    //const tipoNum = parseInt(tipo);
    switch (tipo) {
      case 'Completado': return 'success';
      case 'Alta': return 'success';
      default: return 'default';
    }
  };

  // Función para obtener el label del tipo
  const getTipoLabel = (tipo) => {
    if (!tipo) return 'No definido';
    const tipoNum = parseInt(tipo);
    switch (tipoNum) {
      case 10024: return 'Laboratorio';
      case 10025: return 'Adicional';
      default: return 'Otro';
    }
  };

  const formatLocalDateTime = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    const date = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  };

  const getArchivoTipoLabel = (mime) => {
    if (mime === 'application/pdf') return 'PDF';
    if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mime === 'application/msword') return 'Word';
    if (mime === 'application/vnd.ms-excel' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'Excel';
    return 'Otro';
  };

  const getArchivoTipoColor = (mime) => {
    if (mime === 'application/pdf') return 'warning';
    if (mime === 'application/vnd.ms-excel' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'success';
    return 'default';
  };

  const getExtensionFromMime = (mime) => {
    if (mime === 'application/pdf') return 'pdf';
    if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mime === 'application/msword') return 'docx';
    if (mime === 'application/vnd.ms-excel') return 'xls';
    if (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
    return 'dat';
  };

  const handleDownloadFile = (item) => {
    if (!item) return;
    const mime = item.typeArchive || 'application/octet-stream';
    let href = item.archive || '';
    if (typeof href !== 'string') return;
    if (!/^data:/.test(href)) href = `data:${mime};base64,${href}`;
    const a = document.createElement('a');
    a.href = href;
    const baseName = item.description || item.nombre || 'archivo';
    const hasExt = /\.[a-z0-9]+$/i.test(baseName);
    a.download = hasExt ? baseName : `${baseName}.${getExtensionFromMime(mime)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          href="/procedimientos"
          onClick={(e) => {
            e.preventDefault();
            navigate('/procedimientos');
          }}
        >
          Procedimientos
        </Link>
        <Typography color="text.primary">Altas</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              {/* Cabecera - 20% */}
              <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
                {/* Título */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ExitToApp sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
                    Altas de Procedimientos
                  </Typography>
                </Box>
          {/* Filtros de Búsqueda */}
          <FieldRow>
            <ResponsiveField label="Fecha Inicio" required>
              <TextField
                fullWidth
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
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
            </ResponsiveField>

            <ResponsiveField label="Fecha Fin" required>
              <TextField
                fullWidth
                type="date"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
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
            </ResponsiveField>

            <ResponsiveField label="Sala">
              <FormControl fullWidth size="small">
                <Select
                  value={filters.sala}
                  onChange={(e) => handleFilterChange('sala', e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }}
                >
                  <MenuItem value="">Todas las salas</MenuItem>
                  {Array.isArray(salaD) && salaD.map(sala => (
                    <MenuItem key={sala.id} value={sala.name}>
                      {sala.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ResponsiveField>

            <ResponsiveField label="Procedimiento">
              <FormControl fullWidth size="small">
                <Select
                  value={filters.procedimiento}
                  onChange={(e) => handleFilterChange('procedimiento', e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  }}
                >
                  <MenuItem value="">Todos los procedimientos</MenuItem>
                  {Array.isArray(estudioD) && estudioD.map(estudio => (
                    <MenuItem key={estudio.id} value={estudio.name}>
                      {estudio.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ResponsiveField>
          </FieldRow>

          <FieldRow>
            <ResponsiveField label="Buscar Paciente" sx={{ flex: 3 }}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre del paciente..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
            </ResponsiveField>

           <ResponsiveField label=" " sx={{ flex: 1 }}>
                         <Button
                           fullWidth
                           variant="contained"
                           startIcon={<Search />}
                           onClick={handleBuscarProcedimientos}
                           sx={{
                             backgroundColor: '#2184be',
                             '&:hover': {
                               backgroundColor: '#2184be'
                             },
                             minHeight: '40px'
                           }}
                         >
                           Buscar
                         </Button>
                       </ResponsiveField>
          </FieldRow>
        </Paper>

        {/* Contenido - 80% */}
        <Paper sx={{ flex: 1, boxShadow: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title={`Lista de Procedimientos Completados/Alta (${procedimientosFiltrados.length})`} />

          {/* Tabla con scroll */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Indicadores</strong></TableCell>
                    <TableCell><strong>Examen</strong></TableCell>
                    <TableCell><strong>Paciente</strong></TableCell>
                    <TableCell><strong>Centro (Sala) {'{Recurso}'}</strong></TableCell>
                    <TableCell><strong>Procedimiento {'{CIE-10}'}</strong></TableCell>
                    <TableCell><strong>Gastroenterólogo(a) / Médico Ref.</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Alta</strong></TableCell>

                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedimientosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {filters.fechaInicio || filters.fechaFin || filters.sala || filters.procedimiento || filters.searchTerm
                            ? 'No se encontraron procedimientos que coincidan con los filtros'
                            : 'No hay procedimientos agendados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    procedimientosFiltrados.map((proc) => (
                      <TableRow key={proc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {/*{getIndicadorIcon(proc.urgente)}*/}
                           <IconButton
                                color="success"
                                size="small"
                                title="Información"
                                //onClick={() => handlePacientePresente(proc)}
                              >
                                <AddCircle />
                              </IconButton>
                              {/*
                              <IconButton
                                color="error"
                                size="small"
                                title="Información"
                                //onClick={() => handlePacientePresente(proc)}
                              >
                                <SlowMotionVideoRounded/>
                              </IconButton>*/}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                             EX-Nº { proc.codigo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {proc.tipo}
                            </Typography>
                            <br />
                            <Chip
                              label={proc.estado}
                              color={getTipoColor(proc.estado)}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {proc.nombre || '—'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({proc.genero || '—'})
                            </Typography><br />
                            <Typography variant="caption" color="text.secondary">
                              [{proc.fechaNac ? new Date(proc.fechaNac).toLocaleDateString() : '-'}]
                            </Typography><br />
                            <Typography variant="caption" color="text.secondary">
                              {'{'+proc.tipoAtencion +'}'|| '—'+'}'}
                            </Typography><br />
                            <Typography variant="caption" color="text.secondary">
                              [{proc.seguro || '—'}]
                            </Typography>
                            <br />
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenPatientHistory(proc)}
                                sx={{ fontSize: '10px', minWidth: 'auto', px: 1 }}
                              >
                                <History sx={{ fontSize: 12, mr: 0.5 }} />
                                INFO PAC
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenExamHistory(proc)}
                                sx={{ fontSize: '10px', minWidth: 'auto', px: 1 }}
                              >
                                <Assessment sx={{ fontSize: 12, mr: 0.5 }} />
                                Examen
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {proc.centro}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({proc.sala}) {'{' + proc.recurso + '}'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {proc.procedimiento}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {/*'{' + proc.cie10 + '}'*/}
                              ()
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {'{' +proc.tipoProcedimiento+ '}'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" color="primary">
                             Dr. Tt: {proc.gastroenterologo}
                            </Typography>
                            <Typography variant="caption">
                             Ref: {proc.medicoReferente}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {new Date(proc.fechaExamen).toLocaleDateString('es-ES', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              HORA: {proc.horaExamen} 
                            </Typography>
                            {/*
                            <Typography variant="body2" fontWeight="bold">
                              DURACIÓN: {proc.tiempo} mins.
                            </Typography>
                            */}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {new Date(proc.fechaCompletado).toLocaleDateString('es-ES', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              HORA: {proc.fechaCompletado ? new Date(proc.fechaCompletado).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {/*
                            <IconButton
                              color="primary"
                              size="small"
                              title="Reporte"
                              onClick={() => handleReporte(proc)}
                            >
                              <Description />
                            </IconButton>
                            */}
                            <IconButton
                              color="info"
                              size="small"
                              title="Subir archivo"
                              onClick={() => handleSubirArchivo(proc)}
                            >
                              <CloudUpload />
                            </IconButton>
                            {/*
                            <IconButton
                              color="warning"
                              size="small"
                              title="Enviar correo"
                              onClick={() => handleEnviarCorreo(proc)}
                            >
                              <Email />
                            </IconButton>
                            */}
                            </Box>
                            
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                             {/*
                            <IconButton
                              color="error"
                              size="small"
                              title="Pasar paciente a Alta"
                              onClick={() => handleAltaExamen(proc)}
                            >
                            <ExitToAppRounded />
                            </IconButton>
                             */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>

      {/* Modal para Historial del Paciente */}
      <Dialog
        open={openPatientHistoryModal}
        onClose={handleClosePatientHistory}
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
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>Detalles del Paciente</Typography>
          <IconButton onClick={handleClosePatientHistory} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2, maxHeight: '65vh', overflowY: 'auto' }}>
          {loadingPaciente ? (
            <Typography variant="body1">Cargando...</Typography>
          ) : (
            selectedPaciente && (
              <>
                <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#f8f9fa', '& .MuiTypography-body1': { fontSize: '0.9rem', lineHeight: 1.3 }, '& .MuiTypography-subtitle1': { fontSize: '0.85rem', lineHeight: 1.2 } }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: '#2184be', fontSize: '1rem' }}>1. Información del Paciente</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Nombres</Typography><Typography variant="body1">{selectedPaciente.names || 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Apellidos</Typography><Typography variant="body1">{selectedPaciente.lastNames || 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Género</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.gender} /></Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Fecha de Nacimiento</Typography><Typography variant="body1">{selectedPaciente.birthdate ? new Date(selectedPaciente.birthdate).toLocaleDateString() : 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Estado Marital</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.statusMarital} /></Typography></Grid>
                  </Grid>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Tipo de Documento</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.typeDoc} /></Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Número de Documento</Typography><Typography variant="body1">{selectedPaciente.documentNumber || 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Nacionalidad</Typography><Typography variant="body1">{selectedPaciente.nationality || 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Estado</Typography><Chip label={selectedPaciente.status ? 'Activo' : 'Inactivo'} color={selectedPaciente.status ? 'success' : 'default'} size="small" sx={{ fontWeight: 'bold' }} /></Grid>
                  </Grid>
                </Paper>
                <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#f8f9fa', '& .MuiTypography-body1': { fontSize: '0.9rem', lineHeight: 1.3 }, '& .MuiTypography-subtitle1': { fontSize: '0.85rem', lineHeight: 1.2 } }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: '#2184be', fontSize: '1rem' }}>2. Centro</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Centro Médico</Typography><Typography variant="body1">{selectedPaciente.centroNombre || 'N/A'}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Historia Clínica</Typography><Typography variant="body1">{selectedPaciente.medicalHistory || 'N/A'}</Typography></Grid>
                  </Grid>
                </Paper>
                <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#f8f9fa', '& .MuiTypography-body1': { fontSize: '0.9rem', lineHeight: 1.3 }, '& .MuiTypography-subtitle1': { fontSize: '0.85rem', lineHeight: 1.2 } }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: '#2184be', fontSize: '1rem' }}>3. Información de Residencia</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>País</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.pais} /></Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Departamento</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.department} /></Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Provincia</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.province} /></Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Distrito</Typography><Typography variant="body1"><ParametroTexto id={selectedPaciente.district} /></Typography></Grid>
                  </Grid>
                  <Grid container spacing={2}><Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Dirección</Typography><Typography variant="body1">{selectedPaciente.address || 'N/A'}</Typography></Grid></Grid>
                </Paper>
                <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#f8f9fa', '& .MuiTypography-body1': { fontSize: '0.9rem', lineHeight: 1.3 }, '& .MuiTypography-subtitle1': { fontSize: '0.85rem', lineHeight: 1.2 } }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: '#2184be', fontSize: '1rem' }}>4. Información de Contacto</Typography>
                  <Grid container spacing={2}><Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Teléfono/Celular</Typography><Typography variant="body1">{selectedPaciente.phoneNumber || 'N/A'}</Typography></Grid><Grid item xs={12} sm={6}><Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Correo Electrónico</Typography><Typography variant="body1">{selectedPaciente.email || 'N/A'}</Typography></Grid></Grid>
                </Paper>
              </>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClosePatientHistory}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Información del Examen */}
            <Dialog
              open={openExamHistoryModal}
              onClose={handleCloseExamHistory}
              maxWidth="lg"
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
                <Typography variant="h6" fontWeight="bold">Información del Examen</Typography>
                <IconButton onClick={handleCloseExamHistory} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 4 }}>
                {selectedProcedimiento && (
                  <>
                    {/* Información Médica */}
                    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                        Información Médica
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>ID: </strong> EX-Nº {selectedProcedimiento.id}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Paciente:</strong> {selectedProcedimiento.nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>H.C.:</strong> {selectedProcedimiento.medicalHistory}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Fecha de Nacimiento:</strong> {selectedProcedimiento.fechaNac ? new Date(selectedProcedimiento.fechaNac).toLocaleDateString() : '-'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Edad:</strong> {(() => {
                              const b = selectedProcedimiento?.fechaNac ? new Date(selectedProcedimiento.fechaNac) : null;
                              const r = selectedProcedimiento?.fechaExamen ? new Date(selectedProcedimiento.fechaExamen) : new Date();
                              if (!b) return '—';
                              let age = r.getFullYear() - b.getFullYear();
                              const m = r.getMonth() - b.getMonth();
                              if (m < 0 || (m === 0 && r.getDate() < b.getDate())) age--;
                              return String(age);
                            })()} años
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Centro:</strong> {selectedProcedimiento.centro}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Sala/Recurso:</strong> {selectedProcedimiento.sala} / {selectedProcedimiento.recurso}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Procedimiento:</strong> {selectedProcedimiento.procedimiento}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Médico Asignado:</strong> {selectedProcedimiento.gastroenterologo}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Médico Ref.:</strong> {selectedProcedimiento.medicoReferente}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Fecha de Examen:</strong> {new Date(selectedProcedimiento.fechaExamen).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Duracion:</strong> {selectedProcedimiento.tiempo} mins.</Typography>
                        </Grid>
                      </Grid>  
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Urgente:</strong> {selectedProcedimiento.urgente === true ?'Sí': 'No'}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Estado:</strong> {selectedProcedimiento.estado}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>  
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Estado Reporte:</strong> {selectedProcedimiento.estudioTeminadoId === 0 ? 'Sin Finalizar':selectedProcedimiento.estudioTeminadoId=== 1?'DICTADO':'Terminado'}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>  
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Archivos multimedia:</strong> 0 </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
      
                    {/* Información Clínica 
                    <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                        Información Clínica
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Suministros:</strong> {examenCompleto.suministros}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>CIE-10:</strong> {examenCompleto.cie10}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Urgente:</strong> {examenCompleto.urgente}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Adenda:</strong> {examenCompleto.adenda}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Reporte:</strong> {examenCompleto.reporte}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2"><strong>Archivos Multimedia:</strong> {examenCompleto.archivosMultimedia}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>*/}
                  </>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseExamHistory}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>

      {/* Modal para Cancelar Examen */}
      <Dialog
        open={openCancelModal}
        onClose={handleCloseAltaModal}
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
          <Typography variant="h6" fontWeight="bold">Confirmar Cancelación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea cancelar el examen de{' '}
            <strong>"{selectedProcedimiento?.paciente?.nombre}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Procedimiento: {selectedProcedimiento?.procedimiento}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fecha: {selectedProcedimiento?.fechaExamen ? new Date(selectedProcedimiento.fechaExamen).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'} - {selectedProcedimiento?.horaExamen || '—'}
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseAltaModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmAlta}
            startIcon={<Cancel />}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Reagendar */}
      <Dialog
        open={openRescheduleModal}
        onClose={handleCloseRescheduleModal}
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
          <Typography variant="h6" fontWeight="bold">Reagendar Procedimiento</Typography>
          <IconButton onClick={handleCloseRescheduleModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedProcedimiento && (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                <strong>Paciente:</strong> {selectedProcedimiento?.nombre || '—'} -
                <strong> Procedimiento:</strong> {selectedProcedimiento?.procedimiento}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Selección de Médico, Sala y Equipo */}
              <FieldRow>
                <ResponsiveField label="Médico" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={rescheduleForm.medico}
                      onChange={(e) => setRescheduleForm(prev => ({ ...prev, medico: e.target.value }))}
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
                      value={rescheduleForm.sala}
                      onChange={(e) => setRescheduleForm(prev => ({ ...prev, sala: e.target.value }))}
                      displayEmpty
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

                <ResponsiveField label="Equipo" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={rescheduleForm.equipo}
                      onChange={(e) => setRescheduleForm(prev => ({ ...prev, equipo: e.target.value }))}
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
              </FieldRow>

              <Divider sx={{ my: 3 }} />

              {/* Horario para Reagendar */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Horario para Reagendar
              </Typography>
              <FieldRow>
                <ResponsiveField label="Nueva Fecha" required>
                  <TextField
                    fullWidth
                    type="date"
                    value={rescheduleForm.fecha}
                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, fecha: e.target.value }))}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>

                <ResponsiveField label="Nueva Hora" required>
                  <TextField
                    fullWidth
                    type="time"
                    value={rescheduleForm.hora}
                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, hora: e.target.value }))}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>
              </FieldRow>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseRescheduleModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmReschedule}
            disabled={!rescheduleForm.medico || !rescheduleForm.sala || !rescheduleForm.equipo || !rescheduleForm.fecha || !rescheduleForm.hora}
            startIcon={<Schedule />}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Confirmar Reagendamiento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Subir Archivos */}
      <Dialog
        open={openUploadModal}
        onClose={handleCloseUploadModal}
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
          <Typography variant="h6" fontWeight="bold">Subir Archivos</Typography>
          <IconButton onClick={handleCloseUploadModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedProcedimiento && (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                <strong>Paciente:</strong> {selectedProcedimiento?.nombre || '—'} -
                <strong> Examen:</strong> {selectedProcedimiento?.codigo}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Selección y Subida de Archivos */}
              <FieldRow>
                <ResponsiveField label="Seleccionar Archivo" required sx={{ flex: 2 }}>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="file-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{ height: '40px' }}
                    >
                      {uploadForm.selectedFile ? uploadForm.selectedFile.name : 'Seleccionar Archivo'}
                    </Button>
                  </label>
                </ResponsiveField>

                <ResponsiveField label="Tipo" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={uploadForm.tipoArchivo}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tipoArchivo: e.target.value }))}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                      <MenuItem value="Imagen">Imagen</MenuItem>
                      <MenuItem value="Laboratorio">Laboratorio</MenuItem>
                      <MenuItem value="Documento">Documento</MenuItem>
                      <MenuItem value="Otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label=" " sx={{ flex: 0.8 }}>
                  <Button
                    variant="contained"
                    onClick={handleUploadFile}
                    disabled={!uploadForm.selectedFile || !uploadForm.tipoArchivo}
                    startIcon={<CloudUpload />}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#45a049' },
                      height: '40px'
                    }}
                  >
                    Subir
                  </Button>
                </ResponsiveField>
              </FieldRow>

              <Divider sx={{ my: 3 }} />

              {/* Tabla de Archivos */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2184be' }}>
                Archivos Subidos
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nº</strong></TableCell>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Fecha Creación</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {archivosSubidos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            No hay archivos subidos
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      archivosSubidos.map((archivo, index) => (
                        <TableRow key={archivo.id ?? index} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{archivo.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={getArchivoTipoLabel(archivo.typeArchive)}
                              color={getArchivoTipoColor(archivo.typeArchive)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatLocalDateTime(archivo.createdAt)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleDownloadFile(archivo)}
                              title="Descargar archivo"
                            >
                              <Download />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteFile(archivo.id)}
                              title="Eliminar archivo"
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseUploadModal}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal para Enviar Correo */}
      <Dialog
        open={openEmailModal}
        onClose={handleCloseEmailModal}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">Enviar Reporte por Correo</Typography>
          </Box>
          <IconButton onClick={handleCloseEmailModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
              Correo Electrónico *
            </Typography>
            <TextField
              fullWidth
              placeholder="Ingrese el correo electrónico"
              value={emailForm.destinatario}
              onChange={(e) => handleEmailFormChange('destinatario', e.target.value)}
              type="email"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseEmailModal}
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSendEmail}
            startIcon={<Email />}
            disabled={!emailForm.destinatario}
            sx={{
              backgroundColor: '#2184be',
              '&:hover': {
                backgroundColor: '#1e75a6'
              }
            }}
          >
            Enviar Correo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para CIE-10 */}
      <Dialog
        open={openCie10Modal}
        onClose={handleCloseCie10Modal}
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
          <Typography variant="h6" fontWeight="bold">Gestionar CIE-10</Typography>
          <IconButton onClick={handleCloseCie10Modal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedProcedimiento && (
            <>
              {/* Información del Examen y Paciente */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2184be' }}>
                  Información del Examen
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Examen:</strong> {selectedProcedimiento.codigo} - {selectedProcedimiento.tipo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Paciente:</strong> {selectedProcedimiento?.nombre || '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Procedimiento:</strong> {selectedProcedimiento.procedimiento}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>CIE-10 Actual:</strong> {selectedProcedimiento.cie10}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ mb: 3 }} />

              {/* Seleccionar CIE-10 */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Seleccionar CIE-10
              </Typography>

              <FieldRow>
                <ResponsiveField label="Seleccione un CIE-10" required sx={{ flex: 2 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={cie10Form.codigoSeleccionado}
                      onChange={(e) => handleCie10SelectChange(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar código CIE-10</MenuItem>
                      {codigosCie10.map((item) => (
                        <MenuItem key={item.codigo} value={item.codigo}>
                          {item.codigo} - {item.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label=" " sx={{ flex: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleAgregarCie10}
                    disabled={!cie10Form.codigoSeleccionado}
                    startIcon={<Assignment />}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#45a049' },
                      height: '40px'
                    }}
                  >
                    Agregar
                  </Button>
                </ResponsiveField>
              </FieldRow>

              <Divider sx={{ my: 3 }} />

              {/* Lista de CIE-10 Seleccionados */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2184be' }}>
                CIE-10 Seleccionados
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Código</strong></TableCell>
                      <TableCell><strong>Descripción</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cie10Seleccionados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            No hay códigos CIE-10 seleccionados
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cie10Seleccionados.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {item.codigo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.descripcion}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleEliminarCie10(item.id)}
                              title="Eliminar código"
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseCie10Modal}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={handleGuardarCie10}
            disabled={cie10Seleccionados.length === 0}
            startIcon={<Save />}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación para Paciente Presente */}
      <Dialog
        open={openConfirmPresentModal}
        onClose={handleCloseConfirmPresentModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#dbb539ff',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Iniciar Procedimiento</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Confirma inicio de procedimiento del paciente{' '}
            <strong>"{selectedProcedimiento?.nombre}"</strong>{' '}
             ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Procedimiento: {selectedProcedimiento?.procedimiento}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fecha: {selectedProcedimiento?.fechaExamen ? new Date(selectedProcedimiento.fechaExamen).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'} - {selectedProcedimiento?.horaExamen || '—'}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
            El examen cambiará al estado de "En Proceso".
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseConfirmPresentModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmPacienteInicio}
            startIcon={<CheckCircle />}
            sx={{
              backgroundColor: '#dbb539ff',
              '&:hover': { backgroundColor: '#dbb539ff' }
            }}
          >
            Confirmar Inicio de Procedimiento
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Altas;