import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";

// Función para formatear Timestamp a string
export const formatFecha = (timestamp) => {
  if (!timestamp) return null;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
};

// Listar todos
export const listarMovimientosService = async () => {
  return (await getAllMovimientos()).map(m => ({
    ...m,
    fecha: formatFecha(m.fecha)
  }));
};

// Obtener uno
export const obtenerMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido.");
  const cleanId = id.trim();
  const data = await getMovimientoById(cleanId);
  if (data) data.fecha = formatFecha(data.fecha);
  return data;
};

// Crear
export const crearMovimientoService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createMovimiento(data);
};

// Actualizar
export const actualizarMovimientoService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateMovimiento(id, data);
};

// Eliminar
export const eliminarMovimientoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteMovimiento(id);
};

// Buscar movimientos por día completo
export const buscarMovimientosService = async (fecha) => {
  if (!fecha) throw new Error("Fecha requerida.");
  const cleanFecha = fecha.trim();
  const results = await searchMovimientos(cleanFecha);
  return results.map(m => ({
    ...m,
    fecha: formatFecha(m.fecha)
  }));
};
