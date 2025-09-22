# ✅ CHECKLIST PARA EL BACKEND

## 🔧 Configuración Básica
- [ ] Backend corriendo en `http://localhost:8000`
- [ ] CORS habilitado para `http://localhost:3000`
- [ ] Middleware de JSON parser
- [ ] Logs de requests/responses
- [ ] Health check en `/api/v1/health`

## 🔐 Autenticación
- [ ] JWT tokens (access + refresh)
- [ ] Middleware de verificación de tokens
- [ ] Endpoints de login/logout/refresh
- [ ] Headers `Authorization: Bearer {token}`

## 📊 Base de Datos
- [ ] Tablas: patients, staff, centers, appointments, examinations, procedures
- [ ] Campos obligatorios según `FORMATOS_DATOS.md`
- [ ] Índices en campos de búsqueda
- [ ] Timestamps (created_at, updated_at)

## 🛠️ Endpoints Críticos
- [ ] `/api/v1/patients` - CRUD completo
- [ ] `/api/v1/staff` - CRUD completo
- [ ] `/api/v1/appointments` - CRUD completo
- [ ] `/api/v1/centers` - Al menos GET
- [ ] Paginación en todas las listas

## 🔍 Validaciones Backend
- [ ] Documentos únicos por tipo
- [ ] Emails únicos
- [ ] Fechas válidas
- [ ] Campos requeridos
- [ ] Respuestas de error estándar

## 🧪 Testing Rápido
Una vez que el backend esté listo:

1. **Test Health**: `GET http://localhost:8000/api/v1/health`
2. **Test Login**: `POST http://localhost:8000/api/v1/auth/login`
3. **Test Pacientes**: `GET http://localhost:8000/api/v1/patients`

## 🔗 Integración
- [ ] Usar el componente `TestConnection` del frontend
- [ ] Verificar logs en ambos lados
- [ ] Probar creación/edición de pacientes
- [ ] Verificar refresh automático de tokens