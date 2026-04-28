import {
  listarStockService,
  obtenerStockService,
  crearStockService,
  actualizarStockService
} from "../services/stock.service.js";

export const listarStock = async (req, res) => {
  try {
    const data = await listarStockService();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const obtenerStock = async (req, res) => {
  try {
    const data = await obtenerStockService(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Stock no encontrado" });
    }
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const crearStock = async (req, res) => {
  try {
    const data = await crearStockService(req.body);
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

export const actualizarStock = async (req, res) => {
  try {
    const data = await actualizarStockService(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ success: false, message: "Stock no encontrado" });
    }

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};