import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
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
import logoClinica from '../../assets/images/logo-clinica.png';
import { authService } from '../../services';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.profiletypeid === 1 || currentUser?.profile_name === 'Administrador';
  const profileNameNorm = (currentUser?.profile_name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const roleNorm = (currentUser?.role || '').toLowerCase().trim();
  const isDoctor = roleNorm === 'doctor' || /medico/.test(profileNameNorm);
  const isEnfermera = roleNorm === 'nurse' || /enfermer[ao]/.test(profileNameNorm);
  const isAdmision = roleNorm === 'admisionista' || /admisionista/.test(profileNameNorm);


  const handleMenuClick = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItemsBase = [
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
        { title: 'AgendadasOld', path: '/citas/agendasold' },
        //{ title: 'En Espera', path: '/citas/espera' },
        //{ title: 'Finalizadas', path: '/citas/finalizadas' }
      ]
    },
    {
      title: 'Procedimientos',
      icon: <MedicalServices />,
      children: [
        { title: 'Agendados', path: '/procedimientos/agendados' },
        { title: 'Procedimiento', path: '/procedimientos/preparacionproc' },
        { title: 'Dictado', path: '/procedimientos/dictadoproc' },
        { title: 'Completados', path: '/procedimientos/completados' },
        { title: 'Altas', path: '/procedimientos/altas' }
      ]
    },
    {
      title: 'Pacientes',
      icon: <People />,
      children: [
        { title: 'Nuevo Paciente', path: '/pacientes/pacientes' }
      ]
    },
    {
      title: 'Inf. Clínica',
      icon: <Info />,
      children: [
        { title: 'Examenes', path: '/info-clinica/examenes' },
        { title: 'Suministros', path: '/info-clinica/suministros' },
        { title: 'CIE-10', path: '/info-clinica/cie10' }
      ]
    },
    {
      title: 'Estadísticas',
      icon: <BarChart />,
      children: [
        { title: 'Detallado', path: '/estadisticas/detallado' },
        { title: 'Dashboard', path: '/estadisticas/dashboard' }
      ]
    },
    isAdmin ? {
      title: 'Administración',
      icon: <Settings />,
      children: [
        { title: 'Centros', icon: <Business />, path: '/administracion/centros' },
        { title: 'Personal', icon: <People />, path: '/administracion/personal' },
        //{ title: 'Horarios', icon: <Schedule />, path: '/administracion/horarios' },
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
    } : null
  ];

  let menuItems = menuItemsBase.filter(Boolean);
  if (isDoctor) {
    menuItems = menuItems.filter(item => !['Admisión', 'Citas', 'Estadísticas'].includes(item.title));
    menuItems = menuItems.map(item => {
      if (item.title === 'Procedimientos') {
        return {
          ...item,
          children: item.children.filter(child => ['Procedimiento', 'Dictado', 'Completados'].includes(child.title))
        };
      }
      if (item.title === 'Inf. Clínica') {
        return {
          ...item,
          children: item.children.filter(child => ['Examenes', 'CIE-10'].includes(child.title))
        };
      }
      return item;
    });
  } else if (isEnfermera) {
    menuItems = menuItems.filter(item => !['Admisión', 'Citas', 'Estadísticas', 'Administración'].includes(item.title));
    menuItems = menuItems.map(item => {
      if (item.title === 'Inf. Clínica') {
        return {
          ...item,
          children: item.children.filter(child => ['Examenes'].includes(child.title))
        };
      }
      if (item.title === 'Procedimientos') {
        return {
          ...item,
          children: item.children.filter(child => ['Agendados', 'Completados'].includes(child.title))
        };
      }
      return item;
    });
  }
  else if (isAdmision) {
    menuItems = menuItems.filter(item => !['Estadísticas', 'Administración'].includes(item.title));
    menuItems = menuItems.map(item => {
      if (item.title === 'Inf. Clínica') {
        return {
          ...item,
          children: item.children.filter(child => ['Examenes'].includes(child.title))
        };
      }
      if (item.title === 'Procedimientos') {
        return {
          ...item,
          children: item.children.filter(child => ['Agendados', 'Completados'].includes(child.title))
        };
      }
      return item;
    });
  }

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
          {menuItems.filter(Boolean).map((item) => renderMenuItem(item))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;