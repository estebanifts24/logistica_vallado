import * as usuariosModel from "../models/usuarios.model.js"; 
import bcrypt from "bcryptjs"; 
import { signToken } from "../middlewares/jwt.js"; 

const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------
// loginUser
// ---------------------------------------------------------------
export const loginUser = async ({ email, password }) => {

  if (!email || !password) {
    const e = new Error("email y password requeridos"); 
    e.code = 400; 
    if (isDevelopment) console.log("[loginUser] Error: faltan email o password");
    throw e;
  }

  const user = await usuariosModel.getUsuarioByEmail(email);

  if (!user) { 
    const e = new Error("Credenciales incorrectas"); 
    e.code = 401; 
    if (isDevelopment) console.log("[loginUser] Usuario no encontrado para email:", email);
    throw e; 
  }

  const stored = user.password || "";

  // 🔥 FIX SOLO AQUÍ (seguridad del string)
  if (
    typeof stored === "string" &&
    (stored.startsWith("$2a$") || stored.startsWith("$2b$"))
  ) {
    const ok = bcrypt.compareSync(password, stored); 

    if (!ok) { 
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      if (isDevelopment) console.log("[loginUser] Contraseña bcrypt incorrecta para usuario:", user.email);
      throw e; 
    } else if (isDevelopment) {
      console.log("[loginUser] Contraseña bcrypt correcta para usuario:", user.email);
    }

  } else {

    if (password !== stored) { 
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      if (isDevelopment) console.log("[loginUser] Contraseña plana incorrecta para usuario:", user.email);
      throw e; 
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    await usuariosModel.updateUsuario(user.id, { password: hashed });

    if (isDevelopment) console.log("[loginUser] Contraseña migrada a bcrypt para usuario:", user.email);
  }

  const payload = { 
    id: user.id, 
    email: user.email, 
    rol: user.rol, 
    username: user.username 
  };

  const token = signToken(payload);

  const { password: _, ...sanitized } = user;

  if (sanitized.createdAt?.toDate) {
    sanitized.createdAt = sanitized.createdAt
      .toDate()
      .toISOString()
      .split("T")[0];
  } else {
    sanitized.createdAt = null;
  }

  if (isDevelopment) {
    console.log("[loginUser] Login exitoso para usuario:", user.email);
    console.log("[loginUser] Payload JWT generado:", payload);
    console.log("[loginUser] Usuario devuelto (sin contraseña):", sanitized);
  }

  return { 
    mensaje: "Login exitoso",
    token,
    user: sanitized
  };
};