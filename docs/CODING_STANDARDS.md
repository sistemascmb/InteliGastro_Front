# 📝 Estándares de Código - InteliGastro Frontend

## 🎯 Principios Generales

### 1. **Legibilidad sobre Inteligencia**
- Código claro y expresivo
- Nombres descriptivos de variables y funciones
- Comentarios cuando sea necesario explicar el "por qué", no el "qué"

### 2. **Consistencia**
- Seguir convenciones establecidas
- Usar las mismas patrones en todo el proyecto
- Configuración de ESLint y Prettier

### 3. **Simplicidad**
- Evitar sobre-ingeniería
- Preferir soluciones simples y directas
- YAGNI (You Aren't Gonna Need It)

## 📁 Nomenclatura

### Archivos y Carpetas
```javascript
// ✅ Correcto
PatientForm.js          // Componentes: PascalCase
usePatients.js          // Hooks: camelCase con prefijo 'use'
patients-api.js         // Servicios: kebab-case
date-utils.js           // Utilidades: kebab-case
PatientsPage.js         // Páginas: PascalCase + 'Page'

// ❌ Incorrecto
patientform.js
UsePatients.js
patientsAPI.js
DateUtils.js
```

### Variables y Funciones
```javascript
// ✅ Correcto
const patientData = {};
const isUserAuthenticated = true;
const fetchPatientById = (id) => {};

// Constantes
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Incorrecto
const patientdata = {};
const isauthenticated = true;
const GetPatient = () => {};
```

### Componentes React
```javascript
// ✅ Correcto
const PatientForm = ({ patient, onSubmit }) => {
  // ...
};

// Props descriptivas
const PatientCard = ({
  patient,
  showActions = true,
  onEdit,
  onDelete
}) => {
  // ...
};

// ❌ Incorrecto
const patientForm = ({ data, fn }) => {
  // ...
};
```

## ⚛️ React y JSX

### Estructura de Componentes
```javascript
// ✅ Estructura recomendada
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { usePatients } from '@/features/patients';
import './PatientForm.css';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  // 1. Hooks de estado
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // 2. Hooks personalizados
  const { createPatient, updatePatient, loading } = usePatients();

  // 3. Effects
  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  // 4. Handlers
  const handleSubmit = async (event) => {
    event.preventDefault();
    // lógica del submit
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 5. Render helpers (si son necesarios)
  const renderFormField = (fieldName, label) => (
    <TextField
      name={fieldName}
      label={label}
      value={formData[fieldName] || ''}
      onChange={handleChange}
      error={!!errors[fieldName]}
      helperText={errors[fieldName]}
    />
  );

  // 6. Render principal
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
};

export default PatientForm;
```

### JSX y Formato
```javascript
// ✅ Correcto - Múltiples props en líneas separadas
<TextField
  name="firstName"
  label="Nombre"
  value={formData.firstName}
  onChange={handleChange}
  error={!!errors.firstName}
  helperText={errors.firstName}
  fullWidth
  required
/>

// ✅ Correcto - Props simples en una línea
<Button variant="contained" color="primary">
  Guardar
</Button>

// ✅ Correcto - Conditional rendering
{isLoading && <LoadingSpinner />}
{error && (
  <Alert severity="error">
    {error.message}
  </Alert>
)}

// ❌ Incorrecto - Props mezcladas sin orden
<TextField name="firstName" error={!!errors.firstName} label="Nombre" onChange={handleChange} value={formData.firstName} />
```

### Hooks Personalizados
```javascript
// ✅ Correcto
const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients
  };
};
```

## 🔧 JavaScript/ES6+

### Destructuring
```javascript
// ✅ Correcto
const { firstName, lastName, email } = patient;
const [patients, setPatients] = useState([]);

// Destructuring con renombrado
const { data: patientData, loading: isLoading } = useApi('/patients');

// ❌ Incorrecto
const firstName = patient.firstName;
const lastName = patient.lastName;
const email = patient.email;
```

### Arrow Functions vs Function Declarations
```javascript
// ✅ Correcto para callbacks y funciones pequeñas
const handleClick = () => setVisible(true);
const formatDate = (date) => format(date, 'DD/MM/YYYY');

// ✅ Correcto para funciones más complejas
function validatePatientData(data) {
  // lógica de validación compleja
  return result;
}

// ✅ Correcto para métodos de clase
class PatientService {
  async createPatient(data) {
    // implementación
  }
}
```

### Async/Await vs Promises
```javascript
// ✅ Preferir async/await
const fetchPatient = async (id) => {
  try {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

// ❌ Evitar promise chains innecesarios
const fetchPatient = (id) => {
  return api.get(`/patients/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};
```

### Template Literals
```javascript
// ✅ Correcto
const message = `Paciente ${patient.firstName} ${patient.lastName} creado exitosamente`;
const apiUrl = `${BASE_URL}/patients/${patientId}`;

// ❌ Incorrecto
const message = 'Paciente ' + patient.firstName + ' ' + patient.lastName + ' creado exitosamente';
```

## 🎨 Estilos y CSS-in-JS

### Material-UI Styling
```javascript
// ✅ Correcto - usando sx prop
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
  }}
>
  {/* contenido */}
</Box>

// ✅ Correcto - styled components para reutilización
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));
```

## 🧪 Testing

### Nombres de Tests
```javascript
// ✅ Correcto
describe('PatientForm', () => {
  test('should render patient form fields correctly', () => {
    // test implementation
  });

  test('should validate required fields on submit', () => {
    // test implementation
  });

  test('should call onSubmit with form data when valid', () => {
    // test implementation
  });
});

// ❌ Incorrecto
describe('PatientForm', () => {
  test('test1', () => {
    // test implementation
  });

  test('form works', () => {
    // test implementation
  });
});
```

### Test Structure
```javascript
// ✅ Correcto - Arrange, Act, Assert
test('should update patient when form is submitted', async () => {
  // Arrange
  const mockPatient = { id: 1, firstName: 'Juan', lastName: 'Pérez' };
  const mockOnSubmit = jest.fn();

  render(<PatientForm patient={mockPatient} onSubmit={mockOnSubmit} />);

  // Act
  fireEvent.change(screen.getByLabelText('Nombre'), {
    target: { value: 'Carlos' }
  });
  fireEvent.click(screen.getByText('Guardar'));

  // Assert
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...mockPatient,
      firstName: 'Carlos'
    });
  });
});
```

## 📝 Comentarios y Documentación

### JSDoc para Funciones Complejas
```javascript
/**
 * Valida los datos del paciente según las reglas de negocio
 * @param {Object} patientData - Datos del paciente a validar
 * @param {string} patientData.firstName - Nombre del paciente
 * @param {string} patientData.lastName - Apellido del paciente
 * @param {string} patientData.email - Email del paciente
 * @returns {Object} Objeto con errores de validación o vacío si es válido
 */
function validatePatient(patientData) {
  // implementación
}
```

### Comentarios en Código
```javascript
// ✅ Correcto - explicar el "por qué"
// Necesitamos debounce para evitar llamadas excesivas a la API
const debouncedSearch = useMemo(
  () => debounce(searchPatients, 300),
  []
);

// ✅ Correcto - explicar lógica compleja
// Calculamos la edad considerando el año bisiesto y la zona horaria
const calculateAge = (birthDate) => {
  // implementación compleja
};

// ❌ Incorrecto - explicar el "qué" obvio
// Establece el nombre del paciente
setPatientName(name);
```

## 🚨 Manejo de Errores

### Try-Catch y Error Boundaries
```javascript
// ✅ Correcto - manejo específico de errores
const createPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    showNotification('Paciente creado exitosamente', 'success');
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      showNotification('El paciente ya existe', 'warning');
    } else {
      showNotification('Error al crear paciente', 'error');
      console.error('Create patient error:', error);
    }
    throw error;
  }
};

// ✅ Correcto - Error Boundary para componentes
<ErrorBoundary fallback={<ErrorFallback />}>
  <PatientForm />
</ErrorBoundary>
```

## 📊 Performance

### Memorización y Optimización
```javascript
// ✅ Correcto - memorizar callbacks costosos
const handleExpensiveOperation = useCallback((data) => {
  // operación costosa
}, [dependency]);

// ✅ Correcto - memorizar cálculos complejos
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Correcto - React.memo para componentes puros
const PatientCard = React.memo(({ patient, onEdit }) => {
  return (
    // JSX del componente
  );
});
```

## 🔐 Seguridad

### Validación de Datos
```javascript
// ✅ Correcto - validar datos del cliente
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Correcto - sanitizar entradas
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

// ❌ Incorrecto - confiar en datos sin validar
const savePatient = (data) => {
  // guardar directamente sin validación
};
```

## 📦 Imports y Exports

### Organización de Imports
```javascript
// ✅ Correcto - orden y agrupación
// 1. React y librerías externas
import React, { useState, useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { format } from 'date-fns';

// 2. Imports internos (core, shared, features)
import { apiClient } from '@/core/config';
import { useAuth } from '@/shared/hooks';
import { PatientCard } from '@/features/patients';

// 3. Imports relativos
import './PatientForm.css';
```

### Exports
```javascript
// ✅ Correcto - export por defecto para componentes principales
export default PatientForm;

// ✅ Correcto - exports nombrados para utilidades
export { validatePatient, formatPatientName };

// ✅ Correcto - barrel exports en index.js
export { default as PatientForm } from './PatientForm';
export { default as PatientList } from './PatientList';
export { usePatients } from './hooks/usePatients';
```

## 🛠️ Configuración de Herramientas

### ESLint Rules (recomendadas)
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "react/prop-types": "warn",
    "react/jsx-pascal-case": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

Estos estándares aseguran un código consistente, mantenible y de alta calidad en todo el proyecto.