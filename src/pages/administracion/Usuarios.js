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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Search,
  Visibility,
  VisibilityOff
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

// Agregar displayName para mejor debugging
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

// Agregar displayName para mejor debugging
FieldRow.displayName = 'FieldRow';

const Usuarios = () => {
  const navigate = useNavigate();

  // Datos mock para seleccionables
  const [personales] = useState([
    { id: 1, nombre: 'Dr. Juan Pérez', cargo: 'Médico Gastroenterólogo' },
    { id: 2, nombre: 'Dra. María García', cargo: 'Enfermera Jefe' },
    { id: 3, nombre: 'Carlos Rodriguez', cargo: 'Administrador' },
    { id: 4, nombre: 'Ana Martínez', cargo: 'Recepcionista' }
  ]);

  const [rolesDisponibles] = useState([
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Médico' },
    { id: 3, nombre: 'Enfermero' },
    { id: 4, nombre: 'Recepcionista' }
  ]);

  // Estado para la lista de usuarios
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      personalId: 1,
      personalNombre: 'Dr. Juan Pérez',
      usuario: 'jperez',
      estado: 'activo',
      rolId: 1,
      rolNombre: 'Administrador',
      fechaCreacion: '2024-01-15T10:30:00',
      ultimoAcceso: '2024-03-15T14:25:00',
      creadoPor: 'Sistema',
      intentosLogin: 0
    },
    {
      id: 2,
      personalId: 2,
      personalNombre: 'Dra. María García',
      usuario: 'mgarcia',
      estado: 'activo',
      rolId: 2,
      rolNombre: 'Médico',
      fechaCreacion: '2024-02-01T09:15:00',
      ultimoAcceso: '2024-03-14T16:45:00',
      creadoPor: 'jperez',
      intentosLogin: 0
    }
  ]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    personalId: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    estado: '',
    rolId: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      personalId: '',
      usuario: '',
      password: '',
      confirmPassword: '',
      estado: '',
      rolId: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.personalId) {
      newErrors.personalId = 'Personal es obligatorio';
    }
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'Usuario es obligatorio';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Contraseña es obligatoria';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmar contraseña es obligatorio';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.rolId) {
      newErrors.rolId = 'Rol es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      personalId: usuario.personalId,
      usuario: usuario.usuario,
      password: '',
      confirmPassword: '',
      estado: usuario.estado,
      rolId: usuario.rolId,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUsuario(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedUsuario(null);
  };

  const handleOpenDetailsModal = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedUsuario(null);
  };

  // Función para crear usuario
  const handleCreateUsuario = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedPersonal = personales.find(p => p.id === parseInt(formData.personalId));
      const selectedRol = rolesDisponibles.find(r => r.id === parseInt(formData.rolId));

      const newUsuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        personalId: parseInt(formData.personalId),
        personalNombre: selectedPersonal.nombre,
        usuario: formData.usuario.trim(),
        estado: formData.estado,
        rolId: parseInt(formData.rolId),
        rolNombre: selectedRol.nombre,
        fechaCreacion: new Date().toISOString(),
        ultimoAcceso: null,
        creadoPor: 'Sistema',
        intentosLogin: 0
      };

      setUsuarios(prev => [...prev, newUsuario]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar usuario
  const handleEditUsuario = (e) => {
    e.preventDefault();

    // Para editar, la validación de contraseña es opcional
    const newErrors = {};
    if (!formData.personalId) {
      newErrors.personalId = 'Personal es obligatorio';
    }
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'Usuario es obligatorio';
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado es obligatorio';
    }
    if (!formData.rolId) {
      newErrors.rolId = 'Rol es obligatorio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const selectedPersonal = personales.find(p => p.id === parseInt(formData.personalId));
      const selectedRol = rolesDisponibles.find(r => r.id === parseInt(formData.rolId));

      setUsuarios(prev => prev.map(u =>
        u.id === selectedUsuario.id
          ? {
              ...u,
              personalId: parseInt(formData.personalId),
              personalNombre: selectedPersonal.nombre,
              usuario: formData.usuario.trim(),
              estado: formData.estado,
              rolId: parseInt(formData.rolId),
              rolNombre: selectedRol.nombre
            }
          : u
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar usuario
  const handleDeleteUsuario = () => {
    setUsuarios(prev => prev.filter(u => u.id !== selectedUsuario.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar usuarios basado en la búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.personalNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rolNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'error';
  };

  // Función para cambiar tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        <Typography color="text.primary">Usuarios</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Usuarios
      </Typography>

      {/* Tabs Deslizables */}
      <Paper sx={{ boxShadow: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              minHeight: '60px'
            }
          }}
        >
          <Tab
            label="Crear Usuario"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            label="Lista de Usuarios"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Usuario */}
        {activeTab === 0 && (
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleCreateUsuario}>
              {/* Sección: Información del Usuario*/}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  Información del Usuario
                </Typography>

                {/* Fila 1: Personal, Usuario */}
                <FieldRow>
                  <ResponsiveField label="Personal" required>
                    <FormControl fullWidth required error={!!errors.personalId} size="small">
                      <Select
                        value={formData.personalId}
                        onChange={(e) => handleInputChange('personalId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.personalId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar personal</MenuItem>
                        {personales.map((personal) => (
                          <MenuItem key={personal.id} value={personal.id}>
                            {personal.nombre} - {personal.cargo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.personalId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.personalId}
                      </Typography>
                    )}
                  </ResponsiveField>

                  <ResponsiveField label="Usuario" required>
                    <TextField
                      fullWidth
                      required
                      placeholder="Ingrese el nombre de usuario"
                      value={formData.usuario}
                      onChange={(e) => handleInputChange('usuario', e.target.value)}
                      error={!!errors.usuario}
                      helperText={errors.usuario}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 2: Contraseña, Confirmar Contraseña */}
                <FieldRow>
                  <ResponsiveField label="Contraseña" required>
                    <TextField
                      fullWidth
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingrese la contraseña"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </ResponsiveField>

                  <ResponsiveField label="Confirmar Contraseña" required>
                    <TextField
                      fullWidth
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme la contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Fila 3: Estado, Rol */}
                <FieldRow>
                  <ResponsiveField label="Estado" required>
                    <FormControl fullWidth required error={!!errors.estado} size="small">
                      <Select
                        value={formData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.estado ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar estado</MenuItem>
                        <MenuItem value="activo">Activo</MenuItem>
                        <MenuItem value="inactivo">Inactivo</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.estado && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.estado}
                      </Typography>
                    )}
                  </ResponsiveField>

                  <ResponsiveField label="Rol" required>
                    <FormControl fullWidth required error={!!errors.rolId} size="small">
                      <Select
                        value={formData.rolId}
                        onChange={(e) => handleInputChange('rolId', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.rolId ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar rol</MenuItem>
                        {rolesDisponibles.map((rol) => (
                          <MenuItem key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.rolId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.rolId}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>
              </Paper>

              {/* Botón de Crear */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  size="large"
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    minWidth: '200px',
                    py: 1.5
                  }}
                >
                  Crear Usuario
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Usuarios */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar usuario por nombre, usuario o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#666', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: '450px',
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
              {searchTerm && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {filteredUsuarios.length} resultado(s) de {usuarios.length} usuarios
                </Typography>
              )}
            </Box>

            {/* Tabla de Usuarios */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Usuarios" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Personal</strong></TableCell>
                      <TableCell><strong>Usuario</strong></TableCell>
                      <TableCell><strong>Estado</strong></TableCell>
                      <TableCell><strong>Rol</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>

                  {/*Lista de Usuarios*/}
                  <TableBody>
                    {filteredUsuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.personalNombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.usuario}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(usuario.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.rolNombre}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(usuario)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(usuario)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(usuario)}
                            title="Eliminar"
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
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Modal para Editar Usuario */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
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
          <Typography variant="h6" fontWeight="bold">Editar Usuario</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditUsuario}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información del Usuario
              </Typography>

              <FieldRow>
                <ResponsiveField label="Personal" required>
                  <FormControl fullWidth required error={!!errors.personalId} size="small">
                    <Select
                      value={formData.personalId}
                      onChange={(e) => handleInputChange('personalId', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.personalId ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar personal</MenuItem>
                      {personales.map((personal) => (
                        <MenuItem key={personal.id} value={personal.id}>
                          {personal.nombre} - {personal.cargo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.personalId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.personalId}
                    </Typography>
                  )}
                </ResponsiveField>

                <ResponsiveField label="Usuario" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre de usuario"
                    value={formData.usuario}
                    onChange={(e) => handleInputChange('usuario', e.target.value)}
                    error={!!errors.usuario}
                    helperText={errors.usuario}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Nueva Contraseña (opcional)">
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Dejar vacío para mantener actual"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </ResponsiveField>

                <ResponsiveField label="Confirmar Nueva Contraseña">
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme la nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Estado" required>
                  <FormControl fullWidth required error={!!errors.estado} size="small">
                    <Select
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.estado ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar estado</MenuItem>
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.estado && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.estado}
                    </Typography>
                  )}
                </ResponsiveField>

                <ResponsiveField label="Rol" required>
                  <FormControl fullWidth required error={!!errors.rolId} size="small">
                    <Select
                      value={formData.rolId}
                      onChange={(e) => handleInputChange('rolId', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.rolId ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar rol</MenuItem>
                      {rolesDisponibles.map((rol) => (
                        <MenuItem key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.rolId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.rolId}
                    </Typography>
                  )}
                </ResponsiveField>
              </FieldRow>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseEditModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal de Detalles del Usuario */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
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
          backgroundColor: '#2196f3',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">Detalles del Usuario</Typography>
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedUsuario && (
            <Box>
              {/* Información Personal */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                  Información Personal
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Personal Asignado:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.personalNombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Nombre de Usuario:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.usuario}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Estado:
                    </Typography>
                    <Chip
                      label={selectedUsuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      color={getEstadoColor(selectedUsuario.estado)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Rol Asignado:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.rolNombre}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ my: 2 }} />

              {/* Información del Sistema */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f7ff' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                  Información del Sistema
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Fecha de Creación:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.fechaCreacion ?
                        new Date(selectedUsuario.fechaCreacion).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No disponible'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Último Acceso:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.ultimoAcceso ?
                        new Date(selectedUsuario.ultimoAcceso).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Nunca ha ingresado'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Creado Por:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.creadoPor || 'Sistema'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Intentos de Login Fallidos:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.intentosLogin || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Estadísticas Adicionales */}
              <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#f57c00' }}>
                  Estadísticas de Uso
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {selectedUsuario.ultimoAcceso ?
                          Math.floor((new Date() - new Date(selectedUsuario.ultimoAcceso)) / (1000 * 60 * 60 * 24))
                          : 'N/A'
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Días desde último acceso
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {Math.floor((new Date() - new Date(selectedUsuario.fechaCreacion)) / (1000 * 60 * 60 * 24))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Días desde creación
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color={selectedUsuario.intentosLogin > 0 ? 'error.main' : 'success.main'}>
                        {selectedUsuario.intentosLogin || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Intentos fallidos
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseDetailsModal}
            sx={{
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación para Eliminar */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
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
          <Typography variant="h6" fontWeight="bold">Confirmar Eliminación</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            ¿Está seguro de que desea eliminar el usuario{' '}
            <strong>"{selectedUsuario?.usuario}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteConfirm}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUsuario}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Usuarios;