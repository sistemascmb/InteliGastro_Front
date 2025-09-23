// Configuración de constantes para APIs
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify'
  },

  // Pacientes
  PATIENTS: {
    BASE: '/Paciente',
    BY_ID: (id) => `/Paciente/${id}`,
    SEARCH: '/Paciente/search',
    EXPORT: '/Paciente/export'
  },

  // Personal
  STAFF: {
    BASE: '/staff',
    BY_ID: (id) => `/staff/${id}`,
    BY_CENTER: (centerId) => `/staff/center/${centerId}`,
    BY_ROLE: (role) => `/staff/role/${role}`,
    DOCTORS: '/staff/doctors',
    NURSES: '/staff/nurses'
  },

  // Centros
  CENTERS: {
    BASE: '/centers',
    BY_ID: (id) => `/centers/${id}`,
    ACTIVE: '/centers/active'
  },

  // Citas
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id) => `/appointments/${id}`,
    BY_DATE: (date) => `/appointments/date/${date}`,
    BY_PATIENT: (patientId) => `/appointments/patient/${patientId}`,
    BY_DOCTOR: (doctorId) => `/appointments/doctor/${doctorId}`,
    PENDING: '/appointments/pending',
    COMPLETED: '/appointments/completed',
    CANCELLED: '/appointments/cancelled'
  },

  // Exámenes
  EXAMINATIONS: {
    BASE: '/examinations',
    BY_ID: (id) => `/examinations/${id}`,
    BY_TYPE: (type) => `/examinations/type/${type}`,
    ACTIVE: '/examinations/active'
  },

  // Procedimientos
  PROCEDURES: {
    BASE: '/procedures',
    BY_ID: (id) => `/procedures/${id}`,
    TODAY: '/procedures/today',
    SCHEDULED: '/procedures/scheduled',
    COMPLETED: '/procedures/completed',
    BY_PATIENT: (patientId) => `/procedures/patient/${patientId}`
  },

  // Administración
  ADMIN: {
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    SETTINGS: '/admin/settings'
  },

  // Estadísticas
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    PATIENTS: '/statistics/patients',
    PROCEDURES: '/statistics/procedures',
    STAFF: '/statistics/staff',
    REVENUE: '/statistics/revenue'
  },

  // Información Clínica
  CLINICAL_INFO: {
    CIE10: '/clinical/cie10',
    SUPPLIES: '/clinical/supplies',
    MEDICATIONS: '/clinical/medications'
  }
};

// Estados de respuesta HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Mensajes de error estándar
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  TIMEOUT_ERROR: 'La petición ha tardado demasiado. Intente nuevamente.',
  SERVER_ERROR: 'Error interno del servidor. Contacte al administrador.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos enviados no son válidos.',
  DUPLICATE_ERROR: 'El registro ya existe en el sistema.'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  LIMITS_OPTIONS: [5, 10, 25, 50, 100]
};