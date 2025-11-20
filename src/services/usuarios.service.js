// src/services/usuarios.service.js
import * as model from "../models/usuarios.model.js";
import bcrypt from "bcryptjs";

// -----------------------------------------------------
// Validación de datos
// -----------------------------------------------------
export const validateUsuarioData = (data, { creating = true } = {}) => {
  const errors = [];
  if (!data) { errors.push("No se proporcionó data"); return { valid:false, errors }; }
  if (creating && (!data.username || typeof data.username !== "string")) errors.push("username obligatorio");
  if (!data.email || typeof data.email !== "string") errors.push("email obligatorio");
  if (creating && (!data.password || typeof data.password !== "string")) errors.push("password obligatorio");
  if (!data.rol || !["admin","user"].includes(data.rol)) errors.push("rol debe ser 'admin' o 'user'");
  return { valid: errors.length===0, errors };
};

// -----------------------------------------------------
// CRUD
// -----------------------------------------------------
export const listAllUsuarios = async () => {
  return await model.getAllUsuarios();
};

export const getUsuario = async (id) => {
  if (!id) { const e = new Error("Se requiere id"); e.code=400; throw e; }
  const u = await model.getUsuarioById(id);
  if (!u) { const e = new Error("Usuario no encontrado"); e.code=404; throw e; }
  return u;
};

export const createUsuario = async (data) => {
  const { valid, errors } = validateUsuarioData(data, { creating: true });
  if (!valid) { const e = new Error("Validation error"); e.meta = errors; throw e; }

  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(data.password, salt);

  const toSave = {
    username: data.username,
    email: data.email,
    password: hashed,
    rol: data.rol,
    createdAt: data.createdAt || new Date().toISOString()
  };

  return await model.createUsuario(toSave);
};

export const updateUsuario = async (id, data) => {
  if (!id) { const e = new Error("Se requiere id"); e.code=400; throw e; }
  if (data.password) {
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
  }
  const updated = await model.updateUsuario(id, data);
  if (!updated) { const e = new Error("Usuario no encontrado"); e.code=404; throw e; }
  return updated;
};

export const deleteUsuario = async (id) => {
  if (!id) { const e = new Error("Se requiere id"); e.code=400; throw e; }
  const res = await model.deleteUsuario(id);
  if (!res) { const e = new Error("Usuario no encontrado"); e.code=404; throw e; }
  return res;
};

// 🔹 Búsqueda por username o email
export const searchUsuariosService = async (query) => {
  if (!query) return [];
  const allUsuarios = await model.getAllUsuarios(); // directo al model
  const q = query.toLowerCase();
  return allUsuarios
    .filter(u => 
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    )
    .map(u => {
      const { password, ...rest } = u;
      return rest;
    });
};
