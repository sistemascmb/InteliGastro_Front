export const macrosService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las Macros...');
    
            const url = `${process.env.REACT_APP_API_URL}/Macros`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Macros recibidos:', rawData);
            console.log('✅ Número de Macros:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const macrosActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ Macros activos (isDeleted: false):', macrosActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = macrosActivos.map(macro => ({
            //IDs y referencias
            id: macro.macrosid,
            macrosid: macro.macrosid,
            name: macro.name,
            description: macro.description,
            personalId: macro.personalId,
            macro: macro.macro,
            selectAll: macro.selectAll,

            // Auditoría
            createdAt: macro.createdAt,
            createdBy: macro.createdBy,
            updatedAt: macro.updatedAt,
            updatedBy: macro.updatedBy,
            isDeleted: macro.isDeleted
    
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

  getById: async (id = 1) => {
    try {
      console.log('🌐 Llamando a la API de Macros por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/Macros/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de Macros recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.macrosid,
        macrosid: rawData.macrosid,
        name: rawData.name,
        description: rawData.description,
        personalId: rawData.personalId,
        macro: rawData.macro,
        selectAll: rawData.selectAll,

        // Auditoría
        createdAt: rawData.createdAt,
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

    // Crear nuevo miembro del personal
  create: async (mamcroData) => {
    try {
      console.log('📤 Creando nuevo Macros...');

      // Validar datos requeridos
      const requiredFields = ['name', 'description', 'macro'];
      const missingFields = requiredFields.filter(field => !mamcroData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {        
        macrosid: mamcroData.macrosid,
        name: mamcroData.name,
        description: mamcroData.description,
        personalId: mamcroData.personalId,
        macro: mamcroData.macro,
        selectAll: mamcroData.selectAll,
     
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Macros`;
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
      console.log('✅ Macros creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Macros:', error);
      throw error;
    }
  },

  update: async (id, mamcroData) => {
    try {
      console.log('📝 Actualizando Macros con ID:', id);

      if (!id) {
        throw new Error('ID del Macros es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        macrosid: parseInt(id),
        name: mamcroData.name,
        description: mamcroData.description,
        personalId: mamcroData.personalId,
        macro: mamcroData.macro,
        selectAll: mamcroData.selectAll,

        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Macros/${id}`;
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
      console.log('✅ Macros actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Macros:', error);
      throw error;
    }
  },
    // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Macros con ID:', id);

      if (!id) {
        throw new Error('ID del Macros es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Macros/${id}`;
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

      console.log('✅ Macros eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Macros:', error);
      throw error;
    }
  },

};
    
export default macrosService;