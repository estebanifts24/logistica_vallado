// ---------------------------------------------------------------
// Servicio de Operativos
// ---------------------------------------------------------------

// Importamos funciones del modelo que interactúan con la base de datos
// Cada función realiza operaciones CRUD reales sobre los operativos
import {
  getAllOperativos,     // Trae todos los operativos
  getOperativoById,     // Trae un operativo específico por ID
  createOperativo,      // Crea un nuevo operativo
  updateOperativo,      // Actualiza un operativo existente
  deleteOperativo,      // Elimina un operativo por ID
  searchOperativos      // Busca operativos por nombre
} from "../models/operativos.model.js";

// Detectamos si estamos en modo desarrollo
// Esto permite imprimir logs de seguimiento solo en desarrollo
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todos los operativos
// ------------------------
export const listarOperativosService = () => {
  const result = getAllOperativos();

  // Log en desarrollo para mostrar cantidad de operativos obtenidos
  if (isDevelopment) {
    console.log("[listarOperativosService] Petición GET /operativos recibida");
    console.log("[listarOperativosService] Cantidad de operativos listados:", result.length);
  }

  return result; // Retorna la lista de operativos
};

// ------------------------
// Obtener un operativo por ID
// ------------------------
export const obtenerOperativoService = (id) => {
  if (!id) {
    if (isDevelopment) console.log("[obtenerOperativoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = getOperativoById(id);

  // Log en desarrollo mostrando la petición y el resultado
  if (isDevelopment) {
    console.log(`[obtenerOperativoService] Petición GET /operativos/${id} recibida`);
    console.log("[obtenerOperativoService] Resultado:", result || "No encontrado");
  }

  return result; // Retorna el operativo encontrado
};

// ------------------------
// Crear un nuevo operativo
// ------------------------
export const crearOperativoService = (data) => {
  if (!data) {
    if (isDevelopment) console.log("[crearOperativoService] Error: Datos inválidos");
    throw new Error("Datos inválidos.");
  }

  const result = createOperativo(data);

  // Log en desarrollo mostrando el operativo creado
  if (isDevelopment) {
    console.log("[crearOperativoService] Petición POST /operativos recibida");
    console.log("[crearOperativoService] Operativo creado:", result);
  }

  return result; // Retorna el operativo creado
};

// ------------------------
// Actualizar un operativo existente
// ------------------------
export const actualizarOperativoService = (id, data) => {
  if (!id) {
    if (isDevelopment) console.log("[actualizarOperativoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = updateOperativo(id, data);

  // Log en desarrollo mostrando la actualización realizada
  if (isDevelopment) {
    console.log(`[actualizarOperativoService] Petición PUT /operativos/${id} recibida`);
    console.log("[actualizarOperativoService] Operativo actualizado:", result);
  }

  return result; // Retorna el operativo actualizado
};

// ------------------------
// Eliminar un operativo por ID
// ------------------------
export const eliminarOperativoService = (id) => {
  if (!id) {
    if (isDevelopment) console.log("[eliminarOperativoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = deleteOperativo(id);

  // Log en desarrollo mostrando la eliminación
  if (isDevelopment) {
    console.log(`[eliminarOperativoService] Petición DELETE /operativos/${id} recibida`);
    console.log("[eliminarOperativoService] Resultado de eliminación:", result);
  }

  return result; // Retorna true/false según el resultado del modelo
};

// ------------------------
// Buscar operativos por nombre
// ------------------------
export const buscarOperativosService = (nombre) => {
  if (!nombre) {
    if (isDevelopment) console.log("[buscarOperativosService] Error: Nombre requerido");
    throw new Error("Nombre requerido.");
  }

  const result = searchOperativos(nombre);

  // Log en desarrollo mostrando la búsqueda realizada
  if (isDevelopment) {
    console.log(`[buscarOperativosService] Petición GET /operativos/search?nombre=${nombre} recibida`);
    console.log("[buscarOperativosService] Operativos encontrados:", result.length);
  }

  return result; // Retorna los operativos que coinciden con el nombre
};
