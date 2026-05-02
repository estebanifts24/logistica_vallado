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

  const stock = await getAllStock();

  const origenStock = stock.find(
    s =>
      s.codigoUbicacion === origenCodigo &&
      s.codigoValla === tipoVallaCodigo
  );

  if (!origenStock) {
    throw new Error("Stock origen no existe");
  }

  if ((origenStock.cantidad || 0) < cantidad) {
    throw new Error("Stock insuficiente en origen");
  }

  const destinoStock = stock.find(
    s =>
      s.codigoUbicacion === destinoCodigo &&
      s.codigoValla === tipoVallaCodigo
  );

  // ➖ actualizar origen
  await updateStock(origenStock.id, {
    ...origenStock,
    cantidad: origenStock.cantidad - cantidad
  });

  // ➕ actualizar o crear destino
  if (destinoStock) {
    await updateStock(destinoStock.id, {
      ...destinoStock,
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
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  const old = await getMovimientoById(id);
  if (!old) throw new Error("Movimiento no existe");

  const stock = await getAllStock();

  const oldOrigen = stock.find(
    s =>
      s.codigoUbicacion === old.origenCodigo &&
      s.codigoValla === old.tipoVallaCodigo
  );

  const oldDestino = stock.find(
    s =>
      s.codigoUbicacion === old.destinoCodigo &&
      s.codigoValla === old.tipoVallaCodigo
  );

  // 🔁 revertir movimiento anterior
  if (oldOrigen) {
    await updateStock(oldOrigen.id, {
      ...oldOrigen,
      cantidad: (oldOrigen.cantidad || 0) + old.cantidad
    });
  }

  if (oldDestino) {
    await updateStock(oldDestino.id, {
      ...oldDestino,
      cantidad: (oldDestino.cantidad || 0) - old.cantidad
    });
  }

  // 🔁 aplicar nuevo movimiento
  await crearMovimientoService(data);

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
      s.codigoUbicacion === mov.origenCodigo &&
      s.codigoValla === mov.tipoVallaCodigo
  );

  const destino = stock.find(
    s =>
      s.codigoUbicacion === mov.destinoCodigo &&
      s.codigoValla === mov.tipoVallaCodigo
  );

  // 🔁 revertir stock
  if (origen) {
    await updateStock(origen.id, {
      ...origen,
      cantidad: (origen.cantidad || 0) + mov.cantidad
    });
  }

  if (destino) {
    await updateStock(destino.id, {
      ...destino,
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