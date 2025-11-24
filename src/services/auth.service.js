import * as usuariosModel from "../models/usuarios.model.js"; 
// Importa funciones que interactúan con la base de datos de usuarios
import bcrypt from "bcryptjs"; 
// Biblioteca para encriptar y comparar contraseñas de manera segura
import { signToken } from "../middlewares/jwt.js"; 
// Función para generar JWT (token de autenticación)

// Detectar entorno
const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------
// loginUser: función que valida email y password, migrando
// contraseñas planas a bcrypt si es necesario
// ---------------------------------------------------------------
export const loginUser = async ({ email, password }) => {
  // Validación básica: si falta email o password, lanzar error
  if (!email || !password) {
    const e = new Error("email y password requeridos"); 
    e.code = 400; // HTTP 400 Bad Request
    if (isDevelopment) console.log("[loginUser] Error: faltan email o password");
    throw e; // Interrumpe la ejecución
  }

  // Buscar usuario en la base de datos por email
  const user = await usuariosModel.getUsuarioByEmail(email);
  if (!user) { 
    // Si no existe usuario, lanzar error 401 Unauthorized
    const e = new Error("Credenciales incorrectas"); 
    e.code = 401; 
    if (isDevelopment) console.log("[loginUser] Usuario no encontrado para email:", email);
    throw e; 
  }

  const stored = user.password || ""; // Contraseña almacenada

  // ------------------------
  // Caso: contraseña ya en bcrypt
  // ------------------------
  if (stored.startsWith && (stored.startsWith("$2a$") || stored.startsWith("$2b$"))) {
    const ok = bcrypt.compareSync(password, stored); 
    // Compara la contraseña enviada por el usuario con la hash almacenada
    if (!ok) { 
      // Contraseña incorrecta
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      if (isDevelopment) console.log("[loginUser] Contraseña bcrypt incorrecta para usuario:", user.email);
      throw e; 
    } else if (isDevelopment) {
      console.log("[loginUser] Contraseña bcrypt correcta para usuario:", user.email);
    }

  } else {
    // ------------------------
    // Caso: contraseña en texto plano (vieja)
    // ------------------------
    if (password !== stored) { 
      const e = new Error("Credenciales incorrectas"); 
      e.code = 401; 
      if (isDevelopment) console.log("[loginUser] Contraseña plana incorrecta para usuario:", user.email);
      throw e; 
    }

    // Migrar a bcrypt para mayor seguridad
    const salt = bcrypt.genSaltSync(10); // Genera un salt aleatorio
    const hashed = bcrypt.hashSync(password, salt); // Crea hash seguro
    await usuariosModel.updateUsuario(user.id, { password: hashed }); 
    if (isDevelopment) console.log("[loginUser] Contraseña migrada a bcrypt para usuario:", user.email);
  }

  // ------------------------
  // Crear payload para JWT
  // ------------------------
  const payload = { 
    id: user.id, 
    email: user.email, 
    rol: user.rol, 
    username: user.username 
  };

  const token = signToken(payload); // Genera el token JWT

  // ------------------------
  // Quitar la contraseña del objeto usuario antes de devolverlo
  // ------------------------
  const { password: _, ...sanitized } = user;

  // 🔥 Convertir createdAt (timestamp de Firestore) a "YYYY-MM-DD"
  if (sanitized.createdAt?.toDate) {
    sanitized.createdAt = sanitized.createdAt
      .toDate()
      .toISOString()
      .split("T")[0]; // Solo la fecha
  } else {
    sanitized.createdAt = null;
  }

  // ------------------------
  // Logs finales en modo desarrollo
  // ------------------------
  if (isDevelopment) {
    console.log("[loginUser] Login exitoso para usuario:", user.email);
    console.log("[loginUser] Payload JWT generado:", payload);
    console.log("[loginUser] Usuario devuelto (sin contraseña):", sanitized);
  }

  // ------------------------
  // Retornar resultado final
  // ------------------------
  return { 
    mensaje: "Login exitoso",
    token, // Token JWT para autenticación en futuras peticiones
    user: sanitized // Usuario sin contraseña
  };
};
