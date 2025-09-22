// Exportaciones centralizadas de todos los servicios
export { default as patientsService } from './patientsService';
export { default as staffService } from './staffService';
export { default as centersService } from './centersService';
export { default as appointmentsService } from './appointmentsService';

// Re-exportar servicios con alias más cortos si se prefiere
export {
  patientsService as patients,
  staffService as staff,
  centersService as centers,
  appointmentsService as appointments
} from './index';

// Servicio genérico para otros módulos (examenes, procedimientos, etc.)
import { api } from '../utils/apiClient';

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

    const { accessToken, refreshToken, user } = response.data;

    // Guardar tokens según preferencia del usuario
    if (rememberMe) {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('authToken', accessToken);
    }

    // Guardar información del usuario
    localStorage.setItem('currentUser', JSON.stringify(user));

    return response.data;
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
    const { accessToken } = response.data;

    localStorage.setItem('authToken', accessToken);
    return response.data;
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