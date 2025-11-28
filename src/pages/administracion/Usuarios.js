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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
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
import { usuariosService } from 'services/usuariosService';
import { staffService } from '../../services/staffService';
import { rolesService } from '../../services/rolesService';
import { centrosService } from '../../services/centrosService';

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

  // Estado para la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [PersonalD, setPersonalCargados] = useState([]);
  const [EstadoD, setEstadoCargados] = useState([]);
  const [RolesD, setRolesCargados] = useState([]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const cargarPersonal = async () => {
        try {
          const responseSystemParameter = await staffService.getAll();
          console.log('✅ Respuesta de Personal:', responseSystemParameter);
          setPersonalCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                           responseSystemParameter?.data || []);
        } catch (error) {
          console.error('❌ Error al cargar Personal:', error);
          setError(`Error al cargar Personal: ${error.message}`);
        }
      };

  const cargarRoles = async () => {
        try {
          const responseSystemParameter = await rolesService.getAll();
          console.log('✅ Respuesta de Roles:', responseSystemParameter);
          
          // Asegurarse de que los datos estén en el formato correcto
          const rolesData = responseSystemParameter?.data || [];
          console.log('✅ Datos de roles antes de mapear:', rolesData);
          
          // Mapear los datos asegurando que id y nombre estén presentes
          const rolesMapeados = rolesData.map(rol => ({
            id: rol.id || rol.profiletypeid,
            nombre: rol.nombre || rol.profile_name || '',
            descripcion: rol.descripcion || rol.description || ''
          }));
          
          console.log('✅ Roles mapeados:', rolesMapeados);
          setRolesCargados(rolesMapeados);
        } catch (error) {
          console.error('❌ Error al cargar Roles:', error);
          setError(`Error al cargar Roles: ${error.message}`);
        }
      };
      
  const cargarEstados = async () => {
          try {
            const responseSystemParameter = await centrosService.getAllSystemParameterId(10006);
            console.log('✅ Respuesta de Géneros:', responseSystemParameter);
            setEstadoCargados(Array.isArray(responseSystemParameter) ? responseSystemParameter : 
                              responseSystemParameter?.data || []);
          } catch (error) {
            console.error('❌ Error al cargar estados:', error);
            setError(`Error al cargar estados: ${error.message}`);
           }
        };
  // Estado para el formulario
  const [formData, setFormData] = useState({
    profiletypeid: '',
    personalid: '',
    usuario: '',
    contraseña: '',
    contraseñaC: '',
    estado: '',
  });

  const [editFormData, setEditFormData] = useState({
        profiletypeid: '',
    personalid: '',
    usuario: '',
    contraseña: '',
    contraseñaC: '',
    estado: '',
      });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  const loadUsuarios = async () => {
        try {
          setLoading(true);
          setError('');
    
          console.log('🔄 Cargando Usuarios desde el backend...');
          const response = await usuariosService.getAll();
    
          // Obtener los nombres de los centros para cada personal
                const usuariosListCarga = await Promise.all(
                  response.data.map(async (systemUsuarios) => {
                    try {
                      const personalDatos = await staffService.getById(systemUsuarios.personalid);
                      const rolDatos = await rolesService.getById(systemUsuarios.profiletypeid);
                      const Profesion = await centrosService.getSystemParameterId(personalDatos.data.titulo);

                      return {
                        ...systemUsuarios,
                        nombrePersonal: personalDatos.data.nombres + ' ' + personalDatos.data.apellidos,
                        profesionPer: Profesion.data.value1,
                        nombreRol: rolDatos.data.nombre
                      };
                    } catch (error) {
                      console.error(`Error al obtener centro ${systemUsuarios.personalid}:`, error);
                      return {
                        ...systemUsuarios,
                        nombrePersonal: 'Personal no encontrado',
                        profesionPer: 'Profesion no encontrada',
                        nombreRol: 'Rol no encontrado'
                      };
                    }
                  })
                );
  
          console.log('✅ Estudios cargados:', usuariosListCarga);
          setUsuarios(usuariosListCarga || []);
    
        } catch (error) {
          console.error('❌ Error al cargar Usuarios:', error);
          setError(`Error al cargar Usuarios: ${error.message}`);
    
        } finally {
          setLoading(false);
        }
      };
useEffect(() => {
        const cargarDatosIniciales = async () => {
          setLoading(true);
          try {
            await Promise.all([
              cargarPersonal(),
              cargarEstados(),
              cargarRoles(),
              loadUsuarios()
            ]);
          } catch (error) {
            console.error('❌ Error al cargar datos iniciales:', error);
            setError(`Error al cargar datos iniciales: ${error.message}`);
          } finally {
            setLoading(false);
          }
        };
    
        cargarDatosIniciales();
      }, []);

      
  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      profiletypeid: '',
      personalid: '',
      usuario: '',
      contraseña: '',
      contraseñaC: '',
      estado: '',
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

  const handleEditInputChange = useCallback((field, value) => {
            setEditFormData(prev => ({ ...prev, [field]: value }));
            // Limpiar error si existe
            if (errors[field]) {
              setErrors(prev => ({ ...prev, [field]: '' }));
            }
          }, [errors]);
    
  // 2. Memoiza los componentes de input
    const MemoizedTextField = memo(({
      value,
      onChange,
      error,
      helperText,
      ...props
    }) => (
      <TextField
        {...props}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        size="small"
      />
    ));
  
    MemoizedTextField.displayName = 'MemoizedTextField';

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'Usuario es obligatorio';
    }

    if (!formData.contraseña.trim()) {
      newErrors.contraseña = 'Contraseña es obligatoria';
    }

    if (!formData.contraseñaC.trim()) {
      newErrors.contraseñaC = 'Confirmar contraseña es obligatorio';
    }

    if (formData.contraseña.trim() !== formData.contraseñaC.trim()) {
      newErrors.contraseña = 'Contraseñas no coinciden, vuelva a digitar.';
    }

   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.usuario.trim()) {
      newErrors.usuario = 'Usuario es obligatorio';
    }
    if (!editFormData.contraseña.trim()) {
      newErrors.contraseña = 'Contraseña es obligatoria';
    }
    if (!editFormData.contraseñaC.trim()) {
      newErrors.contraseñaC = 'Confirmar contraseña es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (usuario) => {
    setSelectedUsuario(usuario);
    const initialFormData = {
      profiletypeid: usuario.profiletypeid,
      personalid: usuario.personalid,
      usuario: usuario.usuario,
      contraseña: usuario.contraseña,
      contraseñaC: usuario.contraseñaC,
      estado: usuario.estado,
      createdAt: usuario.createdAt,
      createdBy: usuario.createdBy,
      updatedAt: usuario.updatedAt,
      updatedBy: usuario.updatedBy
    };
    setEditFormData(initialFormData);

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
  const handleCreateUsuario = async (e) => {
            e.preventDefault();
        
            if (validateForm()) {
              try {
                setLoading(true);
                console.log('📤 Creando Usuario...');
        
                // Asegurarse de que estado sea un ID numérico
                const usuarioData = {
                  ...formData,
                  estado: formData.estado === 10007 ? true : false 
                };
        
                const nuevoUsuario = await usuariosService.create(usuarioData);
                console.log('✅ Usuario creado:', nuevoUsuario);
        
                // Recargar la lista de centros
                await loadUsuarios();
        
                clearForm();
                // Cambiar automáticamente al tab de lista
                setActiveTab(0);
        
              } catch (error) {
                console.error('❌ Error al crear Usuario:', error);
                setError(`Error al crear Usuario: ${error.message}`);
              } finally {
                setLoading(false);
              }
            }
          };
  // Función para editar usuario
  const handleEditUsuario = async (e) => {
          e.preventDefault();
      
          if (validateEditForm()) {
            try {
              setLoading(true);
              console.log('📤 Editando Usuario...');
      
              // Asegurarse de que estado sea un booleano
              const formDataToSend = {
                ...editFormData,
                estado: editFormData.estado === '10007', // Convertir a booleano basado en el valor del estado
              };
              const salaActualizado = await usuariosService.update(selectedUsuario.id, formDataToSend);
              console.log('✅ Usuario actualizado:', salaActualizado);
      
              // Recargar la lista de Salas
              await loadUsuarios();
      
              handleCloseEditModal();
      
            } catch (error) {
              console.error('❌ Error al editar Usuario:', error);
              setError(`Error al editar Usuario: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }
        };

  
  // Función para eliminar usuario
const handleDeleteUsuario = async () => {
        try {
          setLoading(true);
          console.log('📤 Eliminando Usuario...');
    
          await usuariosService.delete(selectedUsuario.id);
          console.log('✅ Usuario eliminado');
    
          // Recargar la lista de Estudio
          await loadUsuarios();
    
          handleCloseDeleteConfirm();
    
        } catch (error) {
          console.error('❌ Error al eliminar Usuario:', error);
          setError(`Error al eliminar Usuario: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

  // Filtrar usuarios basado en la búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
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
            label="Lista de Usuarios"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Usuario"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Usuario */}
        {activeTab === 1 && (
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
                        value={formData.personalid}
                        onChange={(e) => handleInputChange('personalid', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.personalid ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar personal</MenuItem>
                        {Array.isArray(PersonalD) && PersonalD.map(personal => (
                          <MenuItem key={personal.id} value={personal.id}>
                            {personal.nombres + ' ' + personal.apellidos || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.personalid && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.personalid}
                      </Typography>
                    )}
                  </ResponsiveField>
                </FieldRow>
                <FieldRow>
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
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange('contraseña', e.target.value)}
                      error={!!errors.contraseña}
                      helperText={errors.contraseña}
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
                      value={formData.contraseñaC}
                      onChange={(e) => handleInputChange('contraseñaC', e.target.value)}
                      error={!!errors.contraseñaC}
                      helperText={errors.contraseñaC}
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
                        {Array.isArray(EstadoD) && EstadoD.map(estado => (
                          <MenuItem key={estado.parameterid} value={estado.parameterid}>
                            {estado.value1 || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.estado && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.estado}
                      </Typography>
                    )}
                  </ResponsiveField>

                  <ResponsiveField label="Rol" required>
                    <FormControl fullWidth required error={!!errors.profiletypeid} size="small">
                      <Select
                        value={formData.profiletypeid}
                        onChange={(e) => handleInputChange('profiletypeid', e.target.value)}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: formData.profiletypeid ? '#000' : '#999'
                          }
                        }}
                      >
                        <MenuItem value="">Seleccionar rol</MenuItem>
                        {Array.isArray(RolesD) && RolesD.map(rol => (
                          <MenuItem key={rol.id} value={rol.id}>
                            {rol.nombre || ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.profiletypeid && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.profiletypeid}
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
        {activeTab === 0 && (
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
                      <TableCell><strong>Profesion</strong></TableCell>
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
                            {usuario.nombrePersonal} 
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.profesionPer} 
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.usuario}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.status === 'activo' ? 'Activo' : 'Inactivo'}
                            color={getEstadoColor(usuario.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {usuario.nombreRol}
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
        <DialogTitle 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2184be',
            color: 'white',
            '& .MuiTypography-root': {
              fontWeight: 'bold'
            }
          }}
        >
          Editar Usuario
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
                  <FormControl fullWidth required error={!!errors.personalid} size="small">
                    <Select
                      value={editFormData.personalid}
                      onChange={(e) => handleEditInputChange('personalid', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: editFormData.personalid ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar personal</MenuItem>
                      {Array.isArray(PersonalD) && PersonalD.map(personal => (
                          <MenuItem key={personal.id} value={personal.id}>
                            {personal.nombres + ' ' + personal.apellidos || ''}
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
              </FieldRow>
              <FieldRow>
                

                <ResponsiveField label="Usuario" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Ingrese el nombre de usuario"
                    value={editFormData.usuario}
                    onChange={(e) => handleEditInputChange('usuario', e.target.value)}
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
                    value={editFormData.contraseña}
                    onChange={(e) => handleEditInputChange('contraseña', e.target.value)}
                    error={!!errors.contraseña}
                    helperText={errors.contraseña}
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
                    value={editFormData.contraseñaC}
                    onChange={(e) => handleEditInputChange('contraseñaC', e.target.value)}
                    error={!!errors.contraseñaC}
                    helperText={errors.contraseñaC}
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
                      value={editFormData.estado}
                      onChange={(e) => handleEditInputChange('estado', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: formData.estado ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar estado</MenuItem>
                      {Array.isArray(EstadoD) && EstadoD.map(estado => (
                        <MenuItem key={estado.parameterid} value={estado.parameterid.toString()}>
                          {estado.value1 || ''}
                        </MenuItem>
                      ))}
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
                      value={editFormData.profiletypeid}
                      onChange={(e) => handleEditInputChange('profiletypeid', e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: editFormData.profiletypeid ? '#000' : '#999'
                        }
                      }}
                    >
                      <MenuItem value="">Seleccionar rol</MenuItem>
                      {Array.isArray(RolesD) && RolesD.map(personal => (
                          <MenuItem key={personal.id} value={personal.id}>
                            {personal.nombre || ''}
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
        <DialogTitle 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2196f3',
            color: 'white',
            '& .MuiTypography-root': {
              fontWeight: 'bold'
            }
          }}
        >
          Detalles del Usuario
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
                      {selectedUsuario.nombrePersonal}
                      [{selectedUsuario.profesionPer}]
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
                      label={selectedUsuario.status === 'activo' ? 'Activo' : 'Inactivo'}
                      color={getEstadoColor(selectedUsuario.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Rol Asignado:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.nombreRol}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Contraseña:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.contraseña}
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
                      Creado Por:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.createdBy || 'Sistema'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Fecha de Creación:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.createdAt ?
                        new Date(selectedUsuario.createdAt).toLocaleString('es-ES', {
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
                      Actualizado Por:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.updatedBy || 'Sistema'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      Fecha de Actualización:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.updatedAt ?
                        new Date(selectedUsuario.updatedAt).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No disponible'
                      }
                    </Typography>
                  </Grid>
                  
                  {/*          
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
                      Intentos de Login Fallidos:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedUsuario.intentosLogin || 0}
                    </Typography>
                  </Grid>*/}
                </Grid>
              </Paper>

              {/* Estadísticas Adicionales 
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
              </Paper>*/}
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
        <DialogTitle 
          sx={{
            backgroundColor: '#f44336',
            color: 'white',
            textAlign: 'center',
            '& .MuiTypography-root': {
              fontWeight: 'bold'
            }
          }}
        >
          Confirmar Eliminación
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