// ---------------------------------------------------------------
// Servicio de Usuarios
// ---------------------------------------------------------------

// Importamos todas las funciones del modelo que interactúan con Firestore
import * as model from "../models/usuarios.model.js";

// Librería para encriptar contraseñas
import bcrypt from "bcryptjs";

// Número de rondas para generar el hash de la contraseña
const SALT_ROUNDS = 10;

// Detectamos si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todos los usuarios
// ------------------------
export const listAllUsuarios = async () => {
  const result = await model.getAllUsuarios();
  
  if (isDevelopment) {
    console.log("[listAllUsuarios] Petición GET /usuarios recibida");
    console.log("[listAllUsuarios] Total de usuarios:", result.length);
  }

  return result;
};

// ------------------------
// Obtener un usuario por ID
// ------------------------
export const getUsuario = async (id) => {
  const u = await model.getUsuarioById(id);

  if (!u) {
    if (isDevelopment) console.log(`[getUsuario] Usuario con ID ${id} no encontrado`);
    throw { code: 404, message: "Usuario no encontrado" };
  }

  if (isDevelopment) console.log(`[getUsuario] Petición GET /usuarios/${id} recibida`, u);

  return u;
};

// ------------------------
// Obtener un usuario por email
// ------------------------
export const getUsuarioByEmailService = async (email) => {
  const u = await model.getUsuarioByEmail(email);

  if (isDevelopment) console.log(`[getUsuarioByEmailService] Petición GET /usuarios/email/${email} recibida`, u);

  return u;
};

// ------------------------
// Importamos Timestamp de Firestore para manejar fechas
// ------------------------
import { Timestamp } from "firebase/firestore";

// ------------------------
// Crear un nuevo usuario
// ------------------------
export const createUsuario = async (data) => {
  // Validación básica: password obligatorio
  if (!data.password) {
    if (isDevelopment) console.log("[createUsuario] Error: Password es requerido");
    throw new Error("Password es requerido");
  }

  // Timestamp por defecto con la fecha actual
  let createdAt = Timestamp.now();

  // Si Postman envía createdAt como string, lo convertimos a Timestamp
  if (data.createdAt) {
    createdAt = Timestamp.fromDate(new Date(data.createdAt));
  }

  // Encriptamos la contraseña
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Construimos el objeto final que se va a guardar
  const newUserData = {
    ...data,
    password: hashedPassword,
    createdAt
  };

  const result = await model.createUsuario(newUserData);

  if (isDevelopment) console.log("[createUsuario] Petición POST /usuarios recibida", result);

  return result;
};

// ------------------------
// Actualizar un usuario
// ------------------------
export const updateUsuario = async (id, data) => {
  // Si se envía password, la encriptamos
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const updated = await model.updateUsuario(id, data);

  if (!updated) {
    if (isDevelopment) console.log(`[updateUsuario] Usuario con ID ${id} no encontrado`);
    throw { code: 404, message: "Usuario no encontrado" };
  }

  if (isDevelopment) console.log(`[updateUsuario] Petición PUT /usuarios/${id} recibida`, updated);

  return updated;
};

// ------------------------
// Eliminar un usuario
// ------------------------
export const deleteUsuario = async (id) => {
  const result = await model.deleteUsuario(id);

  if (!result) {
    if (isDevelopment) console.log(`[deleteUsuario] Usuario con ID ${id} no encontrado`);
    throw { code: 404, message: "Usuario no encontrado" };
  }

  if (isDevelopment) console.log(`[deleteUsuario] Petición DELETE /usuarios/${id} recibida`, result);

  return result;
};

// ------------------------
// Buscar usuarios por término
// ------------------------
export const searchUsuariosService = async (q) => {
  const result = await model.searchUsuarios(q);

  if (isDevelopment) console.log(`[searchUsuariosService] Petición GET /usuarios/search?q=${q} recibida`, result.length);

  return result;
};

// ------------------------
// Actualizar contraseña de un usuario por Admin
// ------------------------
export const updatePasswordAdminService = async (id, newPassword) => {
  // Encriptamos la nueva contraseña
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const updated = await model.updateUsuario(id, { password: hashed });

  if (!updated) {
    if (isDevelopment) console.log(`[updatePasswordAdminService] Usuario con ID ${id} no encontrado`);
    throw { code: 404, message: "Usuario no encontrado" };
  }

  if (isDevelopment) console.log(`[updatePasswordAdminService] Petición PUT /usuarios/password/${id} recibida`);

  return { message: "Contraseña actualizada correctamente" };
};
