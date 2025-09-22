export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },

  // Patients
  PATIENTS: {
    BASE: '/Paciente',
    SEARCH: '/Paciente/search',
    BY_ID: (id) => `/Paciente/${id}`,
  },

  // Staff
  STAFF: {
    BASE: '/staff',
    DOCTORS: '/staff/doctors',
    NURSES: '/staff/nurses',
    BY_ID: (id) => `/staff/${id}`,
  },

  // Centers
  CENTERS: {
    BASE: '/centers',
    ACTIVE: '/centers/active',
    BY_ID: (id) => `/centers/${id}`,
  },

  // Appointments
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_DATE: (date) => `/appointments/date/${date}`,
    BY_PATIENT: (id) => `/appointments/patient/${id}`,
    BY_DOCTOR: (id) => `/appointments/doctor/${id}`,
    PENDING: '/appointments/pending',
    COMPLETED: '/appointments/completed',
    BY_ID: (id) => `/appointments/${id}`,
  },

  // Examinations
  EXAMINATIONS: {
    BASE: '/examinations',
    BY_ID: (id) => `/examinations/${id}`,
  },

  // Procedures
  PROCEDURES: {
    BASE: '/procedures',
    TODAY: '/procedures/today',
    SCHEDULED: '/procedures/scheduled',
    BY_PATIENT: (id) => `/procedures/patient/${id}`,
    BY_ID: (id) => `/procedures/${id}`,
  },

  // Statistics
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    PATIENTS: '/statistics/patients',
    PROCEDURES: '/statistics/procedures',
    STAFF: '/statistics/staff',
    REVENUE: '/statistics/revenue',
  },

  // Clinical Information
  CLINICAL: {
    CIE10: '/clinical/cie10',
    SUPPLIES: '/clinical/supplies',
    MEDICATIONS: '/clinical/medications',
  },

  // System
  SYSTEM: {
    HEALTH: '/health',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
  },
};

export default API_ENDPOINTS;