// ---------------------------------------------------------------
// Servicio de Puntos
// ---------------------------------------------------------------

import {
  getAllPuntos,
  getPuntoById,
  createPunto,
  updatePunto,
  deletePunto,
  searchPuntos
} from "../models/puntos.model.js";

export const listarPuntosService = () => getAllPuntos();

export const obtenerPuntoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getPuntoById(id);
};

export const crearPuntoService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createPunto(data);
};

export const actualizarPuntoService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updatePunto(id, data);
};

export const eliminarPuntoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deletePunto(id);
};

// BUSCAR
export const buscarPuntosService = (nombre) => {
  if (!nombre) throw new Error("Nombre requerido.");
  return searchPuntos(nombre);
};
