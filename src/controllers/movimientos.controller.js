import {
  listarMovimientosService,
  obtenerMovimientoService,
  crearMovimientoService,
  actualizarMovimientoService,
  eliminarMovimientoService,
  buscarMovimientosService
} from "../services/movimientos.service.js";

// GET TODOS
export const listarMovimientos = async (req, res) => {
  try {
    const data = await listarMovimientosService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// GET UNO
export const obtenerMovimiento = async (req, res) => {
  try {
    const data = await obtenerMovimientoService(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Movimiento no encontrado." });

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// POST
export const crearMovimiento = async (req, res) => {
  try {
    const data = await crearMovimientoService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// PUT
export const actualizarMovimiento = async (req, res) => {
  try {
    const data = await actualizarMovimientoService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// DELETE
export const eliminarMovimiento = async (req, res) => {
  try {
    const data = await eliminarMovimientoService(req.params.id);
    const message = data.deleted ? "Movimiento eliminado." : "Movimiento no encontrado.";
    res.json({ success: data.deleted, data: data.data || null, message });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// GET SEARCH
export const buscarMovimientos = async (req, res) => {
  try {
    const { fecha } = req.query;
    const data = await buscarMovimientosService(fecha);
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
