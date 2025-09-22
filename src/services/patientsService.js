import { apiClient } from '../core/config/api';
import { API_ENDPOINTS } from '../core/constants/api-endpoints';

// Servicio para el manejo de pacientes
export const patientsService = {
  // Obtener todos los pacientes
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Base URL:', process.env.REACT_APP_API_URL);
      console.log('📋 Endpoint:', API_ENDPOINTS.PATIENTS.BASE);
      console.log('🔗 URL completa que se va a usar:', `${process.env.REACT_APP_API_URL}${API_ENDPOINTS.PATIENTS.BASE}`);

      const response = await apiClient.get(API_ENDPOINTS.PATIENTS.BASE);

      console.log('✅ Respuesta exitosa:', response);

      // La API devuelve directamente el array de pacientes
      return {
        data: response.data || [],
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ URL que falló:', error.config?.url);
      throw error;
    }
  },

  // Obtener paciente por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del paciente es requerido');
    }
    return await apiClient.get(API_ENDPOINTS.PATIENTS.BY_ID(id));
  },

  // Crear nuevo paciente
  create: async (patientData) => {
    // Validar datos requeridos
    const requiredFields = ['firstName', 'lastName', 'documentType', 'documentNumber', 'birthDate', 'gender'];
    const missingFields = requiredFields.filter(field => !patientData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Formatear datos según el formato esperado por la API
    const formattedData = {
      // Información personal
      firstName: patientData.nombres || patientData.firstName,
      lastName: patientData.apellidos || patientData.lastName,
      documentType: patientData.tipoDocumento || patientData.documentType,
      documentNumber: patientData.documento || patientData.documentNumber,
      birthDate: patientData.fechaNacimiento || patientData.birthDate,
      gender: patientData.genero || patientData.gender,
      maritalStatus: patientData.estadoMarital || patientData.maritalStatus,
      nationality: patientData.nacionalidad || patientData.nationality,

      // Información de contacto
      email: patientData.correo || patientData.email || '',
      phone: patientData.telefono || patientData.phone || '',
      mobile: patientData.celular || patientData.mobile || '',

      // Dirección
      address: {
        street: patientData.calle || patientData.address?.street || '',
        postalCode: patientData.codPostal || patientData.address?.postalCode || '',
        country: patientData.pais || patientData.address?.country || '',
        state: patientData.departamento || patientData.address?.state || '',
        province: patientData.provincia || patientData.address?.province || '',
        district: patientData.distrito || patientData.address?.district || ''
      },

      // Centro médico
      medicalCenter: patientData.nombreCentro || patientData.medicalCenter,

      // Estado
      status: patientData.estado || patientData.status || 'active'
    };

    return await apiClient.post(API_ENDPOINTS.PATIENTS.BASE, formattedData);
  },

  // Actualizar paciente
  update: async (id, patientData) => {
    if (!id) {
      throw new Error('ID del paciente es requerido');
    }

    // Formatear datos igual que en create
    const formattedData = {
      firstName: patientData.nombres || patientData.firstName,
      lastName: patientData.apellidos || patientData.lastName,
      documentType: patientData.tipoDocumento || patientData.documentType,
      documentNumber: patientData.documento || patientData.documentNumber,
      birthDate: patientData.fechaNacimiento || patientData.birthDate,
      gender: patientData.genero || patientData.gender,
      maritalStatus: patientData.estadoMarital || patientData.maritalStatus,
      nationality: patientData.nacionalidad || patientData.nationality,

      email: patientData.correo || patientData.email || '',
      phone: patientData.telefono || patientData.phone || '',
      mobile: patientData.celular || patientData.mobile || '',

      address: {
        street: patientData.calle || patientData.address?.street || '',
        postalCode: patientData.codPostal || patientData.address?.postalCode || '',
        country: patientData.pais || patientData.address?.country || '',
        state: patientData.departamento || patientData.address?.state || '',
        province: patientData.provincia || patientData.address?.province || '',
        district: patientData.distrito || patientData.address?.district || ''
      },

      medicalCenter: patientData.nombreCentro || patientData.medicalCenter,
      status: patientData.estado || patientData.status || 'active'
    };

    return await apiClient.put(API_ENDPOINTS.PATIENTS.BY_ID(id), formattedData);
  },

  // Eliminación lógica del paciente
  delete: async (id) => {
    if (!id) {
      throw new Error('ID del paciente es requerido');
    }
    return await apiClient.delete(API_ENDPOINTS.PATIENTS.BY_ID(id));
  },

  // Cambiar estado del paciente (activar/desactivar)
  changeStatus: async (id, status) => {
    if (!id) {
      throw new Error('ID del paciente es requerido');
    }

    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
    }

    return await apiClient.patch(API_ENDPOINTS.PATIENTS.BY_ID(id), { status });
  },

  // Buscar pacientes por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAll(params);
    }

    const queryParams = {
      q: searchTerm.trim(),
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    };

    return await apiClient.get(API_ENDPOINTS.PATIENTS.SEARCH, { params: queryParams });
  },

  // Exportar lista de pacientes
  export: async (format = 'xlsx', filters = {}) => {
    const validFormats = ['xlsx', 'csv', 'pdf'];
    if (!validFormats.includes(format)) {
      throw new Error(`Formato inválido. Debe ser uno de: ${validFormats.join(', ')}`);
    }

    return await apiClient.get(API_ENDPOINTS.PATIENTS.EXPORT, {
      params: { format, ...filters },
      responseType: 'blob' // Para descargas de archivos
    });
  },

  // Validar número de documento único
  validateDocumentNumber: async (documentType, documentNumber, excludeId = null) => {
    const params = {
      documentType,
      documentNumber
    };

    if (excludeId) {
      params.excludeId = excludeId;
    }

    try {
      await apiClient.get(`${API_ENDPOINTS.PATIENTS.BASE}/validate-document`, { params });
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        message: error.message || 'Número de documento ya existe'
      };
    }
  },

  // Obtener estadísticas básicas de pacientes
  getStats: async () => {
    return await apiClient.get(`${API_ENDPOINTS.PATIENTS.BASE}/stats`);
  }
};

export default patientsService;