// ---------------------------------------------------------------
// Controller de Puntos
// ---------------------------------------------------------------

import {
  listarPuntosService,
  obtenerPuntoService,
  crearPuntoService,
  actualizarPuntoService,
  eliminarPuntoService,
  buscarPuntosService
} from "../services/puntos.service.js";

// GET ALL
export const listarPuntos = async (req, res) => {
  try {
    const data = await listarPuntosService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// GET ONE
export const obtenerPunto = async (req, res) => {
  try {
    const data = await obtenerPuntoService(req.params.id);

    if (!data)
      return res.status(404).json({ success: false, message: "Punto no encontrado." });

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// POST
export const crearPunto = async (req, res) => {
  try {
    const data = await crearPuntoService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// PUT
export const actualizarPunto = async (req, res) => {
  try {
    const data = await actualizarPuntoService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// DELETE
export const eliminarPunto = async (req, res) => {
  try {
    const data = await eliminarPuntoService(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// GET /search
export const buscarPuntos = async (req, res) => {
  try {
    const { nombre } = req.query;
    const data = await buscarPuntosService(nombre);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
