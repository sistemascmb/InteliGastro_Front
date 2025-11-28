# Documento Técnico – InteliGastro Frontend

## 1. Resumen
- Aplicación SPA en React para gestión clínica gastroenterológica.
- UI con MUI, enrutamiento con React Router, cliente HTTP con Axios.
- Autenticación por tokens almacenados en `localStorage/sessionStorage`.
- Servicios modulares para dominios clínicos (pacientes, citas, procedimientos, etc.).
- Módulo crítico de captura de imágenes con requisitos de contexto seguro (HTTPS/localhost) y puente nativo opcional.

## 2. Stack Técnico
- React `^19.1.1`, React Router DOM `^7.8.2`, MUI `^7.3.2` (`package.json:5-29`).
- Axios `^1.12.2` para HTTP.
- Herramientas: Create React App (`react-scripts`), Testing Library.

## 3. Estructura del Proyecto (alto nivel)
- `src/` código de la app
  - `components/` Layout, auth guards y utilidades UI. Ej.: `src/components/Layout/MainLayout.js`.
  - `pages/` pantallas por módulo (admision, citas, procedimientos, etc.). Ej.: `src/pages/procedimientos/Altas.js`.
  - `services/` capa de servicios por dominio y factory CRUD (`src/services/index.js:29`).
  - `core/` configuración base (env, axios, constantes). Ej.: `src/core/config/api.js:7` crea `apiClient`.
  - `shared/` servicios y hooks compartidos. Ej.: `src/shared/services/api-client.js:1`, `src/shared/hooks/useAuth.js:9`.
  - `constants/` constantes de API y paginación (`src/constants/api.js:1-7,9-26`).
  - `setupProxy.js` proxy dev a backend (`src/setupProxy.js:5-19`).
- Aliases TS/JS: `@/core/*`, `@/shared/*`, etc. (`jsconfig.json:2-10`).

## 4. Arranque y Scripts
- Desarrollo: `npm start`.
- Build: `npm run build`.
- Test: `npm test` (`package.json:30-34`).

## 5. Configuración por Entorno
Variables claves en `.env`:
- API base: `REACT_APP_API_URL` (`.env:11`). Ej.: `http://192.168.1.55:8090/api`.
- Timeout: `REACT_APP_API_TIMEOUT` (`.env:23-25`).
- Flags: `REACT_APP_DEBUG`, `REACT_APP_ENABLE_CACHE`, etc. (`.env:58-71,118-120`).
- HTTPS dev: `HTTPS=true`, `HOST=0.0.0.0` (`.env:125-167`).
- Captura: `REACT_APP_CAPTURE_BRIDGE_ENABLED` (`.env:73`) y almacenamiento local `REACT_APP_ALMACENAMIENTO_URL` (`.env:13`).

## 6. Enrutamiento y Layout
- Router principal y rutas protegidas definidas en `src/AppConAuth.js:65-244`.
- Protección por rol/permisos con `ProtectedRoute` (`src/components/Auth/ProtectedRoute.js:5-31`).
- Layout general con sidebar/encabezado: `src/components/Layout/MainLayout.js:21-44` y control de visibilidad para captura (`src/components/Layout/MainLayout.js:27-30`).

## 7. Autenticación y Sesión
- Guardado de tokens y usuario:
  - Servicio clásico: `authService` (`src/services/index.js:99-165`).
  - Servicios de storage centralizados: `src/shared/services/storage-service.js:49-90,121-126`.
- Hook de auth moderno: `src/shared/hooks/useAuth.js:9-36,38-83` (login/logout/refresh, permisos).
- Guard de rutas usa `authService` (estado actual mixto) (`src/components/Auth/ProtectedRoute.js:3,5-31`).

## 8. Cliente HTTP y Endpoints
- Cliente centralizado Axios con interceptores y refresh:
  - `apiClient` (`src/core/config/api.js:7-13,15-61`). Base URL desde `getEnvVar` (`src/core/config/env.js:1-9,11-18`).
- Cliente alterno y wrapper:
  - `api` wrapper con interceptores y helpers (`src/utils/apiClient.js:1-12,14-41,42-141,143-194`).
  - Clase `ApiClient` (singleton) que envuelve `apiClient` (`src/shared/services/api-client.js:1-8,10-59,61-79,81-121`).
- Endpoints declarativos:
  - `core/constants/api-endpoints.js` (`src/core/constants/api-endpoints.js:1-16,25-41,49-56,74-81`).
  - `constants/api.js` incluye otra lista y config (`src/constants/api.js:9-26,27-51,97-119,121-151`).

Estado actual: coexisten 3 clientes (core `apiClient`, utils `api`, shared `ApiClient`). Varios servicios consumen `api` de `utils` (p.ej. `src/services/patientsService.js:1-4`).

Recomendación: unificar en `core/config/api.js` + `core/constants/api-endpoints.js` y migrar servicios.

## 9. Capa de Servicios
- Factory CRUD genérico (`src/services/index.js:28-65`).
- Servicios específicos por dominio con mapeos de datos y validaciones (ejemplos):
  - Pacientes (`src/services/patientsService.js:1-4,5-39`).
  - Citas/Procedimientos (`src/services/appointmentsService.js:336-373`).
  - Archivo Digital (`src/services/archivodigitalService.js:406-442`).
  - Médicos Referencia (`src/services/medicosRefService.js:151-196`).

Convención: la mayoría retorna `{ data, status }` o colecciones depuradas.

## 10. Proxy y CORS (Desarrollo)
- Proxy dev de `/api` al backend (`src/setupProxy.js:5-19`). Evita CORS y simplifica base URL en dev.

## 11. Captura de Imágenes (Core)
- Pantalla: `src/pages/procedimientos/CapturaImagenes.js`.
- Requisitos de seguridad: enumeración de dispositivos solo en contexto seguro (HTTPS/localhost) (`src/pages/procedimientos/CapturaImagenes.js:210-223`).
- Flags y puente nativo:
  - `REACT_APP_CAPTURE_BRIDGE_ENABLED` para activar puente.
  - Host/puertos configurables; base URL del puente (`src/pages/procedimientos/CapturaImagenes.js:118-129`).
- Almacenamiento local:
  - File System Access API con permisos del usuario; persistencia de `DirectoryHandle` en IndexedDB (`src/pages/procedimientos/CapturaImagenes.js:161-176,178-196`).
- Dispositivos HID (pedal) y Gamepad con listeners (`src/pages/procedimientos/CapturaImagenes.js:575-588`).

Buenas prácticas: ejecutar sobre HTTPS, revisar permisos del navegador, usar proxy/puente en producción bajo el mismo dominio para evitar mixed content.

## 12. Manejo de Errores y Estados HTTP
- Códigos y mensajes estándar (`src/constants/api.js:121-151`).
- Interceptores de respuesta manejan 401/refresh, 403, 404, 409, 400, 500 en `utils/apiClient` (`src/utils/apiClient.js:69-141`) y 401 refresh en `core/config/api.js:28-61`.

## 13. Rendimiento y UX
- Listas virtualizadas con `react-window` en pantallas de alto volumen.
- Caching configurable vía flags (`.env:118-120`).
- Paginación estándar (`src/constants/api.js:145-151`).

## 14. Seguridad
- Tokens en storage y refresh automático (`src/core/config/api.js:33-57`).
- Contexto seguro para cámara/micrófono (HTTPS) (`src/pages/procedimientos/CapturaImagenes.js:218-223`).
- Opcional CSP: `REACT_APP_CSP_ENABLED` (`.env:129`).

## 15. Pruebas
- Dependencias de Testing Library (`package.json:11-14,27`).
- Componente de verificación de API: `src/components/TestConnection.js:1-20,32-52`.

## 16. Flujo de Usuario (alto nivel)
1) Login
- Usuario envía credenciales → `auth/login` → guarda tokens/usuario (`src/shared/hooks/useAuth.js:38-68` o `src/services/index.js:101-124`).
2) Navegación
- Rutas protegidas verifican autenticación/roles (`src/components/Auth/ProtectedRoute.js:5-31`).
3) Consumo de API
- Servicios invocan cliente HTTP → interceptores añaden token (`src/core/config/api.js:15-23`).
4) Captura de imágenes
- Verifica contexto seguro y permisos → inicia `getUserMedia` → guarda en carpeta local o sube vía servicio.

## 18. Operación y Despliegue
- Build estático con CRA: `npm run build`.
- Requisitos en producción del módulo de captura:
  - Servir bajo HTTPS, y ubicar el puente (si se usa) detrás del mismo dominio (reverse proxy) para evitar `ERR_CONNECTION_REFUSED`/mixed content.

## 19. Referencias Rápidas (archivos clave)
- Router: `src/AppConAuth.js:65-244`.
- Guard de rutas: `src/components/Auth/ProtectedRoute.js:5-31`.
- Layout: `src/components/Layout/MainLayout.js:21-44,27-30`.
- Cliente HTTP (core): `src/core/config/api.js:7-13,15-61`.
- Endpoints: `src/core/constants/api-endpoints.js:1-16,25-41,49-56,74-81`.
- Servicios CRUD: `src/services/index.js:28-75`.
- Auth servicio: `src/services/index.js:99-165`; Auth hook: `src/shared/hooks/useAuth.js:9-36,38-83`.
- Captura: `src/pages/procedimientos/CapturaImagenes.js:118-129,210-223`.
- Proxy dev: `src/setupProxy.js:5-19`.

---
Este documento resume la arquitectura y los módulos core para que cualquier desarrollador pueda orientarse rápidamente, ejecutar el proyecto, entender los flujos críticos y continuar con la evolución técnica propuesta.