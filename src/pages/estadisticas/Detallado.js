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
  BarChart,
  AddCircle,
  Close,
  History,
  Assessment,
  Assignment,
  Delete,
  Save,
  SlowMotionVideoRounded,
  OpenInNew,
  Download
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { appointmentsService, patientsService, staffService } from 'services';
import centrosService from 'services/centrosService';
import estudiosService from 'services/estudiosService';
import salasService from 'services/salasService';
import recursosService from 'services/recursosService';
import medicosRefService from 'services/medicosRefService';
import segurosService from 'services/segurosService';
 
import archivodigitalService from 'services/archivodigitalService';
import agendadxService from 'services/agendadxService';
import cie10Service from 'services/cie10Service';

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

const EstadisticasDetallado = () => {
  const navigate = useNavigate();

  // Estado para filtros de búsqueda
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const [filters, setFilters] = useState({
    fechaInicio: todayStr,
    fechaFin: todayStr,
    searchTerm: ''
  });

  // Estados para modales
  const [openPatientHistoryModal, setOpenPatientHistoryModal] = useState(false);
  const [openExamHistoryModal, setOpenExamHistoryModal] = useState(false);
  const [openCie10Modal, setOpenCie10Modal] = useState(false);
  
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);
  const [selectedProc, setSelectedProc] = useState(null);
  const [openStudyImagesModal, setOpenStudyImagesModal] = useState(false);
  const [studyImages, setStudyImages] = useState([]);
  const [selectedStudyImage, setSelectedStudyImage] = useState(null);
  const [studyImagesLoading, setStudyImagesLoading] = useState(false);
  

  const [error, setError] = useState(null);

  

  

  

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
          const procedimientos = await appointmentsService.getAll_Proc_Buscados_Fechas({
            startDate: filters.fechaInicio,
            endDate: filters.fechaFin
          });
          
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

                  const cantidadMultimedia = await archivodigitalService.searchByEstudioId(procedimientoDat.medicalscheduleid);
                  // Transformar el estado a ID numérico, manejando tanto booleano como texto
                  
                  const datosdelCie10 = await agendadxService.searchByAgendaDxEstudioId(procedimientoDat.medicalscheduleid);
                  const listaCie10 = Array.isArray(datosdelCie10) ? datosdelCie10 : (datosdelCie10?.data || []);
                  const cie10Pairs = await Promise.all((listaCie10 || []).map(async (dx) => {
                    try {
                      const cie = await cie10Service.getById(dx.cie10id);
                      const c = Array.isArray(cie) ? null : (cie?.data || {});
                      const code = c?.codigo || c?.code || '';
                      const desc = c?.descripcion || c?.description || '';
                      return [code, desc].filter(Boolean).join(':');
                    } catch {
                      const code = String(dx.cie10id || '');
                      const desc = dx.description || '';
                      return [code, desc].filter(Boolean).join(':');
                    }
                  }));
                  const cie10Concatenado = (cie10Pairs || []).filter(Boolean).join(' / ');

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
                    anotacionesAdicionales: procedimientoDat.anotacionesAdicionales || '-',
                    cantidadMultimediaEstudio: Array.isArray(cantidadMultimedia?.data) ? cantidadMultimedia.data.length : 0,
                    cie10: cie10Concatenado,
                    fechacrea: procedimientoDat.createdAt,
                    usuariocrea: procedimientoDat.createdBy,
                    usuarioactualiza: procedimientoDat.updatedBy,


                  };
                } catch (error) {
                  console.error(`Error al obtener centro ${procedimientoDat.personalId}:`, error);
                  return {
                    ...procedimientoDat,
                    fechacrea: '',
                    usuariocrea: '',
                    usuarioactualiza: '',
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
                    medicalHistory: '',
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
                    anotacionesAdicionales: '',
                    cantidadMultimediaEstudio: ''
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
  }, []);

  

  

  // Función para manejar cambios en filtros
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Función para buscar procedimientos
  const handleBuscarProcedimientos = async () => {
    try {
      const procedimientos = await appointmentsService.getAll_Proc_Buscados_Fechas({
        startDate: filters.fechaInicio,
        endDate: filters.fechaFin
      });

      const listaAgendasProcedimientos = await Promise.all(
        (procedimientos?.data || []).map(async (procedimientoDat) => {
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

            const cantidadMultimedia = await archivodigitalService.searchByEstudioId(procedimientoDat.medicalscheduleid);
            const datosdelCie10 = await agendadxService.searchByAgendaDxEstudioId(procedimientoDat.medicalscheduleid);
            const listaCie10 = Array.isArray(datosdelCie10) ? datosdelCie10 : (datosdelCie10?.data || []);
            const cie10Pairs = await Promise.all((listaCie10 || []).map(async (dx) => {
              try {
                const cie = await cie10Service.getById(dx.cie10id);
                const c = Array.isArray(cie) ? null : (cie?.data || {});
                const code = c?.codigo || c?.code || '';
                const desc = c?.descripcion || c?.description || '';
                return [code, desc].filter(Boolean).join(':');
              } catch {
                const code = String(dx.cie10id || '');
                const desc = dx.description || '';
                return [code, desc].filter(Boolean).join(':');
              }
            }));
            const cie10Concatenado = (cie10Pairs || []).filter(Boolean).join(' / ');

            return {
              ...procedimientoDat,
              codigo: procedimientoDat.medicalscheduleid,
              tipo: examenDatos.data.name,
              estado: estadoAgenda.data.value1,
              centro: centroDatos.data.nombre,
              nombre: pacienteDatos.data.names + ' ' + pacienteDatos.data.lastNames,
              documento: pacienteDatos.data.documentNumber,
              fechaNac: pacienteDatos.data.birthdate,
              genero: pacienteDatos.data.gender == '10001' ? 'MASCULINO' : 'FEMENINO',
              medicalHistory: pacienteDatos.data.medicalHistory,
              tipoAtencion: tipoAtencion.data.value1,
              seguro: seguroDatos.data.name,
              tipoProcedimiento: tipoProced.data.value1,
              tiempo: examenDatos.data.operatingHours,
              sala: salaDatos.data.name,
              recurso: recursosDatos.data.name,
              procedimiento: examenDatos.data.name,
              medicoReferente: medicoRefDatos.data.names + ' ' + medicoRefDatos.data.surnames,
              gastroenterologo: medicoTratDatos.data.nombres + ' ' + medicoTratDatos.data.apellidos,
              fechaExamen: procedimientoDat.appointmentDate,
              horaExamen: procedimientoDat.hoursMedicalShedule,
              urgente: procedimientoDat.urgenteId == '10059' ? true : false,
              fechaCompletado: procedimientoDat.updatedAt,
              anotacionesAdicionales: procedimientoDat.anotacionesAdicionales || '-',
              cantidadMultimediaEstudio: Array.isArray(cantidadMultimedia?.data) ? cantidadMultimedia.data.length : 0,
              cie10: cie10Concatenado
            };
          } catch (error) {
            return {
              ...procedimientoDat,
              codigo: procedimientoDat.medicalscheduleid,
              tipo: '-',
              estado: '-',
              centro: '-',
              procedimiento: '-',
              sala: '-',
              recurso: '-',
              paciente: { nombre: '-', documento: '-' },
              fechaExamen: procedimientoDat.appointmentDate,
              horaExamen: procedimientoDat.hoursMedicalShedule,
              urgente: false,
              anotacionesAdicionales: procedimientoDat.anotacionesAdicionales || '-',
              cie10: '-',
              seguro: '-',
              tipoAtencion: '-',
              tipoProcedimiento: '-',
              gastroenterologo: '-',
              medicoReferente: '-',
              multimediaCount: 0
            };
          }
        })
      );

      const term = String(filters.searchTerm || '').trim().toLowerCase();
      const next = term
        ? listaAgendasProcedimientos.filter((p) => {
            const nombre = (p?.paciente?.nombre || '').toLowerCase();
            const doc = String(p?.paciente?.documento || '');
            return nombre.includes(term) || doc.includes(filters.searchTerm || '');
          })
        : listaAgendasProcedimientos;

      setProcedimientosAgendados(next);
    } catch (error) {
      setProcedimientosAgendados([]);
    }
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

    const nombrePaciente = proc?.paciente?.nombre || '';
    const documentoPaciente = proc?.paciente?.documento || '';
    const search = (filters.searchTerm || '').toLowerCase();
    const cumpleBusqueda = !filters.searchTerm ||
      nombrePaciente.toLowerCase().includes(search) ||
      documentoPaciente.includes(filters.searchTerm);

    return cumpleFechaInicio && cumpleFechaFin && cumpleBusqueda;
  });

  const handleExportExcel = () => {
    const headers = [
      'Examen#', 'Estado', 'Paciente', 'Centro', 'Seguro', 'Sala', 'Recurso', 'Procedimiento', 'Duracion', ' CIE-10 ', 'Plan', 'Médico', 'Méd. Ref.', 'Fecha Examen', 'Hora Examen', 'Fecha Creacion', 'Hora Creacion', 'Usuario Creacion', 'Fecha Finalizado', 'Hora Finalizado', 'Usuario Finalizado'
    ];
    const rows = procedimientosFiltrados.map((p) => {
      const dExam = p?.fechaExamen ? new Date(p.fechaExamen) : null;
      const dCrea = p?.fechacrea ? new Date(p.fechacrea) : null;
      const dFin = p?.fechaCompletado ? new Date(p.fechaCompletado) : null;
      const fmtDateDefault = (d) => (d ? d.toLocaleDateString() : '');
      const fmtTimeEs = (d) => (d ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—');
      return [
        `EX-Nº ${p?.codigo || ''}`,
        p?.estado || '',
        p?.nombre || '—',
        p?.centro || '',
        p?.seguro || '',
        p?.sala || '',
        p?.recurso || '',
        p?.procedimiento || '',
        p?.tiempo != null ? `${p.tiempo} min.` : '',
        p?.cie10 || '',
        p?.tipoProcedimiento || '',
        p?.gastroenterologo || '',
        p?.medicoReferente || '',
        fmtDateDefault(dExam),
        p?.horaExamen || '',
        fmtDateDefault(dCrea),
        fmtTimeEs(dCrea),
        p?.usuariocrea || '',
        fmtDateDefault(dFin),
        fmtTimeEs(dFin),
        p?.usuarioactualiza || ''
      ];
    });
    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Procedimientos');
    const name = `procedimientos_${filters.fechaInicio || ''}_${filters.fechaFin || ''}.xlsx`;
    XLSX.writeFile(wb, name);
  };

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

  


  

  

  



  // Funciones para cerrar modales
  

  

  

  const handleCloseCie10Modal = () => {
    setOpenCie10Modal(false);
    setSelectedProcedimiento(null);
  };

  

  // Función para confirmar cancelación
  

  // Función para confirmar reagendamiento
  

  // Función para manejar selección de archivos
  

  

  

  

  // Función para eliminar archivo
  

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
      case 'En Progreso': return 'warning';
      default: return 'default';
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
          Estadísticas
        </Link>
        <Typography color="text.primary">Detallado</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <BarChart sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
                        Estadísticas Detalladas
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

            
          {/*
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
*/}
           <ResponsiveField label=" " sx={{ flex: 2 }}>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
               <Button
                 variant="contained"
                 startIcon={<Search />}
                 onClick={handleBuscarProcedimientos}
                 sx={{
                   backgroundColor: '#2184be',
                   '&:hover': {
                     backgroundColor: '#1e75a6'
                   },
                   height: '44px',
                   px: 2.5,
                   fontWeight: 'bold'
                 }}
               >
                 Buscar
               </Button>
               <Button
                 variant="contained"
                 color="success"
                 startIcon={<Download />}
                 onClick={handleExportExcel}
                 disabled={procedimientosFiltrados.length === 0}
                 sx={{
                   height: '44px',
                   px: 2.5,
                   fontWeight: 'bold'
                 }}
               >
                 Exportar Excel
               </Button>
             </Box>
           </ResponsiveField>
          </FieldRow>
        </Paper>

        {/* Contenido - 80% */}
        <Paper sx={{ flex: 1, boxShadow: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title={`Estadísticas Detalladas  (${procedimientosFiltrados.length})`} />

          {/* Tabla con scroll */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TableContainer sx={{ height: '100%' }}>
              <Table stickyHeader sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ minWidth: 80 }}><strong>Examen#</strong></TableCell>
                    <TableCell sx={{ minWidth: 100 }}><strong>Estado</strong></TableCell>
                    <TableCell sx={{ minWidth: 220 }}><strong>Paciente</strong></TableCell>
                    <TableCell sx={{ minWidth: 180 }}><strong>Centro</strong></TableCell>
                    <TableCell sx={{ minWidth: 150 }}><strong>Seguro</strong></TableCell>

                    <TableCell sx={{ minWidth: 140 }}><strong>Sala</strong></TableCell>
                    <TableCell sx={{ minWidth: 160 }}><strong>Recurso</strong></TableCell>
                    <TableCell sx={{ minWidth: 220 }}><strong>Procedimiento</strong></TableCell>
                    <TableCell sx={{ minWidth: 120 }}><strong>Duracion</strong></TableCell>

                    <TableCell sx={{ minWidth: 180 }}><strong> CIE-10 </strong></TableCell>
                    <TableCell sx={{ minWidth: 160 }}><strong>Plan</strong></TableCell>
                    <TableCell sx={{ minWidth: 200 }}><strong>Médico</strong></TableCell>
                    <TableCell sx={{ minWidth: 200 }}><strong>Méd. Ref.</strong></TableCell>
                    <TableCell sx={{ minWidth: 140 }}><strong>Fecha Examen</strong></TableCell>
                    <TableCell sx={{ minWidth: 120 }}><strong>Hora Examen</strong></TableCell>
                    <TableCell sx={{ minWidth: 140 }}><strong>Fecha Creacion</strong></TableCell>
                    <TableCell sx={{ minWidth: 120 }}><strong>Hora Creacion</strong></TableCell>
                    <TableCell sx={{ minWidth: 160 }}><strong>Usuario Creacion</strong></TableCell>

                    <TableCell sx={{ minWidth: 160 }}><strong>Fecha Finalizado</strong></TableCell>
                    <TableCell sx={{ minWidth: 140 }}><strong>Hora Finalizado</strong></TableCell>
                    <TableCell sx={{ minWidth: 160 }}><strong>Usuario Finalizado</strong></TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedimientosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {filters.fechaInicio || filters.fechaFin || filters.searchTerm
                            ? 'No se encontraron procedimientos que coincidan con los filtros'
                            : 'No hay procedimientos agendados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    procedimientosFiltrados.map((proc) => (
                      <TableRow key={proc.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                             EX-Nº { proc.codigo}
                            </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                             {proc.estado}
                            </Typography>
                        </TableCell>
                        <TableCell>
                              {proc.nombre || '—'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                             {proc.centro}
                            </Typography>
                        </TableCell>
                        <TableCell>
                             {proc.seguro}
                        </TableCell>
                        <TableCell>
                             {proc.sala}
                        </TableCell>
                        <TableCell>
                             {proc.recurso}
                        </TableCell>
                        <TableCell>
                             {proc.procedimiento}
                        </TableCell>
                        <TableCell>
                             {proc.tiempo} min.
                        </TableCell>
                        <TableCell>
                             {proc.cie10}
                        </TableCell>
                        <TableCell>
                             {proc.tipoProcedimiento}
                        </TableCell>
                        <TableCell>
                             {proc.gastroenterologo}
                        </TableCell>
                        <TableCell>
                             {proc.medicoReferente}
                        </TableCell>
                        <TableCell>
                            {new Date(proc.fechaExamen).toLocaleDateString()} 
                        </TableCell>
                        <TableCell>
                            {proc.horaExamen} 
                        </TableCell>
                        <TableCell>
                            {new Date(proc.fechacrea).toLocaleDateString()}                         
                        </TableCell>
                        <TableCell>
                              {proc.fechacrea ? new Date(proc.fechacrea).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </TableCell>
                        <TableCell>
                            {proc.usuariocrea} 
                        </TableCell>
                        <TableCell>
                            {new Date(proc.fechaCompletado).toLocaleDateString()}                         
                        </TableCell>
                        <TableCell>
                              {proc.fechaCompletado ? new Date(proc.fechaCompletado).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </TableCell>
                        <TableCell>
                            {proc.usuarioactualiza} 
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
                    <Typography variant="body2"><strong>Registro:</strong> {selectedProcedimiento?.medicalHistory || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Documento:</strong> {selectedProcedimiento?.documento || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>MRN:</strong> {selectedProcedimiento?.codigo || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Nombre:</strong> {selectedProcedimiento?.nombre || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Apellidos:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Estado Civil:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Género:</strong> {selectedProcedimiento?.genero || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Fecha de Nacimiento:</strong> {selectedProcedimiento?.fechaNac || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Edad:</strong> {selectedProcedimiento?.fechaNac ? Math.floor((Date.now() - new Date(selectedProcedimiento.fechaNac).getTime()) / (365.25*24*60*60*1000)) : '—'} años</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Tipo:</strong> {selectedProcedimiento?.tipoAtencion || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Nacionalidad:</strong> {'—'}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Domicilio */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#666' }}>
                  Domicilio
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Dirección:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Distrito:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Código Postal:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Provincia:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>Departamento:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2"><strong>País:</strong> {'—'}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Contacto */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: '#666' }}>
                  Contacto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Correo:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Teléfono Celular:</strong> {'—'}</Typography>
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
                    <Typography variant="body2"><strong>Fecha de Historia Médica:</strong> {'—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Fecha de Último Triaje:</strong> {'—'}</Typography>
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
                                          <Typography variant="body2"><strong>Fecha de Examen:</strong> {new Date(selectedProcedimiento.fechaExamen).toLocaleDateString()} - {selectedProcedimiento.horaExamen}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2"><strong>Duracion:</strong> {selectedProcedimiento.tiempo} mins.</Typography>
                                        </Grid>
                                      </Grid>  
                                      <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={12} md={6}>
                                          <Typography variant="body2"><strong>Anotaciones Adicionales:</strong> {selectedProcedimiento.anotacionesAdicionales}</Typography>
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
                          <Typography variant="body2"><strong>Archivos multimedia:</strong> {selectedProcedimiento.cantidadMultimediaEstudio} Objetos capturados en estudio.</Typography>                        </Grid>
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

      <Dialog
        open={openStudyImagesModal}
        onClose={() => setOpenStudyImagesModal(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2184be', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Imágenes del Estudio</Typography>
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
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Nº Examen</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedProc?.codigo || '—'}</Typography>
            </Grid>
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

      
    </Container>
  );
};

export default EstadisticasDetallado;