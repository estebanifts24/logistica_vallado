// ---------------------------------------------------------------
// Controller de Usuarios (UNIFICADO)
// ---------------------------------------------------------------

import * as service from "../services/usuarios.service.js";

const isDevelopment = process.env.NODE_ENV !== "production";

// 🔹 Helper fecha
const formatDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value?.toDate) return value.toDate().toISOString().split("T")[0];
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return null;
};

// ------------------------
// GET ALL
// ------------------------
export const getAllUsuarios = async (req, res) => {
  try {
    const result = await service.listAllUsuarios();

    const cleaned = result.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      createdAt: formatDate(createdAt),
    }));

    if (isDevelopment) {
      console.log("[Usuarios] GET ALL");
      console.log("Cantidad:", cleaned.length);
    }

    return res.json({
      success: true,
      data: cleaned
    });

  } catch (err) {
    console.error("getAllUsuarios:", err);
    return res.status(500).json({
      success: false,
      error: "Error interno",
      mensaje: err.message
    });
  }
};

// ------------------------
// GET BY ID
// ------------------------
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const u = await service.getUsuario(id);

    const { password, createdAt, ...rest } = u;

    return res.json({
      success: true,
      data: {
        ...rest,
        createdAt: formatDate(createdAt),
      }
    });

  } catch (err) {
    console.error("getUsuarioById:", err);

    const status = err.code === 404 ? 404 : 400;

    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// CREATE
// ------------------------
export const createUsuario = async (req, res) => {
  try {
    const newU = await service.createUsuario(req.body);

    const { password, createdAt, ...rest } = newU;

    return res.status(201).json({
      success: true,
      data: {
        ...rest,
        createdAt: formatDate(createdAt),
      }
    });

  } catch (err) {
    console.error("createUsuario:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// UPDATE
// ------------------------
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await service.updateUsuario(id, req.body);

    const { password, createdAt, ...rest } = updated;

    return res.json({
      success: true,
      data: {
        ...rest,
        createdAt: formatDate(createdAt),
      }
    });

  } catch (err) {
    console.error("updateUsuario:", err);

    const status = err.code === 404 ? 404 : 400;

    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// DELETE
// ------------------------
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await service.deleteUsuario(id);

    return res.json({
      success: true,
      data: result,
      message: "Usuario eliminado"
    });

  } catch (err) {
    console.error("deleteUsuario:", err);

    const status = err.code === 404 ? 404 : 400;

    return res.status(status).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// SEARCH
// ------------------------
export const searchUsuarios = async (req, res) => {
  try {
    const { q } = req.query;

    const results = await service.searchUsuariosService(q);

    const cleaned = results.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      createdAt: formatDate(createdAt),
    }));

    return res.json({
      success: true,
      data: cleaned
    });

  } catch (err) {
    console.error("searchUsuarios:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// UPDATE PASSWORD
// ------------------------
export const updatePasswordAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: "newPassword es requerido"
      });
    }

    await service.updatePasswordAdminService(id, newPassword);

    return res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (err) {
    console.error("updatePasswordAdmin:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ------------------------
// CHANGE OWN PASSWORD
// ------------------------
export const changeOwnPassword = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {

      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios"
      });

    }

    await service.changeOwnPasswordService(
      userId,
      currentPassword,
      newPassword
    );

    return res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (err) {

    console.error("changeOwnPassword:", err);

    return res.status(400).json({
      success: false,
      error: err.message
    });

  }
};