import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de recursos
export const recursosService = {
  // Obtener todos los recursos
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de recursos...');

      const url = `${process.env.REACT_APP_API_URL}/Recursos`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de recursos recibidos:', rawData);
      console.log('✅ Número de recursos:', rawData.length);

      // Filtrar solo recursos NO eliminados (isDeleted: false)
      const recursosActivos = rawData.filter(recurso => recurso.isDeleted === false);
      console.log('✅ Recursos activos (isDeleted: false):', recursosActivos.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = recursosActivos.map(recurso => ({
        // IDs y referencias
        id: recurso.resourcesid,
        resourcesid: recurso.resourcesid,

        // Información del recurso
        nombre: recurso.name,
        name: recurso.name,
        descripcion: recurso.description,
        description: recurso.description,
        numeroSerie: recurso.serialNumber,
        serialNumber: recurso.serialNumber,

        // IDs relacionados
        centroId: recurso.centroId,
        procedureroomid: recurso.procedureroomid,

        // Para el frontend (mapear a nombres legibles más adelante)
        centro: recurso.centroId, // Por ahora mantenemos el ID
        locacionId: `SALA-${recurso.procedureroomid}`, // Simulamos locación basada en procedureroomid

        // Estado
        estado: recurso.status ? 'activo' : 'inactivo',
        status: recurso.status,

        // Procedimientos (por ahora vacío, se puede extender)
        procedimientos: [], // El backend no maneja procedimientos aún

        // Auditoría
        fechaCreacion: recurso.createdAt,
        createdAt: recurso.createdAt,
        creadoPor: recurso.createdBy,
        createdBy: recurso.createdBy,
        fechaActualizacion: recurso.updatedAt,
        updatedAt: recurso.updatedAt,
        actualizadoPor: recurso.updatedBy,
        updatedBy: recurso.updatedBy,
        eliminado: recurso.isDeleted,
        isDeleted: recurso.isDeleted
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

      if (error.code === 'ERR_NETWORK') {
        console.error('🚫 ERROR DE RED: Posible problema de CORS o servidor no disponible');
      }
      if (error.message.includes('CORS')) {
        console.error('🚫 ERROR DE CORS: El servidor debe permitir origen del frontend');
      }

      throw error;
    }
  },

  // Obtener recurso por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del recurso es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Recursos/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data: {
          id: data.resourcesid,
          resourcesid: data.resourcesid,
          nombre: data.name,
          name: data.name,
          descripcion: data.description,
          description: data.description,
          numeroSerie: data.serialNumber,
          serialNumber: data.serialNumber,
          centroId: data.centroId,
          procedureroomid: data.procedureroomid,
          centro: data.centroId,
          locacionId: `SALA-${data.procedureroomid}`,
          estado: data.status ? 'activo' : 'inactivo',
          status: data.status,
          procedimientos: [],
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
      console.error('❌ Error al obtener recurso por ID:', error);
      throw error;
    }
  },

  // Crear nuevo recurso
  create: async (recursoData) => {
    try {
      console.log('📤 Creando nuevo recurso...');

      // Validar datos requeridos
      const requiredFields = ['nombre', 'descripcion', 'numeroSerie'];
      const missingFields = requiredFields.filter(field => !recursoData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        name: recursoData.nombre || recursoData.name,
        description: recursoData.descripcion || recursoData.description,
        serialNumber: recursoData.numeroSerie || recursoData.serialNumber,
        centroId: 1, // Por defecto al centro único disponible
        status: recursoData.estado === 'activo', // Convertir string a boolean
        procedureroomid: 1, // Por defecto a sala 1 (puedes ajustar esto)
        createdAt: new Date().toISOString(),
        createdBy: 'Jhon' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Recursos`;
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
      console.log('✅ Recurso creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear recurso:', error);
      throw error;
    }
  },

  // Actualizar recurso
  update: async (id, recursoData) => {
    try {
      console.log('📝 Actualizando recurso con ID:', id);

      if (!id) {
        throw new Error('ID del recurso es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        resourcesid: parseInt(id), // ID como número
        name: recursoData.nombre || recursoData.name,
        description: recursoData.descripcion || recursoData.description,
        serialNumber: recursoData.numeroSerie || recursoData.serialNumber,
        centroId: 1, // Por defecto al centro único disponible
        status: recursoData.estado === 'activo', // Convertir string a boolean
        procedureroomid: 1, // Por defecto a sala 1
        updatedAt: new Date().toISOString(),
        updatedBy: 'Jhon', // Usuario de prueba
        isDeleted: false // Mantener como no eliminado
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Recursos/${id}`;
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
      console.log('✅ Recurso actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar recurso:', error);
      throw error;
    }
  },

  // Eliminar recurso
  delete: async (id, eliminadoPor = 'Jhon') => {
    try {
      console.log('🗑️ Eliminando recurso con ID:', id);

      if (!id) {
        throw new Error('ID del recurso es requerido');
      }

      // Según el patrón de otros servicios, necesita ID y eliminadoPor
      const url = `${process.env.REACT_APP_API_URL}/Recursos/${id}?eliminadoPor=${encodeURIComponent(eliminadoPor)}`;

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

      console.log('✅ Recurso eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar recurso:', error);
      throw error;
    }
  },

  // Buscar recursos por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await recursosService.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allRecursos = await recursosService.getAll();
    const filteredRecursos = allRecursos.data.filter(recurso =>
      recurso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.locacionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredRecursos,
      status: 'success'
    };
  }
};

export default recursosService;