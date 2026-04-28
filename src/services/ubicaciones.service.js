import {
  getAllUbicaciones,
  getUbicacionById,
  createUbicacion,
  updateUbicacion,
  deleteUbicacion
} from "../models/ubicaciones.model.js";

export const listarUbicacionesService = async () => {
  return await getAllUbicaciones();
};

export const obtenerUbicacionService = async (id) => {
  if (!id) throw new Error("ID requerido");
  return await getUbicacionById(id);
};

export const crearUbicacionService = async (data) => {
  if (!data) throw new Error("Datos inválidos");
  return await createUbicacion(data);
};

export const actualizarUbicacionService = async (id, data) => {
  return await updateUbicacion(id, data);
};

export const eliminarUbicacionService = async (id) => {
  return await deleteUbicacion(id);
};