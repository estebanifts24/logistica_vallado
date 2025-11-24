// ---------------------------------------------------------------
// Servicio de Movimientos
// ---------------------------------------------------------------

// Importamos funciones del modelo que interactúan con la base de datos
// Cada función realiza operaciones CRUD sobre los movimientos
import {
  getAllMovimientos,     // Trae todos los movimientos
  getMovimientoById,     // Trae un movimiento específico por ID
  createMovimiento,      // Crea un nuevo movimiento
  updateMovimiento,      // Actualiza un movimiento existente
  deleteMovimiento,      // Elimina un movimiento por ID
  searchMovimientos      // Busca movimientos por algún término
} from "../models/movimientos.model.js";

// Función utilitaria para formatear campos de fecha en los objetos
import { formatDateFields } from "../utils/formatDate.js";

// Detectamos si estamos en modo desarrollo para imprimir logs
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todos los movimientos
// ------------------------
export const listarMovimientosService = async () => {
  // Llamamos al modelo para traer todos los movimientos
  const movimientos = await getAllMovimientos();

  // En desarrollo, mostramos un log de seguimiento
  if (isDevelopment) {
    console.log("[listarMovimientosService] Petición GET /movimientos recibida");
    console.log("[listarMovimientosService] Cantidad de movimientos:", movimientos.length);
  }

  // Formateamos las fechas de cada movimiento antes de retornar
  return movimientos.map(m => formatDateFields(m));
};

// ------------------------
// Obtener un movimiento por ID
// ------------------------
export const obtenerMovimientoService = async (id) => {
  // Validación básica: ID requerido
  if (!id) {
    if (isDevelopment) console.log("[obtenerMovimientoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  // Limpiamos espacios en blanco del ID
  const cleanId = id.trim();

  // Traemos el movimiento del modelo
  const data = await getMovimientoById(cleanId);

  // Log en desarrollo con resultado de la petición
  if (isDevelopment) {
    console.log(`[obtenerMovimientoService] Petición GET /movimientos/${cleanId} recibida`);
    console.log("[obtenerMovimientoService] Resultado:", data || "No encontrado");
  }

  // Si no se encontró, retornamos null
  if (!data) return null;

  // Formateamos fechas antes de devolver
  return formatDateFields(data);
};

// ------------------------
// Crear un nuevo movimiento
// ------------------------
export const crearMovimientoService = async (data) => {
  // Validación: los datos no pueden estar vacíos
  if (!data) {
    if (isDevelopment) console.log("[crearMovimientoService] Error: Datos inválidos");
    throw new Error("Datos inválidos.");
  }

  // Creamos el movimiento en la base de datos
  const created = await createMovimiento(data);

  // Log en desarrollo con información del movimiento creado
  if (isDevelopment) {
    console.log("[crearMovimientoService] Petición POST /movimientos recibida");
    console.log("[crearMovimientoService] Movimiento creado:", created);
  }

  // Formateamos las fechas antes de retornar
  return formatDateFields(created);
};

// ------------------------
// Actualizar un movimiento existente
// ------------------------
export const actualizarMovimientoService = async (id, data) => {
  // Validación: necesitamos un ID
  if (!id) {
    if (isDevelopment) console.log("[actualizarMovimientoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  // Actualizamos el movimiento en la base de datos
  const updated = await updateMovimiento(id, data);

  // Log en desarrollo con la actualización realizada
  if (isDevelopment) {
    console.log(`[actualizarMovimientoService] Petición PUT /movimientos/${id} recibida`);
    console.log("[actualizarMovimientoService] Movimiento actualizado:", updated);
  }

  // Formateamos fechas antes de retornar
  return formatDateFields(updated);
};

// ------------------------
// Eliminar un movimiento por ID
// ------------------------
export const eliminarMovimientoService = async (id) => {
  // Validación: necesitamos un ID
  if (!id) {
    if (isDevelopment) console.log("[eliminarMovimientoService] Error: ID requerido");
    throw new Error("ID requerido.");
  }

  // Eliminamos el movimiento del modelo
  const deleted = await deleteMovimiento(id);

  // Si el modelo retorna datos del movimiento eliminado, formateamos fechas
  if (deleted.data) deleted.data = formatDateFields(deleted.data);

  // Log en desarrollo con información del movimiento eliminado
  if (isDevelopment) {
    console.log(`[eliminarMovimientoService] Petición DELETE /movimientos/${id} recibida`);
    console.log("[eliminarMovimientoService] Resultado de eliminación:", deleted);
  }

  return deleted; // Retornamos resultado final
};

// ------------------------
// Buscar movimientos por término
// (vallaCodigo, empleadoLegajo, camiónPatente, etc.)
// ------------------------
export const buscarMovimientosService = async (term) => {
  // Validación: necesitamos un término de búsqueda
  if (!term) {
    if (isDevelopment) console.log("[buscarMovimientosService] Error: Término de búsqueda requerido");
    throw new Error("Término de búsqueda requerido");
  }

  // Llamamos al modelo para buscar movimientos que coincidan con el término
  const movimientos = await searchMovimientos(term);

  // Log en desarrollo con la búsqueda realizada
  if (isDevelopment) {
    console.log(`[buscarMovimientosService] Petición GET /movimientos/search?term=${term} recibida`);
    console.log("[buscarMovimientosService] Movimientos encontrados:", movimientos.length);
  }

  // Formateamos fechas de cada movimiento antes de retornar
  return movimientos.map(m => formatDateFields(m));
};
