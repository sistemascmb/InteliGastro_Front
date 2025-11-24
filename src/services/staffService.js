import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';


// Servicio para el manejo de personal médico y administrativo
export const staffService = {
  // Obtener todo el personal con filtros
  getAll: async (params = {}) => {
      try {
        console.log('🌐 Obteniendo todos los personales...');
  
        const url = `${process.env.REACT_APP_API_URL}/Personal`;
        console.log('🔗 URL:', url);
  
        const response = await fetch(url);
  
        if(!response.ok){
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const rawData = await response.json();
        console.log('✅ Datos de Personal recibidos:', rawData);
        console.log('✅ Número de Personal:', rawData.length);
  
        //Filtrar solo recusros no eliminados (isDeletd : false)
        const personalActivos = rawData.filter(personal => personal.isDeleted === false);
        console.log('✅ Personal activos (isDeleted: false):', personalActivos.length);
  
        //Mapeamos los campos del backend a los campos dell frontend
        const mappedData = personalActivos.map(personal => ({
          //IDs y referencias
          id: personal.personalid,
          personalid: personal.personalid,
          centroId: personal.centroId,

          documento: personal.documento,
          nombres: personal.nombres,
          apellidos: personal.apellidos,
          fecNac: personal.fecNac,
          genero : personal.genero,
          telefono : personal.telefono,
          celular : personal.celular,
          correo: personal.correo,
          direccion: personal.direccion,

          estado: personal.estado ? 'activo' : 'inactivo', // Map boolean to numeric IDs
          status: personal.estado, // Map boolean to numeric IDs

          titulo: personal.titulo,
          grado: personal.grado,
          nLicencia: personal.nLicencia,
          tipoTrabajo: personal.tipoTrabajo,
          
          pais: personal.pais,
          departamento: personal.departamento,
          provincia: personal.provincia,
          distrito: personal.distrito,
  
          // Auditoría
          createdAt: personal.createdAt,
          createdBy: personal.createdBy,
          updatedAt: personal.updatedAt,
          updatedBy: personal.updatedBy,
          isDeleted: personal.isDeleted
  
        }));
        //ordenamos alfabeticamente por nombre
        const sortedData = mappedData.sort((a,b) => 
          a.nombres.toLowerCase().localeCompare(b.nombres.toLowerCase())
        );
  
        return {
          data: sortedData,
          status: 'success'
        };

      } catch (error) {
        console.error('❌ Error completo:', error);
        console.error('❌ Error message:', error.message);
  
        if (error.code === 'ERR_NETWORK') {
          console.error('🚫 ERROR DE RED: Posible problema de CORS o servidor no disponible');
        }
        if (error.message.includes('CORS')) {
          console.error('🚫 ERROR DE CORS: El servidor debe permitir origen del frontend');
        }
  
        throw error;
      }
    },

  // Obtener personal por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del Personal es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Personal/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.personalid,
          personalid: data.personalid,
          centroId: data.centroId,

          documento: data.documento,
          nombres: data.nombres,
          apellidos: data.apellidos,
          fecNac: data.fecNac,
          genero : data.genero,
          telefono : data.telefono,
          celular : data.celular,
          correo: data.correo,
          direccion: data.direccion,

          estado: data.estado ? 'activo' : 'inactivo', // Map boolean to numeric IDs
          status: data.estado, // Map boolean to numeric IDs

          titulo: data.titulo,
          grado: data.grado,
          nLicencia: data.nLicencia,
          tipoTrabajo: data.tipoTrabajo,
          
          pais: data.pais,
          departamento: data.departamento,
          provincia: data.provincia,
          distrito: data.distrito,
          
          photo: data.photo,
          firma: data.firma,
          cabeceraPlantilla: data.cabeceraPlantilla,

  
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
  create: async (personalData) => {
    try {
      console.log('📤 Creando nuevo centro...');

      // Validar datos requeridos
      const requiredFields = ['documento', 'nombres', 'apellidos', 'celular', 'direccion', 'telefono'];
      const missingFields = requiredFields.filter(field => !personalData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Validar campos UBIGEO
      if (!personalData.pais || !personalData.departamento || !personalData.provincia || !personalData.distrito) {
        throw new Error('Todos los campos de ubicación (país, departamento, provincia y distrito) son obligatorios');
      }

      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        centroId: personalData.centroId,
        documento: personalData.documento,
        nombres: personalData.nombres,
        apellidos: personalData.apellidos,
        fecNac: personalData.fecNac,
        genero: personalData.genero.toString(),
        telefono: personalData.telefono,
        celular: personalData.celular,
        correo: personalData.correo,
        direccion: personalData.direccion,
        estado: personalData.estado === '10007', // Convert numeric ID to boolean
        titulo: personalData.titulo.toString(),
        grado: personalData.grado,
        nLicencia: personalData.nLicencia,
        tipoTrabajo: personalData.tipoTrabajo.toString(),

        departamento: personalData.departamento, // Cajamarca
        provincia: personalData.provincia, // Cajabamba
        distrito: personalData.distrito, // Condebamba
        pais: personalData.pais, // Perú
        tipoDoc: 1,

        photo: personalData.photo,
        firma: personalData.firma,
        cabeceraPlantilla: personalData.cabeceraPlantilla,

        createdAt: new Date().toISOString(),
        createdBy: actor
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Personal`;
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
      console.log('✅ Personal creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear personal:', error);
      throw error;
    }
  },

  
  // Actualizar miembro del personal
  update: async (id, personalData) => {
    try {
      console.log('📝 Actualizando centro con ID:', id);

      if (!id) {
        throw new Error('ID del centro es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        personalid: parseInt(id),
        centroId: personalData.centroId,
        documento: personalData.documento,
        nombres: personalData.nombres,
        apellidos: personalData.apellidos,
        fecNac: personalData.fecNac,
        genero: personalData.genero.toString(),
        telefono: personalData.telefono,
        celular: personalData.celular,
        correo: personalData.correo,
        direccion: personalData.direccion,
        estado: personalData.estado, // Convert numeric ID to boolean
        titulo: personalData.titulo.toString(),
        grado: personalData.grado,
        nLicencia: personalData.nLicencia,
        tipoTrabajo: personalData.tipoTrabajo.toString(),

        departamento: personalData.departamento, // Cajamarca
        provincia: personalData.provincia, // Cajabamba
        distrito: personalData.distrito, // Condebamba
        pais: personalData.pais, // Perú
        tipoDoc: 1,

        photo: personalData.photo,
        firma: personalData.firma,
        cabeceraPlantilla: personalData.cabeceraPlantilla,
        
        updatedAt: new Date().toISOString(),
        updatedBy: actor,
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Personal/${id}`;
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
      console.log('✅ Personal actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Personal:', error);
      throw error;
    }
  },

  
  // Eliminar miembro del personal
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Personal con ID:', id);

      if (!id) {
        throw new Error('ID del Personal es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Personal/${id}`;
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

      console.log('✅ Personal eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Personal:', error);
      throw error;
    }
  },

  // Cambiar estado del personal
  changeStatus: async (id, status) => {
    if (!id) {
      throw new Error('ID del personal es requerido');
    }
  
    const validStatuses = ['10007', '10008']; // Numeric IDs for activo/inactivo
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