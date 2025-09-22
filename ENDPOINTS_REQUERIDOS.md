# 📋 ENDPOINTS REQUERIDOS PARA EL BACKEND

## 🔐 Autenticación
```
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/verify
```

## 👥 Pacientes
```
GET    /api/v1/patients           # Listar pacientes
POST   /api/v1/patients           # Crear paciente
GET    /api/v1/patients/:id       # Obtener paciente
PUT    /api/v1/patients/:id       # Actualizar paciente
DELETE /api/v1/patients/:id       # Eliminar paciente
GET    /api/v1/patients/search    # Buscar pacientes
PATCH  /api/v1/patients/:id       # Cambiar estado
```

## 👨‍⚕️ Personal
```
GET    /api/v1/staff              # Listar personal
POST   /api/v1/staff              # Crear personal
GET    /api/v1/staff/:id          # Obtener personal
PUT    /api/v1/staff/:id          # Actualizar personal
DELETE /api/v1/staff/:id          # Eliminar personal
GET    /api/v1/staff/doctors      # Solo doctores
GET    /api/v1/staff/nurses       # Solo enfermeras
```

## 🏥 Centros
```
GET    /api/v1/centers            # Listar centros
POST   /api/v1/centers            # Crear centro
GET    /api/v1/centers/:id        # Obtener centro
PUT    /api/v1/centers/:id        # Actualizar centro
DELETE /api/v1/centers/:id        # Eliminar centro
GET    /api/v1/centers/active     # Solo activos
```

## 📅 Citas
```
GET    /api/v1/appointments                    # Listar citas
POST   /api/v1/appointments                    # Crear cita
GET    /api/v1/appointments/:id               # Obtener cita
PUT    /api/v1/appointments/:id               # Actualizar cita
DELETE /api/v1/appointments/:id               # Eliminar cita
GET    /api/v1/appointments/date/:date        # Por fecha
GET    /api/v1/appointments/patient/:id       # Por paciente
GET    /api/v1/appointments/doctor/:id        # Por doctor
GET    /api/v1/appointments/pending           # Pendientes
GET    /api/v1/appointments/completed         # Completadas
```

## 🔬 Exámenes
```
GET    /api/v1/examinations           # Listar exámenes
POST   /api/v1/examinations           # Crear examen
GET    /api/v1/examinations/:id       # Obtener examen
PUT    /api/v1/examinations/:id       # Actualizar examen
DELETE /api/v1/examinations/:id       # Eliminar examen
```

## 🏥 Procedimientos
```
GET    /api/v1/procedures                  # Listar procedimientos
POST   /api/v1/procedures                  # Crear procedimiento
GET    /api/v1/procedures/:id             # Obtener procedimiento
PUT    /api/v1/procedures/:id             # Actualizar procedimiento
DELETE /api/v1/procedures/:id             # Eliminar procedimiento
GET    /api/v1/procedures/today           # Hoy
GET    /api/v1/procedures/scheduled       # Programados
GET    /api/v1/procedures/patient/:id     # Por paciente
```

## 📊 Estadísticas
```
GET    /api/v1/statistics/dashboard    # Dashboard principal
GET    /api/v1/statistics/patients     # Estadísticas pacientes
GET    /api/v1/statistics/procedures   # Estadísticas procedimientos
GET    /api/v1/statistics/staff        # Estadísticas personal
GET    /api/v1/statistics/revenue      # Ingresos
```

## ⚕️ Información Clínica
```
GET    /api/v1/clinical/cie10          # Códigos CIE-10
GET    /api/v1/clinical/supplies       # Insumos
GET    /api/v1/clinical/medications    # Medicamentos
```

## 🔧 Sistema
```
GET    /api/v1/health                  # Health check
GET    /api/v1/admin/users             # Usuarios
GET    /api/v1/admin/roles             # Roles
GET    /api/v1/admin/permissions       # Permisos
```