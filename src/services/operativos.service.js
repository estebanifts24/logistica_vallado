// ---------------------------------------------------------------
// Servicio de Operativos
// ---------------------------------------------------------------

import {
  getAllOperativos,
  getOperativoById,
  createOperativo,
  updateOperativo,
  deleteOperativo,
  searchOperativos
} from "../models/operativos.model.js";

export const listarOperativosService = () => getAllOperativos();

export const obtenerOperativoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getOperativoById(id);
};

export const crearOperativoService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createOperativo(data);
};

export const actualizarOperativoService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateOperativo(id, data);
};

export const eliminarOperativoService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteOperativo(id);
};

// BUSCAR
export const buscarOperativosService = (nombre) => {
  if (!nombre) throw new Error("Nombre requerido.");
  return searchOperativos(nombre);
};
