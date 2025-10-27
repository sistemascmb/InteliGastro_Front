export const salasService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las Salas...');
    
            const url = `${process.env.REACT_APP_API_URL}/Salas`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Salas recibidos:', rawData);
            console.log('✅ Número de Salas:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const personalActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ Salas activos (isDeleted: false):', personalActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = personalActivos.map(salas => ({
            //IDs y referencias
            id: salas.procedureroomid,
            procedureroomid: salas.procedureroomid,
            name: salas.name,
            description: salas.description,
            estado: salas.status ? 'activo' : 'inactivo', // String representation for display
            status: salas.status ? '10007' : '10008', // Convert numeric value to string for Select component
            type: salas.type,
            centroId: salas.centroId,

            // Auditoría
            createdAt: salas.createdAt,
            createdBy: salas.createdBy,
            updatedAt: salas.updatedAt,
            updatedBy: salas.updatedBy,
            isDeleted: salas.isDeleted
    
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

    // Crear nuevo miembro del personal
  create: async (salaData) => {
    try {
      console.log('📤 Creando nueva Sala...');

      // Validar datos requeridos
      const requiredFields = ['name', 'description'];
      const missingFields = requiredFields.filter(field => !salaData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        name: salaData.name,
        description: salaData.description,
        status: salaData.status, 
        type: salaData.type,
        centroId: salaData.centroId,
     
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Salas`;
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
      console.log('✅ Sala creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Sala:', error);
      throw error;
    }
  },

  update: async (id, salaData) => {
    try {
      console.log('📝 Actualizando Sala con ID:', id);

      if (!id) {
        throw new Error('ID del Sala es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        procedureroomid: parseInt(id),
        name: salaData.name,
        description: salaData.description,
        status: salaData.status, 
        type: salaData.type,
        centroId: salaData.centroId,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Salas/${id}`;
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
      console.log('✅ Sala actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Sala:', error);
      throw error;
    }
  },
    // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Salas con ID:', id);

      if (!id) {
        throw new Error('ID del Salas es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Salas/${id}`;
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

      console.log('✅ Sala eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Sala:', error);
      throw error;
    }
  },

};
    
export default salasService;