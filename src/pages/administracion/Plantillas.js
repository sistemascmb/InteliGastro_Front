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
  Checkbox,
  FormControlLabel
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
  Description,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

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

// Componente Editor de Texto Rico Simple
const RichTextEditor = memo(({ value, onChange, placeholder = "Escriba aquí..." }) => {
  const editorRef = React.useRef(null);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageInsert = () => {
    const url = prompt('Ingrese la URL de la imagen:');
    if (url) {
      handleFormat('insertImage', url);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Ingrese la URL del enlace:');
    if (url) {
      const text = window.getSelection().toString() || url;
      handleFormat('insertHTML', `<a href="${url}" target="_blank">${text}</a>`);
    }
  };

  const handleTableInsert = () => {
    const rows = parseInt(prompt('Número de filas:') || '2');
    const cols = parseInt(prompt('Número de columnas:') || '2');

    let tableHTML = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 10px 0;">';

    // Crear encabezado
    tableHTML += '<thead><tr>';
    for (let j = 0; j < cols; j++) {
      tableHTML += '<th style="border: 1px solid #ccc; padding: 8px; background-color: #f5f5f5; font-weight: bold;">Encabezado ' + (j + 1) + '</th>';
    }
    tableHTML += '</tr></thead>';

    // Crear cuerpo
    tableHTML += '<tbody>';
    for (let i = 0; i < rows - 1; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Celda ' + (i + 1) + ',' + (j + 1) + '</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table><br/>';

    handleFormat('insertHTML', tableHTML);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
      {/* Barra de herramientas */}
      <Box sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        borderBottom: '1px solid #eee',
        flexWrap: 'wrap',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Formato de texto */}
        <IconButton
          size="small"
          onClick={() => handleFormat('bold')}
          title="Negrita"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>B</Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleFormat('italic')}
          title="Cursiva"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontStyle: 'italic', fontSize: '14px' }}>I</Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleFormat('underline')}
          title="Subrayado"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ textDecoration: 'underline', fontSize: '14px' }}>U</Typography>
        </IconButton>

        {/* Separador */}
        <Box sx={{ width: '1px', height: '24px', backgroundColor: '#ccc', my: 'auto' }} />

        {/* Listas */}
        <IconButton
          size="small"
          onClick={() => handleFormat('insertOrderedList')}
          title="Lista numerada"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontSize: '12px' }}>1.</Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleFormat('insertUnorderedList')}
          title="Lista con viñetas"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontSize: '12px' }}>•</Typography>
        </IconButton>

        {/* Separador */}
        <Box sx={{ width: '1px', height: '24px', backgroundColor: '#ccc', my: 'auto' }} />

        {/* Enlaces e imágenes */}
        <IconButton
          size="small"
          onClick={handleLinkInsert}
          title="Insertar enlace"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontSize: '12px' }}>🔗</Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={handleImageInsert}
          title="Insertar imagen"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontSize: '12px' }}>🖼️</Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={handleTableInsert}
          title="Insertar tabla"
          sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}
        >
          <Typography sx={{ fontSize: '12px' }}>📊</Typography>
        </IconButton>

        {/* Separador */}
        <Box sx={{ width: '1px', height: '24px', backgroundColor: '#ccc', my: 'auto' }} />

        {/* Encabezados */}
        <Button
          size="small"
          onClick={() => handleFormat('formatBlock', 'h1')}
          title="Encabezado 1"
          sx={{ minWidth: 'auto', px: 1, fontSize: '12px' }}
        >
          H1
        </Button>
        <Button
          size="small"
          onClick={() => handleFormat('formatBlock', 'h2')}
          title="Encabezado 2"
          sx={{ minWidth: 'auto', px: 1, fontSize: '12px' }}
        >
          H2
        </Button>
        <Button
          size="small"
          onClick={() => handleFormat('formatBlock', 'h3')}
          title="Encabezado 3"
          sx={{ minWidth: 'auto', px: 1, fontSize: '12px' }}
        >
          H3
        </Button>
      </Box>

      {/* Área de edición */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        sx={{
          minHeight: '200px',
          p: 2,
          outline: 'none',
          backgroundColor: 'white',
          '&:empty::before': {
            content: `"${placeholder}"`,
            color: '#999',
            fontStyle: 'italic'
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '10px 0'
          },
          '& th, & td': {
            border: '1px solid #ccc',
            padding: '8px',
            textAlign: 'left'
          },
          '& th': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold'
          }
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </Box>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

const Plantillas = () => {
  const navigate = useNavigate();

  // Lista de personal para asignaciones
  const [personalList] = useState([
    { id: 1, nombre: 'Dr. Juan Pérez' },
    { id: 2, nombre: 'Dra. María García' },
    { id: 3, nombre: 'Dr. Carlos López' },
    { id: 4, nombre: 'Dra. Ana Martínez' }
  ]);

  // Lista de plantillas de procedimientos
  const [procedimientosPlantillas] = useState([
    'Videoendoscopia digestiva alta',
    'Colonoscopia corta',
    'Colonoscopia completa',
    'Rectosigmoidoscopia',
    'Endoscopia terapéutica',
    'Polipectomía',
    'Biopsia endoscópica'
  ]);

  // Estado para la lista de plantillas
  const [plantillas, setPlantillas] = useState([
    {
      id: 1,
      tipo: 'cabecera',
      nombre: 'Cabecera Estándar CMB',
      asignadoA: 'todos',
      plantillaCabecera: '<h2>CLINICA MARIA BELEN</h2><p>Reporte Médico Especializado</p>',
      fechaCreacion: '2024-01-15T10:30:00',
      creadoPor: 'Sistema'
    },
    {
      id: 2,
      tipo: 'plantilla',
      nombre: 'Endoscopia Digestiva Alta',
      descripcion: 'Plantilla para procedimientos de endoscopia digestiva alta',
      asignadoA: [1, 2],
      plantillaProcedimiento: 'Videoendoscopia digestiva alta',
      plantilla: '<p><strong>Indicación:</strong></p><p><strong>Preparación:</strong></p><p><strong>Hallazgos:</strong></p>',
      fechaCreacion: '2024-02-10T14:20:00',
      creadoPor: 'Dr. Juan Pérez'
    }
  ]);

  // Estados para modales
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    tipo: 'cabecera',
    nombre: '',
    descripcion: '',
    asignadoA: 'todos',
    personalSeleccionado: [],
    plantillaProcedimiento: '',
    plantillaCabecera: '',
    plantilla: ''
  });

  const [errors, setErrors] = useState({});

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para tabs
  const [activeTab, setActiveTab] = useState(0);

  // Estado para subtabs de creación
  const [createTab, setCreateTab] = useState(0);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      tipo: 'cabecera',
      nombre: '',
      descripcion: '',
      asignadoA: 'todos',
      personalSeleccionado: [],
      plantillaProcedimiento: '',
      plantillaCabecera: '',
      plantilla: ''
    });
    setErrors({});
  };

  // Función genérica para manejar cambios en campos de texto
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Función para manejar cambios en asignación de personal
  const handlePersonalChange = useCallback((personalId) => {
    setFormData(prev => ({
      ...prev,
      personalSeleccionado: prev.personalSeleccionado.includes(personalId)
        ? prev.personalSeleccionado.filter(id => id !== personalId)
        : [...prev.personalSeleccionado, personalId]
    }));
  }, []);

  // Función para seleccionar/deseleccionar todo el personal
  const handleSelectAllPersonal = useCallback((selectAll) => {
    setFormData(prev => ({
      ...prev,
      personalSeleccionado: selectAll ? personalList.map(p => p.id) : []
    }));
  }, [personalList]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre es obligatorio';
    }

    if (formData.tipo === 'plantilla') {
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = 'Descripción es obligatoria';
      }
      if (!formData.plantillaProcedimiento) {
        newErrors.plantillaProcedimiento = 'Plantilla de procedimiento es obligatoria';
      }
      if (!formData.plantilla.trim()) {
        newErrors.plantilla = 'Contenido de la plantilla es obligatorio';
      }
    } else {
      if (!formData.plantillaCabecera.trim()) {
        newErrors.plantillaCabecera = 'Contenido de la cabecera es obligatorio';
      }
    }

    if (formData.asignadoA === 'seleccionar' && formData.personalSeleccionado.length === 0) {
      newErrors.personalSeleccionado = 'Debe seleccionar al menos un miembro del personal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para manejar modales
  const handleOpenEditModal = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setFormData({
      tipo: plantilla.tipo,
      nombre: plantilla.nombre,
      descripcion: plantilla.descripcion || '',
      asignadoA: plantilla.asignadoA === 'todos' ? 'todos' : 'seleccionar',
      personalSeleccionado: Array.isArray(plantilla.asignadoA) ? plantilla.asignadoA : [],
      plantillaProcedimiento: plantilla.plantillaProcedimiento || '',
      plantillaCabecera: plantilla.plantillaCabecera || '',
      plantilla: plantilla.plantilla || ''
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedPlantilla(null);
    clearForm();
  };

  const handleOpenDeleteConfirm = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedPlantilla(null);
  };

  const handleOpenDetailsModal = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedPlantilla(null);
  };

  // Función para crear plantilla
  const handleCreatePlantilla = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newPlantilla = {
        id: Math.max(...plantillas.map(p => p.id)) + 1,
        tipo: formData.tipo,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        asignadoA: formData.asignadoA === 'todos' ? 'todos' : formData.personalSeleccionado,
        plantillaProcedimiento: formData.plantillaProcedimiento,
        plantillaCabecera: formData.plantillaCabecera,
        plantilla: formData.plantilla,
        fechaCreacion: new Date().toISOString(),
        creadoPor: 'Sistema'
      };

      setPlantillas(prev => [...prev, newPlantilla]);
      clearForm();
      // Cambiar automáticamente al tab de lista
      setActiveTab(1);
    }
  };

  // Función para editar plantilla
  const handleEditPlantilla = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setPlantillas(prev => prev.map(p =>
        p.id === selectedPlantilla.id
          ? {
              ...p,
              tipo: formData.tipo,
              nombre: formData.nombre.trim(),
              descripcion: formData.descripcion.trim(),
              asignadoA: formData.asignadoA === 'todos' ? 'todos' : formData.personalSeleccionado,
              plantillaProcedimiento: formData.plantillaProcedimiento,
              plantillaCabecera: formData.plantillaCabecera,
              plantilla: formData.plantilla,
            }
          : p
      ));
      handleCloseEditModal();
    }
  };

  // Función para eliminar plantilla
  const handleDeletePlantilla = () => {
    setPlantillas(prev => prev.filter(p => p.id !== selectedPlantilla.id));
    handleCloseDeleteConfirm();
  };

  // Filtrar plantillas basado en la búsqueda
  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plantilla.descripcion && plantilla.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    plantilla.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    return tipo === 'cabecera' ? 'primary' : 'secondary';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener texto de asignación
  const getAsignacionTexto = (asignadoA) => {
    if (asignadoA === 'todos') {
      return 'Todos';
    } else if (Array.isArray(asignadoA)) {
      const nombres = asignadoA.map(id => personalList.find(p => p.id === id)?.nombre || 'Desconocido');
      return nombres.join(', ');
    }
    return 'No asignado';
  };

  // Función para cambiar tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Función para cambiar subtab de creación
  const handleCreateTabChange = (event, newValue) => {
    setCreateTab(newValue);
    setFormData(prev => ({
      ...prev,
      tipo: newValue === 0 ? 'cabecera' : 'plantilla'
    }));
    setErrors({});
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
        <Typography color="text.primary">Plantillas</Typography>
      </Breadcrumbs>

      {/* Título Principal */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Gestión de Plantillas
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
            label="Lista de Plantillas"
            icon={<Search />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />

          <Tab
            label="Crear Plantilla"
            icon={<Add />}
            iconPosition="start"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>

        {/* Contenido del Tab 1: Crear Plantilla */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            {/* Subtabs para tipos de plantilla */}
            <Paper sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
              <Tabs
                value={createTab}
                onChange={handleCreateTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minHeight: '50px'
                  }
                }}
              >
                <Tab
                  label="Crear Cabecera de Reporte"
                  icon={<Description />}
                  iconPosition="start"
                />
                <Tab
                  label="Crear Plantilla"
                  icon={<Assignment />}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            <form onSubmit={handleCreatePlantilla}>
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                  {createTab === 0 ? 'Información de Cabecera de Reporte' : 'Información de Plantilla'}
                </Typography>

                {/* Campos comunes */}
                <FieldRow>
                  <ResponsiveField label="Nombre" required>
                    <TextField
                      fullWidth
                      required
                      placeholder={createTab === 0 ? "Ej: Cabecera CMB Gastroenterología" : "Ej: Plantilla Endoscopia"}
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>

                {/* Campo descripción solo para plantillas */}
                {createTab === 1 && (
                  <FieldRow>
                    <ResponsiveField label="Descripción" required>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={2}
                        placeholder="Descripción de la plantilla"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion}
                        size="small"
                      />
                    </ResponsiveField>
                  </FieldRow>
                )}

                {/* Asignación de personal */}
                <FieldRow>
                  <ResponsiveField label="Asignar a" required>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.asignadoA}
                        onChange={(e) => handleInputChange('asignadoA', e.target.value)}
                      >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="seleccionar">Seleccionar personal</MenuItem>
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>

                {/* Selección de personal específico */}
                {formData.asignadoA === 'seleccionar' && (
                  <FieldRow>
                    <ResponsiveField label="Personal seleccionado" required>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, maxHeight: '200px', overflow: 'auto' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.personalSeleccionado.length === personalList.length}
                              indeterminate={formData.personalSeleccionado.length > 0 && formData.personalSeleccionado.length < personalList.length}
                              onChange={(e) => handleSelectAllPersonal(e.target.checked)}
                            />
                          }
                          label="Seleccionar todos"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        />
                        {personalList.map((personal) => (
                          <FormControlLabel
                            key={personal.id}
                            control={
                              <Checkbox
                                checked={formData.personalSeleccionado.includes(personal.id)}
                                onChange={() => handlePersonalChange(personal.id)}
                              />
                            }
                            label={personal.nombre}
                            sx={{ display: 'block', ml: 2 }}
                          />
                        ))}
                      </Box>
                      {errors.personalSeleccionado && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.personalSeleccionado}
                        </Typography>
                      )}
                    </ResponsiveField>
                  </FieldRow>
                )}

                {/* Campo plantilla de procedimiento solo para plantillas */}
                {createTab === 1 && (
                  <FieldRow>
                    <ResponsiveField label="Plantilla por defecto del Procedimiento" required>
                      <FormControl fullWidth size="small" error={!!errors.plantillaProcedimiento}>
                        <Select
                          value={formData.plantillaProcedimiento}
                          onChange={(e) => handleInputChange('plantillaProcedimiento', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Seleccionar plantilla de procedimiento</MenuItem>
                          {procedimientosPlantillas.map((plantilla) => (
                            <MenuItem key={plantilla} value={plantilla}>
                              {plantilla}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors.plantillaProcedimiento && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.plantillaProcedimiento}
                        </Typography>
                      )}
                    </ResponsiveField>
                  </FieldRow>
                )}

                {/* Editor de texto rico */}
                <FieldRow>
                  <ResponsiveField
                    label={createTab === 0 ? "Plantilla de cabecera del Reporte" : "Contenido de la Plantilla"}
                    required
                  >
                    <RichTextEditor
                      value={createTab === 0 ? formData.plantillaCabecera : formData.plantilla}
                      onChange={(value) => handleInputChange(createTab === 0 ? 'plantillaCabecera' : 'plantilla', value)}
                      placeholder={createTab === 0 ? "Diseñe la cabecera del reporte..." : "Diseñe el contenido de la plantilla..."}
                    />
                    {((createTab === 0 && errors.plantillaCabecera) || (createTab === 1 && errors.plantilla)) && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {createTab === 0 ? errors.plantillaCabecera : errors.plantilla}
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
                  {createTab === 0 ? 'Crear Cabecera' : 'Crear Plantilla'}
                </Button>
              </Box>
            </form>
          </Box>
        )}

        {/* Contenido del Tab 2: Lista de Plantillas */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Barra de Búsqueda */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nombre, descripción o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#666', mr: 1 }} />
                  ),
                }}
                sx={{
                  maxWidth: '500px',
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
                  {filteredPlantillas.length} resultado(s) de {plantillas.length} plantillas
                </Typography>
              )}
            </Box>

            {/* Tabla de Plantillas */}
            <Paper sx={{ boxShadow: 1 }}>
              <SectionHeader title="Lista de Plantillas" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Asignado a</strong></TableCell>
                      <TableCell><strong>Fecha de Creación</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlantillas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'No se encontraron plantillas que coincidan con la búsqueda' : 'No hay plantillas registradas'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlantillas.map((plantilla) => (
                      <TableRow key={plantilla.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {plantilla.nombre}
                          </Typography>
                          {plantilla.descripcion && (
                            <Typography variant="caption" color="text.secondary">
                              {plantilla.descripcion.length > 50
                                ? `${plantilla.descripcion.substring(0, 50)}...`
                                : plantilla.descripcion
                              }
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plantilla.tipo === 'cabecera' ? 'Cabecera' : 'Plantilla'}
                            color={getTipoColor(plantilla.tipo)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getAsignacionTexto(plantilla.asignadoA)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(plantilla.fechaCreacion)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handleOpenDetailsModal(plantilla)}
                            sx={{ mr: 1 }}
                            title="Ver Detalles"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditModal(plantilla)}
                            sx={{ mr: 1 }}
                            title="Editar"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(plantilla)}
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

      {/* Modal para Editar Plantilla */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
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
          <Typography variant="h6" fontWeight="bold">Editar Plantilla</Typography>
          <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditPlantilla}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2184be' }}>
                Información de la Plantilla
              </Typography>

              {/* Campos del formulario de edición */}
              <FieldRow>
                <ResponsiveField label="Tipo">
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.tipo}
                      onChange={(e) => handleInputChange('tipo', e.target.value)}
                    >
                      <MenuItem value="cabecera">Cabecera de Reporte</MenuItem>
                      <MenuItem value="plantilla">Plantilla</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              <FieldRow>
                <ResponsiveField label="Nombre" required>
                  <TextField
                    fullWidth
                    required
                    placeholder="Nombre de la plantilla"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                  />
                </ResponsiveField>
              </FieldRow>

              {formData.tipo === 'plantilla' && (
                <FieldRow>
                  <ResponsiveField label="Descripción" required>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={2}
                      placeholder="Descripción de la plantilla"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion}
                      size="small"
                    />
                  </ResponsiveField>
                </FieldRow>
              )}

              <FieldRow>
                <ResponsiveField label="Asignar a" required>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.asignadoA}
                      onChange={(e) => handleInputChange('asignadoA', e.target.value)}
                    >
                      <MenuItem value="todos">Todos</MenuItem>
                      <MenuItem value="seleccionar">Seleccionar personal</MenuItem>
                    </Select>
                  </FormControl>
                </ResponsiveField>
              </FieldRow>

              {formData.asignadoA === 'seleccionar' && (
                <FieldRow>
                  <ResponsiveField label="Personal seleccionado" required>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, maxHeight: '200px', overflow: 'auto' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.personalSeleccionado.length === personalList.length}
                            indeterminate={formData.personalSeleccionado.length > 0 && formData.personalSeleccionado.length < personalList.length}
                            onChange={(e) => handleSelectAllPersonal(e.target.checked)}
                          />
                        }
                        label="Seleccionar todos"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      />
                      {personalList.map((personal) => (
                        <FormControlLabel
                          key={personal.id}
                          control={
                            <Checkbox
                              checked={formData.personalSeleccionado.includes(personal.id)}
                              onChange={() => handlePersonalChange(personal.id)}
                            />
                          }
                          label={personal.nombre}
                          sx={{ display: 'block', ml: 2 }}
                        />
                      ))}
                    </Box>
                  </ResponsiveField>
                </FieldRow>
              )}

              {formData.tipo === 'plantilla' && (
                <FieldRow>
                  <ResponsiveField label="Plantilla por defecto del Procedimiento" required>
                    <FormControl fullWidth size="small" error={!!errors.plantillaProcedimiento}>
                      <Select
                        value={formData.plantillaProcedimiento}
                        onChange={(e) => handleInputChange('plantillaProcedimiento', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccionar plantilla de procedimiento</MenuItem>
                        {procedimientosPlantillas.map((plantilla) => (
                          <MenuItem key={plantilla} value={plantilla}>
                            {plantilla}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ResponsiveField>
                </FieldRow>
              )}

              <FieldRow>
                <ResponsiveField
                  label={formData.tipo === 'cabecera' ? "Plantilla de cabecera del Reporte" : "Contenido de la Plantilla"}
                  required
                >
                  <RichTextEditor
                    value={formData.tipo === 'cabecera' ? formData.plantillaCabecera : formData.plantilla}
                    onChange={(value) => handleInputChange(formData.tipo === 'cabecera' ? 'plantillaCabecera' : 'plantilla', value)}
                    placeholder="Diseñe el contenido..."
                  />
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

      {/* Modal de Detalles de la Plantilla */}
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
          Detalles de la Plantilla
          <IconButton onClick={handleCloseDetailsModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedPlantilla && (
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#2196f3' }}>
                Información de la Plantilla
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Nombre:</strong> {selectedPlantilla.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Tipo:</strong> {selectedPlantilla.tipo === 'cabecera' ? 'Cabecera de Reporte' : 'Plantilla'}
                  </Typography>
                </Grid>
                {selectedPlantilla.descripcion && (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Descripción:</strong> {selectedPlantilla.descripcion}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Asignado a:</strong> {getAsignacionTexto(selectedPlantilla.asignadoA)}
                  </Typography>
                </Grid>
                {selectedPlantilla.plantillaProcedimiento && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Plantilla de Procedimiento:</strong> {selectedPlantilla.plantillaProcedimiento}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Fecha de Creación:</strong> {formatDate(selectedPlantilla.fechaCreacion)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <strong>Creado por:</strong> {selectedPlantilla.creadoPor}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDetailsModal}
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
            ¿Está seguro de que desea eliminar la plantilla{' '}
            <strong>"{selectedPlantilla?.nombre}"</strong>?
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
            onClick={handleDeletePlantilla}
            startIcon={<Delete />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Plantillas;