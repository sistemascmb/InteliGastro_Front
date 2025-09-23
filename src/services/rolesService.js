import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de roles
export const rolesService = {
  // Obtener todos los roles
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de roles...');

      // Usar fetch directo siguiendo el patrón exitoso de pacientes
      const url = `${process.env.REACT_APP_API_URL}/Roles`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);
      const rawData = await response.json();

      console.log('✅ Datos de roles recibidos:', rawData);
      console.log('✅ Número de roles:', rawData.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = rawData.map(rol => ({
        // IDs y referencias
        id: rol.profiletypeid,
        profiletypeid: rol.profiletypeid,

        // Información del rol
        nombre: rol.profile_name,
        profile_name: rol.profile_name,
        descripcion: rol.description,
        description: rol.description,

        // Auditoría
        fechaCreacion: rol.createdAt,
        createdAt: rol.createdAt,
        creadoPor: rol.createdBy,
        createdBy: rol.createdBy,
        fechaActualizacion: rol.updatedAt,
        updatedAt: rol.updatedAt,
        actualizadoPor: rol.updatedBy,
        updatedBy: rol.updatedBy,
        eliminado: rol.isDeleted,
        isDeleted: rol.isDeleted
      }));

      return {
        data: mappedData,
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

  // Obtener rol por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del rol es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Roles/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.profiletypeid,
          profiletypeid: data.profiletypeid,
          nombre: data.profile_name,
          profile_name: data.profile_name,
          descripcion: data.description,
          description: data.description,
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
      console.error('❌ Error al obtener rol por ID:', error);
      throw error;
    }
  },

  // Crear nuevo rol
  create: async (rolData) => {
    try {
      console.log('📤 Creando nuevo rol...');

      // Validar datos requeridos
      const requiredFields = ['nombre', 'descripcion'];
      const missingFields = requiredFields.filter(field => !rolData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        profile_name: rolData.nombre || rolData.profile_name,
        description: rolData.descripcion || rolData.description,
        createdAt: new Date().toISOString(), // Fecha actual en formato ISO
        createdBy: 'Jhon' // Usuario de prueba como solicitaste
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Roles`;
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
      console.log('✅ Rol creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear rol:', error);
      throw error;
    }
  },

  // Actualizar rol
  update: async (id, rolData) => {
    try {
      console.log('📝 Actualizando rol con ID:', id);

      if (!id) {
        throw new Error('ID del rol es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        profiletypeid: parseInt(id), // ID como número
        profile_name: rolData.nombre || rolData.profile_name,
        description: rolData.descripcion || rolData.description,
        updatedAt: new Date().toISOString(), // Fecha actual en formato ISO
        updatedBy: 'Jhon', // Usuario de prueba
        isDeleted: false // Mantener como activo
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Roles/${id}`;
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
      console.log('✅ Rol actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar rol:', error);
      throw error;
    }
  },

  // Eliminar rol
  delete: async (id, eliminadoPor = 'Jhon') => {
    try {
      console.log('🗑️ Eliminando rol con ID:', id);

      if (!id) {
        throw new Error('ID del rol es requerido');
      }

      // Según el swagger, necesita ID y eliminadoPor
      const url = `${process.env.REACT_APP_API_URL}/Roles/${id}?eliminadoPor=${encodeURIComponent(eliminadoPor)}`;

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

      console.log('✅ Rol eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar rol:', error);
      throw error;
    }
  },

  // Buscar roles por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allRoles = await this.getAll();
    const filteredRoles = allRoles.data.filter(rol =>
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredRoles,
      status: 'success'
    };
  }
};

export default rolesService;