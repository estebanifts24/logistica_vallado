// ---------------------------------------------------------------
// Controller de Operativos
// ---------------------------------------------------------------

import {
  listarOperativosService,
  obtenerOperativoService,
  crearOperativoService,
  actualizarOperativoService,
  eliminarOperativoService,
  buscarOperativosService
} from "../services/operativos.service.js";

// GET TODOS
export const listarOperativos = async (req, res) => {
  try {
    const data = await listarOperativosService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// GET UNO
export const obtenerOperativo = async (req, res) => {
  try {
    const data = await obtenerOperativoService(req.params.id);

    if (!data)
      return res.status(404).json({ success: false, message: "Operativo no encontrado." });

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// POST
export const crearOperativo = async (req, res) => {
  try {
    const data = await crearOperativoService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// PUT
export const actualizarOperativo = async (req, res) => {
  try {
    const data = await actualizarOperativoService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// DELETE
export const eliminarOperativo = async (req, res) => {
  try {
    const data = await eliminarOperativoService(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// GET SEARCH
export const buscarOperativos = async (req, res) => {
  try {
    const { nombre } = req.query;
    const data = await buscarOperativosService(nombre);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
