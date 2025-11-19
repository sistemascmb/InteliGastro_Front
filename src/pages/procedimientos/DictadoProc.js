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
  ImageList,
  ImageListItem,
  CircularProgress
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
  ExitToAppRounded,
  ImageSearch,
  OpenInNew,
  AssignmentReturn,
  PlayArrow,
  BedroomChild,
  EditDocument,
  Download,
 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { appointmentsService, patientsService, staff, staffService } from 'services';
import examenesService from 'services/examenesService';
import centrosService from 'services/centrosService';
import estudiosService from 'services/estudiosService';
import salasService from 'services/salasService';
import recursosService from 'services/recursosService';
import medicosRefService from 'services/medicosRefService';
import segurosService from 'services/segurosService';
import archivodigitalService from 'services/archivodigitalService';
 

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

const DictadoProc = () => {
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
  const [selectedProc, setSelectedProc] = useState(null);
  const [openStudyImagesModal, setOpenStudyImagesModal] = useState(false);
  
  const [studyImages, setStudyImages] = useState([]);
  const [selectedStudyImage, setSelectedStudyImage] = useState(null);
  const [studyImagesLoading, setStudyImagesLoading] = useState(false);
  

  const [medicosD, setMedicosCargados] = useState([]);
  const [salaD, setSalaCargados] = useState([]);
  const [recursoD, setRecursoCargados] = useState([]);
  const [estudioD, seEstudioCargados] = useState([]);

  const handleOpenDictadoInforme = (proc) => {
    try {
      const calcEdad = () => {
        try {
          if (proc?.edad) return String(proc.edad);
          const fn = proc?.fechaNac || proc?.fechaNacimiento;
          if (!fn) return '';
          const dob = new Date(fn);
          const now = new Date();
          let edad = now.getFullYear() - dob.getFullYear();
          const m = now.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) edad--;
          return String(edad);
        } catch { return ''; }
      };
      const params = new URLSearchParams({
        nombre: (proc?.nombre || proc?.pacienteNombre || ''),
        numero: (proc?.codigo || proc?.numeroEstudio || ''),
        edad: calcEdad(),
        fecha: (proc?.fechaExamen ? new Date(proc.fechaExamen).toLocaleDateString('es-ES') : ''),
        estudio: (proc?.tipo || proc?.estudio || ''),
        procedimiento: (proc?.procedimiento || ''),
        medico: (proc?.gastroenterologo || proc?.medicoReferente || proc?.medico || ''),
        studiesId : (proc?.studiesId || proc?.examen?.studiesId || proc?.studiesId || proc?.studiesId || ''),
        pacientId : (proc?.pacientId || proc?.examen?.pacientId || proc?.pacientId || proc?.pacientId || ''),
        instrumento : (proc?.recurso || ''),
        aseguradora : (proc?.seguro || ''),
        preparacion : '-',
        dictadoGuardado: (proc?.dictadoGuardado || ''),
        estructuraHtml: (proc?.estructuraHtml || ''),
        pdfGeneradoId: (proc?.pdfGeneradoId || ''),
        informePdf: (proc?.informePdf || ''),
        estudioTeminadoId: (proc?.estudioTeminadoId || ''),

        personalId : (proc?.personalId || ''),

      });
      navigate(`/procedimientos/dictado-informe?${params.toString()}`);
    } catch {}
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
          const procedimientos = await appointmentsService.getAll_Proc_Dictado();
          
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
                    studiesId: procedimientoDat.studiesId,
                    dictadoGuardado: procedimientoDat.dictadoGuardado,
                    estructuraHtml: procedimientoDat.estructuraHtml,
                    informePdf: procedimientoDat.informePdf,
                    pdfGeneradoId: procedimientoDat.pdfGeneradoId,
                    estudioTeminadoId:  procedimientoDat.estudioTeminadoId

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
                    tipoAtencion: '',
                    seguro: '',
                    tipoProc: '',
                    //
                    sala: '',
                    recurso: '',
                    procedimiento: '',
                    //
                    medicoReferente: '',
                    gastroenterologo: '',
                    studiesId: '',
                    dictadoGuardado: '',
                    estructuraHtml: '',
                    informePdf: '',
                    pdfGeneradoId: '',
                    estudioTeminadoId:  ''
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
  const handleOpenPatientHistory = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setOpenPatientHistoryModal(true);
  };

  const handleClosePatientHistory = () => {
    setOpenPatientHistoryModal(false);
    setSelectedProcedimiento(null);
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

  const handlePacienteDictado = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setCambioDictadoModal(true);
  };

  const handleVerImagenesEstudio = async (procedimiento) => {
      if (!procedimiento) return;
      setSelectedProc(procedimiento);
      setOpenStudyImagesModal(true);
      setStudyImagesLoading(true);
      try {
        const res = await archivodigitalService.searchByEstudioId(procedimiento.codigo);
        const codigo = String(procedimiento.codigo || '');
        const imgs = (res?.data || []).filter((f) => String(f.medical_ScheduleId || '') === codigo).map((f) => ({
          id: f.id,
          description: f.description,
          mimeType: f.typeArchive,
          dataUrl: `data:${f.typeArchive};base64,${f.archive}`,
          date: f.date,
          hour: f.hour
        }));
        setStudyImages(imgs);
        setSelectedStudyImage(imgs[0] || null);
      } catch (e) {
        setStudyImages([]);
        setSelectedStudyImage(null);
      } finally {
        setStudyImagesLoading(false);
      }
    };

   
  const handleDownloadSelectedImage = () => {
        if (!selectedStudyImage) return;
        const a = document.createElement('a');
        a.href = selectedStudyImage.dataUrl;
        const ext = (selectedStudyImage.mimeType || '').split('/')[1] || 'dat';
        const name = `${selectedStudyImage.description || 'archivo'}.${ext}`;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    
      const handleOpenSelectedImage = () => {
        if (!selectedStudyImage) return;
        window.open(selectedStudyImage.dataUrl, '_blank', 'noopener,noreferrer');
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
    setUploadForm({
      selectedFile: null,
      tipoArchivo: '',
      descripcion: ''
    });
    setOpenUploadModal(true);
  };

  const handleCancelarExamen = (procedimiento) => {
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
  const handleCloseCancelModal = () => {
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
  const handleConfirmCancel = async(e) => {
    e.preventDefault();

    console.log('Se cancela atención:', selectedProcedimiento);

    const procedimientoCompletado = {
      ...selectedProcedimiento,
      status: 10067,
    };

    const procedimientoActualizado = await appointmentsService.update_Estado_Proc(selectedProcedimiento.id, procedimientoCompletado);
    
    console.log('✅ Procedimiento cancelado:', procedimientoActualizado);


    await cargarProcedimientos();

    handleCloseCancelModal();
    
    {/*
    console.log('Examen cancelado:', selectedProcedimiento);
    // Aquí actualizarías el estado del procedimiento a cancelado
    setProcedimientosAgendados(prev =>
      prev.filter(proc => proc.id !== selectedProcedimiento.id)
    );
    handleCloseCancelModal();
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

  // Función para subir archivo
  const handleUploadFile = () => {
    if (uploadForm.selectedFile && uploadForm.tipoArchivo) {
      const newFile = {
        id: archivosSubidos.length + 1,
        nombre: uploadForm.selectedFile.name,
        tipo: uploadForm.tipoArchivo,
        fechaCreacion: new Date().toISOString().split('T')[0],
        tamaño: `${(uploadForm.selectedFile.size / 1024 / 1024).toFixed(1)} MB`
      };
      setArchivosSubidos(prev => [...prev, newFile]);
      setUploadForm({
        selectedFile: null,
        tipoArchivo: '',
        descripcion: ''
      });
    }
  };

  // Función para eliminar archivo
  const handleDeleteFile = (fileId) => {
    setArchivosSubidos(prev => prev.filter(file => file.id !== fileId));
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
      case 'Dictado': return 'success';
      case 'Dictado Terminado': return 'warning';
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
        <Typography color="text.primary">Dictado</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
    <Container maxWidth="lg" sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assignment sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Lista de Procedimientos para Dictado
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
          <SectionHeader title={`Lista de Procedimientos para Dictado (${procedimientosFiltrados.length})`} />

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

                              
                                <IconButton
                                  color="error"
                                  size="small"
                                  title="Ver imágenes de estudio."
                                  onClick={() => handleVerImagenesEstudio(proc)}
                                >
                                  <PlayArrow />
                                </IconButton>
                              
                              
                            <Box sx={{ display: 'flex', gap: 0.5 }}></Box>

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
                                Historial
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
                            <Typography variant="body2" fontWeight="bold">
                              DURACIÓN: {proc.tiempo} mins.
                            </Typography>

                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>

                              <IconButton
                                color="success"
                                size="small"
                                title="Iniciar informe de paciente"
                                onClick={() => handleOpenDictadoInforme(proc)}
                              >
                                <EditDocument />

                              </IconButton> 
                              {/*
                              <IconButton
                                color="warning"
                                size="small"
                                title="Reagendar"
                                onClick={() => handleReagendar(proc)}
                              >
                                <Schedule />
                              </IconButton>
                              */}
                              <IconButton
                                color="warning"
                                size="small"
                                title="Preparación de Paciente"
                                //onClick={() => handleSubirArchivos(proc)}
                              >
                                <BedroomChild />
                              </IconButton>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                color="info"
                                size="small"
                                title="Subir archivos"
                                onClick={() => handleSubirArchivos(proc)}
                              >
                                <CloudUpload />
                              </IconButton>

                              {/*
                              <IconButton
                                color="error"
                                size="small"
                                title="Cancelar examen"
                                onClick={() => handleCancelarExamen(proc)}
                              >
                                <Cancel />
                              </IconButton>
                              */}
                              <IconButton
                                color="primary"
                                size="small"
                                title="CIE-10"
                                onClick={() => handleCie10(proc)}
                              >
                                <Assignment />
                              </IconButton>

                              
                            </Box>
                            {Number(proc.estudioTeminadoId) === 2 && (
                              <IconButton
                                color="secondary"
                                  size="small"
                                  title="Pasar Paciente a Dictado"
                                  onClick={() => handlePacienteDictado(proc)}
                                      >
                                  <AssignmentReturn />
                              </IconButton>) 
                            }
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
      </Container>

      {/* Modal para Historial del Paciente */}
      <Dialog
        open={openPatientHistoryModal}
        onClose={handleClosePatientHistory}
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
          <Typography variant="h6" fontWeight="bold">Historial del Paciente</Typography>
          <IconButton onClick={handleClosePatientHistory} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedProcedimiento && (
            <>
              {/* Sección 1: Información Básica */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información Básica
                </Typography>

                {/* Información Personal */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#666' }}>
                  Información Personal
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Registro:</strong> {pacienteCompleto.registro}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Documento:</strong> {pacienteCompleto.documento}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>MRN:</strong> {pacienteCompleto.mrn}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Nombres:</strong> {pacienteCompleto.nombres}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Apellidos:</strong> {pacienteCompleto.apellidos}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Estado Civil:</strong> {pacienteCompleto.estadoCivil}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Género:</strong> {pacienteCompleto.genero}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Fecha de Nacimiento:</strong> {pacienteCompleto.fechaNacimiento}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Edad:</strong> {pacienteCompleto.edad} años</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Tipo:</strong> {pacienteCompleto.tipo}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Nacionalidad:</strong> {pacienteCompleto.nacionalidad}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Domicilio */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#666' }}>
                  Domicilio
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Dirección:</strong> {pacienteCompleto.direccion}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Distrito:</strong> {pacienteCompleto.distrito}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Código Postal:</strong> {pacienteCompleto.codPostal}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Provincia:</strong> {pacienteCompleto.provincia}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Departamento:</strong> {pacienteCompleto.departamento}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>País:</strong> {pacienteCompleto.pais}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Contacto */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#666' }}>
                  Contacto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Correo:</strong> {pacienteCompleto.correo}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Teléfono Celular:</strong> {pacienteCompleto.telefonoCelular}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Historia Clínica */}
              <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Historia Clínica
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Fecha de Historia Médica:</strong> {pacienteCompleto.fechaHistoriaMedica}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Fecha de Último Triaje:</strong> {pacienteCompleto.fechaUltimoTriaje}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </>
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

<Dialog
        open={openStudyImagesModal}
        onClose={() => setOpenStudyImagesModal(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2184be', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Imágenes del Estudio Nº {selectedProc?.codigo || '—'}</Typography>
          <Box>
            <IconButton onClick={handleOpenSelectedImage} sx={{ color: 'white' }} disabled={!selectedStudyImage}>
              <OpenInNew />
            </IconButton>
            <IconButton onClick={handleDownloadSelectedImage} sx={{ color: 'white' }} disabled={!selectedStudyImage}>
              <Download />
            </IconButton>
            <IconButton onClick={() => setOpenStudyImagesModal(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Paciente</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedProc?.nombre || '—'}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Edad</Typography>
              <Typography variant="h6" fontWeight="bold">{(() => {
                const b = selectedProc?.fechaNac ? new Date(selectedProc.fechaNac) : null;
                const r = selectedProc?.fechaExamen ? new Date(selectedProc.fechaExamen) : new Date();
                if (!b) return '—';
                let age = r.getFullYear() - b.getFullYear();
                const m = r.getMonth() - b.getMonth();
                if (m < 0 || (m === 0 && r.getDate() < b.getDate())) age--;
                return String(age);
              })()}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Procedimiento</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedProc?.procedimiento || '—'}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Médico</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedProc?.gastroenterologo || '—'}</Typography>
            </Grid>
            {/*
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Nº Examen</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedProc?.codigo || '—'}</Typography>
            </Grid>
            */}
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              {studyImagesLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">Cargando imágenes...</Typography>
                </Box>
              ) : selectedStudyImage ? (
                selectedStudyImage?.mimeType?.startsWith('image/') ? (
                  <Box sx={{ maxWidth: '100%', maxHeight: 500 }}>
                    <img src={selectedStudyImage.dataUrl} alt={selectedStudyImage.description || ''} style={{ maxWidth: '100%', maxHeight: '500px', display: 'block' }} />
                  </Box>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    <video src={selectedStudyImage.dataUrl} controls style={{ width: '100%' }} />
                  </Box>
                )
              ) : (
                <Typography variant="body2" color="text.secondary">No hay imágenes para mostrar</Typography>
              )}
            </Box>

            <Box>
              <ImageList cols={6} gap={8} sx={{ width: '100%', maxHeight: 180 }}>
                {studyImages.map((img) => (
                  <ImageListItem key={img.id} onClick={() => setSelectedStudyImage(img)} sx={{ cursor: 'pointer', border: selectedStudyImage?.id === img.id ? '2px solid #2184be' : '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                    {img.mimeType?.startsWith('image/') ? (
                      <img src={img.dataUrl} alt={img.description || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <video src={img.dataUrl} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal para Historial del Examen */}
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
          <Typography variant="h6" fontWeight="bold">Historial del Examen</Typography>
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
                    <Typography variant="body2"><strong>ID:</strong> {examenCompleto.id}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Número de Acceso:</strong> {examenCompleto.numeroAcceso}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Paciente:</strong> {examenCompleto.paciente}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>H.C.:</strong> {examenCompleto.hc}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Fecha de Nacimiento:</strong> {examenCompleto.fechaNacimiento}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Edad:</strong> {examenCompleto.edad} años</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Centro:</strong> {examenCompleto.centro}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Sala/Recurso:</strong> {examenCompleto.salaRecurso}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Procedimiento:</strong> {examenCompleto.procedimiento}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Médico Asignado:</strong> {examenCompleto.medicoAsignado}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Fecha de Examen:</strong> {examenCompleto.fechaExamen}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Estado:</strong> {examenCompleto.estado}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Estado Reporte:</strong> {examenCompleto.estadoReporte}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Médico Ref.:</strong> {examenCompleto.medicoRef}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Información Clínica */}
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
              </Paper>
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
        onClose={handleCloseCancelModal}
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
            onClick={handleCloseCancelModal}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
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
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Fecha Creación</strong></TableCell>
                      <TableCell><strong>Tamaño</strong></TableCell>
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
                      archivosSubidos.map((archivo) => (
                        <TableRow key={archivo.id} hover>
                          <TableCell>{archivo.id}</TableCell>
                          <TableCell>{archivo.nombre}</TableCell>
                          <TableCell>
                            <Chip
                              label={archivo.tipo}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{archivo.fechaCreacion}</TableCell>
                          <TableCell>{archivo.tamaño}</TableCell>
                          <TableCell align="center">
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

export default DictadoProc;