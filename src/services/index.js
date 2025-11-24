// Importaciones necesarias
import React from 'react';
import { api } from '../utils/apiClient';

// Importar servicios
import patientsService from './patientsService';
import staffService from './staffService';
import centersService from './centersService';
import appointmentsService from './appointmentsService';
import usuariosService from './usuariosService';

// Exportar servicios con nombres completos y alias
export {
  patientsService,
  staffService,
  centersService,
  appointmentsService,
  usuariosService,
  // Alias más cortos
  patientsService as patients,
  staffService as staff,
  centersService as centers,
  appointmentsService as appointments
};

// Servicio genérico para otros módulos (examenes, procedimientos, etc.)

// Factory para crear servicios CRUD básicos
export const createCrudService = (baseEndpoint) => ({
  getAll: async (params = {}) => {
    return await api.get(baseEndpoint, { params });
  },

  getById: async (id) => {
    if (!id) {
      throw new Error('ID es requerido');
    }
    return await api.get(`${baseEndpoint}/${id}`);
  },

  create: async (data) => {
    return await api.post(baseEndpoint, data);
  },

  update: async (id, data) => {
    if (!id) {
      throw new Error('ID es requerido');
    }
    return await api.put(`${baseEndpoint}/${id}`, data);
  },

  delete: async (id) => {
    if (!id) {
      throw new Error('ID es requerido');
    }
    return await api.delete(`${baseEndpoint}/${id}`);
  },

  changeStatus: async (id, status) => {
    if (!id) {
      throw new Error('ID es requerido');
    }
    return await api.patch(`${baseEndpoint}/${id}`, { status });
  }
});

// Servicios específicos usando el factory para módulos simples
export const examinationsService = createCrudService('/examinations');
export const proceduresService = createCrudService('/procedures');
export const suppliesService = createCrudService('/clinical/supplies');
export const cie10Service = createCrudService('/clinical/cie10');
export const insuranceService = createCrudService('/admin/insurance');
export const rolesService = createCrudService('/admin/roles');
export const usersService = createCrudService('/admin/users');

// Servicio de estadísticas
export const statisticsService = {
  getDashboard: async (params = {}) => {
    return await api.get('/statistics/dashboard', { params });
  },

  getPatientStats: async (params = {}) => {
    return await api.get('/statistics/patients', { params });
  },

  getProcedureStats: async (params = {}) => {
    return await api.get('/statistics/procedures', { params });
  },

  getStaffStats: async (params = {}) => {
    return await api.get('/statistics/staff', { params });
  },

  getRevenueStats: async (params = {}) => {
    return await api.get('/statistics/revenue', { params });
  }
};

// Servicio de autenticación
export const authService = {
  login: async (credentials) => {
    const { email, password, rememberMe = false } = credentials;

    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const response = await api.post('/auth/login', { email, password });

    const { accessToken, refreshToken, user } = response;

    // Guardar tokens según preferencia del usuario
    if (rememberMe) {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('authToken', accessToken);
    }

    // Guardar información del usuario
    localStorage.setItem('currentUser', JSON.stringify(user));

    return response;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      // Limpiar storage independientemente del resultado
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('authToken');
    }
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No hay token de refresh disponible');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response;

    localStorage.setItem('authToken', accessToken);
    return response;
  },

  verify: async () => {
    return await api.get('/auth/verify');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
  }
};

// Hook personalizado para el estado de autenticación (para usar con React)
export const useAuth = () => {
  const [user, setUser] = React.useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState(authService.isAuthenticated());

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    setIsAuthenticated(true);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};