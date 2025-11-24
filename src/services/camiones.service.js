// ---------------------------------------------------------------
// Servicio de Camiones
// ---------------------------------------------------------------

// Importamos funciones del modelo que interactúan con la "base de datos"
// Cada función realiza operaciones CRUD reales sobre los camiones
import {
  getAllCamiones,   // Obtiene todos los camiones
  getCamionById,    // Obtiene un camión por su ID
  createCamion,     // Crea un nuevo camión
  updateCamion,     // Actualiza un camión existente
  deleteCamion,     // Elimina un camión por ID
  searchCamiones    // Busca camiones por patente
} from "../models/camiones.model.js";

// Detectamos si estamos en modo desarrollo
// Esto nos permite imprimir logs solo en desarrollo y no en producción
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todos los camiones
// ------------------------
export const listarCamionesService = () => {
  // Llamamos al modelo para traer todos los camiones
  const result = getAllCamiones();

  // En desarrollo, imprimimos un log con información de la petición y cantidad de resultados
  if (isDevelopment) {
    console.log("[listarCamionesService] Petición GET /camiones recibida");
    console.log("[listarCamionesService] Cantidad de camiones listados:", result.length);
  }

  // Retornamos la lista de camiones al controlador
  return result;
};

// ------------------------
// Obtener un camión por ID
// ------------------------
export const obtenerCamionService = (id) => {
  // Validación: verificamos que exista un ID
  if (!id) {
    if (isDevelopment) console.log("[obtenerCamionService] Error: ID requerido");
    throw new Error("ID requerido."); // Arroja error si no hay ID
  }

  // Llamamos al modelo para obtener el camión con el ID indicado
  const result = getCamionById(id);

  // Log en desarrollo para mostrar la petición y el resultado
  if (isDevelopment) {
    console.log(`[obtenerCamionService] Petición GET /camiones/${id} recibida`);
    console.log("[obtenerCamionService] Resultado:", result || "No encontrado");
  }

  return result; // Retorna el camión encontrado o null si no existe
};

// ------------------------
// Crear un nuevo camión
// ------------------------
export const crearCamionService = (data) => {
  // Validación: los datos enviados no pueden estar vacíos
  if (!data) {
    if (isDevelopment) console.log("[crearCamionService] Error: Datos inválidos");
    throw new Error("Datos inválidos.");
  }

  // Llamamos al modelo para crear el nuevo camión
  const result = createCamion(data);

  // Log en desarrollo para mostrar la petición POST y el camión creado
  if (isDevelopment) {
    console.log("[crearCamionService] Petición POST /camiones recibida");
    console.log("[crearCamionService] Camión creado:", result);
  }

  return result; // Retorna el camión creado
};

// ------------------------
// Actualizar un camión existente
// ------------------------
export const actualizarCamionService = (id, data) => {
  // Validación: necesitamos un ID
  if (!id) {
    if (isDevelopment) console.log("[actualizarCamionService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  // Llamamos al modelo para actualizar el camión con los datos recibidos
  const result = updateCamion(id, data);

  // Log en desarrollo para mostrar la petición PUT y los datos actualizados
  if (isDevelopment) {
    console.log(`[actualizarCamionService] Petición PUT /camiones/${id} recibida`);
    console.log("[actualizarCamionService] Datos actualizados:", result);
  }

  return result; // Retorna el camión actualizado
};

// ------------------------
// Eliminar un camión por ID
// ------------------------
export const eliminarCamionService = (id) => {
  // Validación: necesitamos un ID válido
  if (!id) {
    if (isDevelopment) console.log("[eliminarCamionService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  // Llamamos al modelo para eliminar el camión
  const result = deleteCamion(id);

  // Log en desarrollo para mostrar la petición DELETE y resultado
  if (isDevelopment) {
    console.log(`[eliminarCamionService] Petición DELETE /camiones/${id} recibida`);
    console.log("[eliminarCamionService] Resultado de eliminación:", result);
  }

  return result; // Retorna true/false o resultado de la eliminación según el modelo
};

// ------------------------
// Buscar camiones por patente
// ------------------------
export const buscarCamionesService = (patente) => {
  // Validación: debemos recibir una patente
  if (!patente) {
    if (isDevelopment) console.log("[buscarCamionesService] Error: Patente requerida");
    throw new Error("Patente requerida.");
  }

  // Llamamos al modelo para buscar coincidencias de patente
  const result = searchCamiones(patente);

  // Log en desarrollo para mostrar la petición GET con query y cantidad de resultados
  if (isDevelopment) {
    console.log(`[buscarCamionesService] Petición GET /camiones/search?patente=${patente} recibida`);
    console.log("[buscarCamionesService] Camiones encontrados:", result.length);
  }

  return result; // Retorna la lista de camiones que coinciden con la patente
};
