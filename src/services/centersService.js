import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de centros médicos
export const centersService = {
  // Obtener todos los centros con filtros
  getAll: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      status: params.status || '',
      sortBy: params.sortBy || 'name',
      sortOrder: params.sortOrder || 'asc'
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.CENTERS.BASE, { params: cleanParams });
  },

  // Obtener solo centros activos (para dropdowns)
  getActive: async () => {
    return await api.get(API_ENDPOINTS.CENTERS.ACTIVE);
  },

  // Obtener centro por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }
    return await api.get(API_ENDPOINTS.CENTERS.BY_ID(id));
  },

  // Crear nuevo centro
  create: async (centerData) => {
    const requiredFields = ['name', 'abbreviation', 'address'];
    const missingFields = requiredFields.filter(field => !centerData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Formatear datos según el formato esperado por la API
    const formattedData = {
      // Información básica
      name: centerData.nombre || centerData.name,
      description: centerData.descripcion || centerData.description || '',
      abbreviation: centerData.abreviatura || centerData.abbreviation,

      // Información de ubicación
      address: {
        street: centerData.direccion || centerData.address?.street || centerData.address,
        city: centerData.ciudad || centerData.address?.city || '',
        state: centerData.estado || centerData.address?.state || '',
        country: centerData.pais || centerData.address?.country || 'Peru',
        postalCode: centerData.codigoPostal || centerData.address?.postalCode || ''
      },

      // Información de contacto
      phone: centerData.telefono || centerData.phone || '',
      email: centerData.correo || centerData.email || '',
      website: centerData.sitioWeb || centerData.website || '',

      // Horarios de atención
      operatingHours: {
        start: centerData.inicioAtencion || centerData.operatingHours?.start || '08:00',
        end: centerData.finAtencion || centerData.operatingHours?.end || '18:00',
        daysOfWeek: centerData.diasSemana || centerData.operatingHours?.daysOfWeek || [1, 2, 3, 4, 5], // Lun-Vie
        timezone: centerData.zonaHoraria || centerData.operatingHours?.timezone || 'America/Lima'
      },

      // Configuración del centro
      settings: {
        maxAppointmentsPerDay: centerData.maxCitasDia || centerData.settings?.maxAppointmentsPerDay || 100,
        appointmentDuration: centerData.duracionCita || centerData.settings?.appointmentDuration || 30, // minutos
        allowOnlineBooking: centerData.reservaOnline || centerData.settings?.allowOnlineBooking || true,
        requiresInsurance: centerData.requiereSeguro || centerData.settings?.requiresInsurance || false
      },

      // Servicios disponibles
      services: centerData.servicios || centerData.services || [],

      // Personal y recursos
      capacity: {
        rooms: centerData.numeroSalas || centerData.capacity?.rooms || 0,
        beds: centerData.numeroCamas || centerData.capacity?.beds || 0,
        parkingSpots: centerData.estacionamientos || centerData.capacity?.parkingSpots || 0
      },

      // Estado y metadata
      status: centerData.estado || centerData.status || 'active',
      establishedDate: centerData.fechaEstablecimiento || centerData.establishedDate,
      licenseNumber: centerData.numeroLicencia || centerData.licenseNumber || '',

      // Información financiera (si aplicable)
      billing: {
        taxId: centerData.ruc || centerData.billing?.taxId || '',
        bankAccount: centerData.cuentaBancaria || centerData.billing?.bankAccount || ''
      }
    };

    return await api.post(API_ENDPOINTS.CENTERS.BASE, formattedData);
  },

  // Actualizar centro
  update: async (id, centerData) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    // Usar la misma formateo que en create
    const formattedData = {
      name: centerData.nombre || centerData.name,
      description: centerData.descripcion || centerData.description,
      abbreviation: centerData.abreviatura || centerData.abbreviation,

      address: {
        street: centerData.direccion || centerData.address?.street || centerData.address,
        city: centerData.ciudad || centerData.address?.city,
        state: centerData.estado || centerData.address?.state,
        country: centerData.pais || centerData.address?.country,
        postalCode: centerData.codigoPostal || centerData.address?.postalCode
      },

      phone: centerData.telefono || centerData.phone,
      email: centerData.correo || centerData.email,
      website: centerData.sitioWeb || centerData.website,

      operatingHours: {
        start: centerData.inicioAtencion || centerData.operatingHours?.start,
        end: centerData.finAtencion || centerData.operatingHours?.end,
        daysOfWeek: centerData.diasSemana || centerData.operatingHours?.daysOfWeek,
        timezone: centerData.zonaHoraria || centerData.operatingHours?.timezone
      },

      settings: {
        maxAppointmentsPerDay: centerData.maxCitasDia || centerData.settings?.maxAppointmentsPerDay,
        appointmentDuration: centerData.duracionCita || centerData.settings?.appointmentDuration,
        allowOnlineBooking: centerData.reservaOnline || centerData.settings?.allowOnlineBooking,
        requiresInsurance: centerData.requiereSeguro || centerData.settings?.requiresInsurance
      },

      services: centerData.servicios || centerData.services,

      capacity: {
        rooms: centerData.numeroSalas || centerData.capacity?.rooms,
        beds: centerData.numeroCamas || centerData.capacity?.beds,
        parkingSpots: centerData.estacionamientos || centerData.capacity?.parkingSpots
      },

      status: centerData.estado || centerData.status,
      establishedDate: centerData.fechaEstablecimiento || centerData.establishedDate,
      licenseNumber: centerData.numeroLicencia || centerData.licenseNumber,

      billing: {
        taxId: centerData.ruc || centerData.billing?.taxId,
        bankAccount: centerData.cuentaBancaria || centerData.billing?.bankAccount
      }
    };

    return await api.put(API_ENDPOINTS.CENTERS.BY_ID(id), formattedData);
  },

  // Eliminar centro
  delete: async (id) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }
    return await api.delete(API_ENDPOINTS.CENTERS.BY_ID(id));
  },

  // Cambiar estado del centro
  changeStatus: async (id, status) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    const validStatuses = ['active', 'inactive', 'maintenance', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
    }

    return await api.patch(API_ENDPOINTS.CENTERS.BY_ID(id), { status });
  },

  // Obtener servicios disponibles en un centro
  getServices: async (id) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }
    return await api.get(`${API_ENDPOINTS.CENTERS.BY_ID(id)}/services`);
  },

  // Actualizar servicios de un centro
  updateServices: async (id, services) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    if (!Array.isArray(services)) {
      throw new Error('Los servicios deben ser un array');
    }

    return await api.put(`${API_ENDPOINTS.CENTERS.BY_ID(id)}/services`, { services });
  },

  // Obtener personal asignado a un centro
  getStaff: async (id, params = {}) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    const queryParams = {
      role: params.role || '',
      status: params.status || 'active',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(`${API_ENDPOINTS.CENTERS.BY_ID(id)}/staff`, { params: cleanParams });
  },

  // Obtener estadísticas de un centro
  getStats: async (id, params = {}) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    const queryParams = {
      period: params.period || 'month',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(`${API_ENDPOINTS.CENTERS.BY_ID(id)}/stats`, { params: cleanParams });
  },

  // Obtener disponibilidad de citas para un centro
  getAppointmentAvailability: async (id, date) => {
    if (!id) {
      throw new Error('ID del centro es requerido');
    }

    const params = {};
    if (date) {
      params.date = date;
    }

    return await api.get(`${API_ENDPOINTS.CENTERS.BY_ID(id)}/availability`, { params });
  },

  // Validar abreviatura única
  validateAbbreviation: async (abbreviation, excludeId = null) => {
    const params = { abbreviation };

    if (excludeId) {
      params.excludeId = excludeId;
    }

    try {
      await api.get(`${API_ENDPOINTS.CENTERS.BASE}/validate-abbreviation`, { params });
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        message: error.message || 'La abreviatura ya existe'
      };
    }
  },

  // Obtener resumen de todos los centros
  getSummary: async () => {
    return await api.get(`${API_ENDPOINTS.CENTERS.BASE}/summary`);
  }
};

export default centersService;