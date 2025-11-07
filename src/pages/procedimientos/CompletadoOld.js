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
  Description,
  CloudUpload,
  Email,
  Close,
  History,
  Assessment,
  CheckCircle,
  Delete,
  BedroomChild,
  EditDocument
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

const CompletadosOld = () => {
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
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedProcedimiento, setSelectedProcedimiento] = useState(null);

  // Estado para el formulario de correo
  const [emailForm, setEmailForm] = useState({
    destinatario: ''
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
      nombre: 'Reporte_Endoscopia_001.pdf',
      tipo: 'Documento',
      fechaCreacion: '2024-01-10',
      tamaño: '2.3 MB'
    },
    {
      id: 2,
      nombre: 'Imagenes_Procedimiento.jpg',
      tipo: 'Imagen',
      fechaCreacion: '2024-01-10',
      tamaño: '1.8 MB'
    }
  ]);

  // Estado para los procedimientos completados
  const [procedimientosCompletados] = useState([
    {
      id: 1,
      indicadores: { urgente: false, primera_vez: true },
      examen: {
        codigo: 'EX-2024-010',
        tipo: 'Endoscopia Alta',
        estado: 'Completado'
      },
      paciente: {
        nombre: 'José Luis Mendoza',
        documento: '12345670',
        telefono: '987654320',
        edad: 42,
        historiaClinica: 'HC-2024-010'
      },
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Endoscopia 1',
      recurso: 'Endoscopio Olympus EVIS X1',
      procedimiento: 'Endoscopia Diagnóstica',
      cie10: 'K29.5',
      medicoReferente: 'Dr. Carlos García Mendoza',
      aprobadoPor: 'Dra. Ana López Silva',
      fechaExamen: '2024-01-10',
      horaExamen: '09:00',
      fechaCompletado: '2024-01-10',
      horaCompletado: '10:30'
    },
    {
      id: 2,
      indicadores: { urgente: true, primera_vez: false },
      examen: {
        codigo: 'EX-2024-011',
        tipo: 'Colonoscopia',
        estado: 'Completado'
      },
      paciente: {
        nombre: 'Carmen Elena Torres',
        documento: '87654320',
        telefono: '912345670',
        edad: 55,
        historiaClinica: 'HC-2024-011'
      },
      centro: 'Clínica María Belén - Sede Norte',
      sala: 'Sala de Endoscopia 2',
      recurso: 'Colonoscopio Pentax',
      procedimiento: 'Colonoscopia Diagnóstica',
      cie10: 'K59.0',
      medicoReferente: 'Dr. Pedro Silva Rojas',
      aprobadoPor: 'Dr. Carlos García Mendoza',
      fechaExamen: '2024-01-09',
      horaExamen: '14:30',
      fechaCompletado: '2024-01-09',
      horaCompletado: '16:00'
    },
    {
      id: 3,
      indicadores: { urgente: false, primera_vez: false },
      examen: {
        codigo: 'EX-2024-012',
        tipo: 'Biopsia Gástrica',
        estado: 'Completado'
      },
      paciente: {
        nombre: 'Miguel Angel Vargas',
        documento: '11223340',
        telefono: '976543200',
        edad: 48,
        historiaClinica: 'HC-2024-012'
      },
      centro: 'Clínica María Belén - Sede Central',
      sala: 'Sala de Procedimientos',
      recurso: 'Equipo de Biopsia',
      procedimiento: 'Biopsia Endoscópica',
      cie10: 'K31.9',
      medicoReferente: 'Dra. Carmen Martínez Torres',
      aprobadoPor: 'Dr. Pedro Silva Rojas',
      fechaExamen: '2024-01-08',
      horaExamen: '11:00',
      fechaCompletado: '2024-01-08',
      horaCompletado: '12:15'
    }
  ]);

  // Datos simulados para información del paciente (igual que en Agendados)
  const pacienteCompleto = {
    registro: 'REG-2024-010',
    documento: '12345670',
    mrn: 'MRN-001240',
    nombres: 'José Luis',
    apellidos: 'Mendoza Ruiz',
    estadoCivil: 'Soltero',
    genero: 'Masculino',
    fechaNacimiento: '1981-06-20',
    edad: 42,
    tipo: 'Particular',
    nacionalidad: 'Peruana',
    direccion: 'Jr. Las Flores 789',
    distrito: 'San Borja',
    codPostal: '15037',
    provincia: 'Lima',
    departamento: 'Lima',
    pais: 'Perú',
    correo: 'jose.mendoza@email.com',
    telefonoCelular: '987654320',
    fechaHistoriaMedica: '2023-06-15',
    fechaUltimoTriaje: '2024-01-10'
  };

  // Datos simulados para información médica del examen
  const examenCompleto = {
    id: 'EX-010',
    numeroAcceso: 'ACC-2024-010',
    paciente: 'José Luis Mendoza',
    hc: 'HC-2024-010',
    fechaNacimiento: '1981-06-20',
    edad: 42,
    centro: 'Clínica María Belén - Sede Central',
    salaRecurso: 'Sala de Endoscopia 1 / Endoscopio Olympus',
    procedimiento: 'Endoscopia Diagnóstica',
    medicoAsignado: 'Dra. Ana López Silva',
    fechaExamen: '2024-01-10',
    estado: 'Completado',
    estadoReporte: 'Generado',
    medicoRef: 'Dr. Carlos García Mendoza',
    suministros: 'Sedación, Material de Biopsia',
    cie10: 'K29.5',
    urgente: 'No',
    adenda: 'Sí',
    reporte: 'Sí',
    archivosMultimedia: 'Disponible'
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

  // Funció para manejar cambios en filtros
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Funció para buscar procedimientos
  const handleBuscarProcedimientos = () => {
    console.log('Buscando procedimientos completados con filtros:', filters);
  };

  // Filtrar procedimientos basado en los filtros
  const procedimientosFiltrados = procedimientosCompletados.filter(proc => {
    const cumpleFechaInicio = !filters.fechaInicio || proc.fechaCompletado >= filters.fechaInicio;
    const cumpleFechaFin = !filters.fechaFin || proc.fechaCompletado <= filters.fechaFin;
    const cumpleSala = !filters.sala || proc.sala.toLowerCase().includes(filters.sala.toLowerCase());
    const cumpleProcedimiento = !filters.procedimiento || proc.procedimiento.toLowerCase().includes(filters.procedimiento.toLowerCase());
    const cumpleBusqueda = !filters.searchTerm ||
      proc.paciente.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      proc.paciente.documento.includes(filters.searchTerm);

    return cumpleFechaInicio && cumpleFechaFin && cumpleSala && cumpleProcedimiento && cumpleBusqueda;
  });

  // Funciones para manejar modales de historial
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

  // Funciones para las nuevas acciones
  const handleReporte = (procedimiento) => {
    // Simular descarga de PDF
    const fileName = `Reporte_${procedimiento.examen.codigo}_${procedimiento.paciente.nombre.replace(/\s+/g, '_')}.pdf`;

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

  const handleSubirArchivo = (procedimiento) => {
    setSelectedProcedimiento(procedimiento);
    setUploadForm({
      selectedFile: null,
      tipoArchivo: '',
      descripcion: ''
    });
    setOpenUploadModal(true);
  };

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

  // Funciones para manejar el modal de upload
  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setSelectedProcedimiento(null);
  };

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

  const handleDeleteFile = (fileId) => {
    setArchivosSubidos(prev => prev.filter(file => file.id !== fileId));
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
        <Typography color="text.primary">Completados</Typography>
      </Breadcrumbs>

      {/* Estructura Principal con distribución 20% - 80% */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Cabecera - 20% */}
        <Paper sx={{ p: 3, mb: 3, minHeight: '20vh', boxShadow: 3 }}>
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircle sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
              Procedimientos Completados
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
          <SectionHeader title={`Lista de Procedimientos Completados (${procedimientosFiltrados.length})`} />

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
                    <TableCell><strong>Médico Ref.</strong></TableCell>
                    <TableCell><strong>Aprobado por</strong></TableCell>
                    <TableCell><strong>Fecha Examen</strong></TableCell>
                    <TableCell><strong>Completado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedimientosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {filters.fechaInicio || filters.fechaFin || filters.sala || filters.procedimiento || filters.searchTerm
                            ? 'No se encontraron procedimientos que coincidan con los filtros'
                            : 'No hay procedimientos completados'}
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
                              color="success"
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
                          <Typography variant="body2">
                            {proc.medicoReferente}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="primary">
                            {proc.aprobadoPor}
                          </Typography>
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
                              {proc.horaCompletado}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <IconButton
                              color="primary"
                              size="small"
                              title="Reporte"
                              onClick={() => handleReporte(proc)}
                            >
                              <Description />
                            </IconButton>
                            <IconButton
                              color="info"
                              size="small"
                              title="Subir archivo"
                              onClick={() => handleSubirArchivo(proc)}
                            >
                              <CloudUpload />
                            </IconButton>
                            <IconButton
                              color="warning"
                              size="small"
                              title="Enviar correo"
                              onClick={() => handleEnviarCorreo(proc)}
                            >
                              <Email />
                            </IconButton>
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

      {/* Modales de Historial (iguales a Agendados) */}
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
                    <Typography variant="body2"><strong>Fecha de último Triaje:</strong> {pacienteCompleto.fechaUltimoTriaje}</Typography>
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
    </Container>
  );
};

export default CompletadosOld;