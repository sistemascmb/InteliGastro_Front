export const getEnvVar = (name, defaultValue = null) => {
  const value = process.env[name];

  if (value === undefined && defaultValue === null) {
    console.warn(`Environment variable ${name} is not defined`);
  }

  return value || defaultValue;
};

export const config = {
  // API Configuration
  api: {
    baseUrl: getEnvVar('REACT_APP_API_URL', 'http://localhost:3001/api/v1'),
    timeout: parseInt(getEnvVar('REACT_APP_API_TIMEOUT', '10000')),
  },

  // App Configuration
  app: {
    name: getEnvVar('REACT_APP_NAME', 'InteliGastro'),
    version: getEnvVar('REACT_APP_VERSION', '1.0.0'),
    environment: getEnvVar('REACT_APP_ENVIRONMENT', 'development'),
  },

  // Feature Flags
  features: {
    enableStatistics: getEnvVar('REACT_APP_ENABLE_STATISTICS', 'true') === 'true',
    enableReports: getEnvVar('REACT_APP_ENABLE_REPORTS', 'true') === 'true',
    enableNotifications: getEnvVar('REACT_APP_ENABLE_NOTIFICATIONS', 'false') === 'true',
  },

  // Development
  isDevelopment: getEnvVar('NODE_ENV') === 'development',
  isProduction: getEnvVar('NODE_ENV') === 'production',

  // Debugging
  enableDebugLogs: getEnvVar('REACT_APP_DEBUG_LOGS', 'false') === 'true',
};

export default config;