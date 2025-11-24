export const suministrosService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las Suministros...');
    
            const url = `${process.env.REACT_APP_API_URL}/Suministros`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de Suministros recibidos:', rawData);
            console.log('✅ Número de Suministros:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const systemUserActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ Suministros activos (isDeleted: false):', systemUserActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = systemUserActivos.map(suministros => ({
            //IDs y referencias
            id: suministros.provisionid,
            provisionid: suministros.provisionid,
            name: suministros.name,
            quantity: suministros.quantity,
            comments: suministros.comments,
            price: suministros.price,
            status: suministros.status ? 'activo' : 'inactivo', // String representation for display
            estado: suministros.status ? '10007' : '10008', // Convert numeric value to string for Select component


            // Auditoría
            createdAt: suministros.createdAt,
            createdBy: suministros.createdBy,
            updatedAt: suministros.updatedAt,
            updatedBy: suministros.updatedBy,
            isDeleted: suministros.isDeleted
    
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
      console.log('🌐 Llamando a la API de Suministros por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/Suministros/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de Suministros recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.provisionid,
        provisionid: rawData.provisionid,
        name: rawData.name,
        quantity: rawData.quantity,
        comments: rawData.comments,
        price: rawData.price,

        status: rawData.status ? 'activo' : 'inactivo', // String representation for display
        estado: rawData.status ? '10007' : '10008', // Convert numeric value to string for Select component

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
  create: async (suministroData) => {
    try {
      console.log('📤 Creando nuevo Suministros...');

      // Validar datos requeridos
      const requiredFields = ['name', 'quantity', 'price'];
      const missingFields = requiredFields.filter(field => !suministroData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        name: suministroData.name,
        quantity: suministroData.quantity,
        comments: suministroData.comments,
        price: suministroData.price,
        status: suministroData.status,
     
        createdAt: new Date().toISOString(),
        createdBy: (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })()
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Suministros`;
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
      console.log('✅ SystemUser creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear SystemUser:', error);
      throw error;
    }
  },

  update: async (id, suministroData) => {
    try {
      console.log('📝 Actualizando Suministros con ID:', id);

      if (!id) {
        throw new Error('ID del Suministros es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const formattedData = {
        provisionid: parseInt(id),
        name: suministroData.name,
        quantity: suministroData.quantity,
        comments: suministroData.comments,
        price: suministroData.price,
        status: suministroData.status,
        updatedAt: new Date().toISOString(),
        updatedBy: (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })(),
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/Suministros/${id}`;
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
      console.log('✅ Suministros actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar Suministro:', error);
      throw error;
    }
  },
    // Eliminar miembro del estudio
  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando Suministro con ID:', id);

      if (!id) {
        throw new Error('ID del Suministro es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/Suministros/${id}`;
      console.log('🔗 URL de eliminación:', url);

      // Enviar la solicitud DELETE con el campo eliminadoPor como un query parameter
      const eliminador = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'ADMIN'; } catch { return 'ADMIN'; } })();
      const urlWithParams = `${url}?eliminadoPor=${encodeURIComponent(eliminador)}`;
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

      console.log('✅ Suministro eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar Suministro:', error);
      throw error;
    }
  },

};
    
export default suministrosService;