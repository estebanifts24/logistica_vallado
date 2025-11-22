// src/services/camiones.service.js
import * as model from "../models/camiones.model.js";

// Listar todos
export const listarCamionesService = async () => {
  return await model.getAllCamiones();
};

// Obtener por ID
export const obtenerCamionService = async (id) => {
  if (!id) throw new Error("ID requerido");
  const camion = await model.getCamionById(id);
  if (!camion) throw new Error("Camión no encontrado");
  return camion;
};

// Crear
export const crearCamionService = async (data) => {
  if (!data) throw new Error("Datos inválidos");
  return await model.createCamion(data);
};

// Actualizar
export const actualizarCamionService = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  return await model.updateCamion(id, data);
};

// Eliminar
export const eliminarCamionService = async (id) => {
  if (!id) throw new Error("ID requerido");
  return await model.deleteCamion(id);
};

// 🔹 Buscar camiones por patente (parcial y case-insensitive)
export const buscarCamionesService = async (patente) => {
  if (!patente) throw new Error("Patente requerida");

  const camiones = await model.getAllCamiones(); // trae todos los camiones
  return camiones.filter(c =>
    c.patente?.trim().toLowerCase().includes(patente.trim().toLowerCase())
  );
};
