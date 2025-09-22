export const APP_CONSTANTS = {
  // Application Info
  APP_NAME: 'InteliGastro',
  APP_DESCRIPTION: 'Sistema de Gestión Clínica Gastroenterológica',
  APP_VERSION: '1.0.0',

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    CURRENT_USER: 'currentUser',
    USER_PREFERENCES: 'userPreferences',
    SIDEBAR_STATE: 'sidebarState',
  },

  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'DD/MM/YYYY',
    DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
    API: 'YYYY-MM-DD',
    TIME: 'HH:mm',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
    MAX_PAGE_SIZE: 100,
  },

  // Patient Status
  PATIENT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
  },

  // Appointment Status
  APPOINTMENT_STATUS: {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
  },

  // Procedure Status
  PROCEDURE_STATUS: {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Gender Options
  GENDER_OPTIONS: [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'O', label: 'Otro' },
  ],

  // Blood Type Options
  BLOOD_TYPE_OPTIONS: [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ],

  // Priority Levels
  PRIORITY_LEVELS: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent',
  },

  // Notification Types
  NOTIFICATION_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },

  // File Types
  ALLOWED_FILE_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // File Size Limits (in bytes)
  FILE_SIZE_LIMITS: {
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Timeouts (in milliseconds)
  TIMEOUTS: {
    API_REQUEST: 10000,
    NOTIFICATION: 5000,
    SESSION_WARNING: 300000, // 5 minutes
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 100,
    MIN_AGE: 0,
    MAX_AGE: 150,
  },

  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    PATIENTS: '/patients',
    APPOINTMENTS: '/appointments',
    PROCEDURES: '/procedures',
    STATISTICS: '/statistics',
    ADMIN: '/admin',
  },
};

export default APP_CONSTANTS;