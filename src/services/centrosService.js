import Horario from 'pages/administracion/Horario';
import { API_ENDPOINTS } from '../constants/api';
import { ubigeoService } from './ubigeoService';

// Servicio para el manejo de centros
export const centrosService = {
  // Obtener centro por ID (por ahora solo hay ID 1 según la API)
  getById: async (id = 1) => {
    try {
      console.log('🌐 Llamando a la API de centro por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/Centro/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de centro recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.centroid,
        centroid: rawData.centroid,

        // Información del Centro
        nombre: rawData.nombre,
        descripcion: rawData.descripcion,
        abreviatura: rawData.abreviatura,

        // Horarios - convertir de DateTime a solo tiempo
        inicioAtencion: rawData.inicioAtencion ?
          new Date(rawData.inicioAtencion).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }) : '',
        finAtencion: rawData.finAtencion ?
          new Date(rawData.finAtencion).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }) : '',

        // Dirección del Centro
        direccion: rawData.direccion,
        telefono: rawData.telefono,
        ruc: rawData.ruc,

        // Campos geográficos (mantener como números para consistencia con API)
        departamento: rawData.departamento,
        provincia: rawData.provincia,
        distrito: rawData.distrito,
        pais: rawData.pais,

        // Estado
        estado: rawData.status ? 'activo' : 'inactivo',
        status: rawData.status,

        // Auditoría
        fechaCreacion: rawData.createdAt,
        createdAt: rawData.createdAt,
        creadoPor: rawData.createdBy,
        createdBy: rawData.createdBy,
        fechaActualizacion: rawData.updatedAt,
        updatedAt: rawData.updatedAt,
        actualizadoPor: rawData.updatedBy,
        updatedBy: rawData.updatedBy,
        eliminado: rawData.isDeleted,
        isDeleted: rawData.isDeleted
      };

      return {
        data: mappedData,
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

  // Obtener todos los centros (simulando con el único centro disponible)
  getAll: async (params = {}) => {
    try {
      console.log('🌐 Obteniendo todos los centros...');

      const url = `${process.env.REACT_APP_API_URL}/Centro`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de recursos recibidos:', rawData);
      console.log('✅ Número de Centro:', rawData.length);

      //Filtrar solo recusros no eliminados (isDeletd : false)
      const centrosActivos = rawData.filter(centro => centro.isDeleted === false);
      console.log('✅ Centros activos (isDeleted: false):', centrosActivos.length);

      //Mapeamos los campos del backend a los campos dell frontend
      const mappedData = centrosActivos.map(centro => ({
        //IDs y referencias
        //id: centro.centroid,
        centroid: centro.centroid,

        //Información del centro
        nombre: centro.nombre,
        descripcion: centro.descripcion,
        abreviatura: centro.abreviatura,
        horario: centro.inicioAtencion + ' - ' + centro.finAtencion,
        telefono: centro.telefono,
        
        // Estado
        //estado: centro.status ? 'activo' : 'inactivo',
        status: centro.status ? 'activo' : 'inactivo',
        
        // Auditoría
        createdAt: centro.createdAt,
        createdBy: centro.createdBy,
        updatedAt: centro.updatedAt,
        updatedBy: centro.updatedBy,
        isDeleted: centro.isDeleted

      }));

      //ordenamos alfabeticamente por nombre
      const sortedData = mappedData.sort((a,b) => 
        a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };





      // Por ahora solo hay un centro con ID 1 
      //const centro = await centrosService.getById(1);

      //return {
      //  data: [centro.data], // Array con un elemento
      //  status: ' success'
      //};

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

  // Crear nuevo centro
  create: async (centroData) => {
    try {
      console.log('📤 Creando nuevo centro...');

      // Validar datos requeridos
      const requiredFields = ['nombre', 'descripcion', 'abreviatura', 'direccion', 'telefono'];
      const missingFields = requiredFields.filter(field => !centroData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      // Convertir horarios de string (HH:MM) a DateTime
      const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
      const inicioAtencionDateTime = `${today}T${centroData.inicioAtencion}:00.000Z`;
      const finAtencionDateTime = `${today}T${centroData.finAtencion}:00.000Z`;

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        nombre: centroData.nombre,
        descripcion: centroData.descripcion,
        abreviatura: centroData.abreviatura,
        inicioAtencion: inicioAtencionDateTime,
        finAtencion: finAtencionDateTime,
        direccion: centroData.direccion,
        telefono: centroData.telefono,
        departamento: parseInt(centroData.departamento) || 1, // Cajamarca
        provincia: parseInt(centroData.provincia) || 2, // Cajabamba
        distrito: parseInt(centroData.distrito) || 15, // Condebamba (el distrito 3 en el array es ID 15)
        pais: parseInt(centroData.pais) || 1, // Perú
        ruc: centroData.ruc || "20000000000", // RUC por defecto si no se proporciona
        status: centroData.estado === 'activo' || true, // Por defecto activo
        createdAt: new Date().toISOString(),
        createdBy: 'Jhon' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Centro`;
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
      console.log('✅ Centro creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear centro:', error);
      throw error;
    }
  },

  // Actualizar centro
  update: async (id, centroData) => {
    try {
      console.log('📝 Actualizando centro con ID:', id);

      if (!id) {
        throw new Error('ID del centro es requerido');
      }

      // Convertir horarios de string (HH:MM) a DateTime
      const today = new Date().toISOString().split('T')[0];
      const inicioAtencionDateTime = `${today}T${centroData.inicioAtencion}:00.000Z`;
      const finAtencionDateTime = `${today}T${centroData.finAtencion}:00.000Z`;

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        centroid: parseInt(id),
        nombre: centroData.nombre,
        descripcion: centroData.descripcion,
        abreviatura: centroData.abreviatura,
        inicioAtencion: inicioAtencionDateTime,
        finAtencion: finAtencionDateTime,
        direccion: centroData.direccion,
        telefono: centroData.telefono,
        departamento: parseInt(centroData.departamento) || 1, // Cajamarca
        provincia: parseInt(centroData.provincia) || 2, // Cajabamba
        distrito: parseInt(centroData.distrito) || 15, // Condebamba (el distrito 3 en el array es ID 15)
        pais: parseInt(centroData.pais) || 1, // Perú
        ruc: centroData.ruc || "20000000000",
        status: centroData.estado === 'activo' || true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Jhon',
        isDeleted: false
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Centro/${id}`;
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
      console.log('✅ Centro actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar centro:', error);
      throw error;
    }
  },

  // Eliminar centro
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando centro con ID:', id);

      if (!id) {
        throw new Error('ID del centro es requerido');
      }

      // Nota: La API parece tener un typo en la URL (/apiCentro en lugar de /api/Centro)
      // Usaré la URL correcta esperada
      const url = `${process.env.REACT_APP_API_URL}/Centro/${id}`;

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

      console.log('✅ Centro eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar centro:', error);
      throw error;
    }
  },

  // Buscar centros por término
  search: async (searchTerm, params = {}) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await centrosService.getAll(params);
    }

    // Para simplicidad, usar getAll y filtrar localmente
    const allCentros = await centrosService.getAll();
    const filteredCentros = allCentros.data.filter(centro =>
      centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centro.abreviatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centro.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      data: filteredCentros,
      status: 'success'
    };
  }
};

export default centrosService;