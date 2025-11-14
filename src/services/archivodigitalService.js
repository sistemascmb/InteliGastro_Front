import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';
import appointmentsService from './appointmentsService';

// Servicio para el manejo de ArchivoDigitals
export const archivodigitalService = {
  // Obtener todos los ArchivoDigitals
  getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las ArchivoDigital...');
    
            const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de ArchivoDigital recibidos:', rawData);
            console.log('✅ Número de ArchivoDigital:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const personalActivos = rawData.filter(ArchivoDigital => ArchivoDigital.isDeleted === false);
            console.log('✅ ArchivoDigital activos (isDeleted: false):', personalActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = personalActivos.map(ArchivoDigital => ({
            //IDs y referencias
            id: ArchivoDigital.digitalfileid,
            digitalfileid: ArchivoDigital.digitalfileid,
            date: ArchivoDigital.date,
            hour: ArchivoDigital.hour,
            desktop: ArchivoDigital.desktop,
            archive: ArchivoDigital.archive,
            description: ArchivoDigital.description,
            typeArchive: ArchivoDigital.typeArchive,
            medical_ScheduleId: ArchivoDigital.medical_ScheduleId,
            estado: ArchivoDigital.status ? 'activo' : 'inactivo', // String representation for display
            status: ArchivoDigital.status ? '10007' : '10008', // Convert numeric value to string for Select component
           
            // Auditoría
            createdAt: ArchivoDigital.createdAt,
            createdBy: ArchivoDigital.createdBy,
            updatedAt: ArchivoDigital.updatedAt,
            updatedBy: ArchivoDigital.updatedBy,
            isDeleted: ArchivoDigital.isDeleted
    
            }));
            //ordenamos alfabeticamente por nombre
            const sortedData = mappedData.sort((a,b) => 
            a.description.toLowerCase().localeCompare(b.description.toLowerCase())
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

getAll_Estudio: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las ArchivoDigital...');
    
            const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de ArchivoDigital recibidos:', rawData);
            console.log('✅ Número de ArchivoDigital:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const personalActivos = rawData.filter(ArchivoDigital => ArchivoDigital.isDeleted === false);
            console.log('✅ ArchivoDigital activos (isDeleted: false):', personalActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = personalActivos.map(ArchivoDigital => ({
            //IDs y referencias
            id: ArchivoDigital.digitalfileid,
            digitalfileid: ArchivoDigital.digitalfileid,
            date: ArchivoDigital.date,
            hour: ArchivoDigital.hour,
            desktop: ArchivoDigital.desktop,
            archive: ArchivoDigital.archive,
            description: ArchivoDigital.description,
            typeArchive: ArchivoDigital.typeArchive,
            medical_ScheduleId: ArchivoDigital.medical_ScheduleId,
            estado: ArchivoDigital.status ? 'activo' : 'inactivo', // String representation for display
            status: ArchivoDigital.status ? '10007' : '10008', // Convert numeric value to string for Select component
           
            // Auditoría
            createdAt: ArchivoDigital.createdAt,
            createdBy: ArchivoDigital.createdBy,
            updatedAt: ArchivoDigital.updatedAt,
            updatedBy: ArchivoDigital.updatedBy,
            isDeleted: ArchivoDigital.isDeleted
    
            }));
            //ordenamos alfabeticamente por nombre
            const sortedData = mappedData.sort((a,b) => 
            a.description.toLowerCase().localeCompare(b.description.toLowerCase())
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

  // Obtener ArchivoDigital por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del ArchivoDigital es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
          id: data.digitalfileid,
            digitalfileid: data.digitalfileid,
            date: data.date,
            hour: data.hour,
            desktop: data.desktop,
            archive: data.archive,
            description: data.description,
            typeArchive: data.typeArchive,
            medical_ScheduleId: data.medical_ScheduleId,
            estado: data.status ? 'activo' : 'inactivo', // String representation for display
            status: data.status ? '10007' : '10008', // Convert numeric value to string for Select component
           
  
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

  searchByEstudioId: async (estudioId) => {
    if (!estudioId) {
      throw new Error('ID del estudio es requerido');
    }
    try {
      //const url = `http://192.168.1.55:8090/api/ArchivoDigital/search?value1=${encodeURIComponent(estudioId)}`;
      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital/search?value1=${estudioId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      const activos = (Array.isArray(rawData) ? rawData : []).filter(item => item.isDeleted === false);
      const mappedData = activos.map(ArchivoDigital => ({
        id: ArchivoDigital.digitalfileid,
        digitalfileid: ArchivoDigital.digitalfileid,
        date: ArchivoDigital.date,
        hour: ArchivoDigital.hour,
        desktop: ArchivoDigital.desktop,
        archive: ArchivoDigital.archive,
        description: ArchivoDigital.description,
        typeArchive: ArchivoDigital.typeArchive,
        medical_ScheduleId: ArchivoDigital.medical_ScheduleId,
        estado: ArchivoDigital.status ? 'activo' : 'inactivo',
        status: ArchivoDigital.status ? '10007' : '10008',
        createdAt: ArchivoDigital.createdAt,
        createdBy: ArchivoDigital.createdBy,
        updatedAt: ArchivoDigital.updatedAt,
        updatedBy: ArchivoDigital.updatedBy,
        isDeleted: ArchivoDigital.isDeleted
      }));
      return {
        data: mappedData,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al buscar archivos por estudio:', error);
      throw error;
    }
  },

  // Crear nuevo ArchivoDigital
  create: async (archivoDigitalData) => {
    try {
      console.log('📤 Creando nuevo ArchivoDigital...');

      // Validar datos requeridos
      const requiredFields = ['archive', 'description', 'typeArchive'];
      const missingFields = requiredFields.filter(field => !archivoDigitalData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

     const formattedData = {
        //id: ArchivoDigital.digitalfileid,
        //digitalfileid: ArchivoDigital.digitalfileid,
        date: archivoDigitalData.date,
        hour: archivoDigitalData.hour,
        desktop: archivoDigitalData.desktop,
        archive: archivoDigitalData.archive,
        description: archivoDigitalData.description,
        typeArchive: archivoDigitalData.typeArchive,
        medical_ScheduleId: archivoDigitalData.medical_ScheduleId,
        estado: archivoDigitalData.status ? 'activo' : 'inactivo', // String representation for display
        status: archivoDigitalData.status ? '10007' : '10008', // Convert numeric value to string for Select component
           
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital`;
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
      console.log('✅ ArchivoDigital creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear ArchivoDigital:', error);
      throw error;
    }
  },

  create_CaptureImagenes: async (archivoDigitalData) => {
    try {
      console.log('📤 Creando nuevo ArchivoDigital...');

      // Validar datos requeridos
      const requiredFields = ['archive'];
      const missingFields = requiredFields.filter(field => !archivoDigitalData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

     const formattedData = {
        //id: ArchivoDigital.digitalfileid,
        //digitalfileid: ArchivoDigital.digitalfileid,
        date: archivoDigitalData.date,
        hour: archivoDigitalData.hour,
        desktop: '---',
        archive: archivoDigitalData.archive,
        description: archivoDigitalData.nombre,
        typeArchive: archivoDigitalData.mimeType,
        medical_ScheduleId: archivoDigitalData.estudioId,
        status: archivoDigitalData.status, // Convert numeric value to string for Select component
           
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital`;
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
      console.log('✅ ArchivoDigital creado exitosamente:', data);

      if (archivoDigitalData.estudioId) {
        try {
          await appointmentsService.update_Estado_EsudioTerminiado(archivoDigitalData.estudioId);
        } catch (e) {}
      }

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear ArchivoDigital:', error);
      throw error;
    }
  },

  // Actualizar ArchivoDigital
  update: async (id, archivoDigitalData) => {
    try {
      console.log('📝 Actualizando ArchivoDigital con ID:', id);

      if (!id) {
        throw new Error('ID del ArchivoDigital es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        digitalfileid: parseInt(id),
        date: archivoDigitalData.date,
        hour: archivoDigitalData.hour,
        desktop: archivoDigitalData.desktop,
        archive: archivoDigitalData.archive,
        description: archivoDigitalData.description,
        typeArchive: archivoDigitalData.typeArchive,
        medical_ScheduleId: archivoDigitalData.medical_ScheduleId,
        status: archivoDigitalData.status, // Convert numeric value to string for Select component
           
        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital/${id}`;
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
      console.log('✅ ArchivoDigital actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar ArchivoDigital:', error);
      throw error;
    }
  },

  // Eliminación lógica del ArchivoDigital
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando ArchivoDigital con ID:', id);

      if (!id) {
        throw new Error('ID del ArchivoDigital es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/ArchivoDigital/${id}`;
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

      console.log('✅ ArchivoDigital eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar ArchivoDigital:', error);
      throw error;
    }
  },

  

};

export default archivodigitalService;