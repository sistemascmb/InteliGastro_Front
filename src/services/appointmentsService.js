import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de citas médicas
export const appointmentsService = {
  // Obtener todas las citas con filtros
  getAll_Proc_Agendado: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Procedimientos...');

      const response = await api.get(API_ENDPOINTS.SCHEDULES.BASE, { params });
      console.log('✅ Datos de Procedimientos recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
const pacienteActivos = response.filter(proced => !proced.isDeleted 
        && proced.typeOfAttention === 2
        && (proced.status === 10062 || proced.status === 10068));
        
console.log('✅ Procedimientos activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(proced => ({
        // IDs y referencias
        id: proced.medicalscheduleid,
        medicalscheduleid: proced.medicalscheduleid,
        pacientId: proced.pacientId,
        centroId: proced.centroId,
        personalId: proced.personalId,
        appointmentDate: proced.appointmentDate,
        hoursMedicalShedule: proced.hoursMedicalShedule,
        //typeofAppointment: proced.typeofAppointment,
        //originId: proced.originId,
        //otherOrigins: proced.otherOrigins,
        insuranceId: proced.insuranceId,
        letterOfGuarantee: proced.letterOfGuarantee,
        status: proced.status,
        typeOfAttention: proced.typeOfAttention,
        typeOfPatient: proced.typeOfPatient,
        referral_doctorsId:  proced.referral_doctorsId,
        centerOfOriginId: proced.centerOfOriginId,
        anotherCenter: proced.anotherCenter,
        procedureRoomId: proced.procedureRoomId,
        resourcesId: proced.resourcesId,
        studiesId: proced.studiesId,
        anotacionesAdicionales: proced.anotacionesAdicionales,
        tipoProcedimientoId: proced.tipoProcedimientoId,
        urgenteId: proced.urgenteId,
        EstudioTeminadoId: proced.EstudioTeminadoId,
        PdfGeneradoId: proced.PdfGeneradoId,

        // Auditoría
        createdAt: proced.createdAt,
        createdBy: proced.createdBy,
        updatedAt: proced.updatedAt,
        updatedBy: proced.updatedBy,
        isDeleted: proced.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },
  getAll_Proc_Preparacion: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Procedimientos...');

      const response = await api.get(API_ENDPOINTS.SCHEDULES.BASE, { params });
      console.log('✅ Datos de Procedimientos recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
      const pacienteActivos = response.filter(proced => !proced.isDeleted 
        && proced.typeOfAttention === 2
        && (proced.status === 10063  || proced.status === 10064  ));
      console.log('✅ Procedimientos activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(proced => ({
        // IDs y referencias
        id: proced.medicalscheduleid,
        medicalscheduleid: proced.medicalscheduleid,
        pacientId: proced.pacientId,
        centroId: proced.centroId,
        personalId: proced.personalId,
        appointmentDate: proced.appointmentDate,
        hoursMedicalShedule: proced.hoursMedicalShedule,
        //typeofAppointment: proced.typeofAppointment,
        //originId: proced.originId,
        //otherOrigins: proced.otherOrigins,
        insuranceId: proced.insuranceId,
        letterOfGuarantee: proced.letterOfGuarantee,
        status: proced.status,
        typeOfAttention: proced.typeOfAttention,
        typeOfPatient: proced.typeOfPatient,
        referral_doctorsId:  proced.referral_doctorsId,
        centerOfOriginId: proced.centerOfOriginId,
        anotherCenter: proced.anotherCenter,
        procedureRoomId: proced.procedureRoomId,
        resourcesId: proced.resourcesId,
        studiesId: proced.studiesId,
        anotacionesAdicionales: proced.anotacionesAdicionales,
        tipoProcedimientoId: proced.tipoProcedimientoId,
        urgenteId: proced.urgenteId,
        EstudioTeminadoId: proced.EstudioTeminadoId,
        PdfGeneradoId: proced.PdfGeneradoId,
        // Auditoría
        createdAt: proced.createdAt,
        createdBy: proced.createdBy,
        updatedAt: proced.updatedAt,
        updatedBy: proced.updatedBy,
        isDeleted: proced.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },
  getAll_Proc_Dictado: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Procedimientos...');

      const response = await api.get(API_ENDPOINTS.SCHEDULES.BASE, { params });
      console.log('✅ Datos de Procedimientos recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
      const pacienteActivos = response.filter(proced => !proced.isDeleted 
        && proced.typeOfAttention === 2
        && (proced.status === 10069));
      console.log('✅ Procedimientos activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(proced => ({
        // IDs y referencias
        id: proced.medicalscheduleid,
        medicalscheduleid: proced.medicalscheduleid,
        pacientId: proced.pacientId,
        centroId: proced.centroId,
        personalId: proced.personalId,
        appointmentDate: proced.appointmentDate,
        hoursMedicalShedule: proced.hoursMedicalShedule,
        //typeofAppointment: proced.typeofAppointment,
        //originId: proced.originId,
        //otherOrigins: proced.otherOrigins,
        insuranceId: proced.insuranceId,
        letterOfGuarantee: proced.letterOfGuarantee,
        status: proced.status,
        typeOfAttention: proced.typeOfAttention,
        typeOfPatient: proced.typeOfPatient,
        referral_doctorsId:  proced.referral_doctorsId,
        centerOfOriginId: proced.centerOfOriginId,
        anotherCenter: proced.anotherCenter,
        procedureRoomId: proced.procedureRoomId,
        resourcesId: proced.resourcesId,
        studiesId: proced.studiesId,
        anotacionesAdicionales: proced.anotacionesAdicionales,
        tipoProcedimientoId: proced.tipoProcedimientoId,
        urgenteId: proced.urgenteId,
        EstudioTeminadoId: proced.EstudioTeminadoId,
        PdfGeneradoId: proced.PdfGeneradoId,

        // Auditoría
        createdAt: proced.createdAt,
        createdBy: proced.createdBy,
        updatedAt: proced.updatedAt,
        updatedBy: proced.updatedBy,
        isDeleted: proced.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },
  getAll_Proc_Completado: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Procedimientos...');

      const response = await api.get(API_ENDPOINTS.SCHEDULES.BASE, { params });
      console.log('✅ Datos de Procedimientos recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
      const pacienteActivos = response.filter(proced => !proced.isDeleted 
        && proced.typeOfAttention === 2
        && (proced.status === 10065));
      console.log('✅ Procedimientos activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(proced => ({
        // IDs y referencias
        id: proced.medicalscheduleid,
        medicalscheduleid: proced.medicalscheduleid,
        pacientId: proced.pacientId,
        centroId: proced.centroId,
        personalId: proced.personalId,
        appointmentDate: proced.appointmentDate,
        hoursMedicalShedule: proced.hoursMedicalShedule,
        //typeofAppointment: proced.typeofAppointment,
        //originId: proced.originId,
        //otherOrigins: proced.otherOrigins,
        insuranceId: proced.insuranceId,
        letterOfGuarantee: proced.letterOfGuarantee,
        status: proced.status,
        typeOfAttention: proced.typeOfAttention,
        typeOfPatient: proced.typeOfPatient,
        referral_doctorsId:  proced.referral_doctorsId,
        centerOfOriginId: proced.centerOfOriginId,
        anotherCenter: proced.anotherCenter,
        procedureRoomId: proced.procedureRoomId,
        resourcesId: proced.resourcesId,
        studiesId: proced.studiesId,
        anotacionesAdicionales: proced.anotacionesAdicionales,
        tipoProcedimientoId: proced.tipoProcedimientoId,
        urgenteId: proced.urgenteId,
        EstudioTeminadoId: proced.EstudioTeminadoId,
        PdfGeneradoId: proced.PdfGeneradoId,

        // Auditoría
        createdAt: proced.createdAt,
        createdBy: proced.createdBy,
        updatedAt: proced.updatedAt,
        updatedBy: proced.updatedBy,
        isDeleted: proced.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },
  getAll_Proc_Alta: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Procedimientos...');

      const response = await api.get(API_ENDPOINTS.SCHEDULES.BASE, { params });
      console.log('✅ Datos de Procedimientos recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
      const pacienteActivos = response.filter(proced => !proced.isDeleted 
        && proced.typeOfAttention === 2
        && (proced.status === 10066));
      console.log('✅ Procedimientos activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(proced => ({
        // IDs y referencias
        id: proced.medicalscheduleid,
        medicalscheduleid: proced.medicalscheduleid,
        pacientId: proced.pacientId,
        centroId: proced.centroId,
        personalId: proced.personalId,
        appointmentDate: proced.appointmentDate,
        hoursMedicalShedule: proced.hoursMedicalShedule,
        //typeofAppointment: proced.typeofAppointment,
        //originId: proced.originId,
        //otherOrigins: proced.otherOrigins,
        insuranceId: proced.insuranceId,
        letterOfGuarantee: proced.letterOfGuarantee,
        status: proced.status,
        typeOfAttention: proced.typeOfAttention,
        typeOfPatient: proced.typeOfPatient,
        referral_doctorsId:  proced.referral_doctorsId,
        centerOfOriginId: proced.centerOfOriginId,
        anotherCenter: proced.anotherCenter,
        procedureRoomId: proced.procedureRoomId,
        resourcesId: proced.resourcesId,
        studiesId: proced.studiesId,
        anotacionesAdicionales: proced.anotacionesAdicionales,
        tipoProcedimientoId: proced.tipoProcedimientoId,
        urgenteId: proced.urgenteId,
        EstudioTeminadoId: proced.EstudioTeminadoId,
        PdfGeneradoId: proced.PdfGeneradoId,
        // Auditoría
        createdAt: proced.createdAt,
        createdBy: proced.createdBy,
        updatedAt: proced.updatedAt,
        updatedBy: proced.updatedBy,
        isDeleted: proced.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },
  /*
  getAll_old: async (params = {}) => {
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
  */
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
    try {
      console.log('📤 Creando nueva Agenda - Cita...');

      // Validar datos requeridos
      const requiredFields = ['pacientId', 'centroId', 'personalId'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        pacientId: appointmentData.pacientId,
        centroId: appointmentData.centroId,
        personalId: appointmentData.personalId,
        appointmentDate: appointmentData.appointmentDate,
        hoursMedicalShedule: appointmentData.hoursMedicalShedule,
        typeofAppointment : appointmentData.typeofAppointment,
        originId : appointmentData.originId,
        otherOrigins : appointmentData.otherOrigins,
        insuranceId: appointmentData.insuranceId,
        letterOfGuarantee: appointmentData.letterOfGuarantee,
        status: appointmentData.status, 
        typeOfAttention: appointmentData.typeOfAttention, 
        anotherCenter : appointmentData.anotherCenter,
        anotacionesAdicionales: appointmentData.anotacionesAdicionales,
        tipoProcedimientoId: -1,
        urgenteId: -1,
        EstudioTeminadoId: 0,
        PdfGeneradoId: 0,
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Agenda`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Agenda - Cita creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Agenda - Cita:', error);
      throw error;
    }
  },
  create_procedimiento: async (appointmentData) => {
    try {
      console.log('📤 Creando nueva Agenda - Cita...');

      // Validar datos requeridos
      const requiredFields = ['pacientId', 'centroId', 'personalId'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        pacientId: appointmentData.pacientId,
        centroId: appointmentData.centroId,
        personalId: appointmentData.personalId,
        appointmentDate: appointmentData.appointmentDate,
        hoursMedicalShedule: appointmentData.hoursMedicalShedule,
        //typeofAppointment : appointmentData.typeofAppointment,
        //originId : appointmentData.originId,
        otherOrigins : appointmentData.otherOrigins,
        typeOfPatient: appointmentData.typeOfPatient,
        referral_doctorsId: appointmentData.referral_doctorsId,
        centerOfOriginId: appointmentData.centerOfOriginId,
        anotherCenter: appointmentData.anotherCenter,
        procedureRoomId: appointmentData.procedureRoomId,
        resourcesId: appointmentData.resourcesId,
        studiesId: appointmentData.studiesId,

        insuranceId: appointmentData.insuranceId,
        letterOfGuarantee: appointmentData.letterOfGuarantee,
        status: appointmentData.status, 
        typeOfAttention: appointmentData.typeOfAttention, 
        anotacionesAdicionales: appointmentData.anotacionesAdicionales,
        tipoProcedimientoId: appointmentData.tipoProcedimientoId,
        urgenteId: appointmentData.urgenteId,
        EstudioTeminadoId: 0,
        PdfGeneradoId: 0,

        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Agenda`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Agenda - Cita creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Agenda - Cita:', error);
      throw error;
    }
  },

  create_OLD: async (appointmentData) => {
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

  update_Estado_Proc: async (id, pacienteData) => {
    try {
      const urlOrigin = `${process.env.REACT_APP_API_URL}/Agenda/${id}`;
      const responseOrigin = await fetch(urlOrigin);
      const dataOrigin = await responseOrigin.json();

      console.log('📝 Actualizando Agenda con ID:', id);

      if (!id) {
        throw new Error('ID del Agenda es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        medicalscheduleid: parseInt(id),
        pacientId: dataOrigin.pacientId,
        centroId: dataOrigin.centroId,
        personalId: dataOrigin.personalId,
        appointmentDate: dataOrigin.appointmentDate,
        hoursMedicalShedule: dataOrigin.hoursMedicalShedule,

        otherOrigins : dataOrigin.otherOrigins,
        typeOfPatient: dataOrigin.typeOfPatient,
        referral_doctorsId: dataOrigin.referral_doctorsId,
        centerOfOriginId: dataOrigin.centerOfOriginId,
        anotherCenter: dataOrigin.anotherCenter,
        procedureRoomId: dataOrigin.procedureRoomId,
        resourcesId: dataOrigin.resourcesId,
        studiesId: dataOrigin.studiesId,

        insuranceId: dataOrigin.insuranceId,
        letterOfGuarantee: dataOrigin.letterOfGuarantee,
        status: pacienteData.status, //cambio
        typeOfAttention: dataOrigin.typeOfAttention, 
        anotacionesAdicionales: dataOrigin.anotacionesAdicionales,
        tipoProcedimientoId: dataOrigin.tipoProcedimientoId,
        urgenteId: dataOrigin.urgenteId,
        EstudioTeminadoId: dataOrigin.EstudioTeminadoId,
        PdfGeneradoId: dataOrigin.PdfGeneradoId,

        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Agenda/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Agenda actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Agenda:', error);
      throw error;
    }
  },
  update_Sala_med_equipo_fecha_hora_Proc: async (id, pacienteData) => {
    try {
      const urlOrigin = `${process.env.REACT_APP_API_URL}/Agenda/${id}`;
      const responseOrigin = await fetch(urlOrigin);
      const dataOrigin = await responseOrigin.json();

      console.log('📝 Actualizando Agenda con ID:', id);

      if (!id) {
        throw new Error('ID del Agenda es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        medicalscheduleid: parseInt(id),
        pacientId: dataOrigin.pacientId,
        centroId: dataOrigin.centroId,
        personalId: pacienteData.personalId,
        appointmentDate: pacienteData.appointmentDate,
        hoursMedicalShedule: pacienteData.hoursMedicalShedule,

        otherOrigins : dataOrigin.otherOrigins,
        typeOfPatient: dataOrigin.typeOfPatient,
        referral_doctorsId: dataOrigin.referral_doctorsId,
        centerOfOriginId: dataOrigin.centerOfOriginId,
        anotherCenter: dataOrigin.anotherCenter,
        procedureRoomId: pacienteData.procedureRoomId,
        resourcesId: pacienteData.resourcesId,
        studiesId: dataOrigin.studiesId,

        insuranceId: dataOrigin.insuranceId,
        letterOfGuarantee: dataOrigin.letterOfGuarantee,
        status: pacienteData.status, //cambio
        typeOfAttention: dataOrigin.typeOfAttention, 
        anotacionesAdicionales: dataOrigin.anotacionesAdicionales,
        tipoProcedimientoId: dataOrigin.tipoProcedimientoId,
        urgenteId: dataOrigin.urgenteId,

        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Agenda/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Agenda actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Agenda:', error);
      throw error;
    }
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