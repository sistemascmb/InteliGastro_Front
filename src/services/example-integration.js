// EJEMPLO DE INTEGRACIÓN - Cómo usar la estructura de APIs
// Este archivo muestra cómo migrar del estado local hardcodeado a servicios reales

import React, { useState, useEffect, useCallback } from 'react';
import { patientsService } from './index';

// ============================================================================
// ANTES: Usando estado local hardcodeado (como está actualmente)
// ============================================================================

const PacientesOriginal = () => {
  // Estado local con datos hardcodeados
  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      nombres: 'Juan Carlos',
      apellidos: 'Pérez Gómez',
      documento: '71717171',
      // ... más datos hardcodeados
    }
  ]);

  const handleCreatePaciente = (formData) => {
    const newPaciente = {
      id: Math.max(...pacientes.map(c => c.id)) + 1,
      ...formData
    };
    setPacientes(prev => [...prev, newPaciente]);
  };

  // ... resto del componente original
};

// ============================================================================
// DESPUÉS: Usando servicios API (implementación sugerida)
// ============================================================================

const PacientesConAPI = () => {
  // Estados para datos de la API
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario (mantener igual)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    // ... resto de campos
  });

  // Estados de UI (mantener igual)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ========================================================================
  // FUNCIONES DE API - Reemplazan las funciones locales
  // ========================================================================

  // Cargar pacientes al iniciar el componente
  const loadPacientes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await patientsService.getAll({
        page: 1,
        limit: 100, // Cargar todos para mantener funcionalidad actual
        search: searchTerm,
        status: 'active',
        ...params
      });

      setPacientes(response.data || []);
    } catch (err) {
      setError(err.message || 'Error cargando pacientes');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Efecto para cargar datos inicial
  useEffect(() => {
    loadPacientes();
  }, [loadPacientes]);

  // Efecto para búsqueda en tiempo real (debounced)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        loadPacientes({ search: searchTerm });
      } else {
        loadPacientes();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, loadPacientes]);

  // Crear paciente - Reemplaza handleCreatePaciente
  const handleCreatePaciente = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validación local (mantener la existente)
      if (!validateForm()) {
        return;
      }

      // Llamada a la API en lugar de estado local
      const response = await patientsService.create(formData);

      // Actualizar lista local con el nuevo paciente
      setPacientes(prev => [...prev, response.data]);

      // Limpiar formulario y cerrar modal
      clearForm();
      setActiveTab(1); // Cambiar a tab de lista

      // Mostrar mensaje de éxito (opcional)
      console.log('Paciente creado exitosamente:', response.data);

    } catch (err) {
      setError(err.message || 'Error creando paciente');
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  // Editar paciente - Reemplaza handleEditPaciente
  const handleEditPaciente = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!validateForm()) {
        return;
      }

      // Llamada a la API
      const response = await patientsService.update(selectedPaciente.id, formData);

      // Actualizar lista local
      setPacientes(prev => prev.map(p =>
        p.id === selectedPaciente.id ? response.data : p
      ));

      // Cerrar modal
      handleCloseEditModal();

      console.log('Paciente actualizado exitosamente:', response.data);

    } catch (err) {
      setError(err.message || 'Error actualizando paciente');
      console.error('Error updating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar paciente - Reemplaza handleDeletePaciente
  const handleDeletePaciente = async () => {
    try {
      setLoading(true);

      // Llamada a la API
      await patientsService.delete(selectedPaciente.id);

      // Actualizar lista local
      setPacientes(prev => prev.filter(p => p.id !== selectedPaciente.id));

      // Cerrar modal
      handleCloseDeleteConfirm();

      console.log('Paciente eliminado exitosamente');

    } catch (err) {
      setError(err.message || 'Error eliminando paciente');
      console.error('Error deleting patient:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado del paciente (nueva funcionalidad)
  const handleChangeStatus = async (pacienteId, newStatus) => {
    try {
      setLoading(true);

      await patientsService.changeStatus(pacienteId, newStatus);

      // Actualizar lista local
      setPacientes(prev => prev.map(p =>
        p.id === pacienteId ? { ...p, status: newStatus } : p
      ));

      console.log(`Estado del paciente cambiado a: ${newStatus}`);

    } catch (err) {
      setError(err.message || 'Error cambiando estado');
      console.error('Error changing status:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // FUNCIONES DE UTILIDAD - Mantener iguales o mejorar
  // ========================================================================

  const validateForm = () => {
    // Mantener la validación existente
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    }

    // ... resto de validaciones

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    // Mantener igual
    setFormData({
      nombres: '',
      apellidos: '',
      documento: '',
      // ... resto de campos
    });
    setErrors({});
  };

  // Filtrado de pacientes - Ahora se hace en la API, pero mantener como fallback
  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.documento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========================================================================
  // RENDERIZADO - Agregar indicadores de loading y error
  // ========================================================================

  // Mostrar error si existe
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error cargando datos</h3>
        <p>{error}</p>
        <button onClick={() => loadPacientes()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Indicador de carga global */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          zIndex: 9999
        }}>
          Cargando...
        </div>
      )}

      {/* Resto del componente igual, pero usando las nuevas funciones */}
      {/* ... JSX del componente original ... */}

      {/* En la tabla, agregar botón de cambio de estado */}
      <button
        onClick={() => handleChangeStatus(paciente.id,
          paciente.status === 'active' ? 'inactive' : 'active'
        )}
      >
        {paciente.status === 'active' ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  );
};

// ============================================================================
// HOOK PERSONALIZADO PARA PACIENTES (Opción avanzada)
// ============================================================================

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPacientes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientsService.getAll(params);
      setPacientes(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaciente = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await patientsService.create(data);
      setPacientes(prev => [...prev, response.data]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaciente = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const response = await patientsService.update(id, data);
      setPacientes(prev => prev.map(p => p.id === id ? response.data : p));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePaciente = useCallback(async (id) => {
    try {
      setLoading(true);
      await patientsService.delete(id);
      setPacientes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pacientes,
    loading,
    error,
    loadPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente
  };
};

// ============================================================================
// USO DEL HOOK PERSONALIZADO
// ============================================================================

const PacientesConHook = () => {
  const {
    pacientes,
    loading,
    error,
    loadPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente
  } = usePacientes();

  useEffect(() => {
    loadPacientes();
  }, [loadPacientes]);

  const handleCreate = async (formData) => {
    try {
      await createPaciente(formData);
      // Mostrar mensaje de éxito
    } catch (error) {
      // Mostrar mensaje de error
    }
  };

  // Componente más limpio y fácil de mantener
  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {/* Resto del componente */}
    </div>
  );
};

export {
  PacientesOriginal,
  PacientesConAPI,
  PacientesConHook
};