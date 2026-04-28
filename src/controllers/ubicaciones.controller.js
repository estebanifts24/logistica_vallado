import {
  listarUbicacionesService,
  obtenerUbicacionService,
  crearUbicacionService,
  actualizarUbicacionService,
  eliminarUbicacionService
} from "../services/ubicaciones.service.js";

export const listarUbicaciones = async (req, res) => {
  try {
    const data = await listarUbicacionesService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const obtenerUbicacion = async (req, res) => {
  try {
    const data = await obtenerUbicacionService(req.params.id);
    if (!data) return res.status(404).json({ success: false });
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const crearUbicacion = async (req, res) => {
  try {
    const data = await crearUbicacionService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const actualizarUbicacion = async (req, res) => {
  try {
    const data = await actualizarUbicacionService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const eliminarUbicacion = async (req, res) => {
  try {
    const data = await eliminarUbicacionService(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};