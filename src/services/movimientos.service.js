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

const normalizar = (v) => String(v).trim().toLowerCase();
const BASE = "base";

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
// CREAR
// ------------------------
export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { tipo, origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

  if (!tipoVallaCodigo || !cantidad || cantidad <= 0) {
    throw new Error("Datos inválidos");
  }

  const stock = await getAllStock();

  // =====================================================
  // 📥 INGRESO
  // =====================================================
  if (tipo === "ingreso") {
    const baseStock = stock.find(
      s =>
        normalizar(s.codigoUbicacion) === normalizar(BASE) &&
        normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
    );

    if (baseStock) {
      await updateStock(baseStock.id, {
        cantidad: (baseStock.cantidad || 0) + cantidad
      });
    } else {
      await createStock({
        codigoUbicacion: BASE,
        codigoValla: tipoVallaCodigo,
        cantidad
      });
    }

    const created = await createMovimiento({
      ...data,
      origenCodigo: "ingreso",
      destinoCodigo: BASE
    });

    return formatDateFields(created);
  }

  // =====================================================
  // 🚚 TRASLADO
  // =====================================================
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

  // sacar del origen
  await updateStock(origenStock.id, {
    cantidad: origenStock.cantidad - cantidad
  });

  // sumar al destino
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
// ACTUALIZAR
// ------------------------
export const actualizarMovimientoService = async (id, data) => {
  if (!id) throw new Error("ID requerido");

  const old = await getMovimientoById(id);
  if (!old) throw new Error("Movimiento no existe");

  const stock = await getAllStock();

  // =====================================================
  // 📥 INGRESO NO RECALCULA STOCK
  // =====================================================
  if (old.tipo === "ingreso") {
    const updated = await updateMovimiento(id, data);
    return formatDateFields(updated);
  }

  const { origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

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

  const newOrigen = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(origenCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  if (!newOrigen) throw new Error("Stock origen no existe");

  const newDestino = stock.find(
    s =>
      normalizar(s.codigoUbicacion) === normalizar(destinoCodigo) &&
      normalizar(s.codigoValla) === normalizar(tipoVallaCodigo)
  );

  await updateStock(newOrigen.id, {
    cantidad: newOrigen.cantidad - cantidad
  });

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

  const updated = await updateMovimiento(id, data);
  return formatDateFields(updated);
};

// ------------------------
// ELIMINAR
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

  if (mov.tipo !== "ingreso") {
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
  }

  return await deleteMovimiento(id);
};

// ------------------------
// BUSCAR
// ------------------------
export const buscarMovimientosService = async (term) => {
  if (!term) throw new Error("Término requerido");

  const movimientos = await searchMovimientos(term);
  return movimientos.map(m => formatDateFields(m));
};