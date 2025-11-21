import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";
import { Timestamp } from "firebase/firestore";


// Función auxiliar para formatear fecha
const formatFecha = (timestamp) => {
  if (!timestamp) return null;
  const date = timestamp.toDate(); // Convierte Timestamp a Date
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
};

// ---------------------------------------------------------------
// Listar movimientos con fecha formateada
export const listarMovimientosService = async () => {
  return await getAllMovimientos();
};

// ---------------------------------------------------------------
// Obtener uno por ID
export const obtenerMovimientoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getMovimientoById(id);
};

// ---------------------------------------------------------------
// Crear
export const crearMovimientoService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createMovimiento(data);
};



// ---------------------------------------------------------------
export const actualizarMovimientoService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateMovimiento(id, data);
};


// ---------------------------------------------------------------
// Eliminar
export const eliminarMovimientoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteMovimiento(id);
};

// ---------------------------------------------------------------
// Buscar por fecha (formateada)
export const buscarMovimientosService = async (fecha) => {
  if (!fecha) throw new Error("Fecha requerida.");
  return await searchMovimientos(fecha);
};
