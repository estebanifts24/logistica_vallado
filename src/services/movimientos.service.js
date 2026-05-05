import {
  getAllMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  searchMovimientos
} from "../models/movimientos.model.js";

import {
  getAllStock,
  createStock,
  updateStock
} from "../models/stock.model.js";

import { formatDateFields } from "../utils/formatDate.js";

// 🔧 helper para evitar errores por mayúsculas/espacios
const normalizar = (v) => String(v).trim().toLowerCase();

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
// CREAR MOVIMIENTO + STOCK (FIX REAL)
// ------------------------
export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

  if (!origenCodigo || !destinoCodigo || !tipoVallaCodigo || !cantidad) {
    throw new Error("Faltan datos del movimiento");
  }

  if (cantidad <= 0) {
    throw new Error("Cantidad inválida");
  }

  if (normalizar(origenCodigo) === normalizar(destinoCodigo)) {
    throw new Error("Origen y destino no pueden ser iguales");
  }

  const stock = await getAllStock();

  const origenStock = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(origenCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  if (!origenStock) {
    throw new Error("Stock origen no existe");
  }

  if ((origenStock.cantidad || 0) < cantidad) {
    throw new Error("Stock insuficiente en origen");
  }

  const destinoStock = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(destinoCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  // ➖ actualizar origen
  await updateStock(origenStock.id, {
    cantidad: origenStock.cantidad - cantidad
  });

  // ➕ actualizar o crear destino
  if (destinoStock) {
    await updateStock(destinoStock.id, {
      cantidad: (destinoStock.cantidad || 0) + cantidad
    });
  } else {
    await createStock({
      codigoUbicacion: destinoCodigo,
      codigoValla: tipoVallaCodigo,
      cantidad
    });
  }

  const created = await createMovimiento(data);
  return formatDateFields(created);
};

// ------------------------
// ACTUALIZAR MOVIMIENTO
// ------------------------
// ------------------------

export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  const { origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

  if (!origenCodigo || !destinoCodigo || !tipoVallaCodigo || !cantidad) {
    throw new Error("Faltan datos del movimiento");
  }

  if (cantidad <= 0) {
    throw new Error("Cantidad inválida");
  }

  if (normalizar(origenCodigo) === normalizar(destinoCodigo)) {
    throw new Error("Origen y destino no pueden ser iguales");
  }

  const old = await getMovimientoById(id);
  if (!old) throw new Error("Movimiento no existe");

  const stock = await getAllStock();

  // ------------------------
  // 🔁 REVERTIR STOCK VIEJO
  // ------------------------
  const oldOrigen = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(old.origenCodigo) &&
      normalizar(s.codigoValla) === normalizar(old.tipoVallaCodigo)
  );

  const oldDestino = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(old.destinoCodigo) &&
      normalizar(s.codigoValla) === normalizar(old.tipoVallaCodigo)
  );

  if (oldOrigen) {
    await updateStock(oldOrigen.id, {
      cantidad: (oldOrigen.cantidad || 0) + old.cantidad
    });
  }

  if (oldDestino) {
    await updateStock(oldDestino.id, {
      cantidad: (oldDestino.cantidad || 0) - old.cantidad
    });
  }

  // ------------------------
  // 🔁 RE-LEER STOCK ACTUALIZADO
  // ------------------------
  const stockActualizado = await getAllStock();

  const newOrigen = stockActualizado.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(origenCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  if (!newOrigen) {
    throw new Error("Stock origen no existe");
  }

  if ((newOrigen.cantidad || 0) < cantidad) {
    throw new Error("Stock insuficiente para actualizar");
  }

  const newDestino = stockActualizado.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(destinoCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  // ------------------------
  // ➖ NUEVO ORIGEN
  // ------------------------
  await updateStock(newOrigen.id, {
    cantidad: newOrigen.cantidad - cantidad
  });

  // ------------------------
  // ➕ NUEVO DESTINO
  // ------------------------
  if (newDestino) {
    await updateStock(newDestino.id, {
      cantidad: (newDestino.cantidad || 0) + cantidad
    });
  } else {
    await createStock({
      codigoUbicacion: destinoCodigo,
      codigoValla: tipoVallaCodigo,
      cantidad
    });
  }

  // 🔥 CLAVE: SOLO UPDATE (NO CREAR)
  const updated = await updateMovimiento(id, data);

  return formatDateFields(updated);
};
// ------------------------
// ELIMINAR MOVIMIENTO
// ------------------------
export const eliminarMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const mov = await getMovimientoById(id);
  if (!mov) throw new Error("Movimiento no existe");

  const stock = await getAllStock();

  const origen = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(mov.origenCodigo) &&
      normalizar(s.codigoValla) === normalizar(mov.tipoVallaCodigo)
  );

  const destino = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(mov.destinoCodigo) &&
      normalizar(s.codigoValla) === normalizar(mov.tipoVallaCodigo)
  );

  // 🔁 revertir stock
  if (origen) {
    await updateStock(origen.id, {
      cantidad: (origen.cantidad || 0) + mov.cantidad
    });
  }

  if (destino) {
    await updateStock(destino.id, {
      cantidad: (destino.cantidad || 0) - mov.cantidad
    });
  }

  return await deleteMovimiento(id);
};

// ------------------------
// BUSCAR
// ------------------------
export const buscarMovimientosService = async (term) => {
  if (!term) throw new Error("Término de búsqueda requerido");

  const movimientos = await searchMovimientos(term);
  return movimientos.map(m => formatDateFields(m));
};