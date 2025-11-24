// ---------------------------------------------------------------
// Servicio de Vallas
// ---------------------------------------------------------------

// Importamos funciones del modelo que realizan las operaciones en la base de datos
import {
  getAllVallas,      // Trae todas las vallas
  getVallaById,      // Trae una valla por ID
  createValla,       // Crea una nueva valla
  updateValla,       // Actualiza una valla existente
  deleteValla,       // Elimina una valla
  searchVallas       // Busca vallas por código
} from "../models/vallas.model.js";

// Detectamos si estamos en modo desarrollo para imprimir logs
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todas las vallas
// ------------------------
export const listarVallasService = () => {
  const result = getAllVallas();

  // Log en desarrollo para seguimiento de la petición HTTP
  if (isDevelopment) {
    console.log("[listarVallasService] Petición GET /vallas recibida");
    console.log("[listarVallasService] Total de vallas listadas:", result.length);
  }

  return result; // Retorna la lista de vallas
};

// ------------------------
// Obtener una valla por ID
// ------------------------
export const obtenerVallaService = (id) => {
  if (!id) {
    if (isDevelopment) console.log("[obtenerVallaService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = getVallaById(id);

  if (isDevelopment) {
    console.log(`[obtenerVallaService] Petición GET /vallas/${id} recibida`);
    console.log("[obtenerVallaService] Resultado:", result || "No encontrado");
  }

  return result; // Retorna la valla encontrada o null
};

// ------------------------
// Crear una nueva valla
// ------------------------
export const crearVallaService = (data) => {
  if (!data) {
    if (isDevelopment) console.log("[crearVallaService] Error: Datos inválidos");
    throw new Error("Datos inválidos.");
  }

  const result = createValla(data);

  if (isDevelopment) {
    console.log("[crearVallaService] Petición POST /vallas recibida");
    console.log("[crearVallaService] Valla creada:", result);
  }

  return result; // Retorna la valla creada
};

// ------------------------
// Actualizar una valla existente
// ------------------------
export const actualizarVallaService = (id, data) => {
  if (!id) {
    if (isDevelopment) console.log("[actualizarVallaService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = updateValla(id, data);

  if (isDevelopment) {
    console.log(`[actualizarVallaService] Petición PUT /vallas/${id} recibida`);
    console.log("[actualizarVallaService] Valla actualizada:", result);
  }

  return result; // Retorna la valla actualizada
};

// ------------------------
// Eliminar una valla por ID
// ------------------------
export const eliminarVallaService = (id) => {
  if (!id) {
    if (isDevelopment) console.log("[eliminarVallaService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  const result = deleteValla(id);

  if (isDevelopment) {
    console.log(`[eliminarVallaService] Petición DELETE /vallas/${id} recibida`);
    console.log("[eliminarVallaService] Resultado de eliminación:", result);
  }

  return result; // Retorna true/false según éxito de la eliminación
};

// ------------------------
// Buscar vallas por código
// ------------------------
export const buscarVallasService = (codigo) => {
  if (!codigo) {
    if (isDevelopment) console.log("[buscarVallasService] Error: Código requerido");
    throw new Error("Código requerido.");
  }

  const result = searchVallas(codigo);

  if (isDevelopment) {
    console.log(`[buscarVallasService] Petición GET /vallas/search?codigo=${codigo} recibida`);
    console.log("[buscarVallasService] Vallas encontradas:", result.length);
  }

  return result; // Retorna las vallas que coinciden con el código
};
