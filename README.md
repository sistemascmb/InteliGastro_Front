# 🏥 InteliGastro Frontend

Sistema de gestión clínica gastroenterológica construido con React y Material-UI.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo](#desarrollo)
- [Scripts Disponibles](#scripts-disponibles)
- [Documentación](#documentación)
- [Contribución](#contribución)

## ✨ Características

### 🔐 Autenticación y Autorización
- Sistema de login con JWT
- Roles y permisos granulares (Admin, Doctor, Enfermera, Recepcionista)
- Rutas protegidas basadas en permisos
- Refresh token automático

### 👥 Gestión de Pacientes
- CRUD completo de pacientes
- Búsqueda y filtrado avanzado
- Historial médico
- Gestión de documentos

### 📅 Sistema de Citas
- Agenda de citas médicas
- Estados: Agendadas, En espera, Finalizadas
- Notificaciones automáticas
- Calendario integrado

### 🏥 Procedimientos Médicos
- Agenda diaria de procedimientos
- Gestión de órdenes médicas
- Seguimiento de procedimientos
- Sistema de altas médicas

### 📊 Estadísticas y Reportes
- Dashboard con métricas clave
- Reportes de pacientes y procedimientos
- Estadísticas del personal médico
- Análisis de ingresos

### ⚙️ Administración
- Gestión de centros médicos
- Administración de personal
- Configuración de roles y permisos
- Gestión de usuarios

## 🛠️ Tecnologías

### Core
- **React 19.1.1** - Framework principal
- **Material-UI 7.3.2** - Biblioteca de componentes UI
- **React Router DOM 7.8.2** - Routing
- **Axios 1.12.2** - Cliente HTTP

### Herramientas de Desarrollo
- **Create React App** - Setup inicial
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **React Testing Library** - Testing

### Utilidades
- **date-fns** - Manejo de fechas
- **React Quill** - Editor de texto enriquecido

## 🚀 Instalación

### Prerrequisitos
- Node.js 18 o superior
- npm 8 o superior

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd inteligastro-front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Editar `.env` con las configuraciones apropiadas:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api/v1
   REACT_APP_APP_NAME=InteliGastro
   REACT_APP_VERSION=1.0.0
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   - Aplicación: [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── core/                    # Configuración central
│   ├── config/             # Configuraciones de API, env
│   ├── constants/          # Constantes y endpoints
│   └── utils/              # Utilidades base
├── shared/                 # Recursos compartidos
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Servicios compartidos
│   └── utils/              # Utilidades compartidas
├── features/               # Módulos de funcionalidad
│   ├── auth/              # Autenticación
│   ├── patients/          # Gestión de pacientes
│   ├── appointments/      # Sistema de citas
│   ├── procedures/        # Procedimientos médicos
│   ├── statistics/        # Estadísticas y reportes
│   └── admin/             # Administración
├── ui/                    # Interfaz de usuario
│   ├── components/        # Componentes UI
│   ├── layouts/           # Layouts de página
│   └── theme/             # Configuración de tema
└── assets/                # Recursos estáticos
```

Para más detalles, ver [Estructura del Proyecto](./docs/PROJECT_STRUCTURE.md).

## 🔧 Desarrollo

### Configuración del Editor (VS Code)

El proyecto incluye configuración para VS Code con:
- Formateo automático con Prettier
- Linting con ESLint
- Extensiones recomendadas
- Configuración de paths para imports

### Convenciones de Código

- **Componentes**: PascalCase (`PatientForm.js`)
- **Hooks**: camelCase con prefijo `use` (`usePatients.js`)
- **Servicios**: kebab-case (`patients-api.js`)
- **Páginas**: PascalCase + `Page` (`PatientsPage.js`)

Ver [Estándares de Código](./docs/CODING_STANDARDS.md) para más detalles.

### Imports con Alias

```javascript
// Imports organizados con alias
import { apiClient } from '@/core/config';
import { useAuth } from '@/shared/hooks';
import { PatientForm } from '@/features/patients';
import { MainLayout } from '@/ui/layouts';
```

## 📜 Scripts Disponibles

### Desarrollo
```bash
npm start              # Inicia el servidor de desarrollo
npm run dev            # Alias para start
```

### Build y Testing
```bash
npm run build          # Build para producción
npm test               # Ejecuta tests
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Tests con coverage
```

### Linting y Formateo
```bash
npm run lint           # Ejecuta ESLint
npm run lint:fix       # Arregla errores de linting automáticamente
npm run format         # Formatea código con Prettier
```

### Utilidades
```bash
npm run analyze        # Analiza el bundle de producción
npm run clean          # Limpia archivos generados
```

## 📚 Documentación

### Documentación Técnica Principal
- [📐 Arquitectura](./docs/ARCHITECTURE.md) - Principios y patrones arquitectónicos
- [🛠️ Guía de Desarrollo](./docs/DEVELOPMENT.md) - Workflow y mejores prácticas
- [📁 Estructura del Proyecto](./docs/PROJECT_STRUCTURE.md) - Organización de archivos
- [📝 Estándares de Código](./docs/CODING_STANDARDS.md) - Convenciones y estilo
- [🚀 Despliegue](./docs/DEPLOYMENT.md) - Guía de deploy

### Documentación Funcional
- [📄 Inventario de Páginas](./docs/PAGES_INVENTORY.md) - Catálogo completo de todas las páginas
- [🏥 Módulos del Sistema](./docs/MODULES_OVERVIEW.md) - Descripción detallada de módulos funcionales
- [🔄 Resumen de Reestructuración](./docs/RESTRUCTURE_SUMMARY.md) - Cambios implementados en la arquitectura

### Documentación del Backend
- [✅ Checklist Backend](./CHECKLIST_BACKEND.md)
- [🔗 Endpoints Requeridos](./ENDPOINTS_REQUERIDOS.md)
- [📊 Formatos de Datos](./FORMATOS_DATOS.md)
- [🔐 Reglas de Autenticación](./REGLAS_AUTENTICACION.md)
- [✔️ Reglas de Validación](./REGLAS_VALIDACION.md)

## 🔄 Workflow de Contribución

### 1. Crear Feature Branch
```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollo
```bash
# Crear estructura de feature
mkdir -p src/features/nueva-feature/{components,hooks,services,pages}

# Desarrollar siguiendo las convenciones
# Agregar tests
# Actualizar documentación
```

### 3. Testing y Quality
```bash
npm run lint:fix       # Arreglar linting
npm run format         # Formatear código
npm test               # Ejecutar tests
npm run build          # Verificar build
```

### 4. Commit y Push
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 5. Pull Request
- Crear PR con descripción detallada
- Asegurar que todos los checks pasen
- Solicitar revisión de código

## 🚀 Deploy

### Build de Producción
```bash
npm run build
```

### Variables de Entorno para Producción
```env
REACT_APP_API_URL=https://api.inteligastro.com/api/v1
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Verificación pre-deploy
```bash
npm run build          # Build exitoso
npm run test           # Tests passing
npm run lint           # Sin errores de linting
```

## 🤝 Contribución

### Para Nuevos Desarrolladores

1. **Leer la documentación**
   - Arquitectura del proyecto
   - Estándares de código
   - Guía de desarrollo

2. **Configurar entorno**
   - Instalar VS Code y extensiones recomendadas
   - Configurar ESLint y Prettier
   - Familiarizarse con la estructura

3. **Comenzar desarrollo**
   - Crear feature branch
   - Seguir convenciones establecidas
   - Escribir tests para nuevo código
   - Actualizar documentación si es necesario

### Reglas de Contribución

- ✅ Seguir estándares de código establecidos
- ✅ Escribir tests para nuevas funcionalidades
- ✅ Actualizar documentación relevante
- ✅ Usar commits descriptivos
- ✅ Asegurar que todos los checks pasen
- ❌ No hacer commits directos a main
- ❌ No ignorar warnings de ESLint
- ❌ No hacer commits sin tests

## 📞 Soporte

Para dudas o problemas:

1. Revisar la [documentación](./docs/)
2. Buscar en issues existentes
3. Crear nuevo issue con detalles específicos
4. Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto es propiedad de Clínica María Belén y está protegido por derechos de autor.

---

**Desarrollado con ❤️ para Clínica María Belén**