import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Componentes de autenticación
import LoginDemo from './pages/LoginDemo';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Páginas existentes
import HomeConAuth from './pages/HomeConAuth';
import Pacientes from './pages/pacientes/Pacientes';
import PacientesConRoles from './pages/pacientes/PacientesConRoles';

// Páginas de admisión
import CitaMedica from './pages/admision/CitaMedica';
import ProcedimientoAdmision from './pages/admision/ProcedimientoAdmision';

// Páginas de citas
import Agendadas from './pages/citas/Agendadas';
import EnEspera from './pages/citas/EnEspera';
import Finalizadas from './pages/citas/Finalizadas';

// Páginas de procedimientos
import AgendaHoy from './pages/procedimientos/AgendaHoy';
import Ordenes from './pages/procedimientos/Ordenes';
import Agendados from './pages/procedimientos/Agendados';
import Completados from './pages/procedimientos/Completados';
import Altas from './pages/procedimientos/AltasOld';

// Páginas de administración
import Personal from './pages/administracion/Personal';
import Centros from './pages/administracion/Centros';

// Páginas de estadísticas
import Dashboard from './pages/estadisticas/Dashboard';
import PacientesEstadisticas from './pages/estadisticas/Pacientes';

import { authService } from './services';

// Componente para página no autorizada
const UnauthorizedPage = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>No Autorizado</h2>
    <p>No tienes permisos para acceder a esta página.</p>
    <button onClick={() => window.history.back()}>Volver</button>
  </div>
);

// Crear tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#2184be',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function AppConAuth() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Ruta de login - accesible sin autenticación */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginDemo />
            }
          />

          {/* Ruta de no autorizado */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas protegidas - requieren autenticación */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    {/* Página principal - todos los roles */}
                    <Route path="/" element={<HomeConAuth />} />

                    {/* ===== RUTAS DE ADMISIÓN ===== */}
                    {/* Recepcionistas y doctores */}
                    <Route
                      path="/admision/cita-medica"
                      element={
                        <ProtectedRoute requiredPermissions={['appointments:write']}>
                          <CitaMedica />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admision/procedimiento"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:write']}>
                          <ProcedimientoAdmision />
                        </ProtectedRoute>
                      }
                    />

                    {/* ===== RUTAS DE PACIENTES ===== */}
                    {/* Todos pueden ver, solo doctores y admin pueden crear/editar */}
                    <Route
                      path="/pacientes"
                      element={
                        <ProtectedRoute requiredPermissions={['patients:read']}>
                          <PacientesConRoles />
                        </ProtectedRoute>
                      }
                    />

                    {/* ===== RUTAS DE CITAS ===== */}
                    <Route
                      path="/citas/agendadas"
                      element={
                        <ProtectedRoute requiredPermissions={['appointments:read']}>
                          <Agendadas />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/citas/en-espera"
                      element={
                        <ProtectedRoute requiredPermissions={['appointments:read']}>
                          <EnEspera />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/citas/finalizadas"
                      element={
                        <ProtectedRoute requiredPermissions={['appointments:read']}>
                          <Finalizadas />
                        </ProtectedRoute>
                      }
                    />

                    {/* ===== RUTAS DE PROCEDIMIENTOS ===== */}
                    {/* Doctores y enfermeras */}
                    <Route
                      path="/procedimientos/agenda-hoy"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:read']}>
                          <AgendaHoy />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/procedimientos/ordenes"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:read']}>
                          <Ordenes />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/procedimientos/agendados"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:read']}>
                          <Agendados />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/procedimientos/completados"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:read']}>
                          <Completados />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/procedimientos/altas"
                      element={
                        <ProtectedRoute requiredPermissions={['procedures:read']}>
                          <Altas />
                        </ProtectedRoute>
                      }
                    />

                    {/* ===== RUTAS DE ADMINISTRACIÓN ===== */}
                    {/* Solo administradores */}
                    <Route
                      path="/administracion/personal"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Personal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/administracion/centros"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Centros />
                        </ProtectedRoute>
                      }
                    />

                    {/* ===== RUTAS DE ESTADÍSTICAS ===== */}
                    {/* Doctores y administradores */}
                    <Route
                      path="/estadisticas/dashboard"
                      element={
                        <ProtectedRoute requiredPermissions={['statistics:read']}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/estadisticas/pacientes"
                      element={
                        <ProtectedRoute requiredPermissions={['statistics:read']}>
                          <PacientesEstadisticas />
                        </ProtectedRoute>
                      }
                    />

                    {/* Ruta por defecto - redirigir según rol */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default AppConAuth;