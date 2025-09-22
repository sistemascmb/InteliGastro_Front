import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de citas médicas
export const appointmentsService = {
  // Obtener todas las citas con filtros
  getAll: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      date: params.date || '',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      patientId: params.patientId || '',
      doctorId: params.doctorId || '',
      centerId: params.centerId || '',
      status: params.status || '',
      type: params.type || '',
      urgency: params.urgency || '',
      sortBy: params.sortBy || 'date',
      sortOrder: params.sortOrder || 'asc'
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params: cleanParams });
  },

  // Obtener cita por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }
    return await api.get(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
  },

  // Obtener citas por fecha específica
  getByDate: async (date) => {
    if (!date) {
      throw new Error('Fecha es requerida');
    }
    return await api.get(API_ENDPOINTS.APPOINTMENTS.BY_DATE(date));
  },

  // Obtener citas de un paciente
  getByPatient: async (patientId, params = {}) => {
    if (!patientId) {
      throw new Error('ID del paciente es requerido');
    }

    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.APPOINTMENTS.BY_PATIENT(patientId), { params: cleanParams });
  },

  // Obtener citas de un médico
  getByDoctor: async (doctorId, params = {}) => {
    if (!doctorId) {
      throw new Error('ID del médico es requerido');
    }

    const queryParams = {
      date: params.date || '',
      status: params.status || '',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(API_ENDPOINTS.APPOINTMENTS.BY_DOCTOR(doctorId), { params: cleanParams });
  },

  // Obtener citas pendientes
  getPending: async (params = {}) => {
    return await api.get(API_ENDPOINTS.APPOINTMENTS.PENDING, { params });
  },

  // Obtener citas completadas
  getCompleted: async (params = {}) => {
    return await api.get(API_ENDPOINTS.APPOINTMENTS.COMPLETED, { params });
  },

  // Obtener citas canceladas
  getCancelled: async (params = {}) => {
    return await api.get(API_ENDPOINTS.APPOINTMENTS.CANCELLED, { params });
  },

  // Crear nueva cita
  create: async (appointmentData) => {
    const requiredFields = ['patientId', 'doctorId', 'date', 'time', 'type'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    // Formatear datos según el formato esperado por la API
    const formattedData = {
      // Información básica
      patientId: appointmentData.pacienteId || appointmentData.patientId,
      doctorId: appointmentData.medicoId || appointmentData.doctorId,
      centerId: appointmentData.centroId || appointmentData.centerId,

      // Fecha y hora
      date: appointmentData.fecha || appointmentData.date,
      time: appointmentData.hora || appointmentData.time,
      duration: appointmentData.duracion || appointmentData.duration || 30, // minutos

      // Tipo y detalles
      type: appointmentData.tipoCita || appointmentData.type,
      specialty: appointmentData.especialidad || appointmentData.specialty || '',
      reason: appointmentData.motivo || appointmentData.reason || '',
      notes: appointmentData.notas || appointmentData.notes || '',

      // Estado y prioridad
      status: appointmentData.estado || appointmentData.status || 'scheduled',
      priority: appointmentData.prioridad || appointmentData.priority || 'normal',
      isUrgent: appointmentData.esUrgente || appointmentData.isUrgent || false,
      isFirstTime: appointmentData.esPrimeraVez || appointmentData.isFirstTime || false,

      // Información de contacto y confirmación
      contactMethod: appointmentData.metodoContacto || appointmentData.contactMethod || 'phone',
      reminderSent: appointmentData.recordatorioEnviado || appointmentData.reminderSent || false,
      confirmed: appointmentData.confirmado || appointmentData.confirmed || false,

      // Información de pago/seguro
      insurance: {
        provider: appointmentData.seguro?.proveedor || appointmentData.insurance?.provider || '',
        policyNumber: appointmentData.seguro?.numeroPoliza || appointmentData.insurance?.policyNumber || '',
        copay: appointmentData.seguro?.copago || appointmentData.insurance?.copay || 0
      },

      // Metadata
      createdBy: appointmentData.creadoPor || appointmentData.createdBy,
      channel: appointmentData.canal || appointmentData.channel || 'manual' // manual, online, phone
    };

    return await api.post(API_ENDPOINTS.APPOINTMENTS.BASE, formattedData);
  },

  // Actualizar cita
  update: async (id, appointmentData) => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    const formattedData = {
      patientId: appointmentData.pacienteId || appointmentData.patientId,
      doctorId: appointmentData.medicoId || appointmentData.doctorId,
      centerId: appointmentData.centroId || appointmentData.centerId,

      date: appointmentData.fecha || appointmentData.date,
      time: appointmentData.hora || appointmentData.time,
      duration: appointmentData.duracion || appointmentData.duration,

      type: appointmentData.tipoCita || appointmentData.type,
      specialty: appointmentData.especialidad || appointmentData.specialty,
      reason: appointmentData.motivo || appointmentData.reason,
      notes: appointmentData.notas || appointmentData.notes,

      status: appointmentData.estado || appointmentData.status,
      priority: appointmentData.prioridad || appointmentData.priority,
      isUrgent: appointmentData.esUrgente || appointmentData.isUrgent,
      isFirstTime: appointmentData.esPrimeraVez || appointmentData.isFirstTime,

      contactMethod: appointmentData.metodoContacto || appointmentData.contactMethod,
      reminderSent: appointmentData.recordatorioEnviado || appointmentData.reminderSent,
      confirmed: appointmentData.confirmado || appointmentData.confirmed,

      insurance: {
        provider: appointmentData.seguro?.proveedor || appointmentData.insurance?.provider,
        policyNumber: appointmentData.seguro?.numeroPoliza || appointmentData.insurance?.policyNumber,
        copay: appointmentData.seguro?.copago || appointmentData.insurance?.copay
      },

      updatedBy: appointmentData.actualizadoPor || appointmentData.updatedBy
    };

    return await api.put(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), formattedData);
  },

  // Cancelar cita
  cancel: async (id, reason = '') => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    return await api.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString()
    });
  },

  // Confirmar cita
  confirm: async (id) => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    return await api.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
      confirmed: true,
      confirmedAt: new Date().toISOString()
    });
  },

  // Marcar cita como completada
  complete: async (id, notes = '') => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    return await api.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
      status: 'completed',
      completionNotes: notes,
      completedAt: new Date().toISOString()
    });
  },

  // Reprogramar cita
  reschedule: async (id, newDate, newTime, reason = '') => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    if (!newDate || !newTime) {
      throw new Error('Nueva fecha y hora son requeridas');
    }

    return await api.patch(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), {
      date: newDate,
      time: newTime,
      rescheduleReason: reason,
      rescheduledAt: new Date().toISOString()
    });
  },

  // Enviar recordatorio
  sendReminder: async (id, method = 'sms') => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }

    const validMethods = ['sms', 'email', 'whatsapp', 'call'];
    if (!validMethods.includes(method)) {
      throw new Error(`Método inválido. Debe ser uno de: ${validMethods.join(', ')}`);
    }

    return await api.post(`${API_ENDPOINTS.APPOINTMENTS.BY_ID(id)}/reminder`, { method });
  },

  // Verificar disponibilidad
  checkAvailability: async (doctorId, date, time, duration = 30) => {
    if (!doctorId || !date || !time) {
      throw new Error('ID del médico, fecha y hora son requeridos');
    }

    return await api.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/check-availability`, {
      params: { doctorId, date, time, duration }
    });
  },

  // Obtener horarios disponibles
  getAvailableSlots: async (doctorId, date) => {
    if (!doctorId || !date) {
      throw new Error('ID del médico y fecha son requeridos');
    }

    return await api.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/available-slots`, {
      params: { doctorId, date }
    });
  },

  // Eliminar cita
  delete: async (id) => {
    if (!id) {
      throw new Error('ID de la cita es requerido');
    }
    return await api.delete(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
  },

  // Obtener estadísticas de citas
  getStats: async (params = {}) => {
    const queryParams = {
      period: params.period || 'month',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      centerId: params.centerId || '',
      doctorId: params.doctorId || '',
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    );

    return await api.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/stats`, { params: cleanParams });
  }
};

export default appointmentsService;