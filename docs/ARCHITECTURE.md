# 🏗️ Arquitectura Frontend - InteliGastro

## 📋 Tabla de Contenidos
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Principios Arquitectónicos](#principios-arquitectónicos)
- [Organización de Carpetas](#organización-de-carpetas)
- [Convenciones de Código](#convenciones-de-código)
- [Flujo de Datos](#flujo-de-datos)

## 🎯 Estructura del Proyecto

```
src/
├── core/                     # Configuración central y utilidades base
│   ├── config/              # Configuraciones globales
│   ├── constants/           # Constantes de la aplicación
│   ├── types/               # Tipos TypeScript/PropTypes
│   └── utils/               # Utilidades base
├── shared/                  # Recursos compartidos entre módulos
│   ├── components/          # Componentes reutilizables
│   ├── hooks/               # Hooks personalizados
│   ├── services/            # Servicios API compartidos
│   └── utils/               # Utilidades compartidas
├── features/                # Módulos de funcionalidad
│   ├── auth/                # Autenticación y autorización
│   ├── appointments/        # Gestión de citas
│   ├── patients/           # Gestión de pacientes
│   ├── procedures/         # Procedimientos médicos
│   ├── staff/              # Personal médico
│   ├── statistics/         # Estadísticas y reportes
│   └── admin/              # Administración del sistema
├── ui/                     # Interfaz de usuario
│   ├── components/         # Componentes UI específicos
│   ├── layouts/            # Layouts de página
│   └── theme/              # Configuración de tema
├── assets/                 # Recursos estáticos
└── App.js                  # Componente raíz
```

## 🔧 Principios Arquitectónicos

### 1. **Separación de Responsabilidades**
- **Core**: Lógica base y configuración
- **Features**: Módulos de negocio independientes
- **Shared**: Recursos reutilizables
- **UI**: Componentes de interfaz

### 2. **Modularidad**
- Cada feature es autocontenida
- Dependencias claras entre módulos
- Facilita el mantenimiento y testing

### 3. **Escalabilidad**
- Estructura preparada para crecimiento
- Patrones consistentes
- Fácil incorporación de nuevos desarrolladores

## 📁 Organización de Carpetas

### `/core` - Núcleo de la Aplicación
```
core/
├── config/
│   ├── api.js              # Configuración de API
│   ├── env.js              # Variables de entorno
│   └── app.js              # Configuración general
├── constants/
│   ├── api-endpoints.js    # Endpoints de API
│   ├── app-constants.js    # Constantes generales
│   └── permissions.js      # Permisos y roles
├── types/
│   └── index.js            # Definiciones de tipos
└── utils/
    ├── formatters.js       # Funciones de formato
    ├── validators.js       # Validaciones
    └── helpers.js          # Funciones auxiliares
```

### `/shared` - Recursos Compartidos
```
shared/
├── components/
│   ├── forms/              # Componentes de formulario
│   ├── tables/             # Componentes de tabla
│   ├── modals/             # Modales reutilizables
│   └── common/             # Componentes comunes
├── hooks/
│   ├── useApi.js           # Hook para API calls
│   ├── useAuth.js          # Hook de autenticación
│   └── useForm.js          # Hook para formularios
├── services/
│   ├── api-client.js       # Cliente HTTP
│   ├── auth-service.js     # Servicio de autenticación
│   └── storage-service.js  # Servicio de almacenamiento
└── utils/
    ├── date-utils.js       # Utilidades de fecha
    ├── format-utils.js     # Utilidades de formato
    └── validation-utils.js # Utilidades de validación
```

### `/features` - Módulos de Funcionalidad
```
features/
├── auth/
│   ├── components/         # Componentes específicos de auth
│   ├── hooks/              # Hooks específicos de auth
│   ├── services/           # Servicios de autenticación
│   └── pages/              # Páginas de login, etc.
├── patients/
│   ├── components/
│   │   ├── PatientForm.js
│   │   ├── PatientList.js
│   │   └── PatientCard.js
│   ├── hooks/
│   │   └── usePatients.js
│   ├── services/
│   │   └── patients-api.js
│   └── pages/
│       ├── PatientsPage.js
│       └── PatientDetailPage.js
└── [otros módulos...]
```

### `/ui` - Interfaz de Usuario
```
ui/
├── components/
│   ├── buttons/            # Componentes de botón
│   ├── inputs/             # Componentes de entrada
│   ├── feedback/           # Alerts, notifications
│   └── navigation/         # Componentes de navegación
├── layouts/
│   ├── MainLayout.js       # Layout principal
│   ├── AuthLayout.js       # Layout de autenticación
│   └── components/         # Componentes de layout
└── theme/
    ├── index.js            # Configuración de tema
    ├── colors.js           # Paleta de colores
    └── typography.js       # Configuración tipográfica
```

## 🔄 Flujo de Datos

### 1. **Llamadas a API**
```
Component → Hook → Service → API Client → Backend
```

### 2. **Gestión de Estado**
```
Local State (useState) → Custom Hooks → Context (global state)
```

### 3. **Autenticación**
```
Login → Auth Service → Token Storage → Protected Routes
```

## 📝 Convenciones de Código

### Nomenclatura de Archivos
- **Componentes**: PascalCase (`PatientForm.js`)
- **Hooks**: camelCase con prefijo `use` (`usePatients.js`)
- **Servicios**: kebab-case (`patients-api.js`)
- **Páginas**: PascalCase con sufijo `Page` (`PatientsPage.js`)

### Organización de Imports
```javascript
// 1. Librerías externas
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// 2. Imports del core
import { apiClient } from '@/core/config';

// 3. Imports compartidos
import { useAuth } from '@/shared/hooks';

// 4. Imports del feature actual
import { PatientForm } from './components';

// 5. Imports relativos
import './styles.css';
```

### Estructura de Componentes
```javascript
// imports...

const ComponentName = ({ prop1, prop2 }) => {
  // hooks
  // state
  // effects
  // handlers
  // render helpers

  return (
    // JSX
  );
};

export default ComponentName;
```

## 🚀 Migración

Para migrar el código existente:

1. **Fase 1**: Crear nueva estructura de carpetas
2. **Fase 2**: Mover archivos a sus nuevas ubicaciones
3. **Fase 3**: Actualizar imports y referencias
4. **Fase 4**: Refactorizar componentes según convenciones
5. **Fase 5**: Documentar cambios y actualizar README

## 📚 Recursos Adicionales

- [Guía de Desarrollo](./DEVELOPMENT.md)
- [Estándares de Código](./CODING_STANDARDS.md)
- [Configuración del Proyecto](./SETUP.md)