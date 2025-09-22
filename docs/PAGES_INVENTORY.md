# 📄 Inventario de Páginas - InteliGastro Frontend

## 🎯 Introducción

Este documento proporciona un inventario completo de todas las páginas del sistema InteliGastro, organizadas por módulos de funcionalidad. Cada página incluye su propósito, ubicación en la navegación y principales características.

## 📁 Estructura General de Páginas

```
src/pages/
├── Home.js                     # Página principal del sistema
├── Login.js                    # Página de autenticación (temporal)
├── LoginDemo.js                # Página de login demo
├── HomeConAuth.js              # Home con autenticación
├── admision/                   # 2 páginas
│   ├── CitaMedica.js
│   └── ProcedimientoAdmision.js
├── citas/                      # 3 páginas
│   ├── Agendadas.js
│   ├── EnEspera.js
│   └── Finalizadas.js
├── procedimientos/             # 5 páginas
│   ├── AgendaHoy.js
│   ├── Ordenes.js
│   ├── Agendados.js
│   ├── Completados.js
│   └── Altas.js
├── pacientes/                  # 1 página
│   └── Pacientes.js
├── info-clinica/               # 3 páginas
│   ├── Examenes.js
│   ├── Suministros.js
│   └── Cie10.js
├── estadisticas/               # 5 páginas
│   ├── Dashboard.js
│   ├── Detallado.js
│   ├── Pacientes.js
│   ├── Personal.js
│   └── Procedimientos.js
└── administracion/             # 14 páginas
    ├── Centros.js
    ├── Personal.js
    ├── Horario.js
    ├── Estudios.js
    ├── Salas.js
    ├── Recursos.js
    ├── Examenes.js
    ├── Preparacion.js
    ├── Seguros.js
    ├── Roles.js
    ├── Usuarios.js
    ├── Plantillas.js
    ├── Macros.js
    └── MedicosRef.js
```

**Total: 37 páginas** organizadas en 7 módulos principales.

---

## 🏠 **Página Principal**

### Home.js
- **Ruta**: `/` o `/home`
- **Propósito**: Dashboard principal con bienvenida al sistema
- **Características**:
  - Bienvenida al sistema "INTELLISUITE"
  - Fecha actual en español
  - Tarjetas de navegación rápida
  - Acceso directo a módulos principales
- **UI**: Cards con iconos para navegación rápida

---

## 🔐 **Módulo de Autenticación** (Temporal)

### Login.js
- **Ruta**: `/login`
- **Propósito**: Página de autenticación básica
- **Estado**: No se usa actualmente

### LoginDemo.js
- **Ruta**: `/login-demo`
- **Propósito**: Demo de login con roles
- **Estado**: Demo/testing

### HomeConAuth.js
- **Propósito**: Home con funcionalidades de autenticación
- **Estado**: Alternativa con auth implementada

---

## 🏥 **Módulo de Admisión** (2 páginas)

### 1. CitaMedica.js
- **Ruta**: `/admision/cita`
- **Propósito**: Gestión de citas médicas nuevas
- **Características**:
  - Formulario de nueva cita médica
  - Wizard/stepper para pasos del proceso
  - Búsqueda de pacientes existentes
  - Selección de médicos y especialidades
  - Calendario para fechas disponibles
- **UI**: Stepper con múltiples pasos, formularios complejos

### 2. ProcedimientoAdmision.js
- **Ruta**: `/admision/procedimiento`
- **Propósito**: Admisión de procedimientos médicos
- **Características**:
  - Registro de nuevos procedimientos
  - Asociación con pacientes
  - Selección de tipo de procedimiento
  - Programación de fechas
- **UI**: Formularios con validación, selecciones múltiples

---

## 📅 **Módulo de Citas** (3 páginas)

### 1. Agendadas.js
- **Ruta**: `/citas/agendas`
- **Propósito**: Listado de citas programadas
- **Características**:
  - Tabla de citas agendadas
  - Filtros por fecha, médico, especialidad
  - Estados de citas
  - Acciones: ver, editar, cancelar
- **UI**: Tabla con filtros, chips de estado

### 2. EnEspera.js
- **Ruta**: `/citas/espera`
- **Propósito**: Citas en sala de espera
- **Características**:
  - Lista de pacientes esperando
  - Tiempo de espera
  - Prioridades
  - Llamar a consulta
- **UI**: Lista en tiempo real, botones de acción

### 3. Finalizadas.js
- **Ruta**: `/citas/finalizadas`
- **Propósito**: Historial de citas completadas
- **Características**:
  - Archivo de citas completadas
  - Reportes de atención
  - Búsqueda histórica
  - Exportación de datos
- **UI**: Tabla con paginación, filtros avanzados

---

## 🏥 **Módulo de Procedimientos** (5 páginas)

### 1. AgendaHoy.js
- **Ruta**: `/procedimientos/agenda-hoy`
- **Propósito**: Agenda diaria de procedimientos
- **Características**:
  - Vista del día actual
  - Procedimientos programados
  - Estado en tiempo real
  - Reasignación rápida
- **UI**: Vista de calendario/lista diaria

### 2. Ordenes.js
- **Ruta**: `/procedimientos/ordenes`
- **Propósito**: Gestión de órdenes médicas
- **Características**:
  - Creación de órdenes
  - Seguimiento de órdenes
  - Aprobaciones necesarias
  - Historial de órdenes
- **UI**: Formularios complejos, workflow de aprobaciones

### 3. Agendados.js
- **Ruta**: `/procedimientos/agendados`
- **Propósito**: Procedimientos programados
- **Características**:
  - Lista de procedimientos agendados
  - Filtros por fecha y tipo
  - Gestión de estados
  - Reasignación de fechas
- **UI**: Tabla con chips de estado, modales de edición

### 4. Completados.js
- **Ruta**: `/procedimientos/completados`
- **Propósito**: Procedimientos finalizados
- **Características**:
  - Archivo de procedimientos completados
  - Reportes de resultados
  - Documentación médica
  - Facturación
- **UI**: Tabla con documentos adjuntos

### 5. Altas.js
- **Ruta**: `/procedimientos/altas`
- **Propósito**: Gestión de altas médicas
- **Características**:
  - Proceso de alta de pacientes
  - Documentación de alta
  - Instrucciones post-alta
  - Seguimiento
- **UI**: Formularios de alta, documentos PDF

---

## 👥 **Módulo de Pacientes** (1 página)

### Pacientes.js
- **Ruta**: `/pacientes/pacientes`
- **Propósito**: Gestión completa de pacientes
- **Características**:
  - CRUD completo de pacientes
  - Búsqueda avanzada
  - Historial médico
  - Documentos del paciente
  - Información de contacto
  - Datos de emergencia
- **UI**: Tabla con búsqueda, modal de edición completo, tabs para diferentes secciones

---

## ℹ️ **Módulo de Información Clínica** (3 páginas)

### 1. Examenes.js
- **Ruta**: `/info-clinica/examenes`
- **Propósito**: Catálogo de exámenes disponibles
- **Características**:
  - Lista de exámenes médicos
  - Descripciones y preparaciones
  - Precios y duración
  - Gestión del catálogo
- **UI**: Tabla editable, formularios de examen

### 2. Suministros.js
- **Ruta**: `/info-clinica/suministros`
- **Propósito**: Inventario de suministros médicos
- **Características**:
  - Control de inventario
  - Alertas de stock bajo
  - Proveedores
  - Historial de movimientos
- **UI**: Tabla con alertas, gráficos de inventario

### 3. Cie10.js
- **Ruta**: `/info-clinica/cie10`
- **Propósito**: Códigos de diagnóstico CIE-10
- **Características**:
  - Búsqueda de códigos CIE-10
  - Descripción de diagnósticos
  - Códigos frecuentes
  - Historial de uso
- **UI**: Búsqueda inteligente, lista de resultados

---

## 📊 **Módulo de Estadísticas** (5 páginas)

### 1. Dashboard.js
- **Ruta**: `/estadisticas/dashboard`
- **Propósito**: Panel principal de estadísticas
- **Características**:
  - KPIs principales
  - Gráficos en tiempo real
  - Métricas de rendimiento
  - Comparativas temporales
- **UI**: Cards con métricas, gráficos interactivos

### 2. Detallado.js
- **Ruta**: `/estadisticas/detallado`
- **Propósito**: Reportes detallados personalizables
- **Características**:
  - Reportes personalizados
  - Filtros avanzados
  - Exportación a Excel/PDF
  - Comparativas históricas
- **UI**: Filtros complejos, tablas exportables

### 3. Pacientes.js
- **Ruta**: `/estadisticas/pacientes`
- **Propósito**: Estadísticas específicas de pacientes
- **Características**:
  - Demografia de pacientes
  - Frecuencia de visitas
  - Patologías más comunes
  - Satisfacción del paciente
- **UI**: Gráficos demográficos, tablas de análisis

### 4. Personal.js
- **Ruta**: `/estadisticas/personal`
- **Propósito**: Métricas del personal médico
- **Características**:
  - Productividad del personal
  - Horarios de trabajo
  - Carga de trabajo
  - Evaluaciones
- **UI**: Gráficos de rendimiento, calendarios

### 5. Procedimientos.js
- **Ruta**: `/estadisticas/procedimientos`
- **Propósito**: Análisis de procedimientos médicos
- **Características**:
  - Procedimientos más frecuentes
  - Tiempos de ejecución
  - Tasas de éxito
  - Costos y rentabilidad
- **UI**: Gráficos de barras, tablas de análisis

---

## ⚙️ **Módulo de Administración** (14 páginas)

### 1. Centros.js
- **Ruta**: `/administracion/centros`
- **Propósito**: Gestión de centros médicos
- **Características**:
  - CRUD de centros/sucursales
  - Información de contacto
  - Servicios por centro
  - Personal asignado
- **UI**: Tabla con tabs, formularios de centro

### 2. Personal.js
- **Ruta**: `/administracion/personal`
- **Propósito**: Gestión de personal médico y administrativo
- **Características**:
  - CRUD de empleados
  - Roles y especialidades
  - Horarios de trabajo
  - Documentación laboral
- **UI**: Tabla con filtros, formularios complejos

### 3. Horario.js
- **Ruta**: `/administracion/horarios`
- **Propósito**: Gestión de horarios de atención
- **Características**:
  - Horarios por médico
  - Horarios por servicio
  - Bloques de tiempo
  - Excepciones y feriados
- **UI**: Calendario semanal, formularios de horario

### 4. Estudios.js
- **Ruta**: `/administracion/estudios`
- **Propósito**: Catálogo de estudios médicos
- **Características**:
  - Tipos de estudios
  - Equipos necesarios
  - Preparaciones requeridas
  - Tiempos de proceso
- **UI**: Tabla categorizada, formularios detallados

### 5. Salas.js
- **Ruta**: `/administracion/salas`
- **Propósito**: Gestión de salas y consultorios
- **Características**:
  - Inventario de salas
  - Equipamiento por sala
  - Disponibilidad
  - Mantenimiento
- **UI**: Vista de planta, formularios de sala

### 6. Recursos.js
- **Ruta**: `/administracion/recursos`
- **Propósito**: Gestión de recursos y equipos
- **Características**:
  - Inventario de equipos
  - Mantenimientos programados
  - Garantías y proveedores
  - Historial de reparaciones
- **UI**: Tabla con estados, calendarios de mantenimiento

### 7. Examenes.js
- **Ruta**: `/administracion/examenes`
- **Propósito**: Configuración de exámenes médicos
- **Características**:
  - Configuración de parámetros
  - Valores de referencia
  - Protocolos de examen
  - Interpretaciones
- **UI**: Formularios técnicos, tablas de parámetros

### 8. Preparacion.js
- **Ruta**: `/administracion/preparacion`
- **Propósito**: Instrucciones de preparación para estudios
- **Características**:
  - Instrucciones por tipo de estudio
  - Tiempos de preparación
  - Restricciones alimentarias
  - Medicamentos a suspender
- **UI**: Editor de instrucciones, plantillas

### 9. Seguros.js
- **Ruta**: `/administracion/seguros`
- **Propósito**: Gestión de seguros médicos
- **Características**:
  - Lista de seguros aceptados
  - Coberturas por seguro
  - Autorizaciones requeridas
  - Tarifas especiales
- **UI**: Tabla con coberturas, formularios de seguro

### 10. Roles.js
- **Ruta**: `/administracion/roles`
- **Propósito**: Gestión de roles y permisos
- **Características**:
  - Definición de roles
  - Permisos por módulo
  - Jerarquías de acceso
  - Auditoría de permisos
- **UI**: Matriz de permisos, árbol de roles

### 11. Usuarios.js
- **Ruta**: `/administracion/usuarios`
- **Propósito**: Gestión de usuarios del sistema
- **Características**:
  - CRUD de usuarios
  - Asignación de roles
  - Estados de cuenta
  - Auditoría de accesos
- **UI**: Tabla con roles, formularios de usuario

### 12. Plantillas.js
- **Ruta**: `/administracion/plantillas`
- **Propósito**: Plantillas de documentos médicos
- **Características**:
  - Plantillas de reportes
  - Plantillas de recetas
  - Plantillas de órdenes
  - Variables dinámicas
- **UI**: Editor de plantillas, vista previa

### 13. Macros.js
- **Ruta**: `/administracion/macros`
- **Propósito**: Macros y textos predefinidos
- **Características**:
  - Textos frecuentes
  - Diagnósticos comunes
  - Instrucciones estándar
  - Variables automáticas
- **UI**: Lista categorizada, editor de macros

### 14. MedicosRef.js
- **Ruta**: `/administracion/medicos-ref`
- **Propósito**: Médicos de referencia externos
- **Características**:
  - Red de médicos referentes
  - Especialidades de referencia
  - Datos de contacto
  - Protocolos de referencia
- **UI**: Directorio médico, formularios de contacto

---

## 🎨 **Patrones de UI Comunes**

### Componentes Reutilizados:
- **SectionHeader**: Header azul con título de sección
- **Breadcrumbs**: Navegación de migas de pan
- **ResponsiveField**: Campos de formulario adaptativos
- **Tablas**: Tablas con filtros, paginación y acciones
- **Modales**: Dialogs para edición y confirmación
- **Chips**: Estados y categorías
- **Steppers**: Procesos de múltiples pasos

### Colores y Tema:
- **Color primario**: #2184be (azul corporativo)
- **Color secundario**: #dc004e (rosa/rojo)
- **Fondo**: #f5f5f5 (gris claro)
- **Tarjetas**: #ffffff con sombras sutiles

### Iconografía:
- Material-UI Icons consistentes
- Iconos específicos por funcionalidad
- Estados visuales claros

---

## 🔄 **Navegación y Rutas**

### Estructura de URLs:
```
/                                    # Home
/admision/cita                      # Cita médica
/admision/procedimiento             # Procedimiento admisión
/citas/agendas                      # Citas agendadas
/citas/espera                       # Citas en espera
/citas/finalizadas                  # Citas finalizadas
/procedimientos/agenda-hoy          # Agenda de hoy
/procedimientos/ordenes             # Órdenes
/procedimientos/agendados           # Procedimientos agendados
/procedimientos/completados         # Procedimientos completados
/procedimientos/altas               # Altas médicas
/pacientes/pacientes                # Gestión de pacientes
/info-clinica/examenes              # Catálogo de exámenes
/info-clinica/suministros           # Inventario suministros
/info-clinica/cie10                 # Códigos CIE-10
/estadisticas/dashboard             # Dashboard principal
/estadisticas/detallado             # Reportes detallados
/estadisticas/pacientes             # Stats de pacientes
/estadisticas/personal              # Stats de personal
/estadisticas/procedimientos        # Stats de procedimientos
/administracion/*                   # 14 páginas de administración
```

---

## 📈 **Estado del Desarrollo**

### Completamente Implementadas:
- ✅ Home y navegación principal
- ✅ Estructura básica de todas las páginas
- ✅ UI/UX consistente con Material-UI
- ✅ Routing completo
- ✅ Componentes reutilizables

### En Desarrollo:
- 🔄 Integración con APIs backend
- 🔄 Validaciones de formularios
- 🔄 Manejo de estados complejos
- 🔄 Funcionalidades específicas por página

### Pendientes:
- ⏳ Autenticación y autorización
- ⏳ Testing unitario e integración
- ⏳ Optimización de performance
- ⏳ Documentación de usuario

---

**Este inventario proporciona una visión completa del alcance funcional del sistema InteliGastro, facilitando el desarrollo y mantenimiento futuro.**