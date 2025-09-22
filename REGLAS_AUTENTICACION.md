# 🔒 REGLAS DE AUTENTICACIÓN

## 📝 Login Request
```javascript
POST /api/v1/auth/login
{
  "email": "doctor@clinica.com",
  "password": "password123"
}
```

## ✅ Login Response
```javascript
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "doctor@clinica.com",
      "nombre": "Dr. Juan",
      "apellido": "Pérez",
      "role": "doctor",
      "permissions": ["patients:read", "appointments:write"],
      "centro_id": 1
    }
  }
}
```

## 🔑 Headers Requeridos
```javascript
// Todas las peticiones autenticadas DEBEN incluir:
Authorization: Bearer {accessToken}
Content-Type: application/json
```

## 🔄 Token Refresh
```javascript
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response:
{
  "success": true,
  "data": {
    "accessToken": "nuevo_token_aqui"
  }
}
```

## ⏱️ Tiempo de Vida
- **Access Token**: 60 minutos
- **Refresh Token**: 7 días
- **Auto-refresh**: El frontend lo hace automáticamente