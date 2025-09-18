import React, { useState, memo } from 'react';
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
  CalendarToday,
  Home,
  LocationOn
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

const CitaMedica = () => {
  const navigate = useNavigate();

  // Estado del stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Paciente', 'Médicos/Seguros'];

  // Estados para búsqueda de paciente
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Estados para Fase 2: Médicos/Seguros
  const [medicosFollows, setMedicosFollows] = useState({
    // Horario
    centro: '',
    medico: '',
    tipoCita: '',
    fecha: '',
    hora: '',
    // Seguros
    procedencia: '',
    nombreProcedencia: '',
    aseguradora: '',
    cartaGarantia: ''
  });

  // Modal de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Datos simulados de pacientes con información completa
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

  // Función para buscar paciente
  const handleBuscarPaciente = () => {
    setBusquedaRealizada(true);
    const pacienteEncontrado = pacientesSimulados.find(p =>
      p.documento.includes(searchTerm) ||
      p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Función para manejar cambios en Médicos/Seguros
  const handleMedicosFollowsChange = (field, value) => {
    setMedicosFollows(prev => ({ ...prev, [field]: value }));
  };

  // Función para crear cita
  const handleCrearCita = () => {
    setOpenConfirmDialog(true);
  };

  // Función para confirmar creación
  const handleConfirmarCreacion = () => {
    console.log('Creando cita:', {
      paciente: pacienteSeleccionado,
      medicosFollows
    });

    setOpenConfirmDialog(false);
    navigate('/citas/agendas');
  };

  // Validaciones para cada paso
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return pacienteSeleccionado !== null;
      case 1:
        return medicosFollows.centro && medicosFollows.medico && medicosFollows.tipoCita && medicosFollows.fecha && medicosFollows.hora;
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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationOn sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Código Postal:</strong> {pacienteSeleccionado.codigoPostal}
                              </Typography>
                            </Box>
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
                                <strong>Teléfono:</strong> {pacienteSeleccionado.telefono}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone sx={{ color: '#2196f3', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                <strong>Celular:</strong> {pacienteSeleccionado.celular}
                              </Typography>
                            </Box>
                          </Grid>
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
                    onClick={() => navigate('/pacientes/pacientes')}
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
            <SectionHeader title="Médicos y Seguros" />
            <Box sx={{ p: 3 }}>
              {/* Sección Horario */}
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be', mb: 3 }}>
                Horario
              </Typography>

              <FieldRow>
                <ResponsiveField label="Centro" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.centro}
                      onChange={(e) => handleMedicosFollowsChange('centro', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar centro</MenuItem>
                      <MenuItem value="sede-central">Clínica María Belén - Sede Central</MenuItem>
                      <MenuItem value="sede-norte">Clínica María Belén - Sede Norte</MenuItem>
                      <MenuItem value="sede-sur">Clínica María Belén - Sede Sur</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Médico" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.medico}
                      onChange={(e) => handleMedicosFollowsChange('medico', e.target.value)}
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
                <ResponsiveField label="Tipo de Cita" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.tipoCita}
                      onChange={(e) => handleMedicosFollowsChange('tipoCita', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar tipo</MenuItem>
                      <MenuItem value="nueva">Nueva</MenuItem>
                      <MenuItem value="resultados">Resultados</MenuItem>
                      <MenuItem value="control">Control</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Fecha" required>
                  <TextField
                    fullWidth
                    type="date"
                    value={medicosFollows.fecha}
                    onChange={(e) => handleMedicosFollowsChange('fecha', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>

                <ResponsiveField label="Hora" required>
                  <TextField
                    fullWidth
                    type="time"
                    value={medicosFollows.hora}
                    onChange={(e) => handleMedicosFollowsChange('hora', e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </ResponsiveField>
              </FieldRow>

              <Divider sx={{ my: 4 }} />

              {/* Sección Seguros */}
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be', mb: 3 }}>
                Seguros
              </Typography>

              <FieldRow>
                <ResponsiveField label="Procedencia">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.procedencia}
                      onChange={(e) => handleMedicosFollowsChange('procedencia', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Seleccionar procedencia</MenuItem>
                      <MenuItem value="clinica-mariabelen">Clínica María Belén</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                {medicosFollows.procedencia === 'otro' && (
                  <ResponsiveField label="Nombre de Procedencia">
                    <TextField
                      fullWidth
                      value={medicosFollows.nombreProcedencia}
                      onChange={(e) => handleMedicosFollowsChange('nombreProcedencia', e.target.value)}
                      placeholder="Ingrese nombre de la institución"
                      size="small"
                    />
                  </ResponsiveField>
                )}
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Aseguradora">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.aseguradora}
                      onChange={(e) => handleMedicosFollowsChange('aseguradora', e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Sin aseguradora</MenuItem>
                      <MenuItem value="essalud">EsSalud</MenuItem>
                      <MenuItem value="rimac">Rímac Seguros</MenuItem>
                      <MenuItem value="pacifico">Pacífico Seguros</MenuItem>
                      <MenuItem value="mapfre">MAPFRE Perú</MenuItem>
                      <MenuItem value="la-positiva">La Positiva Seguros</MenuItem>
                      <MenuItem value="sis">SIS</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="Carta de Garantía">
                  <FormControl fullWidth size="small">
                    <Select
                      value={medicosFollows.cartaGarantia}
                      onChange={(e) => handleMedicosFollowsChange('cartaGarantia', e.target.value)}
                      displayEmpty
                      disabled={!medicosFollows.aseguradora}
                    >
                      <MenuItem value="">No requerida</MenuItem>
                      <MenuItem value="en-tramite">En Trámite</MenuItem>
                      <MenuItem value="aceptada">Aceptada</MenuItem>
                      <MenuItem value="rechazada">Rechazada</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              {/* Información del paciente seleccionado */}
              {pacienteSeleccionado && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Paciente seleccionado:</strong> {pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}
                    - HC: {pacienteSeleccionado.historiaClinica}
                  </Typography>
                </Alert>
              )}
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
        <Typography color="text.primary">Cita Médica</Typography>
      </Breadcrumbs>

      {/* Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <CalendarToday sx={{ color: '#2184be', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#2184be' }}>
          Admisión de Cita Médica
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
                onClick={handleCrearCita}
                disabled={!isStepValid(activeStep)}
                startIcon={<Save />}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Crear Cita
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
            Confirmar Creación de Cita Médica
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            ¿Confirma la creación de la cita médica con los siguientes datos?
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Información del Paciente:
              </Typography>
              <Typography variant="body2">
                <strong>Nombre:</strong> {pacienteSeleccionado?.nombres} {pacienteSeleccionado?.apellidos}
              </Typography>
              <Typography variant="body2">
                <strong>Historia Clínica:</strong> {pacienteSeleccionado?.historiaClinica}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Horario:
              </Typography>
              <Typography variant="body2">
                <strong>Centro:</strong> {medicosFollows.centro}
              </Typography>
              <Typography variant="body2">
                <strong>Médico:</strong> {medicosFollows.medico}
              </Typography>
              <Typography variant="body2">
                <strong>Tipo de Cita:</strong> {medicosFollows.tipoCita}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha y Hora:</strong> {medicosFollows.fecha} - {medicosFollows.hora}
              </Typography>
            </Grid>

            {medicosFollows.aseguradora && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  Seguros:
                </Typography>
                <Typography variant="body2">
                  <strong>Procedencia:</strong> {medicosFollows.procedencia}
                </Typography>
                <Typography variant="body2">
                  <strong>Aseguradora:</strong> {medicosFollows.aseguradora}
                </Typography>
                {medicosFollows.cartaGarantia && (
                  <Typography variant="body2">
                    <strong>Carta de Garantía:</strong> {medicosFollows.cartaGarantia}
                  </Typography>
                )}
              </Grid>
            )}
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

export default CitaMedica;