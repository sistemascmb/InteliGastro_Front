import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';

import CitaMedica from './pages/admision/CitaMedica';
import ProcedimientoAdmision from './pages/admision/ProcedimientoAdmision';

import Agendadas from './pages/citas/Agendadas';
import EnEspera from './pages/citas/EnEspera';
import Finalizadas from './pages/citas/Finalizadas';

import AgendaHoy from './pages/procedimientos/AgendaHoy';
import Ordenes from './pages/procedimientos/Ordenes';
import Agendados from './pages/procedimientos/Agendados';
import Completados from './pages/procedimientos/Completados';
import Altas from './pages/procedimientos/Altas';

import Pacientes from './pages/pacientes/Pacientes';
import BuscarPaciente from './pages/pacientes/BuscarPaciente';
import NuevoPaciente from './pages/pacientes/NuevoPaciente';

import Examenes from './pages/info-clinica/Examenes';
import Suministros from './pages/info-clinica/Suministros';
import Cie10 from './pages/info-clinica/Cie10';

import Detallado from './pages/estadisticas/Detallado';
import Dashboard from './pages/estadisticas/Dashboard';
import PacientesEstadisticas from './pages/estadisticas/Pacientes';
import ProcedimientosEstadisticas from './pages/estadisticas/Procedimientos';
import PersonalEstadisticas from './pages/estadisticas/Personal';

import Centros from './pages/administracion/Centros';
import PersonalAdministracion from './pages/administracion/Personal';
import Horario from './pages/administracion/Horario';
import Estudios from './pages/administracion/Estudios';
import Salas from './pages/administracion/Salas';
import Recursos from './pages/administracion/Recursos';
import ExamenesAdministracion from './pages/administracion/Examenes';
import Preparacion from './pages/administracion/Preparacion';
import Seguros from './pages/administracion/Seguros';
import Roles from './pages/administracion/Roles';
import Usuarios from './pages/administracion/Usuarios';
import Plantillas from './pages/administracion/Plantillas';
import Macros from './pages/administracion/Macros';
import MedicosRef from './pages/administracion/MedicosRef';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    // Reducir todos los tamaños de fuente en un 10%
    fontSize: 14, // Base por defecto es 14, reducido de ~15.6
    h1: {
      fontSize: '5.4rem', // Reducido de 6rem
    },
    h2: {
      fontSize: '3.42rem', // Reducido de 3.8rem  
    },
    h3: {
      fontSize: '2.7rem', // Reducido de 3rem
    },
    h4: {
      fontSize: '1.935rem', // Reducido de 2.15rem
    },
    h5: {
      fontSize: '1.35rem', // Reducido de 1.5rem
    },
    h6: {
      fontSize: '1.125rem', // Reducido de 1.25rem
    },
    subtitle1: {
      fontSize: '0.9rem', // Reducido de 1rem
    },
    subtitle2: {
      fontSize: '0.785rem', // Reducido de 0.875rem
    },
    body1: {
      fontSize: '0.9rem', // Reducido de 1rem
    },
    body2: {
      fontSize: '0.785rem', // Reducido de 0.875rem
    },
    button: {
      fontSize: '0.785rem', // Reducido de 0.875rem
    },
    caption: {
      fontSize: '0.675rem', // Reducido de 0.75rem
    },
    overline: {
      fontSize: '0.675rem', // Reducido de 0.75rem
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admision/cita" element={<CitaMedica />} />
            <Route path="/admision/procedimiento" element={<ProcedimientoAdmision />} />

            <Route path="/citas/agendas" element={<Agendadas />} />
            <Route path="/citas/espera" element={<EnEspera />} />
            <Route path="/citas/finalizadas" element={<Finalizadas />} />
           
            <Route path="/procedimientos/agenda-hoy" element={<AgendaHoy />} />
            <Route path="/procedimientos/ordenes" element={<Ordenes />} />
            <Route path="/procedimientos/agendados" element={<Agendados />} />
            <Route path="/procedimientos/completados" element={<Completados />} />
            <Route path="/procedimientos/altas" element={<Altas />} />
            
            <Route path="/pacientes/pacientes" element={<Pacientes />} />
            <Route path="/pacientes/nuevo-paciente" element={<NuevoPaciente />} />
            <Route path="/pacientes/buscar-paciente" element={<BuscarPaciente />} />
            
            <Route path="/info-clinica/suministros" element={<Suministros />} />
            <Route path="/info-clinica/cie10" element={<Cie10 />} />
            <Route path="/info-clinica/examenes" element={<Examenes />} />
           
            <Route path="/estadisticas/detallado" element={<Detallado />} />
            <Route path="/estadisticas/dashboard" element={<Dashboard />} />
            <Route path="/estadisticas/pacientes" element={<PacientesEstadisticas />} />
            <Route path="/estadisticas/procedimientos" element={<ProcedimientosEstadisticas />} />
            <Route path="/estadisticas/personal" element={<PersonalEstadisticas />} />
           
            <Route path="/administracion/centros" element={<Centros />} />
            <Route path="/administracion/personal" element={<PersonalAdministracion />} />
            <Route path="/administracion/horarios" element={<Horario />} />
            <Route path="/administracion/estudios" element={<Estudios />} />
            <Route path="/administracion/salas" element={<Salas />} />
            <Route path="/administracion/recursos" element={<Recursos />} />
            <Route path="/administracion/examenes" element={<ExamenesAdministracion />} />
            <Route path="/administracion/preparacion" element={<Preparacion />} />
            <Route path="/administracion/seguros" element={<Seguros />} />
            <Route path="/administracion/roles" element={<Roles />} />
            <Route path="/administracion/usuarios" element={<Usuarios />} />
            <Route path="/administracion/plantillas" element={<Plantillas />} />
            <Route path="/administracion/macros" element={<Macros />} />
            <Route path="/administracion/medicos-ref" element={<MedicosRef />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
