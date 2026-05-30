/* ===============================================================
   1. STOCK SERVICE (LÓGICA DE NEGOCIO)
   =============================================================== */

/*
   1.1 Responsabilidad general:
   - Maneja operaciones de stock
   - Interactúa con modelo stock
   - Valida datos básicos
   - No maneja HTTP (eso es del controller)
*/

import {
  getAllStock,
  getStockByUbicacionAndValla,
  createStock,
  updateStock
} from "../models/stock.model.js";

/* ===============================================================
   2. CONFIGURACIÓN GENERAL
   =============================================================== */

/*
   2.1 Modo desarrollo (reservado para logs futuros)
*/

const isDevelopment = process.env.NODE_ENV !== "production";

/* ===============================================================
   3. LISTAR STOCK
   =============================================================== */

/*
   3.1 Devuelve todo el stock del sistema
*/

export const listarStockService = async () => {
  return await getAllStock();
};

/* ===============================================================
   4. OBTENER STOCK POR UBICACIÓN + VALLA
   =============================================================== */

/*
   4.1 Busca stock específico por combinación:
   - ubicación
   - tipo de valla
*/

export const obtenerStockService = async (ubicacion, valla) => {
  if (!ubicacion || !valla) {
    throw new Error("Ubicación y tipo de valla requeridos");
  }

  return await getStockByUbicacionAndValla(ubicacion, valla);
};

/* ===============================================================
   5. CREAR STOCK
   =============================================================== */

/*
   5.1 Crea un nuevo registro de stock
   - usa combinación ubicación + valla
   - cantidad inicial
*/

export const crearStockService = async (data) => {
  if (!data) throw new Error("Datos inválidos");

  const { codigoUbicacion, codigoValla, cantidad } = data;

  /* 5.2 Validación básica */
  if (!codigoUbicacion || !codigoValla || cantidad == null) {
    throw new Error("Faltan datos de stock");
  }

  /* 5.3 Creación en DB */
  return await createStock(data);
};

/* ===============================================================
   6. ACTUALIZAR STOCK
   =============================================================== */

/*
   6.1 Actualiza stock existente por ID
   - reemplaza o ajusta cantidad
*/

export const actualizarStockService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  return await updateStock(id, data);
};