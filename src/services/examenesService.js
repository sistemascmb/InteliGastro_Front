export const examenesService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las Examenes...');
    
            const url = `${process.env.REACT_APP_API_URL}/Examenes`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Examenes recibidos:', rawData);
            console.log('✅ Número de Examenes:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const personalActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ Examenes activos (isDeleted: false):', personalActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = personalActivos.map(examenes => ({
            //IDs y referencias
            id: examenes.examsid,
            procedureroomid: examenes.examsid,
            description: examenes.description,
            abbreviation: examenes.abbreviation,
            estado: examenes.status ? 'activo' : 'inactivo', // String representation for display
            status: examenes.status ? '10007' : '10008', // Convert numeric value to string for Select component
            type: examenes.type,

            // Auditoría
            createdAt: examenes.createdAt,
            createdBy: examenes.createdBy,
            updatedAt: examenes.updatedAt,
            updatedBy: examenes.updatedBy,
            isDeleted: examenes.isDeleted
    
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

  getById: async (id = 1) => {
    try {
      console.log('🌐 Llamando a la API de Examen por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/Examenes/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de Examen recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.examsid,
        examsid: rawData.examsid,
        description: rawData.description,
        abbreviation: rawData.abbreviation,
        status: rawData.status,
        type: rawData.type,

        // Auditoría
        createdAt: rawData.createdAt,
        createdBy: rawData.createdBy,
        updatedAt: rawData.updatedAt,
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

    // Crear nuevo miembro del personal
  create: async (examenData) => {
    try {
      console.log('📤 Creando nueva Examen...');

      // Validar datos requeridos
      const requiredFields = ['description', 'abbreviation'];
      const missingFields = requiredFields.filter(field => !examenData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        description: examenData.description,
        abbreviation: examenData.abbreviation,
        status: examenData.status, 
        type: examenData.type,
     
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Examenes`;
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
      console.log('✅ Examen creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Examen:', error);
      throw error;
    }
  },

  update: async (id, examenData) => {
    try {
      console.log('📝 Actualizando Examen con ID:', id);
      console.log('📊 Datos recibidos:', examenData);

      if (!id) {
        throw new Error('ID del Examen es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        examsid: parseInt(id),
        description: examenData.description,
        abbreviation: examenData.abbreviation,
        status: examenData.status, 
        type: examenData.type,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Examenes/${id}`;
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
      console.log('✅ Examen actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Examen:', error);
      throw error;
    }
  },
    // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Examen con ID:', id);

      if (!id) {
        throw new Error('ID del Examen es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Examenes/${id}`;
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

      console.log('✅ Examen eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Examen:', error);
      throw error;
    }
  },

};
    
export default examenesService;