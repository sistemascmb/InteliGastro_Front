import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de pacientes
export const patientsService = {
  // Obtener todos los pacientes
  getAll: async (params = {}) => {
    try {
      // Usar fetch directo como backup
      const url = `${process.env.REACT_APP_API_URL}/Paciente`;
      const response = await fetch(url);
      const rawData = await response.json();

      // Mapear los campos del backend a los campos del frontend
      const mappedData = rawData.map(paciente => ({
        // IDs y referencias
        id: paciente.pacientid,
        pacientid: paciente.pacientid,
        centroId: paciente.centroId,

        // Información personal
        tipoDocumento: paciente.typeDoc === 1 ? 'DNI' : 'Otro',
        typeDoc: paciente.typeDoc,
        documento: paciente.documentNumber,
        documentNumber: paciente.documentNumber,
        nombres: paciente.names,
        names: paciente.names,
        apellidos: paciente.lastNames,
        lastNames: paciente.lastNames,

        // Datos demográficos
        fechaNacimiento: paciente.birthdate,
        birthdate: paciente.birthdate,
        genero: paciente.gender === 1 ? 'masculino' : 'femenino',
        gender: paciente.gender,
        estadoMarital: paciente.statusMarital === 1 ? 'soltero' : paciente.statusMarital === 2 ? 'casado' : 'otro',
        statusMarital: paciente.statusMarital,
        nacionalidad: paciente.nationality,
        nationality: paciente.nationality,

        // Ubicación
        calle: paciente.address?.street || paciente.address || '',
        address: paciente.address?.street || paciente.address || '',
        pais: paciente.pais === 1 ? 'Perú' : 'Otro',
        departamento: paciente.department === 1 ? 'Cajamarca' : 'Otro',
        department: paciente.department,
        provincia: paciente.province === 1 ? 'Cajabamba' : 'Otro',
        province: paciente.province,
        distrito: paciente.district === 1 ? 'Cachachi' : 'Otro',
        district: paciente.district,

        // Contacto
        telefono: paciente.phoneNumber,
        phoneNumber: paciente.phoneNumber,
        correo: paciente.email,
        email: paciente.email,

        // Estado y metadatos
        estado: paciente.status ? 'activo' : 'inactivo',
        status: paciente.status,
        historiaClinica: paciente.medicalHistory,
        medicalHistory: paciente.medicalHistory,

        // Auditoría
        fechaCreacion: paciente.createdAt,
        createdAt: paciente.createdAt,
        creadoPor: paciente.createdBy,
        createdBy: paciente.createdBy,
        fechaActualizacion: paciente.updatedAt,
        updatedAt: paciente.updatedAt,
        actualizadoPor: paciente.updatedBy,
        updatedBy: paciente.updatedBy,
        eliminado: paciente.isDeleted,
        isDeleted: paciente.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ URL que falló:', error.config?.url);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);

      // Detectar tipo de error
      if (error.code === 'ERR_NETWORK') {
        console.error('🚫 ERROR DE RED: Posible problema de CORS o servidor no disponible');
      }
      if (error.message.includes('CORS')) {
        console.error('🚫 ERROR DE CORS: El servidor debe permitir origen del frontend');
      }

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