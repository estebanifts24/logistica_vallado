import {
  getAllStock,
  getStockByUbicacionAndValla,
  createStock,
  updateStock
} from "../models/stock.model.js";

const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------
// LISTAR TODO
// ---------------------------------------------------------------
export const listarStockService = async () => {
  return await getAllStock();
};

// ---------------------------------------------------------------
// 🔥 OBTENER POR UBICACION + VALLA (REEMPLAZA getStockById)
// ---------------------------------------------------------------
export const obtenerStockService = async (ubicacion, valla) => {
  if (!ubicacion || !valla) {
    throw new Error("Ubicación y tipo de valla requeridos");
  }

  return await getStockByUbicacionAndValla(ubicacion, valla);
};

// ---------------------------------------------------------------
// 🔥 CREAR STOCK (USA ID AUTOMÁTICO)
// ---------------------------------------------------------------
export const crearStockService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { codigoUbicacion, codigoValla, cantidad } = data;

  if (!codigoUbicacion || !codigoValla || cantidad == null) {
    throw new Error("Faltan datos de stock");
  }

  return await createStock(data);
};

// ---------------------------------------------------------------
// 🔥 ACTUALIZAR STOCK (USA ID REAL)
// ---------------------------------------------------------------
export const actualizarStockService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  return await updateStock(id, data);
};