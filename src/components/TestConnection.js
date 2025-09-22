import React, { useState } from 'react';
import { api } from '../utils/apiClient';
import { Button, Paper, Typography, Box, Alert } from '@mui/material';

const TestConnection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Probar conexión básica
      const response = await api.get('/health');
      setResult({
        success: true,
        message: 'Conexión exitosa',
        data: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        details: error.response?.data || 'No hay respuesta del servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const testPatients = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await api.get('/patients?limit=1');
      setResult({
        success: true,
        message: 'API de pacientes funcional',
        data: response
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        details: error.response?.data || 'Error en API de pacientes'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test de Conexión con Backend
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          URL del servidor: {process.env.REACT_APP_API_URL || 'No configurada'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={testConnection}
          disabled={loading}
        >
          Test Conexión General
        </Button>

        <Button
          variant="outlined"
          onClick={testPatients}
          disabled={loading}
        >
          Test API Pacientes
        </Button>
      </Box>

      {loading && (
        <Alert severity="info">Probando conexión...</Alert>
      )}

      {result && (
        <Alert
          severity={result.success ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          <Typography variant="subtitle2">
            {result.message}
          </Typography>
          <Typography variant="body2" component="pre">
            {JSON.stringify(result.data || result.details, null, 2)}
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default TestConnection;