// ---------------------------------------------------------------
// Servicio de Camiones
// ---------------------------------------------------------------

import {
  getAllCamiones,
  getCamionById,
  createCamion,
  updateCamion,
  deleteCamion,
  searchCamiones
} from "../models/camiones.model.js";

export const listarCamionesService = () => getAllCamiones();

export const obtenerCamionService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getCamionById(id);
};

export const crearCamionService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createCamion(data);
};

export const actualizarCamionService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateCamion(id, data);
};

export const eliminarCamionService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteCamion(id);
};

// BUSCAR
export const buscarCamionesService = (patente) => {
  if (!patente) throw new Error("Patente requerida.");
  return searchCamiones(patente);
};
