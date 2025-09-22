// Script simple para probar la conexión con el backend
const axios = require('axios');

const testConnection = async () => {
  try {
    console.log('🔄 Probando conexión con el backend...');
    console.log('🌐 URL:', 'http://26.41.173.127:8090/api/Paciente');

    const response = await axios.get('http://26.41.173.127:8090/api/Paciente', {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Conexión exitosa!');
    console.log('📊 Status:', response.status);
    console.log('📦 Datos recibidos:', response.data?.length || 0, 'pacientes');
    console.log('🔍 Primer paciente:', JSON.stringify(response.data[0], null, 2));

  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error('- Mensaje:', error.message);
    console.error('- Código:', error.code);

    if (error.response) {
      console.error('- Status HTTP:', error.response.status);
      console.error('- Datos de error:', error.response.data);
    } else if (error.request) {
      console.error('- No se recibió respuesta del servidor');
    }
  }
};

testConnection();