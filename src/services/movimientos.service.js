/* ===============================================================
   1. MOVIMIENTOS SERVICE (LÓGICA DE NEGOCIO)
   =============================================================== */

/*
   1.1 Responsabilidad general:
   - Aplica reglas de negocio
   - Maneja stock (sumas/restas)
   - Coordina modelos (DB)
   - No maneja HTTP (eso es del controller)
*/

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

/* ===============================================================
   2. HELPERS INTERNOS
   =============================================================== */

/*
   2.1 Normalización de strings
   - evita errores por mayúsculas / espacios
*/

const normalizar = (v) => String(v).trim().toLowerCase();

/*
   2.2 Constantes del sistema
*/

const BASE = "base";

/* ===============================================================
   3. LISTAR MOVIMIENTOS
   =============================================================== */

/*
   3.1 Devuelve todos los movimientos formateados
*/

export const listarMovimientosService = async () => {
  const movimientos = await getAllMovimientos();
  return movimientos.map(m => formatDateFields(m));
};

/* ===============================================================
   4. OBTENER MOVIMIENTO POR ID
   =============================================================== */

/*
   4.1 Busca un movimiento específico
*/

export const obtenerMovimientoService = async (id) => {
  if (!id) throw new Error("ID requerido");

  const data = await getMovimientoById(id.trim());
  if (!data) return null;

  return formatDateFields(data);
};

/* ===============================================================
   5. CREAR MOVIMIENTO (LÓGICA PRINCIPAL DE STOCK)
   =============================================================== */

/*
   5.1 Esta es la función más crítica:
   - crea movimientos
   - actualiza stock
*/

export const crearMovimientoService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { tipo, origenCodigo, destinoCodigo, tipoVallaCodigo, cantidad } = data;

  if (!tipoVallaCodigo || !cantidad || cantidad <= 0) {
    throw new Error("Datos inválidos");
  }

  const stock = await getAllStock();

  /* =========================================================
     5.2 INGRESO DE STOCK
     ========================================================= */

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

  /* =========================================================
     5.3 TRASLADO ENTRE UBICACIONES
     ========================================================= */

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

  /* 5.3.1 descontar del origen */
  await updateStock(origenStock.id, {
    cantidad: origenStock.cantidad - cantidad
  });

  /* 5.3.2 sumar al destino */
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

/* ===============================================================
   6. ACTUALIZAR MOVIMIENTO (VERSIÓN ESTABLE ERP)
   =============================================================== */

/*
   ✔ Flujo correcto y seguro:
   1. obtener movimiento viejo
   2. traer stock actual real
   3. revertir movimiento viejo en DB
   4. validar nuevo movimiento contra stock real
   5. aplicar nuevo movimiento
*/

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

  if (!tipoVallaCodigo || !cantidad || cantidad <= 0) {
    throw new Error("Datos inválidos");
  }

  /* =========================================================
     6.1 INGRESO (NO REQUIERE RECALCULO COMPLEJO)
     ========================================================= */

  if (old.tipo === "ingreso") {
    const updated = await updateMovimiento(id, data);
    return formatDateFields(updated);
  }

  /* =========================================================
     6.2 STOCK ACTUAL REAL
     ========================================================= */

  const stock = await getAllStock();

  const normalizar = (v) =>
    String(v).trim().toLowerCase();

  const findStock = (ubicacion, valla) =>
    stock.find(
      s =>
        normalizar(s.codigoUbicacion) === normalizar(ubicacion) &&
        normalizar(s.codigoValla) === normalizar(valla)
    );

  const oldOrigen = findStock(old.origenCodigo, old.tipoVallaCodigo);
  const oldDestino = findStock(old.destinoCodigo, old.tipoVallaCodigo);

  const newOrigen = findStock(origenCodigo, tipoVallaCodigo);
  const newDestino = findStock(destinoCodigo, tipoVallaCodigo);

  if (!newOrigen) {
    throw new Error("Stock origen no existe");
  }

  /* =========================================================
     6.3 REVERSA DEL MOVIMIENTO ANTERIOR (DB REAL)
     ========================================================= */

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

  /* =========================================================
   6.4 VALIDACIÓN SOBRE ESTADO REAL POST-REVERSA
   ========================================================= */

// 🔥 IMPORTANTE: volver a consultar stock real luego de la reversa
const stockPostReversa = await getAllStock();

const findPost = (ubicacion, valla) =>
  stockPostReversa.find(
    s =>
      String(s.codigoUbicacion).trim().toLowerCase() ===
      String(ubicacion).trim().toLowerCase() &&
      String(s.codigoValla).trim().toLowerCase() ===
      String(valla).trim().toLowerCase()
  );

const origenActualizado = findPost(origenCodigo, tipoVallaCodigo);

// validar existencia
if (!origenActualizado) {
  throw new Error("Stock origen no existe luego de reversa");
}

// validar stock disponible REAL
const disponible = origenActualizado.cantidad || 0;

if (disponible < cantidad) {
  throw new Error(
    `Stock insuficiente para actualizar movimiento. Disponible: ${disponible}, solicitado: ${cantidad}`
  );
}


/* =========================================================
   6.5 APLICAR NUEVO MOVIMIENTO (ESTADO CONSISTENTE)
   ========================================================= */

// descontar del origen ya actualizado
await updateStock(origenActualizado.id, {
  cantidad: disponible - cantidad
});

// sumar al destino
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

  /* =========================================================
     6.6 UPDATE FINAL MOVIMIENTO
     ========================================================= */

  const updated = await updateMovimiento(id, data);
  return formatDateFields(updated);
};


/* ===============================================================
   7. ELIMINAR MOVIMIENTO
   =============================================================== */



/*
   7.1 Revierte el stock antes de borrar el movimiento
*/

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

/* ===============================================================
   8. BUSCAR MOVIMIENTOS
   =============================================================== */

/*
   8.1 Búsqueda por término genérico
*/

export const buscarMovimientosService = async (term) => {
  if (!term) throw new Error("Término requerido");

  const movimientos = await searchMovimientos(term);
  return movimientos.map(m => formatDateFields(m));
};