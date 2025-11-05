import { api } from '../utils/apiClient';
import { API_ENDPOINTS } from '../constants/api';
export const estudiosService = {

    getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos los Estudios...');
    
            const url = `${process.env.REACT_APP_API_URL}/Estudios`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Estudios recibidos:', rawData);
            console.log('✅ Número de Estudios:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const personalActivos = rawData.filter(estudios => estudios.isDeleted === false);
            console.log('✅ Estudios activos (isDeleted: false):', personalActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = personalActivos.map(estudios => ({
            //IDs y referencias
            id: estudios.studiesid,
            studiesid: estudios.studiesid,
            name: estudios.name,

            abbreviation: estudios.abbreviation,
            description: estudios.description,
            operatingHours: estudios.operatingHours,

            estado: estudios.status ? 'activo' : 'inactivo', // String representation for display
            status: estudios.status ? '10007' : '10008', // Convert numeric value to string for Select component
            informedConsent: estudios.informedConsent,
            centroId: estudios.centroId,
            price: estudios.price,
    
            // Auditoría
            createdAt: estudios.createdAt,
            createdBy: estudios.createdBy,
            updatedAt: estudios.updatedAt,
            updatedBy: estudios.updatedBy,
            isDeleted: estudios.isDeleted
    
            }));
            //ordenamos alfabeticamente por nombre
            const sortedData = mappedData.sort((a,b) => 
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
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

    // Obtener paciente por ID
  getById: async (id) => {
    if (!id) {
      throw new Error('ID del Estudios es requerido');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/Estudios/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        data: {
            id: data.studiesid,
            studiesid: data.studiesid,
            name: data.name,

            abbreviation: data.abbreviation,
            description: data.description,
            operatingHours: data.operatingHours,

            estado: data.status ? 'activo' : 'inactivo', // String representation for display
            status: data.status ? '10007' : '10008', // Convert numeric value to string for Select component
            informedConsent: data.informedConsent,
            centroId: data.centroId,
            price: data.price,
    
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
      console.error('❌ Error al obtener Estudios por ID:', error);
      throw error;
    }
  },

    // Crear nuevo miembro del personal
  create: async (estudioData) => {
    try {
      console.log('📤 Creando nuevo centro...');

      // Validar datos requeridos
      const requiredFields = ['name', 'abbreviation', 'description'];
      const missingFields = requiredFields.filter(field => !estudioData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        name: estudioData.name,
        abbreviation: estudioData.abbreviation,
        description: estudioData.description,
        operatingHours: estudioData.operatingHours,
        status: estudioData.status, // Convert numeric ID to boolean
        informedConsent: estudioData.informedConsent, // Convert numeric ID to boolean
        centroId: estudioData.centroId,
        price: estudioData.price,
        
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Estudios`;
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
      console.log('✅ Estudios creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Estudios:', error);
      throw error;
    }
  },

  update: async (id, estudioData) => {
    try {
      console.log('📝 Actualizando Estudios con ID:', id);

      if (!id) {
        throw new Error('ID del Estudios es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        studiesid: parseInt(id),
        name: estudioData.name,
        abbreviation: estudioData.abbreviation,
        description: estudioData.description,
        operatingHours: estudioData.operatingHours,
        status: estudioData.status, // Convert numeric ID to boolean
        informedConsent: estudioData.informedConsent, // Convert numeric ID to boolean
        centroId: estudioData.centroId,
        price: estudioData.price,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Estudios/${id}`;
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
      console.log('✅ Estudios actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Estudios:', error);
      throw error;
    }
  },
  // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Estudio con ID:', id);

      if (!id) {
        throw new Error('ID del Estudio es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Estudios/${id}`;
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

      console.log('✅ Estudio eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Estudio:', error);
      throw error;
    }
  },

};

    

export default estudiosService;