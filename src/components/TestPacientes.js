import React, { useState } from 'react';
import { Button, Box, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { patientsService } from '../services/patientsService';

const TestPacientes = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testGetPacientes = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      console.log('🔄 Probando GET /Paciente...');
      console.log('🌐 URL configurada:', process.env.REACT_APP_API_URL);

      const response = await patientsService.getAll();
      console.log('✅ Respuesta completa:', response);

      setResult({
        status: 'success',
        data: response.data,
        message: `Se obtuvieron ${response.data?.length || 0} pacientes`
      });

    } catch (error) {
      console.error('❌ Error en test:', error);
      setError(`Error: ${error.message}`);
      setResult({
        status: 'error',
        error: error.message,
        details: error.response?.data || 'Sin detalles adicionales'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreatePaciente = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);

      const datosPrueba = {
        firstName: 'Test',
        lastName: 'Prueba',
        documentType: 'DNI',
        documentNumber: '12345678',
        birthDate: '1990-01-01',
        gender: 'masculino',
        status: 'active'
      };

      console.log('🔄 Probando POST /patients...');
      const response = await patientsService.create(datosPrueba);
      console.log('✅ Paciente creado:', response);

      setResult({
        status: 'success',
        data: response.data,
        message: 'Paciente creado exitosamente'
      });

    } catch (error) {
      console.error('❌ Error en test:', error);
      setError(`Error: ${error.message}`);
      setResult({
        status: 'error',
        error: error.message,
        details: error.response?.data || 'Sin detalles adicionales'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test de Conexión - Pacientes
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={testGetPacientes}
          disabled={loading}
        >
          Test GET Pacientes
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={testCreatePaciente}
          disabled={loading}
        >
          Test POST Paciente
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Resultado del Test
            </Typography>

            <Typography variant="body2" component="pre" sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(result, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TestPacientes;