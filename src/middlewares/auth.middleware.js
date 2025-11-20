// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

// Middleware de autenticación
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // guardamos info del usuario en req.user
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token inválido o expirado" });
  }
};

// Middleware de autorización por roles
// roles: string o array de roles permitidos
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }

    const userRole = req.user.rol;

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, error: "Rol no autorizado" });
    }

    next();
  };
};
