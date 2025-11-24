import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de pacientes
export const patientsService = {
  // Obtener todos los pacientes
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los Pacientes...');

      const response = await api.get(API_ENDPOINTS.PATIENTS.BASE, { params });
      console.log('✅ Datos de Pacientes recibidos:', response);

      // Filtrar solo recursos no eliminados (isDeleted : false)
      const pacienteActivos = response.filter(paciente => !paciente.isDeleted);
      console.log('✅ Pacientes activos (isDeleted: false):', pacienteActivos.length);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = pacienteActivos.map(paciente => ({
        // IDs y referencias
        id: paciente.pacientid,
        pacientid: paciente.pacientid,
        typeDoc: paciente.typeDoc,

        documentNumber: paciente.documentNumber,
        names: paciente.names,
        lastNames: paciente.lastNames,
        birthdate: paciente.birthdate,
        gender: paciente.gender,
        statusMarital: paciente.statusMarital,
        nationality: paciente.nationality,
        centroId: paciente.centroId,
        address: paciente.address,

        pais: paciente.pais,
        department: paciente.department,
        province: paciente.province,
        district: paciente.district,

        phoneNumber: paciente.phoneNumber,
        email: paciente.email,
        direccion: paciente.direccion,

        status: paciente.status, // Mantener el valor booleano original
        estado: paciente.status ? '10007' : '10008', // Convertir a ID numérico

        medicalHistory: paciente.medicalHistory,

        // Auditoría
        createdAt: paciente.createdAt,
        createdBy: paciente.createdBy,
        updatedAt: paciente.updatedAt,
        updatedBy: paciente.updatedBy,
        isDeleted: paciente.isDeleted
      }));

      // Ordenamos alfabéticamente por nombre
      const sortedData = mappedData.sort((a, b) =>
        a.names.toLowerCase().localeCompare(b.names.toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error al obtener pacientes:', error);
      throw error;
    }
  },

  // Obtener paciente por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del Paciente es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Paciente/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.pacientid,
          pacientid: data.pacientid,
          typeDoc: data.typeDoc,

          documentNumber: data.documentNumber,
          names: data.names,
          lastNames: data.lastNames,
          birthdate: data.birthdate,
          gender : data.gender,
          statusMarital : data.statusMarital,
          nationality : data.nationality,
          centroId: data.centroId,
          address: data.address,

          pais: data.pais,
          department: data.department,
          province: data.province,
          district: data.district,

          phoneNumber: data.phoneNumber,
          email: data.email,
          direccion: data.direccion,

          status: data.status, // Mantener el valor booleano original
          estado: data.status ? '10007' : '10008', // Convertir a ID numérico

          medicalHistory: data.medicalHistory,
  
          // Auditoría
          createdAt: data.createdAt,
          createdBy: data.createdBy,
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy,
          isDeleted: data.isDeleted
        },
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al obtener Personal por ID:', error);
      throw error;
    }
  },

  getByDocumentNumber: async (documentNumber) => {
    if (!documentNumber) {
      throw new Error('ID del Paciente es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Paciente/document/${documentNumber}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.pacientid,
          pacientid: data.pacientid,
          typeDoc: data.typeDoc,

          documentNumber: data.documentNumber,
          names: data.names,
          lastNames: data.lastNames,
          birthdate: data.birthdate,
          gender : data.gender,
          statusMarital : data.statusMarital,
          nationality : data.nationality,
          centroId: data.centroId,
          address: data.address,

          pais: data.pais,
          department: data.department,
          province: data.province,
          district: data.district,

          phoneNumber: data.phoneNumber,
          email: data.email,
          direccion: data.direccion,

          status: data.status, // Mantener el valor booleano original
          estado: data.status ? '10007' : '10008', // Convertir a ID numérico

          medicalHistory: data.medicalHistory,
  
          // Auditoría
          createdAt: data.createdAt,
          createdBy: data.createdBy,
          updatedAt: data.updatedAt,
          updatedBy: data.updatedBy,
          isDeleted: data.isDeleted
        },
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al obtener Personal por DocumentNumber:', error);
      throw error;
    }
  },

  // Crear nuevo paciente
  create: async (pacienteData) => {
    try {
      console.log('📤 Creando nuevo centro...');

      // Validar datos requeridos
      const requiredFields = ['documentNumber', 'names', 'lastNames', 'address', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !pacienteData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Validar campos UBIGEO
      if (!pacienteData.pais || !pacienteData.department || !pacienteData.province || !pacienteData.district) {
        throw new Error('Todos los campos de ubicación (país, departamento, provincia y distrito) son obligatorios');
      }

      const formattedData = {
        typeDoc: pacienteData.typeDoc,
        documentNumber: pacienteData.documentNumber,
        names: pacienteData.names,
        lastNames: pacienteData.lastNames,
        birthdate: pacienteData.birthdate,
        gender : pacienteData.gender,
        statusMarital : pacienteData.statusMarital,
        nationality : pacienteData.nationality,
        centroId: pacienteData.centroId,
        address: pacienteData.address,

        pais: pacienteData.pais,
        department: pacienteData.department,
        province: pacienteData.province,
        district: pacienteData.district,

        phoneNumber: pacienteData.phoneNumber,
        email: pacienteData.email,
        direccion: pacienteData.direccion,

        status: pacienteData.status, // Map boolean to numeric IDs
        medicalHistory: 'HC-' + pacienteData.documentNumber + '-CMB',

        createdAt: new Date().toISOString(),
        createdBy: (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })()
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Paciente`;
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
      console.log('✅ Paciente creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Paciente:', error);
      throw error;
    }
  },

  // Actualizar paciente
  update: async (id, pacienteData) => {
    try {
      console.log('📝 Actualizando Paciente con ID:', id);

      if (!id) {
        throw new Error('ID del Paciente es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        pacientid: parseInt(id),
        typeDoc: pacienteData.typeDoc,
        documentNumber: pacienteData.documentNumber,
        names: pacienteData.names,
        lastNames: pacienteData.lastNames,
        birthdate: pacienteData.birthdate,
        gender : pacienteData.gender,
        statusMarital : pacienteData.statusMarital,
        nationality : pacienteData.nationality,
        centroId: pacienteData.centroId,
        address: pacienteData.address,

        pais: pacienteData.pais,
        department: pacienteData.department,
        province: pacienteData.province,
        district: pacienteData.district,

        phoneNumber: pacienteData.phoneNumber,
        email: pacienteData.email,
        direccion: pacienteData.direccion,

        status: pacienteData.status, // Map boolean to numeric IDs
        medicalHistory: 'HC-' + pacienteData.documentNumber + '-CMB',

        updatedAt: new Date().toISOString(),
        updatedBy: (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })(),
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Paciente/${id}`;
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
      console.log('✅ Paciente actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Paciente:', error);
      throw error;
    }
  },

  // Eliminación lógica del paciente
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Paciente con ID:', id);

      if (!id) {
        throw new Error('ID del Paciente es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Paciente/${id}`;
      console.log('🔗 URL de eliminación:', url);

      // Enviar la solicitud DELETE con el campo eliminadoPor como un query parameter
      const eliminador = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'ADMIN'; } catch { return 'ADMIN'; } })();
      const urlWithParams = `${url}?eliminadoPor=${encodeURIComponent(eliminador)}`;
      console.log('🔗 URL con parámetros:', urlWithParams);

      const response = await fetch(urlWithParams, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      console.log('✅ Paciente eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Paciente:', error);
      throw error;
    }
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

    return await api.patch(API_ENDPOINTS.PATIENTS.BY_ID(id), { status });
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

    return await api.get(API_ENDPOINTS.PATIENTS.SEARCH, { params: queryParams });
  },

  // Exportar lista de pacientes
  export: async (format = 'xlsx', filters = {}) => {
    const validFormats = ['xlsx', 'csv', 'pdf'];
    if (!validFormats.includes(format)) {
      throw new Error(`Formato inválido. Debe ser uno de: ${validFormats.join(', ')}`);
    }

    return await api.get(API_ENDPOINTS.PATIENTS.EXPORT, {
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
      await api.get(`${API_ENDPOINTS.PATIENTS.BASE}/validate-document`, { params });
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
    return await api.get(`${API_ENDPOINTS.PATIENTS.BASE}/stats`);
  }
};

export default patientsService;