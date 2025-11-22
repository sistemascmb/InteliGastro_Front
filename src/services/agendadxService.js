import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de códigos AgendaDx
export const agendadxService = {
  // Obtener todos los códigos AgendaDx
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de AgendaDx...');

      // Usar fetch directo siguiendo el patrón exitoso
      const url = `${process.env.REACT_APP_API_URL}/AgendaDx`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);
      const rawData = await response.json();

      console.log('✅ Datos de AgendaDx recibidos:', rawData);
      console.log('✅ Número de códigos AgendaDx:', rawData.length);

      // Filtrar solo códigos activos (status: true) como medida de seguridad
      const codigosActivos = rawData.filter(codigo => codigo.isDeleted === false);
      console.log('✅ Códigos AgendaDx activos:', codigosActivos.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = codigosActivos.map(codigo => ({
        // IDs y referencias
        id: codigo.medicalscheduledxid,
        medicalscheduledxid: codigo.medicalscheduledxid,
        medical_ScheduleId: codigo.medical_ScheduleId,
        cie10id: codigo.cie10id,
        description: codigo.description,

        createdAt: codigo.createdAt,
        createdBy: codigo.createdBy,
        updatedAt: codigo.updatedAt,
        updatedBy: codigo.updatedBy,
        isDeleted: codigo.isDeleted
      }));

      return {
        data: mappedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error message:', error.message);
      throw error;
    }
  },

  // Obtener código AgendaDx por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del código AgendaDx es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/AgendaDx/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
            id: data.medicalscheduledxid,
            medicalscheduledxid: data.medicalscheduledxid,
            medical_ScheduleId: data.medical_ScheduleId,
            cie10id: data.cie10id,
            description: data.description,

            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
            isDeleted: data.isDeleted
        },
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al obtener código AgendaDx por ID:', error);
      throw error;
    }
  },

  // Crear nuevo código AgendaDx
  create: async (AgendaDxData) => {
    try {
      console.log('📤 Creando nuevo código AgendaDx...');

      // Validar datos requeridos
      const requiredFields = ['medical_ScheduleId', 'cie10id'];
      const missingFields = requiredFields.filter(field => AgendaDxData[field] === undefined || AgendaDxData[field] === null || AgendaDxData[field] === '');
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        medical_ScheduleId: AgendaDxData.medical_ScheduleId,
        cie10id: AgendaDxData.cie10id,
        description: AgendaDxData.description,
        
        createdAt: new Date().toISOString(),
        createdBy: 'Jhon' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/AgendaDx`;
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
      console.log('✅ Código AgendaDx creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear código AgendaDx:', error);
      throw error;
    }
  },

  // Actualizar código AgendaDx
  update: async (id, AgendaDxData) => {
    try {
      console.log('📝 Actualizando código AgendaDx con ID:', id);

      if (!id) {
        throw new Error('ID del código AgendaDx es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        medicalscheduledxid: parseInt(id),
        medical_ScheduleId: AgendaDxData.medical_ScheduleId,
        cie10id: AgendaDxData.cie10id,
        description: AgendaDxData.description,

        updatedAt: new Date().toISOString(),
        updatedBy: 'Jhon',
        isDeleted: false // Mantener como no eliminado
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/AgendaDx/${id}`;
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
      console.log('✅ Código AgendaDx actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar código AgendaDx:', error);
      throw error;
    }
  },

  // Eliminar código AgendaDx
  delete: async (id, eliminadoPor = 'Jhon') => {
    try {
      console.log('🗑️ Eliminando código AgendaDx con ID:', id);

      if (!id) {
        throw new Error('ID del código AgendaDx es requerido');
      }

      // Según el swagger, necesita ID y eliminadoPor
      const url = `${process.env.REACT_APP_API_URL}/AgendaDx/${id}?eliminadoPor=${encodeURIComponent(eliminadoPor)}`;

      console.log('🔗 URL de eliminación:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('🔗 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      console.log('✅ Código AgendaDx eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar código AgendaDx:', error);
      throw error;
    }
  },

  // Buscar códigos AgendaDx por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allCodigos = await this.getAll();
    const filteredCodigos = allCodigos.data.filter(codigo =>
      codigo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codigo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredCodigos,
      status: 'success'
    };
  },

  searchByAgendaDxEstudioId: async (estudioId) => {
    if (!estudioId) {
      throw new Error('ID del estudio es requerido');
    }
    try {
      //const url = `http://192.168.1.55:8090/api/ArchivoDigital/search?value1=${encodeURIComponent(estudioId)}`;
      const url = `${process.env.REACT_APP_API_URL}/AgendaDx/search?value1=${encodeURIComponent(estudioId)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      const activos = (Array.isArray(rawData) ? rawData : []).filter(item => item && item.isDeleted === false);
      const mappedData = activos.map(item => ({
        id: item.medicalscheduledxid,
        medicalscheduledxid: item.medicalscheduledxid,
        medical_ScheduleId: item.medical_ScheduleId,
        cie10id: item.cie10id,
        description: item.description,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        updatedAt: item.updatedAt,
        updatedBy: item.updatedBy,
        isDeleted: item.isDeleted
      }));
      return {
        data: mappedData,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al buscar Dx por estudio:', error);
      throw error;
    }
  },

};

export default agendadxService;