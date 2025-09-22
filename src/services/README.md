# Estructura de APIs - Sistema Clínico InteliGastro

## 📋 Índice
- [Introducción](#introducción)
- [Estructura de Archivos](#estructura-de-archivos)
- [Configuración](#configuración)
- [Servicios Disponibles](#servicios-disponibles)
- [Uso de Servicios](#uso-de-servicios)
- [Manejo de Errores](#manejo-de-errores)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Patrones y Convenciones](#patrones-y-convenciones)

## 🚀 Introducción

Esta estructura de APIs proporciona una capa de servicios completa y organizada para el frontend del sistema clínico. Incluye configuración centralizada, manejo de errores, interceptores, autenticación automática y servicios específicos para cada módulo del sistema.

## 📁 Estructura de Archivos

```
src/
├── constants/
│   └── api.js                 # Configuración y constantes de API
├── utils/
│   └── apiClient.js           # Cliente HTTP configurado con interceptores
├── services/
│   ├── index.js               # Exportaciones centralizadas
│   ├── patientsService.js     # Servicio de pacientes
│   ├── staffService.js        # Servicio de personal
│   ├── centersService.js      # Servicio de centros médicos
│   ├── appointmentsService.js # Servicio de citas
│   └── README.md             # Este archivo de documentación
```

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# URL base del backend
REACT_APP_API_URL=http://localhost:8000

# Otras configuraciones opcionales
REACT_APP_API_TIMEOUT=10000
REACT_APP_RETRY_ATTEMPTS=3
```

### Configuración de API (constants/api.js)

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  VERSION: 'v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};
```

## 🛠️ Servicios Disponibles

### 1. Servicio de Pacientes (`patientsService`)
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Búsqueda y filtros
- ✅ Paginación
- ✅ Cambio de estado
- ✅ Exportación de datos
- ✅ Validación de documentos únicos

### 2. Servicio de Personal (`staffService`)
- ✅ Gestión de personal médico y administrativo
- ✅ Filtros por centro, rol, especialización
- ✅ Obtener médicos y enfermeros específicamente
- ✅ Gestión de permisos y horarios
- ✅ Disponibilidad de médicos

### 3. Servicio de Centros (`centersService`)
- ✅ Gestión de centros médicos
- ✅ Configuración de horarios y servicios
- ✅ Gestión de personal por centro
- ✅ Estadísticas y disponibilidad
- ✅ Validación de abreviaturas únicas

### 4. Servicio de Citas (`appointmentsService`)
- ✅ Programación y gestión de citas
- ✅ Verificación de disponibilidad
- ✅ Reprogramación y cancelación
- ✅ Recordatorios automáticos
- ✅ Filtros por paciente, médico, fecha
- ✅ Estados: programada, confirmada, completada, cancelada

### 5. Servicios Adicionales
- ✅ `authService`: Autenticación y autorización
- ✅ `statisticsService`: Estadísticas del sistema
- ✅ Servicios genéricos para módulos simples (exámenes, suministros, etc.)

## 🔧 Uso de Servicios

### Importación

```javascript
// Importación específica
import { patientsService } from '../services';

// Importación múltiple
import {
  patientsService,
  staffService,
  centersService
} from '../services';

// Importación con alias
import {
  patients,
  staff,
  centers
} from '../services';
```

### En Componentes React

```javascript
import React, { useState, useEffect } from 'react';
import { patientsService } from '../services';

const PatientsComponent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await patientsService.getAll({
          page: 1,
          limit: 10,
          status: 'active'
        });
        setPatients(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleCreatePatient = async (patientData) => {
    try {
      const newPatient = await patientsService.create(patientData);
      setPatients(prev => [...prev, newPatient.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Resto del componente...
};
```

## ❌ Manejo de Errores

### Estructura de Errores

Los servicios lanzan errores con mensajes descriptivos:

```javascript
try {
  await patientsService.create(invalidData);
} catch (error) {
  console.error('Error creando paciente:', error.message);
  // Error: "Campos requeridos faltantes: firstName, lastName"
}
```

### Interceptores de Error

El cliente HTTP maneja automáticamente:

- **401 Unauthorized**: Renovación automática de tokens
- **403 Forbidden**: Errores de permisos
- **404 Not Found**: Recursos no encontrados
- **409 Conflict**: Datos duplicados
- **500 Server Error**: Errores del servidor
- **Timeout**: Reintentos automáticos
- **Network Error**: Errores de conexión

## 📚 Ejemplos de Uso

### 1. Crear un Paciente

```javascript
const patientData = {
  nombres: 'Juan Carlos',
  apellidos: 'Pérez González',
  tipoDocumento: 'DNI',
  documento: '12345678',
  fechaNacimiento: '1985-06-15',
  genero: 'masculino',
  telefono: '+51 987654321',
  correo: 'juan.perez@email.com'
};

try {
  const result = await patientsService.create(patientData);
  console.log('Paciente creado:', result.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 2. Buscar Personal por Centro

```javascript
try {
  const staff = await staffService.getByCenter('centro-1');
  console.log('Personal del centro:', staff.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 3. Verificar Disponibilidad de Cita

```javascript
try {
  const availability = await appointmentsService.checkAvailability(
    'medico-123',
    '2024-01-15',
    '09:00',
    30
  );

  if (availability.available) {
    console.log('Horario disponible');
  } else {
    console.log('Horario no disponible');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

### 4. Autenticación

```javascript
import { authService } from '../services';

const handleLogin = async (credentials) => {
  try {
    const result = await authService.login({
      email: 'usuario@clinica.com',
      password: 'password123',
      rememberMe: true
    });

    console.log('Usuario logueado:', result.user);
    // Token se guarda automáticamente
  } catch (error) {
    console.error('Error de login:', error.message);
  }
};
```

## 📝 Patrones y Convenciones

### 1. Nombres de Métodos
- `getAll()`: Obtener lista con paginación
- `getById(id)`: Obtener elemento específico
- `create(data)`: Crear nuevo elemento
- `update(id, data)`: Actualizar elemento
- `delete(id)`: Eliminar elemento
- `changeStatus(id, status)`: Cambiar estado

### 2. Parámetros de Consulta
```javascript
const params = {
  page: 1,           // Página actual
  limit: 10,         // Elementos por página
  search: 'término', // Término de búsqueda
  status: 'active',  // Filtro por estado
  sortBy: 'name',    // Campo de ordenación
  sortOrder: 'asc'   // Dirección de ordenación
};
```

### 3. Formato de Respuesta Esperado
```javascript
{
  success: true,
  data: [...],       // Datos solicitados
  message: "Success",
  pagination: {      // Solo en listas paginadas
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
}
```

### 4. Estados Estándar
- `active`: Activo
- `inactive`: Inactivo
- `pending`: Pendiente
- `completed`: Completado
- `cancelled`: Cancelado

## 🔄 Migración desde Estado Local

Para migrar componentes que usan estado local hardcodeado:

### Antes (Estado Local)
```javascript
const [pacientes, setPacientes] = useState([
  { id: 1, nombre: 'Juan', ... }
]);
```

### Después (Con Servicios)
```javascript
const [pacientes, setPacientes] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await patientsService.getAll();
      setPacientes(response.data);
    } catch (error) {
      setError(error.message);
    }
  };
  fetchData();
}, []);
```

## 🚨 Notas Importantes

1. **Tokens de Autenticación**: Se manejan automáticamente por los interceptores
2. **Retry Automático**: Las peticiones fallan 3 veces antes de dar error final
3. **Formato de Datos**: Los servicios formatean automáticamente entre frontend y backend
4. **Validaciones**: Se realizan tanto en frontend como backend
5. **Logs**: En desarrollo se muestran logs detallados de todas las peticiones

## 🎯 Próximos Pasos

1. ✅ Implementar servicios en componentes existentes
2. ✅ Configurar variables de entorno
3. ✅ Conectar con backend real
4. ✅ Implementar tests unitarios
5. ✅ Agregar más validaciones específicas del negocio

---

**Nota**: Esta estructura está lista para conectar con un backend real. Los servicios manejan tanto el formato actual del frontend como el formato esperado del backend, facilitando la transición.