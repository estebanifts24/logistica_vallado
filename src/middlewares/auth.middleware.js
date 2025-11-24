// ---------------------------------------------------------------
// Middleware de autenticación y autorización
// ---------------------------------------------------------------

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Clave secreta usada para firmar y verificar JWT
// Se toma del archivo .env. Si no está definido, se usa "secret_dev" (solo para desarrollo)
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

// ---------------------------------------------------------------
// 🔹 Middleware de autenticación
// ---------------------------------------------------------------
// Este middleware verifica que la petición HTTP incluya un token JWT válido.
// Se espera que el token se envíe en la cabecera Authorization con el formato:
// "Authorization: Bearer <token>"
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ Si no hay cabecera de autorización o no empieza con "Bearer ", denegamos el acceso
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Token no proporcionado" });
  }

  // 🔹 Extraemos el token de la cabecera (lo que viene después de "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 🔹 Verificamos que el token sea válido usando la clave secreta
    // Si es válido, jwt.verify devuelve el payload del token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔹 Guardamos la información del usuario en req.user para que esté disponible en la ruta
    req.user = decoded;

    // ✅ Continuamos con la ejecución de la ruta
    next();
  } catch (err) {
    // ❌ Si el token es inválido o ha expirado, se deniega el acceso
    return res.status(401).json({ success: false, error: "Token inválido o expirado" });
  }
};

// ---------------------------------------------------------------
// 🔹 Middleware de autorización por roles
// ---------------------------------------------------------------
// Este middleware verifica que el usuario autenticado tenga uno de los roles permitidos
// roles: puede ser un string (un solo rol) o un array de roles permitidos
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    // ❌ Si no existe req.user (no autenticado), denegamos acceso
    if (!req.user) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }

    // 🔹 Obtenemos el rol del usuario desde el token decodificado
    const userRole = req.user.rol;

    // 🔹 Normalizamos roles a un array para simplificar la verificación
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // ❌ Si el rol del usuario no está en la lista de roles permitidos, denegamos acceso
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, error: "Rol no autorizado" });
    }

    // ✅ Si todo es correcto, el usuario está autorizado y seguimos con la ruta
    next();
  };
};

/*
RESUMEN:
1. authenticate:
   - Verifica que exista un token JWT válido en la cabecera Authorization.
   - Coloca la información del usuario decodificado en req.user.
   - Devuelve error 401 si no hay token o es inválido.

2. authorizeRoles:
   - Comprueba que el usuario autenticado tenga un rol permitido.
   - Permite restringir rutas según roles (ej: "admin", "user").
   - Devuelve error 403 si el usuario no tiene rol autorizado o no está autenticado.
*/
