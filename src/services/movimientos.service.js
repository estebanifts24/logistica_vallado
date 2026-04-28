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
// CREAR MOVIMIENTO (CON STOCK + ROLLBACK)
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

  // 🔁 leer estado inicial (para rollback)
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
    // ➖ descontar origen
    await updateStock(origenId, {
      ...origenStock,
      cantidad: origenCantidad - cantidad
    });

    // ➕ destino
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

    // 📦 crear movimiento
    const created = await createMovimiento(data);

    if (isDevelopment) {
      console.log("[crearMovimientoService] OK movimiento + stock actualizado");
    }

    return formatDateFields(created);

  } catch (error) {
    // 🔥 ROLLBACK

    console.log("[ROLLBACK] Revirtiendo stock...");

    // restaurar origen
    await updateStock(origenId, origenPrev);

    // restaurar destino o eliminar si era nuevo
    if (destinoPrev) {
      await updateStock(destinoId, destinoPrev);
    } else {
      await deleteDoc(doc(db, "stock", destinoId));
    }

    throw new Error("Error en movimiento, cambios revertidos: " + error.message);
  }
};

// ------------------------
// ACTUALIZAR
// ------------------------
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  const updated = await updateMovimiento(id, data);
  return formatDateFields(updated);
};

// ------------------------
// ELIMINAR
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