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
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  NavigateNext,
  ChevronLeft,
  ChevronRight,
  Add,
  Edit,
  Delete,
  Schedule,
  Search,
  Person,
  Business,
  LocalHospital
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

ResponsiveField.displayName = 'ResponsiveField';

const Horario = () => {
  const navigate = useNavigate();

  // Estado para los filtros
  const [filters, setFilters] = useState({
    centro: '',
    especialidad: '',
    personal: '',
    busquedaPersonal: ''
  });

  // Estado para la semana actual
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Estado para modales
  const [openHorarioModal, setOpenHorarioModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'

  // Estado para el horario seleccionado
  const [horarioForm, setHorarioForm] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    tipoTurno: '',
    notas: ''
  });

  // Datos simulados
  const centros = [
    { value: 'centro-1', label: 'Clínica María Belén - Sede Central' },
    { value: 'centro-2', label: 'Clínica María Belén - Sede Norte' }
  ];

  const especialidades = [
    { value: 'gastroenterologia', label: 'Gastroenterología' },
    { value: 'enfermeria', label: 'Enfermería' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'radiologia', label: 'Radiología' }
  ];

  const personalPorEspecialidad = {
    gastroenterologia: [
      { id: 1, nombre: 'Dr. Carlos Mendoza', documento: '12345678' },
      { id: 2, nombre: 'Dr. Ana García', documento: '87654321' }
    ],
    enfermeria: [
      { id: 3, nombre: 'Enf. María López', documento: '11223344' },
      { id: 4, nombre: 'Enf. José Ruiz', documento: '55667788' }
    ],
    cardiologia: [
      { id: 5, nombre: 'Dr. Pedro Silva', documento: '99887766' }
    ],
    neurologia: [
      { id: 6, nombre: 'Dr. Laura Vega', documento: '44556677' }
    ],
    radiologia: [
      { id: 7, nombre: 'Tec. Roberto Castillo', documento: '33224411' }
    ]
  };

  // Horarios simulados
  const [horariosData, setHorariosData] = useState([
    {
      id: 1,
      personalId: 1,
      dia: 'Lunes',
      horaInicio: '08:00',
      horaFin: '12:00',
      tipoTurno: 'Mañana',
      notas: 'Consultas generales'
    },
    {
      id: 2,
      personalId: 1,
      dia: 'Lunes',
      horaInicio: '14:00',
      horaFin: '18:00',
      tipoTurno: 'Tarde',
      notas: 'Procedimientos'
    },
    {
      id: 3,
      personalId: 1,
      dia: 'Martes',
      horaInicio: '08:00',
      horaFin: '12:00',
      tipoTurno: 'Mañana',
      notas: 'Consultas especializadas'
    },
    {
      id: 4,
      personalId: 3,
      dia: 'Lunes',
      horaInicio: '07:00',
      horaFin: '15:00',
      tipoTurno: 'Día completo',
      notas: 'Turno completo'
    },
    {
      id: 5,
      personalId: 3,
      dia: 'Miércoles',
      horaInicio: '15:00',
      horaFin: '23:00',
      tipoTurno: 'Noche',
      notas: 'Guardia nocturna'
    }
  ]);

  // Funciones auxiliares
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  const horasDelDia = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const formatearHora = (hora) => {
    const [hour, minute] = hora.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${hour12}:${minute} ${ampm}`;
  };

  const getPersonalFiltrado = () => {
    // Si hay búsqueda, mostrar todos los resultados de todas las especialidades
    if (filters.busquedaPersonal) {
      const todoElPersonal = Object.values(personalPorEspecialidad).flat();
      return todoElPersonal.filter(p => 
        p.nombre.toLowerCase().includes(filters.busquedaPersonal.toLowerCase()) ||
        p.documento.includes(filters.busquedaPersonal)
      );
    }
    
    // Si no hay búsqueda pero hay especialidad seleccionada, mostrar personal de esa especialidad
    if (filters.especialidad) {
      return personalPorEspecialidad[filters.especialidad] || [];
    }
    
    // Si no hay ningún filtro, no mostrar nada en el select pero permitir búsqueda
    return [];
  };

  const getHorariosPersonal = (personalId) => {
    return horariosData.filter(h => h.personalId === parseInt(personalId));
  };

  // Manejo de filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      // Limpiar campos dependientes
      if (field === 'especialidad') {
        newFilters.personal = '';
        newFilters.busquedaPersonal = '';
      }
      return newFilters;
    });
  };

  // Navegación de semana
  const navegarSemana = (direccion) => {
    const nuevaFecha = new Date(currentWeek);
    nuevaFecha.setDate(nuevaFecha.getDate() + (direccion * 7));
    setCurrentWeek(nuevaFecha);
  };

  const getSemanaActual = () => {
    const inicio = new Date(currentWeek);
    const diaSemana = inicio.getDay();
    const diff = inicio.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    inicio.setDate(diff);
    
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    
    const formatOptions = { day: '2-digit', month: 'short' };
    return `${inicio.toLocaleDateString('es-ES', formatOptions)} - ${fin.toLocaleDateString('es-ES', formatOptions)}`;
  };

  // Manejo de modales
  const handleOpenModal = (dia, hora = null, horarioExistente = null) => {
    if (horarioExistente) {
      setModalMode('edit');
      setHorarioForm({
        dia: horarioExistente.dia,
        horaInicio: horarioExistente.horaInicio,
        horaFin: horarioExistente.horaFin,
        tipoTurno: horarioExistente.tipoTurno,
        notas: horarioExistente.notas
      });
      setSelectedSlot(horarioExistente);
    } else {
      setModalMode('add');
      setHorarioForm({
        dia: dia,
        horaInicio: hora || '',
        horaFin: '',
        tipoTurno: '',
        notas: ''
      });
      setSelectedSlot({ dia, hora });
    }
    setOpenHorarioModal(true);
  };

  const handleCloseModal = () => {
    setOpenHorarioModal(false);
    setSelectedSlot(null);
    setHorarioForm({
      dia: '',
      horaInicio: '',
      horaFin: '',
      tipoTurno: '',
      notas: ''
    });
  };

  const handleSaveHorario = () => {
    if (modalMode === 'add') {
      const nuevoHorario = {
        id: horariosData.length + 1,
        personalId: parseInt(filters.personal),
        ...horarioForm
      };
      setHorariosData([...horariosData, nuevoHorario]);
    } else if (modalMode === 'edit') {
      setHorariosData(horariosData.map(h => 
        h.id === selectedSlot.id ? { ...h, ...horarioForm } : h
      ));
    }
    handleCloseModal();
  };

  const handleDeleteHorario = () => {
    setHorariosData(horariosData.filter(h => h.id !== selectedSlot.id));
    handleCloseModal();
  };

  const getHorarioEnSlot = (dia, hora) => {
    if (!filters.personal) return null;
    const horariosPersonal = getHorariosPersonal(filters.personal);
    return horariosPersonal.find(h => {
      const horaNum = parseInt(hora.split(':')[0]);
      const inicioNum = parseInt(h.horaInicio.split(':')[0]);
      const finNum = parseInt(h.horaFin.split(':')[0]);
      return h.dia === dia && horaNum >= inicioNum && horaNum < finNum;
    });
  };

  const getTipoTurnoColor = (tipo) => {
    const colores = {
      'Mañana': '#4caf50',
      'Tarde': '#ff9800',
      'Noche': '#3f51b5',
      'Día completo': '#2196f3'
    };
    return colores[tipo] || '#9e9e9e';
  };

  return (
    <Container maxWidth={false} sx={{ py: 1, px: 2 }}>
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
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Administración
        </Link>
        <Typography color="text.primary">Horarios</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Gestión de Horarios
      </Typography>

      {/* Sección de Filtros */}
      <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Schedule sx={{ color: '#2184be', mr: 2, fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be' }}>
            Filtros de Búsqueda
          </Typography>
        </Box>

        {/* Fila 1: Centro, Especialidad, Personal */}
        <FieldRow>
          <ResponsiveField label="Centro" required>
            <FormControl fullWidth required>
              <Select
                value={filters.centro}
                onChange={(e) => handleFilterChange('centro', e.target.value)}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    color: filters.centro ? '#000' : '#999'
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#000' }}>Seleccionar centro</MenuItem>
                {centros.map(centro => (
                  <MenuItem key={centro.value} value={centro.value}>
                    {centro.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ResponsiveField>

          <ResponsiveField label="Especialidad" required>
            <FormControl fullWidth required disabled={!filters.centro}>
              <Select
                value={filters.especialidad}
                onChange={(e) => handleFilterChange('especialidad', e.target.value)}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    color: filters.especialidad ? '#000' : '#999'
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#000' }}>Seleccionar especialidad</MenuItem>
                {especialidades.map(esp => (
                  <MenuItem key={esp.value} value={esp.value}>
                    {esp.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ResponsiveField>

          <ResponsiveField label="Personal" required>
            <FormControl fullWidth required disabled={!filters.especialidad && !filters.busquedaPersonal}>
              <Select
                value={filters.personal}
                onChange={(e) => handleFilterChange('personal', e.target.value)}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    color: filters.personal ? '#000' : '#999'
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#000' }}>Seleccionar personal</MenuItem>
                {getPersonalFiltrado().map(persona => (
                  <MenuItem key={persona.id} value={persona.id}>
                    {persona.nombre} - {persona.documento}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ResponsiveField>
        </FieldRow>

        {/* Fila 2: Búsqueda de Personal */}
        <FieldRow>
          <ResponsiveField label="Búsqueda de Personal">
            <TextField
              fullWidth
              placeholder="Buscar personal por nombre o documento..."
              value={filters.busquedaPersonal}
              onChange={(e) => handleFilterChange('busquedaPersonal', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#666' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              }}
            />
          </ResponsiveField>

          <ResponsiveField label="  ">
            {/* Espacio vacío para mantener alineación */}
          </ResponsiveField>
        </FieldRow>
      </Paper>

      {/* Calendario de Horarios */}
      {filters.personal && (
        <Paper sx={{ p: 3, boxShadow: 3 }}>
          {/* Header del Calendario */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ color: '#2184be', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#2184be' }}>
                  Horario Semanal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getPersonalFiltrado().find(p => p.id === parseInt(filters.personal))?.nombre}
                </Typography>
              </Box>
            </Box>
            
            {/* Navegación de Semana */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navegarSemana(-1)} sx={{ bgcolor: '#f5f5f5' }}>
                <ChevronLeft />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: '200px', textAlign: 'center' }}>
                {getSemanaActual()}
              </Typography>
              <IconButton onClick={() => navegarSemana(1)} sx={{ bgcolor: '#f5f5f5' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>

          {/* Calendario con días como filas */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: '900px' }}>
              {/* Header de horas */}
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Box sx={{ width: '120px', flexShrink: 0 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ 
                    p: 1, textAlign: 'center', bgcolor: '#f8f9fa',
                    borderRadius: '4px', border: '1px solid #e0e0e0'
                  }}>
                    Día / Hora
                  </Typography>
                </Box>
                {horasDelDia.map(hora => (
                  <Box key={hora} sx={{ width: '80px', flexShrink: 0 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold" 
                      sx={{ 
                        p: 1, 
                        textAlign: 'center', 
                        bgcolor: '#2184be', 
                        color: 'white',
                        borderRadius: '4px 4px 0 0',
                        fontSize: '10px'
                      }}
                    >
                      {formatearHora(hora)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Filas por día */}
              {diasSemana.map(dia => (
                <Box key={dia} sx={{ display: 'flex', mb: 0.5 }}>
                  {/* Columna del día */}
                  <Box sx={{ width: '120px', flexShrink: 0 }}>
                    <Box sx={{ 
                      p: 1, 
                      textAlign: 'center', 
                      bgcolor: '#2184be', 
                      color: 'white',
                      border: '1px solid #e0e0e0',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      <Typography variant="body2" fontWeight="bold">
                        {dia}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Celdas de horas */}
                  {horasDelDia.map(hora => {
                    const horarioExistente = getHorarioEnSlot(dia, hora);
                    return (
                      <Box key={`${dia}-${hora}`} sx={{ width: '80px', flexShrink: 0 }}>
                        <Box
                          sx={{
                            height: '50px',
                            border: '1px solid #e0e0e0',
                            bgcolor: horarioExistente ? getTipoTurnoColor(horarioExistente.tipoTurno) + '20' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            '&:hover': {
                              bgcolor: horarioExistente ? getTipoTurnoColor(horarioExistente.tipoTurno) + '40' : '#f5f5f5'
                            }
                          }}
                          onClick={() => handleOpenModal(dia, hora, horarioExistente)}
                        >
                          {horarioExistente && (
                            <Chip
                              label="●"
                              size="small"
                              sx={{
                                bgcolor: getTipoTurnoColor(horarioExistente.tipoTurno),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                width: '20px',
                                height: '20px'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Leyenda */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight="bold" sx={{ mr: 2 }}>
              Leyenda:
            </Typography>
            {['Mañana', 'Tarde', 'Noche', 'Día completo'].map(tipo => (
              <Chip
                key={tipo}
                label={tipo}
                size="small"
                sx={{
                  bgcolor: getTipoTurnoColor(tipo),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Modal para Agregar/Editar Horario */}
      <Dialog open={openHorarioModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2184be', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {modalMode === 'add' ? 'Agregar Horario' : 'Editar Horario'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body1" fontWeight="bold">
              Día: {horarioForm.dia}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Hora Inicio"
                type="time"
                value={horarioForm.horaInicio}
                onChange={(e) => setHorarioForm({...horarioForm, horaInicio: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Hora Fin"
                type="time"
                value={horarioForm.horaFin}
                onChange={(e) => setHorarioForm({...horarioForm, horaFin: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Tipo de Turno
              </Typography>
              <Select
                value={horarioForm.tipoTurno}
                onChange={(e) => setHorarioForm({...horarioForm, tipoTurno: e.target.value})}
                displayEmpty
              >
                <MenuItem value="">Seleccionar tipo</MenuItem>
                <MenuItem value="Mañana">Mañana</MenuItem>
                <MenuItem value="Tarde">Tarde</MenuItem>
                <MenuItem value="Noche">Noche</MenuItem>
                <MenuItem value="Día completo">Día Completo</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Notas"
              multiline
              rows={3}
              value={horarioForm.notas}
              onChange={(e) => setHorarioForm({...horarioForm, notas: e.target.value})}
              placeholder="Notas adicionales..."
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancelar
          </Button>
          {modalMode === 'edit' && (
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<Delete />}
              onClick={handleDeleteHorario}
            >
              Eliminar
            </Button>
          )}
          <Button 
            variant="contained" 
            startIcon={modalMode === 'add' ? <Add /> : <Edit />}
            onClick={handleSaveHorario}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            {modalMode === 'add' ? 'Agregar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Horario;