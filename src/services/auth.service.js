// src/services/auth.service.js
import * as usuariosModel from "../models/usuarios.model.js";
import bcrypt from "bcryptjs";
import { signToken } from "../middlewares/jwt.js";

/**
 * loginUser by email + password
 * migrates plain-text passwords to bcrypt if needed
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const e = new Error("email y password requeridos"); 
    e.code = 400; 
    throw e;
  }

  const user = await usuariosModel.getUsuarioByEmail(email);
  if (!user) { 
    const e = new Error("Credenciales incorrectas"); 
    e.code = 401; 
    throw e; 
  }

  const stored = user.password || "";

  // if already bcrypt hash
  if (stored.startsWith && (stored.startsWith("$2a$") || stored.startsWith("$2b$"))) {

    const ok = bcrypt.compareSync(password, stored);
    if (!ok) { 
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      throw e; 
    }

  } else {

    // plain-text stored: compare and migrate
    if (password !== stored) { 
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      throw e; 
    }

    // migrate to bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    await usuariosModel.updateUsuario(user.id, { password: hashed });
  }

  // JWT payload
  const payload = { 
    id: user.id, 
    email: user.email, 
    rol: user.rol, 
    username: user.username 
  };

  const token = signToken(payload);

  // remove password
  const { password: _, ...sanitized } = user;

  // 🔥 Convert createdAt Timestamp → "YYYY-MM-DD"
  if (sanitized.createdAt?.toDate) {
    sanitized.createdAt = sanitized.createdAt
      .toDate()
      .toISOString()
      .split("T")[0]; // solo fecha
  } else {
    sanitized.createdAt = null;
  }

  return { 
    mensaje: "Login exitoso",
    token, 
    user: sanitized 
  };
};
