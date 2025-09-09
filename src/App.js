import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainLayout from './components/Layout/MainLayout';

// Home Page
import Home from './pages/Home';

// Admin Pages
import Centros from './pages/administracion/Centros';

// Admisión Pages
import CitaMedica from './pages/admision/CitaMedica';
import ProcedimientoAdmision from './pages/admision/ProcedimientoAdmision';

// Citas Pages
import Agendadas from './pages/citas/Agendadas';
import EnEspera from './pages/citas/EnEspera';
import Finalizadas from './pages/citas/Finalizadas';

// Procedimientos Pages
import AgendaHoy from './pages/procedimientos/AgendaHoy';
import Ordenes from './pages/procedimientos/Ordenes';

// Pacientes Pages
import NuevoPaciente from './pages/pacientes/NuevoPaciente';
import BuscarPaciente from './pages/pacientes/BuscarPaciente';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            {/* Ruta Principal */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Rutas de Admisión */}
            <Route path="/admision/cita" element={<CitaMedica />} />
            <Route path="/admision/procedimiento" element={<ProcedimientoAdmision />} />
            
            {/* Rutas de Citas */}
            <Route path="/citas/agendas" element={<Agendadas />} />
            <Route path="/citas/espera" element={<EnEspera />} />
            <Route path="/citas/finalizadas" element={<Finalizadas />} />
            
            {/* Rutas de Procedimientos */}
            <Route path="/procedimientos/agenda-hoy" element={<AgendaHoy />} />
            <Route path="/procedimientos/ordenes" element={<Ordenes />} />
            
            {/* Rutas de Pacientes */}
            <Route path="/pacientes/nuevo-paciente" element={<NuevoPaciente />} />
            <Route path="/pacientes/buscar-paciente" element={<BuscarPaciente />} />
            
            {/* Rutas de Administración */}
            <Route path="/admin/centros" element={<Centros />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
