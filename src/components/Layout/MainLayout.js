import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  IconButton,
  Typography,
  Button
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

// CONFIGURACIÓN: Ancho del sidebar cuando está abierto (280px)
const drawerWidth = 280;

const MainLayout = ({ children }) => {
  // ESTADO: Controla si el sidebar está abierto (true) o cerrado (false)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Forzar ocultar el sidebar en la página de Captura de Imágenes
  const isSidebarForcedClosed = location.pathname === '/procedimientos/captura-imagenes';
  const effectiveSidebarOpen = isSidebarForcedClosed ? false : sidebarOpen;

  // FUNCIÓN: Alternar apertura/cierre del sidebar al hacer clic en hamburguesa
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        
        {/* SIDEBAR IZQUIERDO (20%): Menú de navegación colapsible */}
      <Box
        sx={{
          // COMPORTAMIENTO: Ancho cambia según estado (280px abierto, 0px cerrado)
          width: effectiveSidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          transition: 'width 0.4s ease-in-out', // ANIMACIÓN: Suave al abrir/cerrar
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: drawerWidth,
            height: '100vh',
            // ANIMACIÓN: Desliza hacia la izquierda cuando se cierra
            transform: effectiveSidebarOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
            transition: 'transform 0.4s ease-in-out'
          }}
        >
          <Sidebar />
        </Box>
      </Box>
      
      {/* ═══════════════════════════════════════════════════════════════════
          ÁREA PRINCIPAL DERECHA (80%): Contenedor con scroll
          ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          overflow: 'auto', // SCROLL: El contenedor principal tiene scroll
          height: '100vh' // ALTURA: 100% del viewport
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            HEADER SUPERIOR (20%): Elemento normal que sube con el scroll
            ═══════════════════════════════════════════════════════════════════ */}
        <Box
          sx={{
            height: '20vh', // TAMAÑO: 20% de la altura del viewport
            backgroundColor: '#f3f3f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4, // ESPACIADO: Padding horizontal reducido para caja más ancha
            py: 2, // ESPACIADO: Padding vertical de 16px
            flexShrink: 0 // COMPORTAMIENTO: No se encoge, mantiene su altura
          }}
        >
          {/* CAJA PRINCIPAL DEL HEADER: Contenedor con bordes redondeados */}
          <Box
            sx={{
              width: '100%',
              height: '70%', // TAMAÑO: 70% del espacio del header
              backgroundColor: '#ffffff',
              border: '1px solid #d0d7de', // DISEÑO: Borde gris sutil
              borderRadius: '12px', // DISEÑO: Esquinas redondeadas
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // DISTRIBUCIÓN: Contenido a los extremos
              px: 3, // ESPACIADO INTERNO: 24px a los lados
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)' // DISEÑO: Sombra sutil
            }}
          >
            {/* ═══ LADO IZQUIERDO: Ícono hamburguesa para abrir/cerrar sidebar ═══ */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={handleSidebarToggle} // ACCIÓN: Ejecuta función para mostrar/ocultar sidebar
                sx={{ 
                  padding: '8px', // TAMAÑO: Espaciado interno del botón
                  border: '1px solid #d0d7de', // DISEÑO: Borde gris alrededor del botón
                  borderRadius: '6px', // DISEÑO: Esquinas redondeadas del botón
                  '&:hover': {
                    backgroundColor: '#f6f8fa' // INTERACCIÓN: Color de fondo al pasar el mouse
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: '20px' }} /> {/* ÍCONO: Tres líneas horizontales (hamburguesa) */}
              </IconButton>
            </Box>

            {/* ═══ LADO DERECHO: Información del usuario y acciones ═══ */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}> {/* ESPACIADO: 24px entre elementos */}
              
              {/* ÍCONO DE CLÍNICA: Representación visual de la institución */}
              <BusinessIcon sx={{ fontSize: 24, color: '#2184be' }} /> {/* COLOR: Azul corporativo #2184be */}
              
              {/* EMAIL DEL USUARIO: Mostrar quién está logueado*/}
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                usuario@clinica.com {/* DATOS: Email del usuario actual - CONECTAR CON BACKEND */}
              </Typography>
              
              {/* SIGLAS CMB: Clínica María Belén*/}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#2184be', // COLOR: Azul corporativo
                  fontWeight: 'bold',
                  fontSize: '14px',
                  px: 2, // ESPACIADO: Padding horizontal interno
                  py: 0.5, // ESPACIADO: Padding vertical interno
                  border: '1px solid #2184be', // DISEÑO: Borde del mismo color del texto
                  borderRadius: '4px' // DISEÑO: Esquinas ligeramente redondeadas
                }}
              >
                CMB {/* TEXTO: Siglas de la clínica*/}
              </Typography>
              
              {/* BOTÓN CERRAR SESIÓN: Logout del sistema (AGREGAR FUNCIONALIDAD EN onClick) */}
              <Button
                startIcon={<LogoutIcon />} // ÍCONO: Puerta de salida antes del texto
                variant="outlined" // ESTILO: Botón con borde, sin relleno
                size="small" // TAMAÑO: Botón pequeño
                sx={{
                  color: '#666', // COLOR: Gris para texto
                  borderColor: '#d0d7de', // COLOR: Gris para borde
                  fontSize: '12px', // TAMAÑO: Texto pequeño
                  '&:hover': { // INTERACCIÓN: Efectos al pasar el mouse
                    backgroundColor: '#f6f8fa', // Fondo gris claro
                    borderColor: '#d0d7de' // Mantener color del borde
                  }
                }}
                // onClick={handleLogout} // TODO: AGREGAR función de logout aquí
              >
                Cerrar Sesión {/* TEXTO: Label del botón*/}
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <Box
          component="main"
          sx={{
            backgroundColor: '#f3f3f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4, // ESPACIADO: Padding horizontal reducido para caja más ancha
            py: 2, // ESPACIADO: Padding vertical de 16px
            flexShrink: 0, // COMPORTAMIENTO: No se encoge, mantiene su altura
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default MainLayout;