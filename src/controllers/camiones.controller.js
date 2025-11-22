// src/controllers/camiones.controller.js
import {
  listarCamionesService,
  obtenerCamionService,
  crearCamionService,
  actualizarCamionService,
  eliminarCamionService,
  buscarCamionesService
} from "../services/camiones.service.js";

// GET todos
export const listarCamiones = async (req, res) => {
  try {
    const data = await listarCamionesService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// GET por ID
export const obtenerCamion = async (req, res) => {
  try {
    const data = await obtenerCamionService(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(404).json({ success: false, error: e.message });
  }
};

// POST crear
export const crearCamion = async (req, res) => {
  try {
    const data = await crearCamionService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// PUT actualizar
export const actualizarCamion = async (req, res) => {
  try {
    const data = await actualizarCamionService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// DELETE
export const eliminarCamion = async (req, res) => {
  try {
    const data = await eliminarCamionService(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// 🔹 GET /search?patente=ABC123
export const buscarCamiones = async (req, res) => {
  try {
    const { patente } = req.query;
    const data = await buscarCamionesService(patente);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
