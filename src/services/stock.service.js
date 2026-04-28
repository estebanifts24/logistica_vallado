import {
  getAllStock,
  getStockById,
  setStock,
  updateStock
} from "../models/stock.model.js";

const isDevelopment = process.env.NODE_ENV !== "production";

export const listarStockService = async () => {
  const stock = await getAllStock();
  return stock;
};

export const obtenerStockService = async (id) => {
  if (!id) throw new Error("ID requerido");
  return await getStockById(id);
};

export const crearStockService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  // id compuesto simple (consistente con el sistema)
  const id = `${data.codigoUbicacion}_${data.codigoValla}`;

  return await setStock(id, data);
};

export const actualizarStockService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  return await updateStock(id, data);
};