export const medicosRefService = {
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las MedicoReferencia...');
    
            const url = `${process.env.REACT_APP_API_URL}/MedicoReferencia`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de MedicoReferencia recibidos:', rawData);
            console.log('✅ Número de MedicoReferencia:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const medicoReferenciaActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ MedicoReferencia activos (isDeleted: false):', medicoReferenciaActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = medicoReferenciaActivos.map(medicoRef => ({
            //IDs y referencias
            id: medicoRef.referraldoctorsd,
            referraldoctorsd: medicoRef.referraldoctorsd,
            names: medicoRef.names,
            surnames: medicoRef.surnames,
            gender: medicoRef.gender,
            date_of_birth: medicoRef.date_of_birth,
            profession: medicoRef.profession,
            status: medicoRef.status ? 'activo' : 'inactivo', // String representation for display
            estado: medicoRef.status ? '10006' : '10007', // Convert numeric value to string for Select component
            phoneNumber: medicoRef.phoneNumber,

            // Auditoría
            createdAt: medicoRef.createdAt,
            createdBy: medicoRef.createdBy,
            updatedAt: medicoRef.updatedAt,
            updatedBy: medicoRef.updatedBy,
            isDeleted: medicoRef.isDeleted
    
            }));
            //ordenamos alfabeticamente por nombre y apellido
            const sortedData = mappedData.sort((a,b) => {
              const fullNameA = `${a.names} ${a.surnames}`.toLowerCase();
              const fullNameB = `${b.names} ${b.surnames}`.toLowerCase();
              return fullNameA.localeCompare(fullNameB);
            });
    
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
      console.log('🌐 Llamando a la API de MedicoReferencia por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/MedicoReferencia/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de MedicoReferencia recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.referraldoctorsd,
        referraldoctorsd: rawData.referraldoctorsd,
        names: rawData.names,
        surnames: rawData.surnames,
        gender: rawData.gender,
        date_of_birth: rawData.date_of_birth,
        profession: rawData.profession,
        status: rawData.status ? 'activo' : 'inactivo', // String representation for display
        estado: rawData.status ? '10006' : '10007', // Convert numeric value to string for Select component
        phoneNumber: rawData.phoneNumber,
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

    // Crear nuevo miembro del MedicoReferencia
  create: async (medicoRefData) => {
    try {
      console.log('📤 Creando nuevo MedicoReferencia...');

      // Validar datos requeridos
      const requiredFields = ['names', 'surnames', 'gender'];
      const missingFields = requiredFields.filter(field => !medicoRefData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        names: medicoRefData.names,
        surnames: medicoRefData.surnames,
        gender: medicoRefData.gender,
        date_of_birth: medicoRefData.date_of_birth,
        profession: medicoRefData.profession,
        status: medicoRefData.status,
        phoneNumber: medicoRefData.phoneNumber,
     
        createdAt: new Date().toISOString(),
        createdBy: actor
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/MedicoReferencia`;
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
      console.log('✅ MedicoReferencia creado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al crear MedicoReferencia:', error);
      throw error;
    }
  },

  update: async (id, medicoRefData) => {
    try {
      console.log('📝 Actualizando MedicoReferencia con ID:', id);

      if (!id) {
        throw new Error('ID del MedicoReferencia es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        referraldoctorsd: parseInt(id),
        names: medicoRefData.names,
        surnames: medicoRefData.surnames,
        gender: medicoRefData.gender,
        date_of_birth: medicoRefData.date_of_birth,
        profession: medicoRefData.profession,
        status: medicoRefData.status,
        phoneNumber: medicoRefData.phoneNumber,
        updatedAt: new Date().toISOString(),
        updatedBy: actor
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/MedicoReferencia/${id}`;
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
      console.log('✅ MedicoReferencia actualizado exitosamente:', data);

      return {
        data: data,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al actualizar MedicoReferencia:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log('🗑️ Eliminando MedicoReferencia con ID:', id);

      if (!id) {
        throw new Error('ID del MedicoReferencia es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/MedicoReferencia/${id}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return {
        status: 'success',
        message: 'MedicoReferencia eliminado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error al eliminar MedicoReferencia:', error);
      throw error;
    }
  }
};
    
export default medicosRefService;