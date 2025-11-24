// Servicio para el manejo de preparaciones
export const preparacionService = {
  // Obtener todas las preparaciones
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de preparaciones...');

      const url = `${process.env.REACT_APP_API_URL}/Preparacion`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de preparaciones recibidos:', rawData);
      console.log('✅ Número de preparaciones:', rawData.length);

      // Filtrar solo preparaciones NO eliminadas (isDeleted: false)
      const preparacionesActivas = rawData.filter(preparacion => preparacion.isDeleted === false);
      console.log('✅ Preparaciones activas (isDeleted: false):', preparacionesActivas.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = preparacionesActivas.map(preparacion => ({
        // IDs y referencias
        id: preparacion.preparationid,
        preparationid: preparacion.preparationid,

        // Información de la preparación
        descripcion: preparacion.description,
        description: preparacion.description,

        // Estado - convertir boolean a string
        estado: preparacion.status ? 'activo' : 'inactivo',
        status: preparacion.status,

        // Auditoría
        fechaCreacion: preparacion.createdAt,
        createdAt: preparacion.createdAt,
        creadoPor: preparacion.createdBy,
        createdBy: preparacion.createdBy,
        fechaActualizacion: preparacion.updatedAt,
        updatedAt: preparacion.updatedAt,
        actualizadoPor: preparacion.updatedBy,
        updatedBy: preparacion.updatedBy,
        eliminado: preparacion.isDeleted,
        isDeleted: preparacion.isDeleted
      }));

      // Ordenar alfabéticamente por descripción
      const sortedData = mappedData.sort((a, b) =>
        a.descripcion.toLowerCase().localeCompare(b.descripcion.toLowerCase())
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

  // Obtener preparación por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID de la preparación es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Preparacion/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data: {
          id: data.preparationid,
          preparationid: data.preparationid,
          descripcion: data.description,
          description: data.description,
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
      console.error('❌ Error al obtener preparación por ID:', error);
      throw error;
    }
  },

  // Crear nueva preparación
  create: async (preparacionData) => {
    try {
      console.log('📤 Creando nueva preparación...');

      // Validar datos requeridos
      const requiredFields = ['descripcion'];
      const missingFields = requiredFields.filter(field => !preparacionData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        description: preparacionData.descripcion || preparacionData.description,
        status: preparacionData.estado === 'activo', // Convertir string a boolean
        createdAt: new Date().toISOString(),
        createdBy: actor
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Preparacion`;
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
      console.log('✅ Preparación creada exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear preparación:', error);
      throw error;
    }
  },

  // Actualizar preparación
  update: async (id, preparacionData) => {
    try {
      console.log('📝 Actualizando preparación con ID:', id);

      if (!id) {
        throw new Error('ID de la preparación es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        preparationid: parseInt(id), // ID como número
        description: preparacionData.descripcion || preparacionData.description,
        status: preparacionData.estado === 'activo', // Convertir string a boolean
        updatedAt: new Date().toISOString(),
        updatedBy: actor,
        isDeleted: false // Mantener como no eliminado
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Preparacion/${id}`;
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
      console.log('✅ Preparación actualizada exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar preparación:', error);
      throw error;
    }
  },

  // Eliminar preparación
  delete: async (id, eliminadoPor) => {
    try {
      console.log('🗑️ Eliminando preparación con ID:', id);

      if (!id) {
        throw new Error('ID de la preparación es requerido');
      }

      // Según el patrón de otros servicios, necesita ID y eliminadoPor
      const actor = eliminadoPor || (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const url = `${process.env.REACT_APP_API_URL}/Preparacion/${id}?eliminadoPor=${encodeURIComponent(actor)}`;

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

      console.log('✅ Preparación eliminada exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar preparación:', error);
      throw error;
    }
  },

  // Buscar preparaciones por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await preparacionService.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allPreparaciones = await preparacionService.getAll();
    const filteredPreparaciones = allPreparaciones.data.filter(preparacion =>
      preparacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preparacion.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredPreparaciones,
      status: 'success'
    };
  }
};

export default preparacionService;