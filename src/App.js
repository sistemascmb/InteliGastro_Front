import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Centros from './pages/administracion/Centros';
import CitaMedica from './pages/admision/CitaMedica';
import ProcedimientoAdmision from './pages/admision/ProcedimientoAdmision';
import Agendadas from './pages/citas/Agendadas';
import EnEspera from './pages/citas/EnEspera';
import Finalizadas from './pages/citas/Finalizadas';
import AgendaHoy from './pages/procedimientos/AgendaHoy';
import Ordenes from './pages/procedimientos/Ordenes';
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
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admision/cita" element={<CitaMedica />} />
            <Route path="/admision/procedimiento" element={<ProcedimientoAdmision />} />
            <Route path="/citas/agendas" element={<Agendadas />} />
            <Route path="/citas/espera" element={<EnEspera />} />
            <Route path="/citas/finalizadas" element={<Finalizadas />} />
            <Route path="/procedimientos/agenda-hoy" element={<AgendaHoy />} />
            <Route path="/procedimientos/ordenes" element={<Ordenes />} />
            <Route path="/pacientes/nuevo-paciente" element={<NuevoPaciente />} />
            <Route path="/pacientes/buscar-paciente" element={<BuscarPaciente />} />
            <Route path="/admin/centros" element={<Centros />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
