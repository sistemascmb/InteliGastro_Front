export const usuariosService = {
  login: async ({ usuario, contraseña }) => {
    if (!usuario || !contraseña) {
      const e = new Error('Ingrese usuario y contraseña');
      e.statusCode = 400;
      e.details = 'Campos requeridos faltantes';
      throw e;
    }
    const url = `http://192.168.1.55:8090/api/SystemUsers/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contraseña })
      });
      if (!response.ok) {
        let errorBody = null;
        try { errorBody = await response.json(); } catch {}
        const e = new Error(errorBody?.message || 'Acceso no autorizado');
        e.statusCode = errorBody?.statusCode || response.status;
        e.details = errorBody?.details || 'Credenciales inválidas.';
        throw e;
      }
      const data = await response.json();
      const user = {
        userid: data.userid,
        usuario: data.usuario,
        profiletypeid: data.profiletypeid,
        profile_name: data.profile_name
      };
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', 'system-user');
      } catch {}
      return { data: user, status: 'success' };
    } catch (error) {
      throw error;
    }
  },
      getAll: async (params = {}) => {
        try {
            console.log('🌐 Obteniendo todos las SystemUsers...');
    
            const url = `${process.env.REACT_APP_API_URL}/SystemUsers`;
            console.log('🔗 URL:', url);
    
            const response = await fetch(url);
    
            if(!response.ok){
            throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            const rawData = await response.json();
            console.log('✅ Datos de SystemUsers recibidos:', rawData);
            console.log('✅ Número de SystemUsers:', rawData.length);
    
            //Filtrar solo recusros no eliminados (isDeletd : false)
            const systemUserActivos = rawData.filter(salas => salas.isDeleted === false);
            console.log('✅ SystemUsers activos (isDeleted: false):', systemUserActivos.length);
    
            //Mapeamos los campos del backend a los campos dell frontend
            const mappedData = systemUserActivos.map(usuario => ({
            //IDs y referencias
            id: usuario.userid,
            userid: usuario.userid,
            usuario: usuario.usuario,
            contraseña: usuario.contraseña,
            contraseñaC: usuario.contraseñaC,
            status: usuario.estado ? 'activo' : 'inactivo', // String representation for display
            estado: usuario.estado ? '10007' : '10008', // Convert numeric value to string for Select component
            profiletypeid: usuario.profiletypeid,
            personalid: usuario.personalid,

            // Auditoría
            createdAt: usuario.createdAt,
            createdBy: usuario.createdBy,
            updatedAt: usuario.updatedAt,
            updatedBy: usuario.updatedBy,
            isDeleted: usuario.isDeleted
    
            }));
            //ordenamos alfabeticamente por nombre
            const sortedData = mappedData.sort((a,b) => 
            a.usuario.toLowerCase().localeCompare(b.usuario.toLowerCase())
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
      console.log('🌐 Llamando a la API de SystemUsers por ID...', id);

      const url = `${process.env.REACT_APP_API_URL}/SystemUsers/${id}`;
      console.log('🔗 URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      console.log('✅ Datos de SystemUsers recibidos:', rawData);

      // Mapear los campos del backend a los campos del frontend
      const mappedData = {
        // IDs y referencias
        id: rawData.userid,
        userid: rawData.userid,
        profiletypeid: rawData.profiletypeid,
        personalid: rawData.personalid,
        usuario: rawData.usuario,
        contraseña: rawData.contraseña,
        contraseñaC: rawData.contraseñaC,
        estado: rawData.estado ? 'activo' : 'inactivo', // String representation for display
        status: rawData.estado ? '10007' : '10008', // Convert numeric value to string for Select component
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
  create: async (userData) => {
    try {
      console.log('📤 Creando nuevo SystemUsers...');

      // Validar datos requeridos
      const requiredFields = ['usuario', 'contraseña', 'contraseñaC'];
      const missingFields = requiredFields.filter(field => !userData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      }

      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        profiletypeid: userData.profiletypeid,
        personalid: userData.personalid,
        usuario: userData.usuario,
        contraseña: userData.contraseña,
        contraseñaC: userData.contraseñaC, 
        estado: userData.estado,
     
        createdAt: new Date().toISOString(),
        createdBy: actor
      };

      console.log('📊 Datos a enviar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/SystemUsers`;
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

  update: async (id, userData) => {
    try {
      console.log('📝 Actualizando SystemUsers con ID:', id);

      if (!id) {
        throw new Error('ID del SystemUsers es requerido');
      }

      // Formatear datos según el formato esperado por la API
      const actor = (() => { try { const u = JSON.parse(localStorage.getItem('currentUser')||'null'); return u?.usuario || 'USUARIO'; } catch { return 'USUARIO'; } })();
      const formattedData = {
        userid: parseInt(id),
        profiletypeid: userData.profiletypeid,
        personalid: userData.personalid,
        usuario: userData.usuario,
        contraseña: userData.contraseña,
        contraseñaC: userData.contraseñaC, 
        estado: userData.estado,
        updatedAt: new Date().toISOString(),
        updatedBy: actor,
        isDeleted: false
        
      };

      console.log('📊 Datos a enviar para actualizar:', formattedData);

      const url = `${process.env.REACT_APP_API_URL}/SystemUsers/${id}`;
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
      console.log('🗑️ Eliminando SystemUser con ID:', id);

      if (!id) {
        throw new Error('ID del SystemUser es requerido');
      }

      const url = `${process.env.REACT_APP_API_URL}/SystemUsers/${id}`;
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

      console.log('✅ SystemUser eliminado exitosamente');

      return {
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error al eliminar SystemUser:', error);
      throw error;
    }
  },

};
    
export default usuariosService;