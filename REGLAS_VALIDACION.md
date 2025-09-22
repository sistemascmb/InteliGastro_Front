# ✅ REGLAS DE VALIDACIÓN Y ERRORES

## 🔍 Validaciones Frontend (YA IMPLEMENTADAS)
El frontend ya valida estos campos:

### 👥 Pacientes
- **Nombres**: Requerido, mínimo 2 caracteres
- **Apellidos**: Requerido, mínimo 2 caracteres
- **Documento**: Requerido, formato según tipo
- **Email**: Formato de email válido
- **Teléfono**: Solo números, 9 dígitos
- **Fecha Nacimiento**: No futuro, mayor de edad para ciertos casos

### 👨‍⚕️ Personal
- **Email**: Único en el sistema
- **Licencia**: Formato según especialidad
- **Horarios**: No se superpongan

## ❌ Códigos de Error que el Backend DEBE Usar
```javascript
// Errores de validación
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": {
      "email": "Email ya existe",
      "documento": "DNI inválido"
    }
  }
}

// No encontrado
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Paciente no encontrado"
  }
}

// Sin permisos
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No tiene permisos para esta acción"
  }
}

// Conflicto (duplicado)
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Ya existe un paciente con este documento"
  }
}
```

## 🔄 Paginación Estándar
```javascript
// Request
GET /api/v1/patients?page=1&limit=10&search=juan

// Response
{
  "success": true,
  "data": [...], // Array de resultados
  "meta": {
    "total": 150,        // Total de registros
    "page": 1,           // Página actual
    "limit": 10,         // Límite por página
    "totalPages": 15,    // Total de páginas
    "hasNext": true,     // Hay página siguiente
    "hasPrev": false     // Hay página anterior
  }
}
```

## 📅 Formato de Fechas
- **Frontend envía**: `"2024-12-25"` (ISO date)
- **Frontend recibe**: `"2024-12-25T10:30:00Z"` (ISO datetime)
- **Timezone**: UTC en backend, local en frontend