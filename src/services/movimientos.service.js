import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";

import {
  getStockById,
  setStock,
  updateStock
} from "../models/stock.model.js";

import { formatDateFields } from "../utils/formatDate.js";

const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// LISTAR
// ------------------------
export const listarMovimientosService = async () => {
  const movimientos = await getAllMovimientos();
  return movimientos.map(m => formatDateFields(m));
};

// ------------------------
// OBTENER POR ID
// ------------------------
export const obtenerMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const cleanId = id.trim();
  const data = await getMovimientoById(cleanId);

  if (!data) return null;

  return formatDateFields(data);
};

// ------------------------
// CREAR MOVIMIENTO (CON STOCK REAL)
// ------------------------
export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const {
    origenCodigo,
    destinoCodigo,
    tipoVallaCodigo,
    cantidad
  } = data;

  if (!origenCodigo || !destinoCodigo || !tipoVallaCodigo || !cantidad) {
    throw new Error("Faltan datos del movimiento");
  }

  const origenId = `${origenCodigo}_${tipoVallaCodigo}`;
  const destinoId = `${destinoCodigo}_${tipoVallaCodigo}`;

  const origenStock = await getStockById(origenId);
  const destinoStock = await getStockById(destinoId);

  if (!origenStock) throw new Error("Stock origen no existe");

  const origenCantidad = origenStock.cantidad || 0;
  const destinoCantidad = destinoStock?.cantidad || 0;

  if (origenCantidad < cantidad) {
    throw new Error("Stock insuficiente en origen");
  }

  // actualizar stock origen
  await setStock(origenId, {
    ...origenStock,
    cantidad: origenCantidad - cantidad
  });

  // actualizar o crear stock destino
  if (destinoStock) {
    await updateStock(destinoId, {
      ...destinoStock,
      cantidad: destinoCantidad + cantidad
    });
  } else {
    await setStock(destinoId, {
      codigoUbicacion: destinoCodigo,
      codigoValla: tipoVallaCodigo,
      cantidad: cantidad
    });
  }

  // guardar movimiento
  const created = await createMovimiento(data);

  if (isDevelopment) {
    console.log("[crearMovimientoService] Movimiento creado con actualización de stock:", created);
  }

  return formatDateFields(created);
};

// ------------------------
// ACTUALIZAR MOVIMIENTO (SIN STOCK AUTOMÁTICO)
// ------------------------
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  const updated = await updateMovimiento(id, data);
  return formatDateFields(updated);
};

// ------------------------
// ELIMINAR MOVIMIENTO
// ------------------------
export const eliminarMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const deleted = await deleteMovimiento(id);

  if (deleted.data) {
    deleted.data = formatDateFields(deleted.data);
  }

  return deleted;
};

// ------------------------
// BUSCAR
// ------------------------
export const buscarMovimientosService = async (term) => {
  if (!term) throw new Error("Término de búsqueda requerido");

  const movimientos = await searchMovimientos(term);

  return movimientos.map(m => formatDateFields(m));
};