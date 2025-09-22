# 📁 Estructura del Proyecto - InteliGastro Frontend

## 🎯 Introducción

Este documento describe la estructura organizacional del proyecto frontend de InteliGastro, un sistema de gestión clínica gastroenterológica. La estructura está diseñada para ser escalable, mantenible y fácil de entender para nuevos desarrolladores.

## 📂 Estructura Completa

```
inteligastro-front/
├── docs/                           # Documentación del proyecto
│   ├── ARCHITECTURE.md             # Arquitectura general
│   ├── DEVELOPMENT.md              # Guía de desarrollo
│   ├── PROJECT_STRUCTURE.md        # Este archivo
│   ├── CODING_STANDARDS.md         # Estándares de código
│   ├── PAGES_INVENTORY.md          # Inventario completo de páginas
│   ├── MODULES_OVERVIEW.md         # Descripción de módulos funcionales
│   ├── RESTRUCTURE_SUMMARY.md      # Resumen de reestructuración
│   └── DEPLOYMENT.md               # Guía de despliegue
├── public/                         # Archivos públicos
│   ├── index.html                  # HTML principal
│   ├── favicon.ico                 # Favicon
│   └── manifest.json               # Manifiesto PWA
├── src/                            # Código fuente principal
│   ├── core/                       # Configuración central del sistema
│   │   ├── config/                 # Configuraciones globales
│   │   │   ├── api.js              # Cliente HTTP configurado
│   │   │   ├── env.js              # Variables de entorno
│   │   │   └── index.js            # Exportaciones centralizadas
│   │   ├── constants/              # Constantes del sistema
│   │   │   ├── api-endpoints.js    # Definición de endpoints
│   │   │   ├── app-constants.js    # Constantes de aplicación
│   │   │   ├── permissions.js      # Sistema de permisos
│   │   │   └── index.js            # Exportaciones centralizadas
│   │   ├── types/                  # Definiciones de tipos
│   │   │   └── index.js            # Tipos TypeScript/PropTypes
│   │   └── utils/                  # Utilidades base del sistema
│   │       ├── formatters.js       # Funciones de formateo
│   │       ├── validators.js       # Validaciones generales
│   │       └── helpers.js          # Funciones auxiliares
│   ├── shared/                     # Recursos compartidos entre módulos
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── common/             # Componentes comunes
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── ErrorBoundary.js
│   │   │   │   ├── ConfirmDialog.js
│   │   │   │   └── index.js
│   │   │   ├── forms/              # Componentes de formulario
│   │   │   │   ├── FormField.js
│   │   │   │   ├── FormActions.js
│   │   │   │   └── index.js
│   │   │   ├── tables/             # Componentes de tabla
│   │   │   │   ├── DataTable.js
│   │   │   │   ├── TableActions.js
│   │   │   │   └── index.js
│   │   │   └── modals/             # Modales reutilizables
│   │   │       ├── BaseModal.js
│   │   │       └── index.js
│   │   ├── hooks/                  # Hooks personalizados
│   │   │   ├── useApi.js           # Hook para llamadas API
│   │   │   ├── useAuth.js          # Hook de autenticación
│   │   │   ├── useForm.js          # Hook para formularios
│   │   │   ├── useLocalStorage.js  # Hook para localStorage
│   │   │   └── index.js            # Exportaciones centralizadas
│   │   ├── services/               # Servicios compartidos
│   │   │   ├── api-client.js       # Cliente HTTP principal
│   │   │   ├── storage-service.js  # Servicio de almacenamiento
│   │   │   └── index.js            # Exportaciones centralizadas
│   │   └── utils/                  # Utilidades compartidas
│   │       ├── date-utils.js       # Utilidades de fecha
│   │       ├── format-utils.js     # Utilidades de formato
│   │       ├── validation-utils.js # Utilidades de validación
│   │       └── index.js            # Exportaciones centralizadas
│   ├── features/                   # Módulos de funcionalidad (Feature-based)
│   │   ├── auth/                   # Autenticación y autorización
│   │   │   ├── components/         # Componentes específicos de auth
│   │   │   │   ├── LoginForm.js
│   │   │   │   ├── ProtectedRoute.js
│   │   │   │   └── index.js
│   │   │   ├── hooks/              # Hooks específicos de auth
│   │   │   │   ├── useLogin.js
│   │   │   │   └── index.js
│   │   │   ├── services/           # Servicios de autenticación
│   │   │   │   ├── auth-api.js
│   │   │   │   └── index.js
│   │   │   ├── pages/              # Páginas de autenticación
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── index.js
│   │   │   └── index.js            # Exportación principal del módulo
│   │   ├── patients/               # Gestión de pacientes
│   │   │   ├── components/
│   │   │   │   ├── PatientForm.js
│   │   │   │   ├── PatientList.js
│   │   │   │   ├── PatientCard.js
│   │   │   │   └── index.js
│   │   │   ├── hooks/
│   │   │   │   ├── usePatients.js
│   │   │   │   ├── usePatientForm.js
│   │   │   │   └── index.js
│   │   │   ├── services/
│   │   │   │   ├── patients-api.js
│   │   │   │   └── index.js
│   │   │   ├── pages/
│   │   │   │   ├── PatientsPage.js
│   │   │   │   ├── PatientDetailPage.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── appointments/           # Gestión de citas
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── pages/
│   │   │   └── index.js
│   │   ├── procedures/             # Procedimientos médicos
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── pages/
│   │   │   └── index.js
│   │   ├── staff/                  # Personal médico
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── pages/
│   │   │   └── index.js
│   │   ├── statistics/             # Estadísticas y reportes
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── pages/
│   │   │   └── index.js
│   │   └── admin/                  # Administración del sistema
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── pages/
│   │       └── index.js
│   ├── ui/                         # Interfaz de usuario y tema
│   │   ├── components/             # Componentes UI específicos
│   │   │   ├── buttons/            # Componentes de botón
│   │   │   ├── inputs/             # Componentes de entrada
│   │   │   ├── feedback/           # Alerts, notifications
│   │   │   ├── navigation/         # Componentes de navegación
│   │   │   └── index.js
│   │   ├── layouts/                # Layouts de página
│   │   │   ├── MainLayout.js       # Layout principal
│   │   │   ├── AuthLayout.js       # Layout de autenticación
│   │   │   ├── components/         # Componentes de layout
│   │   │   │   ├── Header.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   └── theme/                  # Configuración de tema
│   │       ├── index.js            # Tema principal
│   │       ├── colors.js           # Paleta de colores
│   │       ├── typography.js       # Configuración tipográfica
│   │       ├── components.js       # Estilos de componentes
│   │       └── breakpoints.js      # Breakpoints responsivos
│   ├── assets/                     # Recursos estáticos
│   │   ├── images/                 # Imágenes
│   │   ├── icons/                  # Iconos personalizados
│   │   └── fonts/                  # Fuentes personalizadas
│   ├── App.js                      # Componente raíz de la aplicación
│   ├── AppConAuth.js               # Aplicación con autenticación
│   ├── index.js                    # Punto de entrada
│   └── setupTests.js               # Configuración de tests
├── package.json                    # Dependencias y scripts
├── package-lock.json               # Lockfile de dependencias
├── .env.example                    # Ejemplo de variables de entorno
├── .env                           # Variables de entorno (gitignored)
├── .gitignore                     # Archivos ignorados por Git
├── README.md                      # Documentación principal
├── CHECKLIST_BACKEND.md           # Checklist de backend
├── ENDPOINTS_REQUERIDOS.md        # Endpoints requeridos
├── FORMATOS_DATOS.md              # Formatos de datos
├── REGLAS_AUTENTICACION.md        # Reglas de autenticación
└── REGLAS_VALIDACION.md           # Reglas de validación
```

## 🏗️ Explicación de la Estructura

### `/docs` - Documentación
Contiene toda la documentación técnica del proyecto para facilitar el onboarding de nuevos desarrolladores.

### `/src/core` - Núcleo del Sistema
- **Configuración central**: API client, variables de entorno
- **Constantes**: Endpoints, permisos, configuraciones
- **Utilidades base**: Funciones fundamentales del sistema

### `/src/shared` - Recursos Compartidos
- **Componentes reutilizables**: UI components usados en múltiples features
- **Hooks personalizados**: Lógica compartida entre componentes
- **Servicios**: Funcionalidades compartidas (API, storage, etc.)
- **Utilidades**: Funciones helper compartidas

### `/src/features` - Módulos de Funcionalidad
Cada feature es autocontenida con su propia estructura:
- **components/**: Componentes específicos del módulo
- **hooks/**: Hooks específicos del módulo
- **services/**: API calls específicas del módulo
- **pages/**: Páginas del módulo
- **index.js**: Exportación principal del módulo

### `/src/ui` - Interfaz de Usuario
- **components/**: Componentes UI específicos (botones, inputs, etc.)
- **layouts/**: Layouts de página y componentes de layout
- **theme/**: Configuración completa del tema Material-UI

## 📋 Convenciones de Nomenclatura

### Archivos y Carpetas
- **Componentes**: PascalCase (`PatientForm.js`)
- **Hooks**: camelCase con prefijo `use` (`usePatients.js`)
- **Servicios**: kebab-case (`patients-api.js`)
- **Páginas**: PascalCase con sufijo `Page` (`PatientsPage.js`)
- **Utilidades**: kebab-case (`date-utils.js`)
- **Constantes**: UPPER_SNAKE_CASE para valores, kebab-case para archivos

### Estructura de Exports
Cada carpeta tiene un `index.js` que actúa como barrel export:

```javascript
// features/patients/index.js
export { default as PatientsPage } from './pages/PatientsPage';
export { default as PatientForm } from './components/PatientForm';
export { usePatients } from './hooks/usePatients';
export { patientsApi } from './services/patients-api';
```

## 🔄 Flujo de Imports

### Orden de Imports
```javascript
// 1. Librerías externas
import React from 'react';
import { Button } from '@mui/material';

// 2. Core imports
import { apiClient } from '@/core/config';
import { PERMISSIONS } from '@/core/constants';

// 3. Shared imports
import { useAuth } from '@/shared/hooks';
import { LoadingSpinner } from '@/shared/components';

// 4. Feature imports
import { usePatients } from '@/features/patients';

// 5. UI imports
import { MainLayout } from '@/ui/layouts';

// 6. Relative imports
import './ComponentName.css';
```

### Alias de Paths (Path Mapping)
Se recomienda configurar aliases para imports más limpios:

```javascript
// jsconfig.json o webpack.config.js
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/core/*": ["core/*"],
      "@/shared/*": ["shared/*"],
      "@/features/*": ["features/*"],
      "@/ui/*": ["ui/*"],
      "@/assets/*": ["assets/*"]
    }
  }
}
```

## 🎯 Beneficios de esta Estructura

### 1. **Escalabilidad**
- Fácil adición de nuevos features
- Separación clara de responsabilidades
- Estructura predecible

### 2. **Mantenibilidad**
- Código organizado y fácil de encontrar
- Reutilización de componentes y lógica
- Testing más simple

### 3. **Colaboración**
- Estructura familiar para desarrolladores React
- Documentación clara
- Convenciones consistentes

### 4. **Performance**
- Code splitting por features
- Imports optimizados
- Lazy loading de componentes

## 📝 Guía para Nuevos Desarrolladores

### 1. **Crear un Nuevo Feature**
```bash
# Crear estructura base
mkdir -p src/features/nueva-feature/{components,hooks,services,pages}

# Crear archivos index.js en cada carpeta
touch src/features/nueva-feature/{components,hooks,services,pages,}/index.js
```

### 2. **Agregar un Nuevo Componente**
- Ubicar en la carpeta apropiada (shared/components o features/[feature]/components)
- Seguir convenciones de nomenclatura
- Exportar desde index.js correspondiente

### 3. **Crear una Nueva Página**
- Ubicar en features/[feature]/pages/
- Usar layout apropiado
- Implementar lazy loading si es necesario

### 4. **Agregar Nueva API**
- Definir endpoints en core/constants/api-endpoints.js
- Crear servicio en features/[feature]/services/
- Usar hooks compartidos (useApi) para llamadas

## 🔧 Herramientas de Desarrollo

### VS Code Extensions Recomendadas
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- Path Intellisense
- Material Icon Theme

### Scripts Útiles
```bash
# Desarrollo
npm start

# Build
npm run build

# Tests
npm test

# Linting
npm run lint

# Formateo
npm run format
```

Esta estructura garantiza un proyecto organizado, escalable y fácil de mantener para cualquier desarrollador que se una al equipo.