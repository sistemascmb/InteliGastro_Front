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
import NuevoPaciente from './pages/pacientes/NuevoPaciente';
import BuscarPaciente from './pages/pacientes/BuscarPaciente';
import Suministros from './pages/info-clinica/Suministros';
import Examenes from './pages/info-clinica/Examenes';
import Cie10 from './pages/info-clinica/Cie10';
import Centros from './pages/administracion/Centros';
import Estudios from './pages/administracion/Estudios';
import ExamenesAdmi from './pages/administracion/Examenes';
import Horario from './pages/administracion/Horario';
import Macros from './pages/administracion/Macros';
import MedicosRef from './pages/administracion/MedicosRef';
import Personal from './pages/administracion/Personal';
import Plantillas from './pages/administracion/Plantillas';
import Preparacion from './pages/administracion/Preparacion';
import Recursos from './pages/administracion/Recursos';
import Roles from './pages/administracion/Roles';
import Salas from './pages/administracion/Salas';
import Seguros from './pages/administracion/Seguros';
import Usuarios from './pages/administracion/Usuarios';


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
            <Route path="/info-clinica/suministros" element={<Suministros />} />
            <Route path="/info-clinica/cie10" element={<Cie10 />} />
            <Route path="/info-clinica/examenes" element={<Examenes />} />
            <Route path="/administracion/centros" element={<Centros />} />
            <Route path="/administracion/personal" element={<Personal />} />
            <Route path="/administracion/horarios" element={<Horario />} />
            <Route path="/administracion/estudios" element={<Estudios />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
