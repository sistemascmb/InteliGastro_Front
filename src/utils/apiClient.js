import axios from 'axios';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../constants/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // La URL ya incluye /api en el .env
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para requests - agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage o sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de la petición en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo de errores y tokens
apiClient.interceptors.response.use(
  (response) => {
    // Log de la respuesta en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      });
    }

    // Manejo de errores específicos
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // Token expirado o inválido
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              // Intentar renovar el token
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const response = await axios.post(
                  `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/auth/refresh`,
                  { refreshToken }
                );

                const newToken = response.data.accessToken;
                localStorage.setItem('authToken', newToken);

                // Reintentar la petición original
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              // Si falla el refresh, limpiar tokens y redirigir al login
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              sessionStorage.removeItem('authToken');

              // Redirigir al login (esto depende de tu router)
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
          break;

        case HTTP_STATUS.FORBIDDEN:
          // Sin permisos
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

        case HTTP_STATUS.NOT_FOUND:
          // Recurso no encontrado
          throw new Error(ERROR_MESSAGES.NOT_FOUND);

        case HTTP_STATUS.CONFLICT:
          // Conflicto/duplicado
          throw new Error(data?.message || ERROR_MESSAGES.DUPLICATE_ERROR);

        case HTTP_STATUS.BAD_REQUEST:
          // Error de validación
          throw new Error(data?.message || ERROR_MESSAGES.VALIDATION_ERROR);

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          // Error del servidor
          throw new Error(ERROR_MESSAGES.SERVER_ERROR);

        default:
          throw new Error(data?.message || 'Error desconocido');
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
    } else if (error.message === 'Network Error') {
      // Error de red
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    return Promise.reject(error);
  }
);

// Funciones helper para las peticiones HTTP
export const api = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Función para retry automático
export const withRetry = async (apiCall, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await delay(API_CONFIG.RETRY_DELAY);
      return withRetry(apiCall, retries - 1);
    }
    throw error;
  }
};

// Determinar si se debe reintentar la petición
const shouldRetry = (error) => {
  return (
    error.code === 'ECONNABORTED' || // Timeout
    error.message === 'Network Error' || // Error de red
    (error.response && error.response.status >= 500) // Error del servidor
  );
};

// Función helper para delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default apiClient;