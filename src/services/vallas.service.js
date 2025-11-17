// ---------------------------------------------------------------
// Servicio de Vallas
// ---------------------------------------------------------------

import {
  getAllVallas,
  getVallaById,
  createValla,
  updateValla,
  deleteValla,
  searchVallas
} from "../models/vallas.model.js";

export const listarVallasService = () => getAllVallas();

export const obtenerVallaService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return getVallaById(id);
};

export const crearVallaService = (data) => {
  if (!data) throw new Error("Datos inválidos.");
  return createValla(data);
};

export const actualizarVallaService = (id, data) => {
  if (!id) throw new Error("ID requerido.");
  return updateValla(id, data);
};

export const eliminarVallaService = (id) => {
  if (!id) throw new Error("ID requerido.");
  return deleteValla(id);
};

// BUSCAR POR CÓDIGO
export const buscarVallasService = (codigo) => {
  if (!codigo) throw new Error("Código requerido.");
  return searchVallas(codigo);
};
