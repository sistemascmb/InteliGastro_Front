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
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
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
  Business,
  LocalHospital,
  MedicalServices,
  Security,
  Assignment
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

const ProcedimientoAdmision = () => {
  const navigate = useNavigate();

  // Estado del stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Paciente', 'Médico Ref./Seguros', 'Procedimiento'];

  // Estados para búsqueda de paciente
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Estados para Fase 2: Médico Ref./Seguros
  const [medicoSeguros, setMedicoSeguros] = useState({
    tipoPaciente: '',
    medicoReferente: '',
    centro: '',
    seguro: '',
    aseguradora: '',
    cartaGarantia: ''
  });

  // Estados para Fase 3: Procedimiento
  const [procedimiento, setProcedimiento] = useState({
    centro: '',
    sala: '',
    recurso: '',
    tipoProcedimiento: '',
    fecha: '',
    hora: '',
    notas: ''
  });

  // Modal de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Datos simulados de pacientes
  const pacientesSimulados = [
    {
      id: 1,
      documento: '12345678',
      nombre: 'María Elena González',
      apellidos: 'Martínez López',
      telefono: '987654321',
      email: 'maria.gonzalez@email.com',
      fechaNacimiento: '1985-03-15',
      edad: 38,
      genero: 'Femenino',
      direccion: 'Av. Principal 123, Lima'
    },
    {
      id: 2,
      documento: '87654321',
      nombre: 'Carlos Antonio Rodríguez',
      apellidos: 'Silva Torres',
      telefono: '912345678',
      email: 'carlos.rodriguez@email.com',
      fechaNacimiento: '1978-08-22',
      edad: 45,
      genero: 'Masculino',
      direccion: 'Jr. Los Andes 456, Lima'
    }
  ];

  // Función para buscar paciente
  const handleBuscarPaciente = () => {
    setBusquedaRealizada(true);
    const pacienteEncontrado = pacientesSimulados.find(p =>
      p.documento.includes(searchTerm) ||
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPacienteSeleccionado(pacienteEncontrado || null);
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

  // Función para manejar cambios en Médico/Seguros
  const handleMedicoSegurosChange = (field, value) => {
    setMedicoSeguros(prev => ({ ...prev, [field]: value }));
  };

  // Función para manejar cambios en Procedimiento
  const handleProcedimientoChange = (field, value) => {
    setProcedimiento(prev => ({ ...prev, [field]: value }));
  };

  // Función para crear procedimiento
  const handleCrearProcedimiento = () => {
    setOpenConfirmDialog(true);
  };

  // Función para confirmar creación
  const handleConfirmarCreacion = () => {
    // Aquí iría la lógica para crear el procedimiento
    console.log('Creando procedimiento:', {
      paciente: pacienteSeleccionado,
      medicoSeguros,
      procedimiento
    });

    setOpenConfirmDialog(false);
    // Redirigir o mostrar mensaje de éxito
    navigate('/procedimientos/agenda-hoy');
  };

  // Validaciones para cada paso
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return pacienteSeleccionado !== null;
      case 1:
        return medicoSeguros.tipoPaciente && medicoSeguros.medicoReferente;
      case 2:
        return procedimiento.centro && procedimiento.sala && procedimiento.tipoProcedimiento;
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
                              {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
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
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Assignment sx={{ color: '#2184be', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                Documento: {pacienteSeleccionado.documento}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                Teléfono: {pacienteSeleccionado.telefono}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                Email: {pacienteSeleccionado.email}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Edad:</strong> {pacienteSeleccionado.edad} años
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Género:</strong> {pacienteSeleccionado.genero}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Dirección:</strong> {pacienteSeleccionado.direccion}
                            </Typography>
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
                          onClick={() => navigate('/pacientes/nuevo-paciente')}
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
                    onClick={() => navigate('/pacientes/nuevo-paciente')}
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
                      value={medicoSeguros.tipoPaciente}
                      onChange={(e) => handleMedicoSegurosChange('tipoPaciente', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                      <MenuItem value="particular">Particular</MenuItem>
                      <MenuItem value="asegurado">Asegurado</MenuItem>
                      <MenuItem value="convenio">Convenio Empresarial</MenuItem>
                      <MenuItem value="emergencia">Emergencia</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Médico Referente" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicoSeguros.medicoReferente}
                      onChange={(e) => handleMedicoSegurosChange('medicoReferente', e.target.value)}
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
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Centro de Referencia">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicoSeguros.centro}
                      onChange={(e) => handleMedicoSegurosChange('centro', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar centro</MenuItem>
                      <MenuItem value="sede-central">Clínica María Belén - Sede Central</MenuItem>
                      <MenuItem value="sede-norte">Clínica María Belén - Sede Norte</MenuItem>
                      <MenuItem value="sede-sur">Clínica María Belén - Sede Sur</MenuItem>
                      <MenuItem value="externo">Centro Externo</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Seguro">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicoSeguros.seguro}
                      onChange={(e) => handleMedicoSegurosChange('seguro', e.target.value)}
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
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Aseguradora">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicoSeguros.aseguradora}
                      onChange={(e) => handleMedicoSegurosChange('aseguradora', e.target.value)}
                      displayEmpty
                      disabled={!medicoSeguros.seguro || medicoSeguros.seguro === 'particular'}
                    >
                      <MenuItem value="">Seleccionar aseguradora</MenuItem>
                      <MenuItem value="rimac">Rímac Seguros y Reaseguros</MenuItem>
                      <MenuItem value="pacifico">Pacífico Seguros</MenuItem>
                      <MenuItem value="mapfre">MAPFRE Perú</MenuItem>
                      <MenuItem value="la-positiva">La Positiva Seguros</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Carta de Garantía">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicoSeguros.cartaGarantia}
                      onChange={(e) => handleMedicoSegurosChange('cartaGarantia', e.target.value)}
                      displayEmpty
                      disabled={!medicoSeguros.seguro}
                    >
                      <MenuItem value="">No requerida</MenuItem>
                      <MenuItem value="pendiente">Pendiente de Aprobación</MenuItem>
                      <MenuItem value="aprobada">Aprobada</MenuItem>
                      <MenuItem value="rechazada">Rechazada</MenuItem>
                      <MenuItem value="previa">Autorización Previa</MenuItem>
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
                      value={procedimiento.centro}
                      onChange={(e) => handleProcedimientoChange('centro', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar centro</MenuItem>
                      <MenuItem value="sede-central">Clínica María Belén - Sede Central</MenuItem>
                      <MenuItem value="sede-norte">Clínica María Belén - Sede Norte</MenuItem>
                      <MenuItem value="sede-sur">Clínica María Belén - Sede Sur</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Sala" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimiento.sala}
                      onChange={(e) => handleProcedimientoChange('sala', e.target.value)}
                      displayEmpty
                      disabled={!procedimiento.centro}
                    >
                      <MenuItem value="">Seleccionar sala</MenuItem>
                      <MenuItem value="endoscopia-1">Sala de Endoscopia 1</MenuItem>
                      <MenuItem value="endoscopia-2">Sala de Endoscopia 2</MenuItem>
                      <MenuItem value="procedimientos">Sala de Procedimientos</MenuItem>
                      <MenuItem value="cirugia-menor">Sala de Cirugía Menor</MenuItem>
                      <MenuItem value="consultorios-1">Consultorio 1</MenuItem>
                      <MenuItem value="consultorios-2">Consultorio 2</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Recurso">
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimiento.recurso}
                      onChange={(e) => handleProcedimientoChange('recurso', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar recurso</MenuItem>
                      <MenuItem value="endoscopio-olympus">Endoscopio Olympus EVIS X1</MenuItem>
                      <MenuItem value="endoscopio-pentax">Endoscopio Pentax</MenuItem>
                      <MenuItem value="colonoscopio">Colonoscopio</MenuItem>
                      <MenuItem value="equipo-biopsia">Equipo de Biopsia</MenuItem>
                      <MenuItem value="equipo-cauterizacion">Equipo de Cauterización</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Tipo de Procedimiento" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={procedimiento.tipoProcedimiento}
                      onChange={(e) => handleProcedimientoChange('tipoProcedimiento', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar procedimiento</MenuItem>
                      <MenuItem value="endoscopia-alta">Endoscopia Alta</MenuItem>
                      <MenuItem value="endoscopia-baja">Endoscopia Baja</MenuItem>
                      <MenuItem value="colonoscopia">Colonoscopia Diagnóstica</MenuItem>
                      <MenuItem value="biopsia-gastrica">Biopsia Gástrica</MenuItem>
                      <MenuItem value="cpre">CPRE</MenuItem>
                      <MenuItem value="polipectomia">Polipectomía</MenuItem>
                      <MenuItem value="dilatacion">Dilatación Esofágica</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Fecha del Procedimiento" required>
                  <TextField
                    fullWidth
                    type="date"
                    value={procedimiento.fecha}
                    onChange={(e) => handleProcedimientoChange('fecha', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>

                <ResponsiveField label="Hora del Procedimiento" required>
                  <TextField
                    fullWidth
                    type="time"
                    value={procedimiento.hora}
                    onChange={(e) => handleProcedimientoChange('hora', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>
              </FieldRow>

              <ResponsiveField label="Notas e Indicaciones">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={procedimiento.notas}
                  onChange={(e) => handleProcedimientoChange('notas', e.target.value)}
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
                  <strong>Paciente:</strong> {pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellidos}<br/>
                  <strong>Médico:</strong> {medicoSeguros.medicoReferente || 'No asignado'}<br/>
                  <strong>Procedimiento:</strong> {procedimiento.tipoProcedimiento || 'No seleccionado'}<br/>
                  <strong>Fecha:</strong> {procedimiento.fecha || 'No programada'} {procedimiento.hora && `- ${procedimiento.hora}`}
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
            ¿Confirma la creación del procedimiento con los siguientes datos?
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
                <strong>Tipo de Paciente:</strong> {medicoSeguros.tipoPaciente}
              </Typography>
              <Typography variant="body2">
                <strong>Médico Referente:</strong> {medicoSeguros.medicoReferente}
              </Typography>
              {medicoSeguros.seguro && (
                <Typography variant="body2">
                  <strong>Seguro:</strong> {medicoSeguros.seguro}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Procedimiento:
              </Typography>
              <Typography variant="body2">
                <strong>Tipo:</strong> {procedimiento.tipoProcedimiento}
              </Typography>
              <Typography variant="body2">
                <strong>Centro:</strong> {procedimiento.centro}
              </Typography>
              <Typography variant="body2">
                <strong>Sala:</strong> {procedimiento.sala}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha y Hora:</strong> {procedimiento.fecha} - {procedimiento.hora}
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