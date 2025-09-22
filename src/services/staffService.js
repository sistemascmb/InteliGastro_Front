import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de personal médico y administrativo
export const staffService = {
  // Obtener todo el personal con filtros
  getAll: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      center: params.center || '',
      role: params.role || '',
      status: params.status || '',
      type: params.type || '', // medico, enfermero, administrativo
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.STAFF.BASE, { params: cleanParams });
  },

  // Obtener personal por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }
    return await api.get(API_ENDPOINTS.STAFF.BY_ID(id));
  },

  // Obtener personal por centro
  getByCenter: async (centerId) => {
    if (!centerId) {
      throw new Error('ID del centro es requerido');
    }
    return await api.get(API_ENDPOINTS.STAFF.BY_CENTER(centerId));
  },

  // Obtener personal por rol
  getByRole: async (role) => {
    if (!role) {
      throw new Error('Rol es requerido');
    }
    return await api.get(API_ENDPOINTS.STAFF.BY_ROLE(role));
  },

  // Obtener solo médicos
  getDoctors: async (params = {}) => {
    const queryParams = {
      center: params.center || '',
      specialization: params.specialization || '',
      status: params.status || 'active',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.STAFF.DOCTORS, { params: cleanParams });
  },

  // Obtener solo enfermeros
  getNurses: async (params = {}) => {
    const queryParams = {
      center: params.center || '',
      status: params.status || 'active',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.STAFF.NURSES, { params: cleanParams });
  },

  // Crear nuevo miembro del personal
  create: async (staffData) => {
    const requiredFields = ['firstName', 'lastName', 'documentNumber', 'gender', 'position', 'center'];
    const missingFields = requiredFields.filter(field => !staffData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Formatear datos según el formato esperado por la API
    const formattedData = {
      // Información personal
      firstName: staffData.nombre || staffData.firstName,
      lastName: staffData.apellido || staffData.lastName,
      documentType: staffData.tipoDocumento || staffData.documentType || 'DNI',
      documentNumber: staffData.documento || staffData.documentNumber,
      gender: staffData.genero || staffData.gender,
      birthDate: staffData.fechaNacimiento || staffData.birthDate,

      // Información profesional
      position: staffData.titulo || staffData.position,
      specialization: staffData.especializacion || staffData.specialization || '',
      degree: staffData.grado || staffData.degree || '',
      type: staffData.tipo || staffData.type, // medico, enfermero, administrativo

      // Información laboral
      center: staffData.centro || staffData.center,
      hireDate: staffData.fechaContratacion || staffData.hireDate,
      salary: staffData.salario || staffData.salary,
      schedule: staffData.horario || staffData.schedule || {},

      // Información de contacto
      email: staffData.correo || staffData.email || '',
      phone: staffData.telefono || staffData.phone || '',
      mobile: staffData.celular || staffData.mobile || '',

      // Dirección
      address: {
        street: staffData.direccion || staffData.address?.street || '',
        city: staffData.ciudad || staffData.address?.city || '',
        state: staffData.estado || staffData.address?.state || '',
        postalCode: staffData.codigoPostal || staffData.address?.postalCode || ''
      },

      // Estado y permisos
      status: staffData.estatus || staffData.status || 'active',
      permissions: staffData.permisos || staffData.permissions || [],

      // Información adicional
      emergencyContact: staffData.contactoEmergencia || staffData.emergencyContact || {},
      medicalLicense: staffData.licenciaMedica || staffData.medicalLicense || ''
    };

    return await api.post(API_ENDPOINTS.STAFF.BASE, formattedData);
  },

  // Actualizar miembro del personal
  update: async (id, staffData) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }

    const formattedData = {
      firstName: staffData.nombre || staffData.firstName,
      lastName: staffData.apellido || staffData.lastName,
      documentType: staffData.tipoDocumento || staffData.documentType,
      documentNumber: staffData.documento || staffData.documentNumber,
      gender: staffData.genero || staffData.gender,
      birthDate: staffData.fechaNacimiento || staffData.birthDate,

      position: staffData.titulo || staffData.position,
      specialization: staffData.especializacion || staffData.specialization,
      degree: staffData.grado || staffData.degree,
      type: staffData.tipo || staffData.type,

      center: staffData.centro || staffData.center,
      hireDate: staffData.fechaContratacion || staffData.hireDate,
      salary: staffData.salario || staffData.salary,
      schedule: staffData.horario || staffData.schedule,

      email: staffData.correo || staffData.email,
      phone: staffData.telefono || staffData.phone,
      mobile: staffData.celular || staffData.mobile,

      address: {
        street: staffData.direccion || staffData.address?.street || '',
        city: staffData.ciudad || staffData.address?.city || '',
        state: staffData.estado || staffData.address?.state || '',
        postalCode: staffData.codigoPostal || staffData.address?.postalCode || ''
      },

      status: staffData.estatus || staffData.status,
      permissions: staffData.permisos || staffData.permissions,
      emergencyContact: staffData.contactoEmergencia || staffData.emergencyContact,
      medicalLicense: staffData.licenciaMedica || staffData.medicalLicense
    };

    return await api.put(API_ENDPOINTS.STAFF.BY_ID(id), formattedData);
  },

  // Eliminar miembro del personal
  delete: async (id) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }
    return await api.delete(API_ENDPOINTS.STAFF.BY_ID(id));
  },

  // Cambiar estado del personal
  changeStatus: async (id, status) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }

    const validStatuses = ['active', 'inactive', 'suspended', 'vacation'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
    }

    return await api.patch(API_ENDPOINTS.STAFF.BY_ID(id), { status });
  },

  // Asignar permisos al personal
  updatePermissions: async (id, permissions) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }

    if (!Array.isArray(permissions)) {
      throw new Error('Los permisos deben ser un array');
    }

    return await api.patch(API_ENDPOINTS.STAFF.BY_ID(id), { permissions });
  },

  // Actualizar horario del personal
  updateSchedule: async (id, schedule) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }

    return await api.patch(API_ENDPOINTS.STAFF.BY_ID(id), { schedule });
  },

  // Obtener disponibilidad de un médico
  getAvailability: async (doctorId, date) => {
    if (!doctorId) {
      throw new Error('ID del médico es requerido');
    }

    const params = {};
    if (date) {
      params.date = date;
    }

    return await api.get(`${API_ENDPOINTS.STAFF.BY_ID(doctorId)}/availability`, { params });
  },

  // Obtener estadísticas del personal
  getStats: async (params = {}) => {
    const queryParams = {
      center: params.center || '',
      period: params.period || 'month',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(`${API_ENDPOINTS.STAFF.BASE}/stats`, { params: cleanParams });
  },

  // Validar número de documento único
  validateDocumentNumber: async (documentNumber, excludeId = null) => {
    const params = { documentNumber };

    if (excludeId) {
      params.excludeId = excludeId;
    }

    try {
      await api.get(`${API_ENDPOINTS.STAFF.BASE}/validate-document`, { params });
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        message: error.message || 'Número de documento ya existe'
      };
    }
  },

  // Validar licencia médica única
  validateMedicalLicense: async (licenseNumber, excludeId = null) => {
    const params = { licenseNumber };

    if (excludeId) {
      params.excludeId = excludeId;
    }

    try {
      await api.get(`${API_ENDPOINTS.STAFF.BASE}/validate-license`, { params });
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        message: error.message || 'Número de licencia ya existe'
      };
    }
  }
};

export default staffService;