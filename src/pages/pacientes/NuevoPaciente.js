import React, { useState, useCallback, memo } from 'react';
import {
  Container,
  Paper,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Typography,
  Button,
  Box,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack,
  Save,
  NavigateNext
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

// Componente de header de sección - FUERA del componente principal
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

// Creación del componente FieldRow para las filas de campos
const FieldRow = memo(({children})=>(
  <Box 
    sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      mb: 3,
      alignItems: 'center' }}> 
    
    {children} 
  </Box>
));

FieldRow.displayName = 'FieldRow'; // Agregar displayName para mejor debugging


// Componente para layout responsive de campos - FUERA del componente principal y memoizado
const ResponsiveField = memo(({ label, children, required = false }) => (
  <Box sx={{flex: 1}}>
    {/* Layout para pantallas grandes */}
    <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', alignItems: 'center' }}>
      {/* Etiqueta del campo - ancho fijo para alineación perfecta */}
      <Box sx={{ width: '200px', textAlign: 'right', pr: 2 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          {label}
          {required && ' *'}
        </Typography>
      </Box>
      <Box sx={{flexGrow: 1}}>
        {children}
      </Box>
    </Box>

    {/* Layout para pantallas pequeñas*/}
    <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 'bold',
          color: '#333',
          mb: 1
        }}
      >
        {label}{required && ' *'}
      </Typography>
      {children}
    </Box>
  </Box>
));

// Agregar displayName para mejor debugging
ResponsiveField.displayName = 'ResponsiveField';

const NuevoPaciente = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información Básica
    estado: '',
    tipoDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: null,
    genero: '',
    estadoMarital: '',
    nacionalidad: '',
    
    // Centro
    nombre: '',
    
    // Información de Residencia
    calle: '',
    codPostal: '',
    pais: '',
    departamento: '',
    provincia: '',
    distrito: '',
    
    // Información de Contacto
    telefono: '',
    celular: '',
    correo: ''
  });

  const [errors, setErrors] = useState({});

  // Datos para cascading dropdowns
  const provincias = {
    cajamarca: [
      { value: 'cajabamba', label: 'Cajabamba' },
      { value: 'bambamarca', label: 'Bambamarca' }
      // Más provincias se pueden agregar aquí
    ]
  };

  const distritos = {
    cajabamba: [
      { value: 'cajabamba_distrito', label: 'Cajabamba' },
      { value: 'cachachi', label: 'Cachachi' }
      // Más distritos se pueden agregar aquí
    ],
    bambamarca: [
      { value: 'bambamarca_distrito', label: 'Bambamarca' },
      { value: 'chugur', label: 'Chugur' }
      // Más distritos se pueden agregar aquí
    ]
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Función para manejar cambios en selects con lógica de cascada
  const handleSelectChangeWithCascade = useCallback((field, value) => {
    // Lógica especial para cascading dropdowns
    if (field === 'pais') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        departamento: '',
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'departamento') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        provincia: '',
        distrito: ''
      }));
    } else if (field === 'provincia') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        distrito: ''
      }));
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

  // Validación de campos obligatorios
  const validateForm = () => {
    const requiredFields = {
      estado: 'Estado es obligatorio',
      tipoDocumento: 'Tipo de Documento es obligatorio',
      nombres: 'Nombres es obligatorio',
      apellidos: 'Apellidos es obligatorio',
      fechaNacimiento: 'Fecha de Nacimiento es obligatoria',
      genero: 'Género es obligatorio',
      nombre: 'Nombre del centro es obligatorio'
    };

    const newErrors = {};
    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = requiredFields[field];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Datos del formulario:', formData);
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      // Por ejemplo: 
      // await savePatient(formData);
      // navigate('/pacientes');
    } else {
      console.log('Por favor complete todos los campos obligatorios');
    }
  };

  // Función para regresar
  const handleBack = () => {
    navigate('/pacientes/buscar-paciente');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
          <Typography color="text.primary">Nuevo Paciente</Typography>
        </Breadcrumbs>

        {/* Título Principal */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Nuevo Paciente
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Sección 1: Información Básica */}
          <Paper sx={{ mb: 3, boxShadow: 2 }}>
            <SectionHeader title="Información Básica" />
            <Box sx={{ p: 4 }}>
              
              {/* Fila 1 */}
              <FieldRow>
                {/* Estado */}
                <ResponsiveField label="Estado" required>
                  <FormControl fullWidth required error={!!errors.estado}>
                    <Select
                      value={formData.estado}
                      onChange={(e) => handleSelectChangeWithCascade('estado', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.estado ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                {/* Tipo de Documento */}
                <ResponsiveField label="Tipo de Documento" required>
                  <FormControl fullWidth required error={!!errors.tipoDocumento}>
                    <Select
                      value={formData.tipoDocumento}
                      onChange={(e) => handleSelectChangeWithCascade('tipoDocumento', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.tipoDocumento ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="CE">Carnet de Extranjería</MenuItem>
                      <MenuItem value="PP">Pasaporte</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

              </FieldRow>

              {/* Fila 2 */}
              <FieldRow>
                {/* Nombres */}
                <ResponsiveField label="Nombres" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese nombres"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                    error={!!errors.nombres}
                    helperText={errors.nombres}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>

                {/* Apellidos */}
                <ResponsiveField label="Apellidos" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>
              </FieldRow>

              {/* Fila 3 */}
              <FieldRow>
                {/* Fecha de Nacimiento */}
                <ResponsiveField label="Fecha de Nacimiento" required>
                  <DatePicker
                    value={formData.fechaNacimiento}
                    onChange={(newValue) => {
                      handleInputChange('fechaNacimiento', newValue);
                    }}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        placeholder: "dd/mm/aaaa",
                        error: !!errors.fechaNacimiento,
                        helperText: errors.fechaNacimiento,
                        sx: {
                          '& .MuiOutlinedInput-input::placeholder': {
                            color: '#999',
                            opacity: 1
                          }
                        }
                      }
                    }}
                  />
                </ResponsiveField>

                {/* Género */}
                <ResponsiveField label="Género" required>
                  <FormControl fullWidth required error={!!errors.genero}>
                    <Select
                      value={formData.genero}
                      onChange={(e) => handleSelectChangeWithCascade('genero', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.genero ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="masculino">Masculino</MenuItem>
                      <MenuItem value="femenino">Femenino</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              {/* Fila 4 */}
              <FieldRow>
                      
                {/* Estado Marital */}
                <ResponsiveField label="Estado Marital">
                  <FormControl fullWidth>
                    <Select
                      value={formData.estadoMarital}
                      onChange={(e) => handleSelectChangeWithCascade('estadoMarital', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.estadoMarital ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="soltero">Soltero(a)</MenuItem>
                      <MenuItem value="casado">Casado(a)</MenuItem>
                      <MenuItem value="divorciado">Divorciado(a)</MenuItem>
                      <MenuItem value="viudo">Viudo(a)</MenuItem>
                      <MenuItem value="union_libre">Unión Libre</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                {/* Nacionalidad */}
                <ResponsiveField label="Nacionalidad">
                  <TextField
                    fullWidth
                    placeholder="Ingrese nacionalidad"
                    value={formData.nacionalidad}
                    onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>
              </FieldRow>
            </Box>
          </Paper>

          {/* Sección 2: Centro */}
          <Paper sx={{ mb: 3, boxShadow: 2 }}>
            <SectionHeader title="Centro" />
            <Box sx={{ p: 4 }}>
              
              <FieldRow>
                {/* Nombre */}
                <ResponsiveField label="Nombre" required>
                  <FormControl fullWidth required error={!!errors.nombre}>
                    <Select
                      value={formData.nombre}
                      onChange={(e) => handleSelectChangeWithCascade('nombre', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.nombre ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="clinica_maria_belen">Clínica María Belén</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                <ResponsiveField label="  ">
                  {/* Espacio vacío para mantener alineación */}
                </ResponsiveField>

              </FieldRow>
            </Box>
          </Paper>

          {/* Sección 3: Información de Residencia */}
          <Paper sx={{ mb: 3, boxShadow: 2 }}>
            <SectionHeader title="Información de Residencia" />
            <Box sx={{ p: 4 }}>

              {/* Fila 1 */}
              <FieldRow>
                {/* Calle */}
                <ResponsiveField label="Calle">
                  <TextField
                    fullWidth
                    placeholder="Ingrese calle"
                    value={formData.calle}
                    onChange={(e) => handleInputChange('calle', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>

                {/* Código Postal */}
                <ResponsiveField label="Código Postal">
                  <TextField
                    fullWidth
                    placeholder="Ingrese código postal"
                    value={formData.codPostal}
                    onChange={(e) => handleInputChange('codPostal', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>
              </FieldRow>

              {/* Fila 2 */}
              <FieldRow>
                {/* País */}
                <ResponsiveField label="País">
                  <FormControl fullWidth>
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
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      <MenuItem value="peru">Perú</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>

                {/* Departamento */}
                <ResponsiveField label="Departamento">
                  <FormControl fullWidth disabled={formData.pais !== 'peru'}>
                    <Select
                      value={formData.departamento}
                      onChange={(e) => handleSelectChangeWithCascade('departamento', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.departamento ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      {formData.pais === 'peru' && (
                        <MenuItem value="cajamarca">Cajamarca</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>
              
              
              {/* Fila 3 */}
              <FieldRow>
                {/* Provincia */}
                <ResponsiveField label="Provincia">
                  <FormControl fullWidth disabled={formData.departamento !== 'cajamarca'}>
                    <Select
                      value={formData.provincia}
                      onChange={(e) => handleSelectChangeWithCascade('provincia', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.provincia ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      {formData.departamento === 'cajamarca' && 
                        provincias.cajamarca.map(provincia => (
                          <MenuItem key={provincia.value} value={provincia.value}>
                            {provincia.label}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </ResponsiveField>

                {/* Distrito */}
                <ResponsiveField label="Distrito">
                  <FormControl fullWidth disabled={!formData.provincia || !distritos[formData.provincia]}>
                    <Select
                      value={formData.distrito}
                      onChange={(e) => handleSelectChangeWithCascade('distrito', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.distrito ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#000' }}>Por favor seleccione</MenuItem>
                      {formData.provincia && distritos[formData.provincia] &&
                        distritos[formData.provincia].map(distrito => (
                          <MenuItem key={distrito.value} value={distrito.value}>
                            {distrito.label}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>
            </Box>
          </Paper>

          {/* Sección 4: Información de Contacto */}
          <Paper sx={{ mb: 4, boxShadow: 2 }}>
            <SectionHeader title="Información de Contacto" />
            <Box sx={{ p: 4 }}>
              
              {/* Fila 1 */}
              <FieldRow>
                {/* Teléfono */}
                <ResponsiveField label="Teléfono">
                  <TextField
                    fullWidth
                    placeholder="Ingrese teléfono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>

                {/* Celular */}
                <ResponsiveField label="Celular">
                  <TextField
                    fullWidth
                    placeholder="Ingrese celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange('celular', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
              </ResponsiveField>
              </FieldRow>

              {/* Fila 2 */}
              <FieldRow>
                {/* Correo */}
                <ResponsiveField label="Correo">
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Ingrese correo electrónico"
                    value={formData.correo}
                    onChange={(e) => handleInputChange('correo', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: '#999',
                        opacity: 1
                      }
                    }}
                  />
                </ResponsiveField>

                <ResponsiveField label="&nbsp;">
                  {/* Espacio vacío para mantener el layout */}
                </ResponsiveField>
              </FieldRow>
            </Box>
          </Paper>

          {/* Botones de Acción */}
          <Box sx={{ display: 'flex', gap: 8, mb: 10, mt:7 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ minWidth: '120px' }}
            >
              Regresar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ 
                minWidth: '120px',
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              Guardar
            </Button>
          </Box>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default NuevoPaciente;