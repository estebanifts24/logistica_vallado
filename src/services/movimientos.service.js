// src/services/movimientos.service.js

import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";

import { formatDateFields } from "../utils/formatDate.js";

// ---------------------------------------------------------------
// Listar todos los movimientos
export const listarMovimientosService = async () => {
  const movimientos = await getAllMovimientos();
  return movimientos.map(m => formatDateFields(m));
};

// ---------------------------------------------------------------
// Obtener uno por ID
export const obtenerMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido.");
  const cleanId = id.trim();
  const data = await getMovimientoById(cleanId);
  if (!data) return null;
  return formatDateFields(data);
};

// ---------------------------------------------------------------
// Crear un movimiento
export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos.");
  const created = await createMovimiento(data);
  return formatDateFields(created);
};

// ---------------------------------------------------------------
// Actualizar un movimiento
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido.");
  const updated = await updateMovimiento(id, data);
  return formatDateFields(updated);
};

// ---------------------------------------------------------------
// Eliminar un movimiento
export const eliminarMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido.");
  const deleted = await deleteMovimiento(id);
  if (deleted.data) deleted.data = formatDateFields(deleted.data);
  return deleted;
};

// ---------------------------------------------------------------
// Buscar movimientos por término (vallaCodigo, empleadoLegajo, camiónPatente)
export const buscarMovimientosService = async (term) => {
  if (!term) throw new Error("Término de búsqueda requerido");
  const movimientos = await searchMovimientos(term);
  return movimientos.map(m => formatDateFields(m));
};
