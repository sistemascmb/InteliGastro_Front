# 🛠️ Guía de Desarrollo - InteliGastro Frontend

## 📋 Configuración del Entorno

### Requisitos Previos
- Node.js 18+
- npm 8+
- Git
- VS Code (recomendado)

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd inteligastro-front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correctos

# Iniciar desarrollo
npm start
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start                 # Inicia servidor de desarrollo
npm run dev              # Alias para start

# Testing
npm test                 # Ejecuta tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con coverage

# Build
npm run build            # Build para producción
npm run build:analyze    # Analiza el bundle

# Linting y formateo
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Arregla errores de linting
npm run format           # Formatea código con Prettier

# Utilidades
npm run clean            # Limpia archivos generados
npm run analyze          # Analiza dependencias
```

## 📁 Workflow de Desarrollo

### 1. **Crear Nueva Feature**
```bash
# Crear rama
git checkout -b feature/nueva-funcionalidad

# Crear estructura de archivos
mkdir -p src/features/nueva-feature/{components,hooks,services,pages}

# Desarrollar feature
# - Componentes en /components
# - Lógica en /hooks
# - API calls en /services
# - Páginas en /pages
```

### 2. **Estructura de Feature**
```
features/nueva-feature/
├── components/
│   ├── FeatureComponent.js
│   ├── FeatureForm.js
│   └── index.js            # Exportaciones
├── hooks/
│   ├── useFeature.js
│   └── index.js
├── services/
│   ├── feature-api.js
│   └── index.js
├── pages/
│   ├── FeaturePage.js
│   └── index.js
└── index.js                # Exportación principal
```

### 3. **Crear Componente**
```javascript
// src/features/patients/components/PatientCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {patient.firstName} {patient.lastName}
        </Typography>
        <Typography color="textSecondary">
          {patient.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
```

### 4. **Crear Hook Personalizado**
```javascript
// src/features/patients/hooks/usePatients.js
import { useState, useEffect } from 'react';
import { patientsApi } from '../services';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients
  };
};
```

### 5. **Crear Servicio API**
```javascript
// src/features/patients/services/patients-api.js
import { apiClient } from '@/core/config';

export const patientsApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/patients', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/patients/${id}`);
  }
};
```

## 🎨 Estándares de UI

### 1. **Componentes Material-UI**
```javascript
// Usar componentes consistentes
import {
  Button,
  TextField,
  Dialog,
  Card,
  Table,
  Chip
} from '@mui/material';

// Aplicar tema consistente
import { useTheme } from '@mui/material/styles';
```

### 2. **Layout Patterns**
```javascript
// Página típica
const PatientPage = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader title="Pacientes" />
      <PageContent>
        <PatientFilters />
        <PatientTable />
      </PageContent>
    </Container>
  );
};
```

### 3. **Formularios**
```javascript
// Usar React Hook Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PatientForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(patientSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
    </form>
  );
};
```

## 🔒 Manejo de Autenticación

### 1. **Rutas Protegidas**
```javascript
// Usar ProtectedRoute
<Route
  path="/patients"
  element={
    <ProtectedRoute requiredPermissions={['patients:read']}>
      <PatientsPage />
    </ProtectedRoute>
  }
/>
```

### 2. **Hook de Autenticación**
```javascript
// En componentes
const { user, isAuthenticated, logout } = useAuth();

// Verificar permisos
const canEdit = user?.permissions.includes('patients:write');
```

## 📊 Estado Global

### 1. **Context API**
```javascript
// Para estado global simple
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};
```

### 2. **Zustand (Opcional)**
```javascript
// Para estado más complejo
import { create } from 'zustand';

const useStore = create((set) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),
}));
```

## 🧪 Testing

### 1. **Testing de Componentes**
```javascript
// PatientCard.test.js
import { render, screen } from '@testing-library/react';
import PatientCard from './PatientCard';

describe('PatientCard', () => {
  const mockPatient = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez'
  };

  test('renders patient name', () => {
    render(<PatientCard patient={mockPatient} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });
});
```

### 2. **Testing de Hooks**
```javascript
// usePatients.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { usePatients } from './usePatients';

describe('usePatients', () => {
  test('fetches patients on mount', async () => {
    const { result } = renderHook(() => usePatients());

    await waitFor(() => {
      expect(result.current.patients).toHaveLength(0);
      expect(result.current.loading).toBe(false);
    });
  });
});
```

## 🚀 Deploy

### 1. **Build de Producción**
```bash
# Crear build
npm run build

# Verificar build
npm run serve:build
```

### 2. **Variables de Entorno**
```javascript
// .env.production
REACT_APP_API_URL=https://api.inteligastro.com
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

## 📝 Convenciones de Commit

```bash
# Tipos de commit
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: mantenimiento

# Ejemplos
git commit -m "feat: add patient search functionality"
git commit -m "fix: resolve authentication token refresh issue"
git commit -m "docs: update API documentation"
```

## 🔍 Debugging

### 1. **React DevTools**
- Instalar extensión de Chrome/Firefox
- Inspeccionar componentes y estado

### 2. **Network Tab**
- Verificar llamadas a API
- Revisar headers de autenticación

### 3. **Console Logs**
```javascript
// Usar console.group para organizar logs
console.group('Patient API Call');
console.log('Request:', request);
console.log('Response:', response);
console.groupEnd();
```

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [Material-UI](https://mui.com)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [React Testing Library](https://testing-library.com/react)