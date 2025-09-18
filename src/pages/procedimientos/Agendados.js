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
  Divider
} from '@mui/material';
import {
  NavigateNext,
  Search,
  MedicalServices,
  CheckCircle,
  Schedule,
  CloudUpload,
  Cancel,
  Assignment,
  Close,
  History,
  Assessment,
  Delete,
  Save
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

const Agendados = () => {
  const navigate = useNavigate();

  // Estado para filtros de búsqueda
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
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
  const [procedimientosAgendados, setProcedimientosAgendados] = useState([
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
    if (indicadores.urgente) {
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

  // Filtrar procedimientos basado en los filtros
  const procedimientosFiltrados = procedimientosAgendados.filter(proc => {
    const cumpleFechaInicio = !filters.fechaInicio || proc.fechaExamen >= filters.fechaInicio;
    const cumpleFechaFin = !filters.fechaFin || proc.fechaExamen <= filters.fechaFin;
    const cumpleSala = !filters.sala || proc.sala.toLowerCase().includes(filters.sala.toLowerCase());
    const cumpleProcedimiento = !filters.procedimiento || proc.procedimiento.toLowerCase().includes(filters.procedimiento.toLowerCase());
    const cumpleBusqueda = !filters.searchTerm ||
      proc.paciente.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      proc.paciente.documento.includes(filters.searchTerm);

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

  const handleConfirmPacientePresente = () => {
    console.log('Paciente se presentó:', selectedProcedimiento);

    // Mover el procedimiento de Agendados a Completados
    // Actualizar el estado del procedimiento
    const procedimientoCompletado = {
      ...selectedProcedimiento,
      fechaCompletado: new Date().toISOString().split('T')[0],
      horaCompletado: new Date().toTimeString().split(' ')[0].substring(0, 5),
      estado: 'Completado'
    };

    // Aquí normalmente harías una llamada a la API para mover el procedimiento
    // y luego actualizarías la lista local

    // Remover de la lista de agendados
    setProcedimientosAgendados(prev =>
      prev.filter(proc => proc.id !== selectedProcedimiento.id)
    );

    // En un sistema real, aquí también añadirías el procedimiento a la lista de completados
    // Esto se haría a través de una API call o context/store
    console.log('Procedimiento movido a Completados:', procedimientoCompletado);

    handleCloseConfirmPresentModal();

    // Opcional: mostrar mensaje de éxito
    // alert(`Procedimiento completado: ${selectedProcedimiento.paciente.nombre}`);
  };

  const handleReagendar = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setRescheduleForm({
      medico: '',
      sala: '',
      equipo: '',
      fecha: '',
      hora: ''
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
  const handleConfirmCancel = () => {
    console.log('Examen cancelado:', selectedProcedimiento);
    // Aquí actualizarías el estado del procedimiento a cancelado
    setProcedimientosAgendados(prev =>
      prev.filter(proc => proc.id !== selectedProcedimiento.id)
    );
    handleCloseCancelModal();
  };

  // Función para confirmar reagendamiento
  const handleConfirmReschedule = () => {
    console.log('Procedimiento reagendado:', rescheduleForm);
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
        <Typography color="text.primary">Agendados</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MedicalServices sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Procedimientos Agendados
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
                  <MenuItem value="Sala de Endoscopia 1">Sala de Endoscopia 1</MenuItem>
                  <MenuItem value="Sala de Endoscopia 2">Sala de Endoscopia 2</MenuItem>
                  <MenuItem value="Sala de Procedimientos">Sala de Procedimientos</MenuItem>
                  <MenuItem value="Sala de Cirugía Menor">Sala de Cirugía Menor</MenuItem>
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
                  <MenuItem value="Endoscopia Alta">Endoscopia Alta</MenuItem>
                  <MenuItem value="Colonoscopia">Colonoscopia</MenuItem>
                  <MenuItem value="Biopsia Gástrica">Biopsia Gástrica</MenuItem>
                  <MenuItem value="CPRE">CPRE</MenuItem>
                  <MenuItem value="Polipectomía">Polipectomía</MenuItem>
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
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#45a049'
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
          <SectionHeader title={`Lista de Procedimientos Agendados (${procedimientosFiltrados.length})`} />

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
                    <TableCell><strong>Médico Ref. Gastroenterólogo(a)</strong></TableCell>
                    <TableCell><strong>Fecha de Examen</strong></TableCell>
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
                            {getIndicadorIcon(proc.indicadores)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {proc.examen.codigo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {proc.examen.tipo}
                            </Typography>
                            <br />
                            <Chip
                              label={proc.examen.estado}
                              color="info"
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {proc.paciente.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Doc: {proc.paciente.documento}
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
                              {'{' + proc.cie10 + '}'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {proc.medicoReferente}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {proc.gastroenterologo}
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
                              {proc.horaExamen}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                color="success"
                                size="small"
                                title="Paciente se presentó al centro"
                                onClick={() => handlePacientePresente(proc)}
                              >
                                <CheckCircle />
                              </IconButton>
                              <IconButton
                                color="warning"
                                size="small"
                                title="Reagendar"
                                onClick={() => handleReagendar(proc)}
                              >
                                <Schedule />
                              </IconButton>
                              <IconButton
                                color="info"
                                size="small"
                                title="Subir archivos"
                                onClick={() => handleSubirArchivos(proc)}
                              >
                                <CloudUpload />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                color="error"
                                size="small"
                                title="Cancelar examen"
                                onClick={() => handleCancelarExamen(proc)}
                              >
                                <Cancel />
                              </IconButton>
                              <IconButton
                                color="primary"
                                size="small"
                                title="CIE-10"
                                onClick={() => handleCie10(proc)}
                              >
                                <Assignment />
                              </IconButton>
                            </Box>
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
            Fecha: {selectedProcedimiento?.fechaExamen} - {selectedProcedimiento?.horaExamen}
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
                <strong>Paciente:</strong> {selectedProcedimiento.paciente.nombre} -
                <strong> Procedimiento:</strong> {selectedProcedimiento.procedimiento}
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
                      <MenuItem value="dr-garcia">Dr. Carlos García Mendoza</MenuItem>
                      <MenuItem value="dra-lopez">Dra. Ana López Silva</MenuItem>
                      <MenuItem value="dr-silva">Dr. Pedro Silva Rojas</MenuItem>
                      <MenuItem value="dra-martinez">Dra. Carmen Martínez Torres</MenuItem>
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
                      <MenuItem value="endoscopia-1">Sala de Endoscopia 1</MenuItem>
                      <MenuItem value="endoscopia-2">Sala de Endoscopia 2</MenuItem>
                      <MenuItem value="procedimientos">Sala de Procedimientos</MenuItem>
                      <MenuItem value="cirugia-menor">Sala de Cirugía Menor</MenuItem>
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
                      <MenuItem value="">Seleccionar equipo</MenuItem>
                      <MenuItem value="endoscopio-olympus">Endoscopio Olympus EVIS X1</MenuItem>
                      <MenuItem value="endoscopio-pentax">Endoscopio Pentax</MenuItem>
                      <MenuItem value="colonoscopio">Colonoscopio</MenuItem>
                      <MenuItem value="equipo-biopsia">Equipo de Biopsia</MenuItem>
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
                <strong>Paciente:</strong> {selectedProcedimiento.paciente.nombre} -
                <strong> Examen:</strong> {selectedProcedimiento.examen.codigo}
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
                      <strong>Examen:</strong> {selectedProcedimiento.examen.codigo} - {selectedProcedimiento.examen.tipo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Paciente:</strong> {selectedProcedimiento.paciente.nombre}
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
          backgroundColor: '#4caf50',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Confirmar Presencia</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Confirma que el paciente{' '}
            <strong>"{selectedProcedimiento?.paciente?.nombre}"</strong>{' '}
            se presentó al examen?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Procedimiento: {selectedProcedimiento?.procedimiento}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fecha: {selectedProcedimiento?.fechaExamen} - {selectedProcedimiento?.horaExamen}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
            El examen se moverá a la lista de "Completados".
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
            onClick={handleConfirmPacientePresente}
            startIcon={<CheckCircle />}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Confirmar Presencia
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Agendados;