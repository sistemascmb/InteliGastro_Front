export const plantillaService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las Plantilla...');
    
            const url = `${process.env.REACT_APP_API_URL}/Plantilla`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Plantilla recibidos:', rawData);
            console.log('✅ Número de Plantilla:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const PlantillaActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ Plantilla activos (isDeleted: false):', PlantillaActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = PlantillaActivos.map(plantilla => ({
            //IDs y referencias
            id: plantilla.templatesid,
            templatesid: plantilla.templatesid,
            name: plantilla.name,
            description: plantilla.description,
            personalId: plantilla.personalId,
            examsId: plantilla.examsId,
            allPersonalMed: plantilla.allPersonalMed,
            plantilla: plantilla.plantilla,
            status: plantilla.status,
            // Auditoría
            createdAt: plantilla.createdAt,
            createdBy: plantilla.createdBy,
            updatedAt: plantilla.updatedAt,
            updatedBy: plantilla.updatedBy,
            isDeleted: plantilla.isDeleted
    
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
      console.log('🌐 Llamando a la API de Plantilla por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/Plantilla/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de Plantilla recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.templatesid,
        templatesid: rawData.templatesid,
        name: rawData.name,
        description: rawData.description,
        personalId: rawData.personalId,
        examsId: rawData.examsId,
        allPersonalMed: rawData.allPersonalMed,
        plantilla: rawData.plantilla,
        status: rawData.status,

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
  create: async (plantillaData) => {
    try {
      console.log('📤 Creando nuevo Plantilla...');

      // Validar datos requeridos
      const requiredFields = ['name', 'description', 'plantilla'];
      const missingFields = requiredFields.filter(field => !plantillaData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {        
        name: plantillaData.name,
        description: plantillaData.description,
        personalId: plantillaData.personalId,
        examsId: plantillaData.examsId,
        allPersonalMed: plantillaData.allPersonalMed,
        plantila: plantillaData.plantilla,
        status: true,
     
        createdAt: new Date().toISOString(),
        createdBy: 'Arnold' // Usuario de prueba
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Plantilla`;
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
      console.log('✅ Plantilla creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear Plantilla:', error);
      throw error;
    }
  },

  update: async (id, plantilla) => {
    try {
      console.log('📝 Actualizando Plantilla con ID:', id);

      if (!id) {
        throw new Error('ID del Plantilla es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        templatesid: parseInt(id),
        name: plantilla.name,
        description: plantilla.description,
        personalId: plantilla.personalId,
        examsId: plantilla.examsId,
        allPersonalMed: plantilla.allPersonalMed,
        plantilla: plantilla.plantilla,
        status: plantilla.status,

        updatedAt: new Date().toISOString(),
        updatedBy: 'Arnold',
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Plantilla/${id}`;
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
      console.log('✅ Plantilla actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Plantilla:', error);
      throw error;
    }
  },
    // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Plantilla con ID:', id);

      if (!id) {
        throw new Error('ID del Plantilla es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Plantilla/${id}`;
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

      console.log('✅ Plantilla eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Plantilla:', error);
      throw error;
    }
  },

};
    
export default plantillaService;