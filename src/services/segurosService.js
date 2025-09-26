import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de seguros
export const segurosService = {
  // Obtener todos los seguros
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de seguros...');

      // Usar fetch directo siguiendo el patrón exitoso
      const url = `${process.env.REACT_APP_API_URL}/Seguros`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);
      const rawData = await response.json();

      console.log('✅ Datos de seguros recibidos:', rawData);
      console.log('✅ Número de seguros:', rawData.length);

      // Verificar si hay seguros con isDeleted: true
      const segurosEliminados = rawData.filter(seguro => seguro.isDeleted === true);
      console.log('🗑️ Seguros eliminados (isDeleted: true):', segurosEliminados.length, segurosEliminados);

      // Filtrar solo seguros NO eliminados (isDeleted: false) como medida de seguridad
      const segurosActivos = rawData.filter(seguro => seguro.isDeleted === false);
      console.log('✅ Seguros activos (isDeleted: false):', segurosActivos.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = segurosActivos.map(seguro => ({
        // IDs y referencias
        id: seguro.insuranceid,
        insuranceid: seguro.insuranceid,

        // Información del seguro
        nombre: seguro.name,
        name: seguro.name,
        identificacion: seguro.identification,
        identification: seguro.identification,
        descripcion: seguro.details,
        details: seguro.details,
        direccion: seguro.adress,
        adress: seguro.adress,
        estado: seguro.status ? 'activo' : 'inactivo',
        status: seguro.status,

        // Auditoría
        fechaCreacion: seguro.createdAt,
        createdAt: seguro.createdAt,
        creadoPor: seguro.createdBy,
        createdBy: seguro.createdBy,
        fechaActualizacion: seguro.updatedAt,
        updatedAt: seguro.updatedAt,
        actualizadoPor: seguro.updatedBy,
        updatedBy: seguro.updatedBy,
        eliminado: seguro.isDeleted,
        isDeleted: seguro.isDeleted
      }));

      // Ordenar alfabéticamente por nombre
      const sortedData = mappedData.sort((a, b) =>
        a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };

    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error message:', error.message);

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

  // Obtener seguro por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del seguro es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Seguros/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.insuranceid,
          insuranceid: data.insuranceid,
          nombre: data.name,
          name: data.name,
          identificacion: data.identification,
          identification: data.identification,
          descripcion: data.details,
          details: data.details,
          direccion: data.adress,
          adress: data.adress,
          estado: data.status ? 'activo' : 'inactivo',
          status: data.status,
          fechaCreacion: data.createdAt,
          createdAt: data.createdAt,
          creadoPor: data.createdBy,
          createdBy: data.createdBy,
          fechaActualizacion: data.updatedAt,
          updatedAt: data.updatedAt,
          actualizadoPor: data.updatedBy,
          updatedBy: data.updatedBy,
          eliminado: data.isDeleted,
          isDeleted: data.isDeleted
        },
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al obtener seguro por ID:', error);
      throw error;
    }
  },

  // Crear nuevo seguro
  create: async (seguroData) => {
    try {
      console.log('📤 Creando nuevo seguro...');

      // Validar datos requeridos
      const requiredFields = ['nombre', 'identificacion', 'descripcion', 'direccion'];
      const missingFields = requiredFields.filter(field => !seguroData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        name: seguroData.nombre || seguroData.name,
        identification: seguroData.identificacion || seguroData.identification,
        details: seguroData.descripcion || seguroData.details,
        adress: seguroData.direccion || seguroData.adress,
        status: seguroData.estado === 'activo', // Convertir string a boolean
        createdAt: new Date().toISOString(),
        createdBy: 'Jhon' // Usuario de prueba como solicitaste
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Seguros`;
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
      console.log('✅ Seguro creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear seguro:', error);
      throw error;
    }
  },

  // Actualizar seguro
  update: async (id, seguroData) => {
    try {
      console.log('📝 Actualizando seguro con ID:', id);

      if (!id) {
        throw new Error('ID del seguro es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        insuranceid: parseInt(id), // ID como número
        name: seguroData.nombre || seguroData.name,
        identification: seguroData.identificacion || seguroData.identification,
        details: seguroData.descripcion || seguroData.details,
        adress: seguroData.direccion || seguroData.adress,
        status: seguroData.estado === 'activo', // Convertir string a boolean
        updatedAt: new Date().toISOString(),
        updatedBy: 'Jhon', // Usuario de prueba
        isDeleted: false // Mantener como no eliminado
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Seguros/${id}`;
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
      console.log('✅ Seguro actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar seguro:', error);
      throw error;
    }
  },

  // Eliminar seguro
  delete: async (id, eliminadoPor = 'Jhon') => {
    try {
      console.log('🗑️ Eliminando seguro con ID:', id);

      if (!id) {
        throw new Error('ID del seguro es requerido');
      }

      // Según el swagger, necesita ID y eliminadoPor
      const url = `${process.env.REACT_APP_API_URL}/Seguros/${id}?eliminadoPor=${encodeURIComponent(eliminadoPor)}`;

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

      console.log('✅ Seguro eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar seguro:', error);
      throw error;
    }
  },

  // Buscar seguros por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allSeguros = await this.getAll();
    const filteredSeguros = allSeguros.data.filter(seguro =>
      seguro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seguro.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seguro.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seguro.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredSeguros,
      status: 'success'
    };
  }
};

export default segurosService;