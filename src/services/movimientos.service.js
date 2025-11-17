// ---------------------------------------------------------------
// Servicio de Movimientos
// ---------------------------------------------------------------

import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";

export const listarMovimientosService = () => getAllMovimientos();

export const obtenerMovimientoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getMovimientoById(id);
};

export const crearMovimientoService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createMovimiento(data);
};

export const actualizarMovimientoService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateMovimiento(id, data);
};

export const eliminarMovimientoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteMovimiento(id);
};

// BUSCAR
export const buscarMovimientosService = (fecha) => {
  if (!fecha) throw new Error("Fecha requerida.");
  return searchMovimientos(fecha);
};
