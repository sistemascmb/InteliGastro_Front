import Horario from 'pages/administracion/Horario';
import { API_ENDPOINTS } from '../constants/api';
import { ubigeoService } from './ubigeoService';
import { format } from 'date-fns';

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

        // Horarios
        inicioAtencion: rawData.inicioAtencion || '',
        finAtencion: rawData.finAtencion || '',

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
      console.log('✅ Datos de Centro recibidos:', rawData);
      console.log('✅ Número de Centro:', rawData.length);

      //Filtrar solo recusros no eliminados (isDeletd : false)
      const centrosActivos = rawData.filter(centro => centro.isDeleted === false);
      console.log('✅ Centros activos (isDeleted: false):', centrosActivos.length);

      //Mapeamos los campos del backend a los campos dell frontend
      const mappedData = centrosActivos.map(centro => ({
        //IDs y referencias
        id: centro.centroid,
        centroid: centro.centroid,

        //Información del centro
        nombre: centro.nombre,
        descripcion: centro.descripcion,
        abreviatura: centro.abreviatura,
        pais: centro.pais,
        departamento: centro.departamento,
        provincia: centro.provincia,
        distrito: centro.distrito,
        ruc: centro.ruc,

        inicioAtencion: centro.inicioAtencion || '',
        finAtencion: centro.finAtencion || '',
        telefono: centro.telefono,
        direccion: centro.direccion,
        
        // Estado
        estado: centro.status ? 'activo' : 'inactivo',
        status: centro.status ? 'activo' : 'inactivo',
        
        // Auditoría
        createdAt: format(centro.createdAt, 'dd/MM/yyyy HH:mm:ss zzzz'),
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

      // Validar campos UBIGEO
      if (!centroData.pais || !centroData.departamento || !centroData.provincia || !centroData.distrito) {
        throw new Error('Todos los campos de ubicación (país, departamento, provincia y distrito) son obligatorios');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        nombre: centroData.nombre,
        descripcion: centroData.descripcion,
        abreviatura: centroData.abreviatura,
        inicioAtencion: centroData.inicioAtencion,
        finAtencion: centroData.finAtencion,
        direccion: centroData.direccion,
        telefono: centroData.telefono,
        departamento: centroData.departamento, // Cajamarca
        provincia: centroData.provincia, // Cajabamba
        distrito: centroData.distrito, // Condebamba
        pais: centroData.pais, // Perú
        ruc: centroData.ruc || "20000000000", // RUC por defecto si no se proporciona
        status: true, // Siempre activo al crear
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

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        centroid: parseInt(id),
        nombre: centroData.nombre,
        descripcion: centroData.descripcion,
        abreviatura: centroData.abreviatura,
        inicioAtencion: centroData.inicioAtencion,
        finAtencion: centroData.finAtencion,
        direccion: centroData.direccion,
        telefono: centroData.telefono,
        departamento: centroData.departamento, // Cajamarca
        provincia: centroData.provincia, // Cajabamba
        distrito: centroData.distrito, // Condebamba (el distrito 3 en el array es ID 15)
        pais: centroData.pais, // Perú
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

      const url = `${process.env.REACT_APP_API_URL}/Centro/${id}`;
      console.log('🔗 URL de eliminación:', url);

      // Enviar la solicitud DELETE con el campo eliminadoPor como un query parameter
      const urlWithParams = `${url}?eliminadoPor=ADMIN`;
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
  ,
  getAllSystemParameterId: async (idGroup) => {
    try {

      const url = `${process.env.REACT_APP_API_URL}/SystemParameter/group/${idGroup}`;
      const response = await fetch(url);

      if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemParameter recibidos:', rawData);
      console.log('✅ Número de SystemParameter:', rawData.length);
      
      // Asegurarnos que rawData sea un array
      const dataArray = Array.isArray(rawData) ? rawData : rawData.data || [];
      
      // Filtrar solo los parámetros no eliminados
      const systemparameterActivos = dataArray.filter(param => !param.isDeleted);
      console.log('Parámetros activos:', systemparameterActivos);
      
      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = systemparameterActivos.map(systemparameter => ({
        // IDs y referencias
        parameterid: systemparameter.parameterid,
        groupid: systemparameter.groupid,

        // Información del SystemParameter
        value1: systemparameter.value1 || '',
        value2: systemparameter.value2 || '',
        parentParameterId: systemparameter.parentParameterId,
               
        // Auditoría
        createdAt: systemparameter.createdAt ? format(new Date(systemparameter.createdAt), 'dd/MM/yyyy HH:mm:ss zzzz') : null,
        createdBy: systemparameter.createdBy,
        updatedAt: systemparameter.updatedAt,
        updatedBy: systemparameter.updatedBy,
        isDeleted: systemparameter.isDeleted
      }));

      // Ordenamos alfabéticamente por value1 con manejo de nulos
      const sortedData = mappedData.sort((a,b) => 
        (a.value1 || '').toLowerCase().localeCompare((b.value1 || '').toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };


    } catch (error) {
      console.error('❌ Error al obtener recurso por ID:', error);
      throw error;
    }
  },
  getAllSystemParameterIdRest: async (idGroup) => {
    try {

      const url = `${process.env.REACT_APP_API_URL}/SystemParameter/group/${idGroup}/rest`;
      const response = await fetch(url);

      if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemParameter recibidos:', rawData);
      console.log('✅ Número de SystemParameter:', rawData.length);
      
      // Asegurarnos que rawData sea un array
      const dataArray = Array.isArray(rawData) ? rawData : rawData.data || [];
      
      // Filtrar solo los parámetros no eliminados
      const systemparameterActivos = dataArray.filter(param => !param.isDeleted);
      console.log('Parámetros activos:', systemparameterActivos);
      
      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = systemparameterActivos.map(systemparameter => ({
        // IDs y referencias
        parameterid: systemparameter.parameterid,
        groupid: systemparameter.groupid,

        // Información del SystemParameter
        value1: systemparameter.value1 || '',
        value2: systemparameter.value2 || '',
        parentParameterId: systemparameter.parentParameterId,
               
        // Auditoría
        createdAt: systemparameter.createdAt ? format(new Date(systemparameter.createdAt), 'dd/MM/yyyy HH:mm:ss zzzz') : null,
        createdBy: systemparameter.createdBy,
        updatedAt: systemparameter.updatedAt,
        updatedBy: systemparameter.updatedBy,
        isDeleted: systemparameter.isDeleted
      }));

      // Ordenamos alfabéticamente por value1 con manejo de nulos
      const sortedData = mappedData.sort((a,b) => 
        (a.value1 || '').toLowerCase().localeCompare((b.value1 || '').toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };


    } catch (error) {
      console.error('❌ Error al obtener recurso por ID:', error);
      throw error;
    }
  },
  getAllSystemParameterIdParent: async (idGroup, parentId) => {
    if (!idGroup || !parentId) {
      throw new Error('Se requieren idGroup y parentId');
    }

    try {
      console.log(`🔄 Obteniendo SystemParameter para grupo ${idGroup} y padre ${parentId}...`);
      const url = `${process.env.REACT_APP_API_URL}/SystemParameter/group/${idGroup}/parent/${parentId}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if(!response.ok){
        console.error('❌ Error en la respuesta:', response.status, response.statusText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemParameter recibidos:', rawData);
      
      if (!rawData) {
        console.error('❌ No se recibieron datos del servidor');
        throw new Error('No se recibieron datos del servidor');
      }
      
      // Asegurarnos que rawData sea un array
      const dataArray = Array.isArray(rawData) ? rawData : rawData.data || [];
      console.log('✅ Número de SystemParameter:', dataArray.length);
      
      // Filtrar solo los parámetros no eliminados
      const systemparameterActivos = dataArray.filter(param => !param.isDeleted);
      console.log('Parámetros activos:', systemparameterActivos.length);
      
      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = systemparameterActivos.map(systemparameter => ({
        // IDs y referencias
        parameterid: systemparameter.parameterid,
        groupid: systemparameter.groupid,

        // Información del SystemParameter
        value1: systemparameter.value1 || '',
        value2: systemparameter.value2 || '',
        parentParameterId: systemparameter.parentParameterId,
               
        // Auditoría
        createdAt: systemparameter.createdAt ? format(new Date(systemparameter.createdAt), 'dd/MM/yyyy HH:mm:ss zzzz') : null,
        createdBy: systemparameter.createdBy,
        updatedAt: systemparameter.updatedAt,
        updatedBy: systemparameter.updatedBy,
        isDeleted: systemparameter.isDeleted
      }));

      // Ordenamos alfabéticamente por value1 con manejo de nulos
      const sortedData = mappedData.sort((a,b) => 
        (a.value1 || '').toLowerCase().localeCompare((b.value1 || '').toLowerCase())
      );

      console.log('✅ Datos mapeados y ordenados:', sortedData.length, 'registros');
      return {
        data: sortedData,
        status: 'success'
      };


    } catch (error) {
      console.error('❌ Error al obtener recurso por ID:', error);
      throw error;
    }
  },
  getAllSystemParameterAll: async () => {
    try {

      const url = `${process.env.REACT_APP_API_URL}/SystemParameter`;
      const response = await fetch(url);

      if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemParameter recibidos:', rawData);
      console.log('✅ Número de SystemParameter:', rawData.length);
      
      // Asegurarnos que rawData sea un array
      const dataArray = Array.isArray(rawData) ? rawData : rawData.data || [];
      
      // Filtrar solo los parámetros no eliminados
      const systemparameterActivos = dataArray.filter(param => !param.isDeleted);
      console.log('Parámetros activos:', systemparameterActivos);
      
      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = systemparameterActivos.map(systemparameter => ({
        // IDs y referencias
        parameterid: systemparameter.parameterid,
        groupid: systemparameter.groupid,

        // Información del SystemParameter
        value1: systemparameter.value1 || '',
        value2: systemparameter.value2 || '',
        parentParameterId: systemparameter.parentParameterId,
               
        // Auditoría
        createdAt: systemparameter.createdAt ? format(new Date(systemparameter.createdAt), 'dd/MM/yyyy HH:mm:ss zzzz') : null,
        createdBy: systemparameter.createdBy,
        updatedAt: systemparameter.updatedAt,
        updatedBy: systemparameter.updatedBy,
        isDeleted: systemparameter.isDeleted
      }));

      // Ordenamos alfabéticamente por value1 con manejo de nulos
      const sortedData = mappedData.sort((a,b) => 
        (a.value1 || '').toLowerCase().localeCompare((b.value1 || '').toLowerCase())
      );

      return {
        data: sortedData,
        status: 'success'
      };


    } catch (error) {
      console.error('❌ Error al obtener recurso por ID:', error);
      throw error;
    }
  },
  getSystemParameterId: async (id = 1) => {
    try {
      console.log('🌐 Llamando a la API de SystemParameter por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/SystemParameter/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemParameter recibidos:', rawData);

      // Mapeamos los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        parameterid: rawData.parameterid,
        groupid: rawData.groupid,

        // Información del SystemParameter
        value1: rawData.value1 || '',
        value2: rawData.value2 || '',
        parentParameterId: rawData.parentParameterId,
               
        // Auditoría
        createdAt: rawData.createdAt ? format(new Date(rawData.createdAt), 'dd/MM/yyyy HH:mm:ss zzzz') : null,
        createdBy: rawData.createdBy,
        updatedAt: rawData.updatedAt,
        updatedBy: rawData.updatedBy,
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

};



export default centrosService;