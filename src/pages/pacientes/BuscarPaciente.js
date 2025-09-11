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
  Link,
  Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  NavigateNext,
  Search,
  RemoveRedEye, Close
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
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

const BuscarPaciente = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando con los datos:', formData);

    const mockData = [
      { id: 1, nombres: 'Juan', apellidos: 'Pérez García', tipoDocumento: 'DNI', numeroDocumento: '12345678', edad: 45, telefono: '987654321', email: 'juan.perez@example.com' },
      { id: 2, nombres: 'María', apellidos: 'López Ruiz', tipoDocumento: 'CE', numeroDocumento: 'CE98765432', edad: 30, telefono: '912345678', email: 'maria.lopez@example.com' },
      { id: 3, nombres: 'Carlos', apellidos: 'Gómez Sánchez', tipoDocumento: 'DNI', numeroDocumento: '87654321', edad: 28, telefono: '955555555', email: 'carlos.gomez@example.com' },
    ];

    const filteredResults = mockData.filter(patient => {
      const matchDoc = !formData.numeroDocumento || patient.numeroDocumento.includes(formData.numeroDocumento);
      const matchNombres = !formData.nombres || patient.nombres.toLowerCase().includes(formData.nombres.toLowerCase());
      const matchApellidos = !formData.apellidos || patient.apellidos.toLowerCase().includes(formData.apellidos.toLowerCase());
      const matchTipoDoc = !formData.tipoDocumento || patient.tipoDocumento === formData.tipoDocumento;
      return matchDoc && matchNombres && matchApellidos && matchTipoDoc;
    });

    setSearchResults(filteredResults);
  };

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPatient(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container sx={{ py: 1, px: 2, maxWidth: '100% !important' }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
            Inicio
          </Link>
          <Typography color="text.primary">Búsqueda de Pacientes</Typography>
        </Breadcrumbs>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Búsqueda de Pacientes
        </Typography>

        <form onSubmit={handleSearch}>
          <Paper sx={{ mb: 4, boxShadow: 2 }}>
            <SectionHeader title="Información de Búsqueda" />
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                
                {/* Contenedor flexible para los campos de búsqueda */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    
                    {/* Campo de Tipo de Documento */}
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth size="small">
                        {/* Se agrega label para el Select */}
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Tipo Documento</Typography>
                        <Select
                          value={formData.tipoDocumento}
                          onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                        >
                          <MenuItem value="DNI">DNI</MenuItem>
                          <MenuItem value="CE">Carnet de Extranjería</MenuItem>
                          <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Campo de Número de Documento */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Número de Documento</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder='Número de Documento'
                            value={formData.numeroDocumento}
                            onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                        />
                    </Box>
                    
                    {/* Campo de Nombres */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Nombres</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder='Nombres'
                            value={formData.nombres}
                            onChange={(e) => handleInputChange('nombres', e.target.value)}
                        />
                    </Box>

                    {/* Campo de Apellidos */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>Apellidos</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder='Apellidos'
                            value={formData.apellidos}
                            onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        />
                    </Box>
                </Box>
                
                {/* Botón de búsqueda a la derecha */}
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search />}
                  sx={{ minWidth: '150px', height: '60px' }}
                >
                  Buscar
                </Button>
            </Box>
          </Paper>
        </form>

        {/* --- */}
        
        {/* Sección 2: Resultados de la Búsqueda */}
        {searchResults.length > 0 && (
          <Paper sx={{ mb: 4, boxShadow: 2 }}>
            <SectionHeader title="Resultados de la Búsqueda" />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Nombres y Apellidos</TableCell>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Número de Documento</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>{patient.nombres} {patient.apellidos}</TableCell>
                      <TableCell>{patient.tipoDocumento}</TableCell>
                      <TableCell>{patient.numeroDocumento}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="Ver Ficha Médica"
                          color="primary"
                          onClick={() => handleOpenModal(patient)}
                        >
                          <RemoveRedEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      {/* Ventana Emergente (Modal) */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2184be', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">Ficha Médica</Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedPatient && (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Nombres:</strong> {selectedPatient.nombres}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Apellidos:</strong> {selectedPatient.apellidos}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Tipo de Documento:</strong> {selectedPatient.tipoDocumento}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Número de Documento:</strong> {selectedPatient.numeroDocumento}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Edad:</strong> {selectedPatient.edad} años</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Teléfono:</strong> {selectedPatient.telefono}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {selectedPatient.email}</Typography>
              {/* Aquí podrías añadir más información real como historial médico, citas, etc. */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default BuscarPaciente;