import * as model from "../models/usuarios.model.js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const listAllUsuarios = async () => await model.getAllUsuarios();
export const getUsuario = async (id) => {
  const u = await model.getUsuarioById(id);
  if (!u) throw { code: 404, message: "Usuario no encontrado" };
  return u;
};
export const getUsuarioByEmailService = async (email) => await model.getUsuarioByEmail(email);

import { Timestamp } from "firebase/firestore";

export const createUsuario = async (data) => {
  if (!data.password) throw new Error("Password es requerido");

  // --- Timestamp ---
  let createdAt = Timestamp.now(); // valor por defecto

  if (data.createdAt) {
    // convierte el string enviado por Postman en Timestamp de Firestore
    createdAt = Timestamp.fromDate(new Date(data.createdAt));
  }

  // --- Hash password ---
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUserData = {
    ...data,
    password: hashedPassword,
    createdAt
  };

  return await model.createUsuario(newUserData);
};


export const updateUsuario = async (id, data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  const updated = await model.updateUsuario(id, data);
  if (!updated) throw { code: 404, message: "Usuario no encontrado" };
  return updated;
};

export const deleteUsuario = async (id) => {
  const result = await model.deleteUsuario(id);
  if (!result) throw { code: 404, message: "Usuario no encontrado" };
  return result;
};

export const searchUsuariosService = async (q) => await model.searchUsuarios(q);

export const updatePasswordAdminService = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const updated = await model.updateUsuario(id, { password: hashed });

  if (!updated) throw { code: 404, message: "Usuario no encontrado" };

  return { message: "Contraseña actualizada correctamente" };
};

