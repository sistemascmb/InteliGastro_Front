import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Toolbar,
} from '@mui/material';
import logoClinica from '../../assets/images/logo-clinica.png';
import {
  Dashboard,
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
        { title: 'Centros', icon: <Business />, path: '/admin/centros' },
        { title: 'Personal', icon: <People />, path: '/admin/personal' },
        { title: 'Horarios', icon: <Schedule />, path: '/admin/horarios' },
        { title: 'Estudios', icon: <LocalHospital />, path: '/admin/estudios' },
        { title: 'Salas', icon: <MeetingRoom />, path: '/admin/salas' },
        { title: 'Recursos', icon: <Inventory />, path: '/admin/recursos' },
        { title: 'Exámenes', icon: <Assessment />, path: '/admin/examenes' },
        { title: 'Preparación', icon: <Healing />, path: '/admin/preparacion' },
        { title: 'Seguros', icon: <Security />, path: '/admin/seguros' },
        { title: 'Roles', icon: <AccountCircle />, path: '/admin/roles' },
        { title: 'Usuarios', icon: <People />, path: '/admin/usuarios' },
        { title: 'Plantillas', icon: <Description />, path: '/admin/plantillas' },
        { title: 'Macros', icon: <Code />, path: '/admin/macros' },
        { title: 'Médicos Ref.', icon: <PersonSearch />, path: '/admin/medicos-referencia' }
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
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
          {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
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
    <Box sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Toolbar 
        sx={{ 
          backgroundColor: '#1976d2', 
          color: 'white',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }}
        onClick={() => navigate('/')}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img 
            src={logoClinica} 
            alt="Clínica María Belén" 
            style={{ 
              height: '35px',
              marginRight: '8px'
            }}
          />
        </Box>
        
      </Toolbar>
      <Divider />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Box>
  );
};

export default Sidebar;