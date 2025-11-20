// src/controllers/usuarios.controller.js
import * as service from "../services/usuarios.service.js";

export const getAllUsuarios = async (req, res) => {
  try {
    const result = await service.listAllUsuarios();
    // no enviar password
    const cleaned = result.map(({ password, ...rest }) => rest);
    return res.json(cleaned);
  } catch (err) {
    console.error("getAllUsuarios:", err);
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const u = await service.getUsuario(id);
    const { password, ...rest } = u;
    return res.json(rest);
  } catch (err) {
    console.error("getUsuarioById:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const newU = await service.createUsuario(req.body);
    const { password, ...rest } = newU;
    return res.status(201).json(rest);
  } catch (err) {
    console.error("createUsuario:", err);
    if (err.message === "Validation error") return res.status(400).json({ error: "Validation error", details: err.meta });
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await service.updateUsuario(id, req.body);
    const { password, ...rest } = updated;
    return res.json(rest);
  } catch (err) {
    console.error("updateUsuario:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteUsuario(id);
    return res.json(result);
  } catch (err) {
    console.error("deleteUsuario:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};
// -----------------------------------------------------
// 🔹 Search usuarios (GET /api/usuarios/search?q=algo)
// -----------------------------------------------------
export const searchUsuarios = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await service.searchUsuariosService(q);
    return res.json(results);
  } catch (err) {
    console.error("searchUsuarios:", err);
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

