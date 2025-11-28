// Servicio UBIGEO - Códigos oficiales del Perú
// Basado en el estándar INEI (Instituto Nacional de Estadística e Informática)

import { centrosService } from "./centrosService";

export const ubigeoService = {
  // Países
  paises: [
    { id: 1, codigo: 'PE', nombre: 'Perú' }
  ],

  // Departamentos del Perú
  departamentos: [
    { id: 1, codigo: '06', nombre: 'Cajamarca', paisId: 1 },
    { id: 2, codigo: '15', nombre: 'Lima', paisId: 1 },
    { id: 3, codigo: '13', nombre: 'La Libertad', paisId: 1 },
    // Agregar más según necesidad
  ],

  // Provincias de Cajamarca
  provincias: [
    { id: 1, codigo: '0601', nombre: 'Cajamarca', departamentoId: 1 },
    { id: 2, codigo: '0602', nombre: 'Cajabamba', departamentoId: 1 },
    { id: 3, codigo: '0603', nombre: 'Celendín', departamentoId: 1 },
    { id: 4, codigo: '0604', nombre: 'Chota', departamentoId: 1 },
    { id: 5, codigo: '0605', nombre: 'Contumazá', departamentoId: 1 },
    { id: 6, codigo: '0606', nombre: 'Cutervo', departamentoId: 1 },
    { id: 7, codigo: '0607', nombre: 'Hualgayoc', departamentoId: 1 },
    { id: 8, codigo: '0608', nombre: 'Jaén', departamentoId: 1 },
    { id: 9, codigo: '0609', nombre: 'San Ignacio', departamentoId: 1 },
    { id: 10, codigo: '0610', nombre: 'San Marcos', departamentoId: 1 },
    { id: 11, codigo: '0611', nombre: 'San Miguel', departamentoId: 1 },
    { id: 12, codigo: '0612', nombre: 'San Pablo', departamentoId: 1 },
    { id: 13, codigo: '0613', nombre: 'Santa Cruz', departamentoId: 1 }
  ],

  // Distritos principales de Cajamarca (algunos ejemplos)
  distritos: [
    // Provincia de Cajamarca (id: 1)
    { id: 1, codigo: '060101', nombre: 'Cajamarca', provinciaId: 1 },
    { id: 2, codigo: '060102', nombre: 'Asunción', provinciaId: 1 },
    { id: 3, codigo: '060103', nombre: 'Chetilla', provinciaId: 1 },
    { id: 4, codigo: '060104', nombre: 'Cospan', provinciaId: 1 },
    { id: 5, codigo: '060105', nombre: 'Encañada', provinciaId: 1 },
    { id: 6, codigo: '060106', nombre: 'Jesús', provinciaId: 1 },
    { id: 7, codigo: '060107', nombre: 'Llacanora', provinciaId: 1 },
    { id: 8, codigo: '060108', nombre: 'Los Baños del Inca', provinciaId: 1 },
    { id: 9, codigo: '060109', nombre: 'Magdalena', provinciaId: 1 },
    { id: 10, codigo: '060110', nombre: 'Matara', provinciaId: 1 },
    { id: 11, codigo: '060111', nombre: 'Namora', provinciaId: 1 },
    { id: 12, codigo: '060112', nombre: 'San Juan', provinciaId: 1 },

    // Provincia de Cajabamba (id: 2) - API devuelve provincia: 2
    { id: 13, codigo: '060201', nombre: 'Cajabamba', provinciaId: 2 },
    { id: 14, codigo: '060202', nombre: 'Cachachi', provinciaId: 2 },
    { id: 15, codigo: '060203', nombre: 'Condebamba', provinciaId: 2 }, // ← API devuelve distrito: 3
    { id: 16, codigo: '060204', nombre: 'Sitacocha', provinciaId: 2 }
  ],

  // Métodos auxiliares
  getProvinciasByDepartamento: (departamentoId) => {
    return ubigeoService.provincias.filter(p => p.departamentoId === departamentoId);
  },

  getDistritosByProvincia: (provinciaId) => {
    return ubigeoService.distritos.filter(d => d.provinciaId === provinciaId);
  },







  // Buscar por ID
  //getUbigeoId: async (id) => {
  //  const response = await centrosService.getAllSystemParameterAll();
  //  return response.data.find(p => p.parameterid === id);
  //},
  //getPaisById: async (id) => {
  //  const response = await centrosService.getAllSystemParameterAll();
  //  return response.data.find(p => p.parameterid === id);
  //},
  //getDepartamentoById: async (id) => {
  //  const response = await centrosService.getAllSystemParameterAll();
  //  return response.data.find(p => p.parameterid === id);
  //},
  //getProvinciaById: async (id) => {
  //  const response = await centrosService.getAllSystemParameterAll();
  //  return response.data.find(p => p.parameterid === id);
  //},
  //getDistritoById: async (id) => {
   // const response = await centrosService.getAllSystemParameterAll();
  //  return response.data.find(p => p.parameterid === id);
  //},

  // Formatear ubicación completa
  formatUbicacionCompleta: async (paisId, departamentoId, provinciaId, distritoId) => {
    try {

      const response = await centrosService.getAllSystemParameterAll();
    //return response.data.find(p => p.parameterid === id);
      
      //const pais = await ubigeoService.getUbigeoId(paisId);
      const pais = await response.data.find(p => p.parameterid === paisId);
      const departamento = await response.data.find(p => p.parameterid === departamentoId);
      const provincia = await response.data.find(p => p.parameterid === provinciaId);
      const distrito = await response.data.find(p => p.parameterid === distritoId);

      //const pais = await ubigeoService.getUbigeoId(paisId);
      //const departamento = await ubigeoService.getUbigeoId(departamentoId);
      //const provincia = await ubigeoService.getUbigeoId(provinciaId);
      //const distrito = await ubigeoService.getUbigeoId(distritoId);

      return `${distrito?.value1 || ''}, ${provincia?.value1 || ''}, ${departamento?.value1 || ''}, ${pais?.value1 || ''}`;
    } catch (error) {
      console.error('Error al formatear ubicación:', error);
      return '';
    }
  }
};

export default ubigeoService;