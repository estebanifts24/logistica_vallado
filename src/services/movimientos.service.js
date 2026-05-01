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

import { db } from "../config/data.js";
import { doc, deleteDoc } from "firebase/firestore";

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
// OBTENER
// ------------------------
export const obtenerMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const data = await getMovimientoById(id.trim());
  if (!data) return null;

  return formatDateFields(data);
};

// ------------------------
// CREAR MOVIMIENTO + STOCK
// ------------------------
export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

  if (!origenCodigo || !destinoCodigo || !tipoVallaCodigo || !cantidad) {
    throw new Error("Faltan datos del movimiento");
  }

  const origenId = `${origenCodigo}_${tipoVallaCodigo}`;
  const destinoId = `${destinoCodigo}_${tipoVallaCodigo}`;

  const origenStock = await getStockById(origenId);
  if (!origenStock) throw new Error("Stock origen no existe");

  const destinoStock = await getStockById(destinoId);

  const origenPrev = { ...origenStock };
  const destinoPrev = destinoStock ? { ...destinoStock } : null;

  const origenCantidad = origenStock.cantidad || 0;

  if (origenCantidad < cantidad) {
    throw new Error("Stock insuficiente en origen");
  }

  try {
    await updateStock(origenId, {
      ...origenStock,
      cantidad: origenCantidad - cantidad
    });

    if (destinoStock) {
      await updateStock(destinoId, {
        ...destinoStock,
        cantidad: (destinoStock.cantidad || 0) + cantidad
      });
    } else {
      await setStock(destinoId, {
        codigoUbicacion: destinoCodigo,
        codigoValla: tipoVallaCodigo,
        cantidad
      });
    }

    const created = await createMovimiento(data);

    return formatDateFields(created);

  } catch (error) {
    await updateStock(origenId, origenPrev);

    if (destinoPrev) {
      await updateStock(destinoId, destinoPrev);
    } else {
      await deleteDoc(doc(db, "stock", destinoId));
    }

    throw new Error("Error en movimiento: " + error.message);
  }
};

// ------------------------
// ACTUALIZAR MOVIMIENTO (CORRECTO + STOCK VALIDADO)
// ------------------------
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  const old = await getMovimientoById(id);
  if (!old) throw new Error("Movimiento no existe");

  const {
    origenCodigo,
    destinoCodigo,
    tipoVallaCodigo,
    cantidad
  } = data;

  if (!origenCodigo || !destinoCodigo || !tipoVallaCodigo || !cantidad) {
    throw new Error("Faltan datos del movimiento");
  }

  const oldOrigenId = `${old.origenCodigo}_${old.tipoVallaCodigo}`;
  const oldDestinoId = `${old.destinoCodigo}_${old.tipoVallaCodigo}`;

  const newOrigenId = `${origenCodigo}_${tipoVallaCodigo}`;
  const newDestinoId = `${destinoCodigo}_${tipoVallaCodigo}`;

  const oldOrigenStock = await getStockById(oldOrigenId);
  const oldDestinoStock = await getStockById(oldDestinoId);

  const newOrigenStock = await getStockById(newOrigenId);
  const newDestinoStock = await getStockById(newDestinoId);

  try {
    // 🔁 revertir movimiento anterior
    if (oldOrigenStock) {
      await updateStock(oldOrigenId, {
        ...oldOrigenStock,
        cantidad: (oldOrigenStock.cantidad || 0) + old.cantidad
      });
    }

    if (oldDestinoStock) {
      await updateStock(oldDestinoId, {
        ...oldDestinoStock,
        cantidad: (oldDestinoStock.cantidad || 0) - old.cantidad
      });
    }

    // 🔒 validar stock nuevo
    const origenFinal = newOrigenStock?.cantidad || 0;

    if (origenFinal < cantidad) {
      throw new Error("Stock insuficiente para actualizar movimiento");
    }

    // ➕ aplicar nuevo movimiento
    if (newOrigenStock) {
      await updateStock(newOrigenId, {
        ...newOrigenStock,
        cantidad: origenFinal - cantidad
      });
    }

    if (newDestinoStock) {
      await updateStock(newDestinoId, {
        ...newDestinoStock,
        cantidad: (newDestinoStock.cantidad || 0) + cantidad
      });
    } else {
      await setStock(newDestinoId, {
        codigoUbicacion: destinoCodigo,
        codigoValla: tipoVallaCodigo,
        cantidad
      });
    }

    const updated = await updateMovimiento(id, data);

    return formatDateFields(updated);

  } catch (error) {
    throw new Error("Error al actualizar movimiento: " + error.message);
  }
};

// ------------------------
// ELIMINAR MOVIMIENTO (CORRECTO)
// ------------------------
export const eliminarMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const mov = await getMovimientoById(id);
  if (!mov) throw new Error("Movimiento no existe");

  const origenId = `${mov.origenCodigo}_${mov.tipoVallaCodigo}`;
  const destinoId = `${mov.destinoCodigo}_${mov.tipoVallaCodigo}`;

  const origenStock = await getStockById(origenId);
  const destinoStock = await getStockById(destinoId);

  if (origenStock) {
    await updateStock(origenId, {
      ...origenStock,
      cantidad: (origenStock.cantidad || 0) + mov.cantidad
    });
  }

  if (destinoStock) {
    await updateStock(destinoId, {
      ...destinoStock,
      cantidad: (destinoStock.cantidad || 0) - mov.cantidad
    });
  }

  const deleted = await deleteMovimiento(id);

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