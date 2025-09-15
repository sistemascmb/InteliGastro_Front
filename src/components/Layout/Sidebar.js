import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import logoClinica from '../../assets/images/logo-clinica.png';
import {
  PersonAdd,
  CalendarToday,
  MedicalServices,
  People,
  Info,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
  Business,
  Schedule,
  LocalHospital,
  MeetingRoom,
  Inventory,
  Assessment,
  Healing,
  Security,
  AccountCircle,
  Description,
  Code,
  PersonSearch,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuClick = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    {
      title: 'Admisión',
      icon: <PersonAdd />,
      children: [
        { title: 'Cita médica', path: '/admision/cita' },
        { title: 'Procedimiento', path: '/admision/procedimiento' }
      ]
    },
    {
      title: 'Citas',
      icon: <CalendarToday />,
      children: [
        { title: 'Agendadas', path: '/citas/agendas' },
        { title: 'En Espera', path: '/citas/espera' },
        { title: 'Finalizadas', path: '/citas/finalizadas' }
      ]
    },
    {
      title: 'Procedimientos',
      icon: <MedicalServices />,
      children: [
        { title: 'Agenda de Hoy', path: '/procedimientos/agenda-hoy' },
        { title: 'Ordenes', path: '/procedimientos/ordenes' },
        { title: 'Agendados', path: '/procedimientos/agendados' },
        { title: 'Completados', path: '/procedimientos/completados' },
        { title: 'Altas', path: '/procedimientos/altas' }
      ]
    },
    {
      title: 'Pacientes',
      icon: <People />,
      children: [
        { title: 'Nuevo Paciente', path: '/pacientes/nuevo-paciente' },
        { title: 'Buscar Paciente', path: '/pacientes/buscar-paciente' }
      ]
    },
    {
      title: 'Inf. Clínica',
      icon: <Info />,
      children: [
        { title: 'Examenes', path: '/info-clinica/examenes' },
        { title: 'Suministros', path: '/info-clinica/suministros' },
        { title: 'CIE-10', path: '/info-clinica/cie10' },
      ]
    },
    {
      title: 'Estadísticas',
      icon: <BarChart />,
      children:[
        { title: 'Detallado', path: '/estadisticas/detallado' },
        { title: 'Dashboard', path: '/estadisticas/dashboard' },
        { title: 'Pacientes', path: '/estadisticas/pacientes' },
        { title: 'Procedimientos', path: '/estadisticas/procedimientos' },
        { title: 'Personal', path: '/estadisticas/personal' }
      ]
    },
    {
      title: 'Administración',
      icon: <Settings />,
      children: [
        { title: 'Centros', icon: <Business />, path: '/administracion/centros' },
        { title: 'Personal', icon: <People />, path: '/administracion/personal' },
        { title: 'Horarios', icon: <Schedule />, path: '/administracion/horarios' },
        { title: 'Estudios', icon: <LocalHospital />, path: '/administracion/estudios' },
        { title: 'Salas', icon: <MeetingRoom />, path: '/administracion/salas' },
        { title: 'Recursos', icon: <Inventory />, path: '/administracion/recursos' },
        { title: 'Exámenes', icon: <Assessment />, path: '/administracion/examenes' },
        { title: 'Preparación', icon: <Healing />, path: '/administracion/preparacion' },
        { title: 'Seguros', icon: <Security />, path: '/administracion/seguros' },
        { title: 'Roles', icon: <AccountCircle />, path: '/administracion/roles' },
        { title: 'Usuarios', icon: <People />, path: '/administracion/usuarios' },
        { title: 'Plantillas', icon: <Description />, path: '/administracion/plantillas' },
        { title: 'Macros', icon: <Code />, path: '/administracion/macros' },
        { title: 'Médicos Ref.', icon: <PersonSearch />, path: '/administracion/medicos-ref' }
      ]
    }
  ];

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.title];

    return (
      <div key={item.title}>
        <ListItemButton
          onClick={() => {
            if (hasChildren) {
              handleMenuClick(item.title);
            } else {
              navigate(item.path);
            }
          }}
          sx={{
            pl: 2 + level * 2,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 40,
            color: 'white'
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.title}
            sx={{
              '& .MuiListItemText-primary': {
                color: 'white'
              }
            }}
          />
          {hasChildren && (isOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />)}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#2184be'
    }}>
      {/* Contenedor con scroll que incluye logo y menú */}
      <Box sx={{ 
        height: '100vh',
        backgroundColor: '#2184be',
        overflow: 'auto',
        // Estilos personalizados para la barra de scroll
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#2184be', // Mismo color del sidebar
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#1e75a6', // Color más oscuro para la barra
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#1565c0', // Color aún más oscuro al hover
        }
      }}>
        {/* Logo que ahora se desliza con el scroll */}
        <Box 
          sx={{ 
            height: '20vh', // Mismo tamaño que el header principal
            backgroundColor: '#2184be', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0, // No se encoge
            '&:hover': {
              backgroundColor: '#1e75a6'
            }
          }}
          onClick={() => navigate('/')}
        >
          <img 
            src={logoClinica} 
            alt="Clínica María Belén" 
            style={{ 
              height: '130px',
              maxWidth: '95%',
              objectFit: 'contain'
            }}
          />
        </Box>
        
        {/* Menú que continúa después del logo */}
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;