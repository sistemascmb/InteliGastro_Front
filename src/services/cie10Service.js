import { API_ENDPOINTS } from '../constants/api';

// Servicio para el manejo de códigos CIE10
export const cie10Service = {
  // Obtener todos los códigos CIE10
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Llamando a la API de CIE10...');

      // Usar fetch directo siguiendo el patrón exitoso
      const url = `${process.env.REACT_APP_API_URL}/Cie10`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);
      const rawData = await response.json();

      console.log('✅ Datos de CIE10 recibidos:', rawData);
      console.log('✅ Número de códigos CIE10:', rawData.length);

      // Filtrar solo códigos activos (status: true) como medida de seguridad
      const codigosActivos = rawData.filter(codigo => codigo.status === true && codigo.isDeleted === false);
      console.log('✅ Códigos CIE10 activos:', codigosActivos.length);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = codigosActivos.map(codigo => ({
        // IDs y referencias
        id: codigo.cieid,
        cieid: codigo.cieid,

        // Información del código CIE10
        codigo: codigo.code,
        code: codigo.code,
        descripcion: codigo.description,
        description: codigo.description,

        // Información adicional
        generoId: codigo.genderId,
        genderId: codigo.genderId,
        estado: codigo.status ? 'activo' : 'inactivo',
        status: codigo.status,

        // Auditoría
        fechaCreacion: codigo.createdAt,
        createdAt: codigo.createdAt,
        creadoPor: codigo.createdBy,
        createdBy: codigo.createdBy,
        fechaActualizacion: codigo.updatedAt,
        updatedAt: codigo.updatedAt,
        actualizadoPor: codigo.updatedBy,
        updatedBy: codigo.updatedBy,
        eliminado: codigo.isDeleted,
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

  // Obtener código CIE10 por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del código CIE10 es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Cie10/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.cieid,
          cieid: data.cieid,
          codigo: data.code,
          code: data.code,
          descripcion: data.description,
          description: data.description,
          generoId: data.genderId,
          genderId: data.genderId,
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
      console.error('❌ Error al obtener código CIE10 por ID:', error);
      throw error;
    }
  },

  // Crear nuevo código CIE10
  create: async (cie10Data) => {
    try {
      console.log('📤 Creando nuevo código CIE10...');

      // Validar datos requeridos
      const requiredFields = ['codigo', 'descripcion'];
      const missingFields = requiredFields.filter(field => !cie10Data[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        code: cie10Data.codigo || cie10Data.code,
        description: cie10Data.descripcion || cie10Data.description,
        genderId: cie10Data.genero || cie10Data.generoId || cie10Data.genderId || 3, // Por defecto 3 ("Ambos")
        status: true, // Siempre activo al crear
        createdAt: new Date().toISOString(),
        createdBy: 'Jhon' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Cie10`;
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
      console.log('✅ Código CIE10 creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear código CIE10:', error);
      throw error;
    }
  },

  // Actualizar código CIE10
  update: async (id, cie10Data) => {
    try {
      console.log('📝 Actualizando código CIE10 con ID:', id);

      if (!id) {
        throw new Error('ID del código CIE10 es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        cieid: parseInt(id),
        code: cie10Data.codigo || cie10Data.code,
        description: cie10Data.descripcion || cie10Data.description,
        genderId: cie10Data.genero || cie10Data.generoId || cie10Data.genderId || 3,
        status: cie10Data.estado === 'activo' || cie10Data.status !== false, // Mantener como activo por defecto
        updatedAt: new Date().toISOString(),
        updatedBy: 'Jhon',
        isDeleted: false // Mantener como no eliminado
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Cie10/${id}`;
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
      console.log('✅ Código CIE10 actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar código CIE10:', error);
      throw error;
    }
  },

  // Eliminar código CIE10
  delete: async (id, eliminadoPor = 'Jhon') => {
    try {
      console.log('🗑️ Eliminando código CIE10 con ID:', id);

      if (!id) {
        throw new Error('ID del código CIE10 es requerido');
      }

      // Según el swagger, necesita ID y eliminadoPor
      const url = `${process.env.REACT_APP_API_URL}/Cie10/${id}?eliminadoPor=${encodeURIComponent(eliminadoPor)}`;

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

      console.log('✅ Código CIE10 eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar código CIE10:', error);
      throw error;
    }
  },

  // Buscar códigos CIE10 por término
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
  }
};

export default cie10Service;