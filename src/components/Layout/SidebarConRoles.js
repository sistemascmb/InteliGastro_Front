import React, { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Button,
  Typography,
  Avatar
} from '@mui/material';
import {
  PersonAdd,
  CalendarToday,
  MedicalServices,
  People,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
  Business,
  Logout,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import RoleBasedComponent, { usePermissions } from '../Auth/RoleBasedComponent';

const SidebarConRoles = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, isDoctor, isNurse, isReceptionist } = usePermissions();
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuClick = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Menús según roles
  const menuByRole = {
    admin: [
      {
        title: 'Pacientes',
        icon: <People />,
        path: '/pacientes',
        permissions: ['patients:read']
      },
      {
        title: 'Personal',
        icon: <AccountCircle />,
        path: '/administracion/personal',
        permissions: ['staff:read']
      },
      {
        title: 'Citas',
        icon: <CalendarToday />,
        path: '/citas',
        permissions: ['appointments:read']
      },
      {
        title: 'Procedimientos',
        icon: <MedicalServices />,
        path: '/procedimientos',
        permissions: ['procedures:read']
      },
      {
        title: 'Estadísticas',
        icon: <BarChart />,
        path: '/estadisticas',
        permissions: ['statistics:read']
      },
      {
        title: 'Administración',
        icon: <Settings />,
        path: '/administracion',
        permissions: ['admin:read']
      }
    ],
    doctor: [
      {
        title: 'Pacientes',
        icon: <People />,
        path: '/pacientes',
        permissions: ['patients:read']
      },
      {
        title: 'Mis Citas',
        icon: <CalendarToday />,
        path: '/citas',
        permissions: ['appointments:read']
      },
      {
        title: 'Procedimientos',
        icon: <MedicalServices />,
        path: '/procedimientos',
        permissions: ['procedures:read']
      },
      {
        title: 'Estadísticas',
        icon: <BarChart />,
        path: '/estadisticas',
        permissions: ['statistics:read']
      }
    ],
    nurse: [
      {
        title: 'Pacientes',
        icon: <People />,
        path: '/pacientes',
        permissions: ['patients:read']
      },
      {
        title: 'Citas del Día',
        icon: <CalendarToday />,
        path: '/citas',
        permissions: ['appointments:read']
      },
      {
        title: 'Procedimientos',
        icon: <MedicalServices />,
        path: '/procedimientos',
        permissions: ['procedures:read']
      }
    ],
    receptionist: [
      {
        title: 'Admisión',
        icon: <PersonAdd />,
        path: '/admision',
        permissions: ['patients:read']
      },
      {
        title: 'Citas',
        icon: <CalendarToday />,
        path: '/citas',
        permissions: ['appointments:read']
      },
      {
        title: 'Pacientes',
        icon: <People />,
        path: '/pacientes',
        permissions: ['patients:read']
      }
    ]
  };

  const currentMenuItems = menuByRole[currentUser?.role] || [];

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header con info del usuario */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {currentUser?.nombres?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser?.nombres} {currentUser?.apellidos}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {currentUser?.role === 'admin' && 'Administrador'}
              {currentUser?.role === 'doctor' && 'Doctor'}
              {currentUser?.role === 'nurse' && 'Enfermera'}
              {currentUser?.role === 'receptionist' && 'Recepcionista'}
            </Typography>
          </Box>
        </Box>

        {/* Mostrar centro de trabajo */}
        {currentUser?.centro && (
          <Typography variant="caption" display="block" color="textSecondary">
            Centro: {currentUser.centro.nombre}
          </Typography>
        )}
      </Box>

      {/* Menú principal */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {currentMenuItems.map((item, index) => (
            <RoleBasedComponent
              key={index}
              requiredPermissions={item.permissions}
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </RoleBasedComponent>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Menús específicos por rol */}
        <RoleBasedComponent allowedRoles={['admin']}>
          <List>
            <ListItemButton onClick={() => navigate('/administracion/centros')}>
              <ListItemIcon><Business /></ListItemIcon>
              <ListItemText primary="Centros" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/administracion/roles')}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Roles y Permisos" />
            </ListItemButton>
          </List>
          <Divider sx={{ my: 2 }} />
        </RoleBasedComponent>
      </Box>

      {/* Footer con logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          color="error"
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default SidebarConRoles;