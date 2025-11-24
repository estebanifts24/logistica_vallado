// ---------------------------------------------------------------
// Controller de Usuarios
// ---------------------------------------------------------------
// Gestiona las rutas REST relacionadas con los usuarios
// Se encarga de llamar a los servicios, formatear datos y responder JSON
// También maneja errores y status codes HTTP
// ---------------------------------------------------------------

import * as service from "../services/usuarios.service.js";

// Detectamos si estamos en modo desarrollo para mostrar logs
const isDevelopment = process.env.NODE_ENV !== "production";

// 🔹 Helper para formatear Firestore Timestamps o fechas a "YYYY-MM-DD"
const formatDate = (value) => {
  if (!value) return null;

  // Si ya es string (YYYY-MM-DD)
  if (typeof value === "string") return value;

  // Firestore Timestamp
  if (value?.toDate) return value.toDate().toISOString().split("T")[0];

  // Objeto Date
  if (value instanceof Date) return value.toISOString().split("T")[0];

  return null;
};

// ------------------------
// GET - Listar todos los usuarios
// ------------------------
export const getAllUsuarios = async (req, res) => {
  try {
    // Llamamos al servicio que obtiene todos los usuarios
    const result = await service.listAllUsuarios();

    // Limpiamos la información sensible (password) y formateamos fecha
    const cleaned = result.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      createdAt: formatDate(createdAt),
    }));

    // Log en desarrollo para seguimiento de la petición
    if (isDevelopment) {
      console.log("[UsuariosController.getAllUsuarios] Petición GET /api/usuarios recibida");
      console.log("[UsuariosController.getAllUsuarios] Cantidad de usuarios:", cleaned.length);
    }

    // Respondemos con éxito y los datos
    return res.json(cleaned);
  } catch (err) {
    console.error("getAllUsuarios:", err);
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

// ------------------------
// GET - Obtener un usuario por ID
// ------------------------
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que obtiene el usuario por ID
    const u = await service.getUsuario(id);

    // Limpiamos password y formateamos fecha
    const { password, createdAt, ...rest } = u;

    if (isDevelopment) {
      console.log(`[UsuariosController.getUsuarioById] Petición GET /api/usuarios/${id} recibida`);
      console.log("[UsuariosController.getUsuarioById] Usuario encontrado:", rest);
    }

    return res.json({
      ...rest,
      createdAt: formatDate(createdAt),
    });
  } catch (err) {
    console.error("getUsuarioById:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};

// ------------------------
// POST - Crear un usuario
// ------------------------
export const createUsuario = async (req, res) => {
  try {
    // Llamamos al servicio que crea un usuario y maneja hash de password
    const newU = await service.createUsuario(req.body);

    // Limpiamos password y formateamos fecha
    const { password, createdAt, ...rest } = newU;

    if (isDevelopment) {
      console.log("[UsuariosController.createUsuario] Petición POST /api/usuarios recibida");
      console.log("[UsuariosController.createUsuario] Usuario creado:", rest);
    }

    // Respondemos 201 Created
    return res.status(201).json({
      ...rest,
      createdAt: formatDate(createdAt),
    });
  } catch (err) {
    console.error("createUsuario:", err);
    if (err.message === "Validation error")
      return res.status(400).json({ error: "Validation error", details: err.meta });
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

// ------------------------
// PUT - Actualizar un usuario
// ------------------------
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que actualiza usuario y aplica hash si se cambia password
    const updated = await service.updateUsuario(id, req.body);

    // Limpiamos password y formateamos fecha
    const { password, createdAt, ...rest } = updated;

    if (isDevelopment) {
      console.log(`[UsuariosController.updateUsuario] Petición PUT /api/usuarios/${id} recibida`);
      console.log("[UsuariosController.updateUsuario] Usuario actualizado:", rest);
    }

    return res.json({
      ...rest,
      createdAt: formatDate(createdAt),
    });
  } catch (err) {
    console.error("updateUsuario:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};

// ------------------------
// DELETE - Eliminar un usuario
// ------------------------
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que elimina el usuario
    const result = await service.deleteUsuario(id);

    if (isDevelopment) {
      console.log(`[UsuariosController.deleteUsuario] Petición DELETE /api/usuarios/${id} recibida`);
      console.log("[UsuariosController.deleteUsuario] Usuario eliminado:", result);
    }

    return res.json({ ...result, message: "Usuario eliminado" });
  } catch (err) {
    console.error("deleteUsuario:", err);
    const status = err.code === 404 ? 404 : 400;
    return res.status(status).json({ error: err.message });
  }
};

// ------------------------
// GET - Buscar usuarios por query
// ------------------------
export const searchUsuarios = async (req, res) => {
  try {
    const { q } = req.query;

    // Llamamos al servicio que busca usuarios por nombre/email/etc.
    const results = await service.searchUsuariosService(q);

    // Limpiamos password y formateamos fecha
    const cleaned = results.map(({ password, createdAt, ...rest }) => ({
      ...rest,
      createdAt: formatDate(createdAt),
    }));

    if (isDevelopment) {
      console.log(`[UsuariosController.searchUsuarios] Petición GET /api/usuarios/search?q=${q} recibida`);
      console.log("[UsuariosController.searchUsuarios] Usuarios encontrados:", cleaned.length);
    }

    return res.json(cleaned);
  } catch (err) {
    console.error("searchUsuarios:", err);
    return res.status(500).json({ error: "Error interno", mensaje: err.message });
  }
};

// ------------------------
// PUT - Admin cambia contraseña de un usuario
// ------------------------
export const updatePasswordAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Validación básica
    if (!newPassword) {
      return res.status(400).json({ error: "newPassword es requerido" });
    }

    // Ejecutamos la lógica del servicio que aplica hash y actualiza contraseña
    await service.updatePasswordAdminService(id, newPassword);

    if (isDevelopment) {
      console.log(`[UsuariosController.updatePasswordAdmin] Petición PUT /api/usuarios/${id}/password recibida`);
      console.log("[UsuariosController.updatePasswordAdmin] Contraseña actualizada correctamente");
    }

    // Respondemos solo con un mensaje limpio
    return res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (err) {
    console.error("updatePasswordAdmin:", err);
    const status = err.code === 404 ? 404 : 500;
    return res.status(status).json({
      error: err.message || "Error interno",
    });
  }
};
