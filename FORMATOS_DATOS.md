# 📊 FORMATOS DE DATOS REQUERIDOS

## 👥 Estructura de Paciente
```javascript
{
  "id": 1,
  "nombres": "Juan Carlos",
  "apellidos": "Pérez Gómez",
  "documento": "71717171",
  "tipoDocumento": "DNI",
  "telefono": "987654321",
  "email": "juan@email.com",
  "fechaNacimiento": "1985-06-15",
  "genero": "M", // M, F, O
  "direccion": "Av. Principal 123",
  "distrito": "Miraflores",
  "provincia": "Lima",
  "departamento": "Lima",
  "seguro": "EsSalud",
  "numeroSeguro": "12345678",
  "contactoEmergencia": {
    "nombre": "María Pérez",
    "telefono": "123456789",
    "relacion": "Esposa"
  },
  "estado": "active", // active, inactive
  "fechaRegistro": "2024-01-15T10:30:00Z",
  "ultimaModificacion": "2024-01-15T10:30:00Z"
}
```

## 👨‍⚕️ Estructura de Personal
```javascript
{
  "id": 1,
  "nombres": "Dr. Pedro",
  "apellidos": "González",
  "documento": "12345678",
  "email": "pedro@clinica.com",
  "telefono": "987654321",
  "especialidad": "Gastroenterología",
  "rol": "doctor", // doctor, nurse, admin, technician
  "numeroLicencia": "CMP-12345",
  "centro_id": 1,
  "horarios": [
    {
      "dia": "lunes",
      "horaInicio": "08:00",
      "horaFin": "17:00"
    }
  ],
  "estado": "active",
  "fechaIngreso": "2024-01-01",
  "salario": 5000.00
}
```

## 📅 Estructura de Cita
```javascript
{
  "id": 1,
  "paciente_id": 1,
  "doctor_id": 2,
  "centro_id": 1,
  "fecha": "2024-12-25",
  "hora": "10:30",
  "tipo": "consulta", // consulta, procedimiento, control
  "estado": "programada", // programada, confirmada, en_curso, completada, cancelada
  "motivo": "Control gastroenterológico",
  "observaciones": "Paciente refiere molestias",
  "duracionEstimada": 30, // minutos
  "precio": 150.00,
  "pagado": false,
  "fechaCreacion": "2024-12-20T14:30:00Z"
}
```

## 🔬 Estructura de Procedimiento
```javascript
{
  "id": 1,
  "paciente_id": 1,
  "doctor_id": 2,
  "examen_id": 3,
  "fecha": "2024-12-25",
  "hora": "09:00",
  "estado": "programado", // programado, en_curso, completado, cancelado
  "preparacion": "Ayuno de 12 horas",
  "observaciones": "Paciente presenta síntomas de...",
  "resultados": null, // Se llena después del procedimiento
  "precio": 300.00,
  "duracion": 45 // minutos
}
```

## 📈 Estructura de Estadísticas
```javascript
{
  "dashboard": {
    "pacientesHoy": 15,
    "citasHoy": 25,
    "procedimientosHoy": 8,
    "ingresosDia": 2500.00,
    "tendencias": {
      "pacientes": "+12%",
      "ingresos": "+8%"
    }
  }
}
```