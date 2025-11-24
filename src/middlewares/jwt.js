// ---------------------------------------------------------------
// Middleware / Helper de JWT
// ---------------------------------------------------------------

import jwt from "jsonwebtoken";  // Librería para crear y verificar JWTs
import dotenv from "dotenv";     // Para leer variables de entorno desde .env

dotenv.config(); // Carga las variables de entorno

// 🔹 Clave secreta para firmar los tokens JWT
// Se recomienda que sea larga y secreta. Si no existe en .env, se usa "secret_dev" (solo desarrollo)
const JWT_SECRET = process.env.JWT_SECRET || "secret_dev";

// 🔹 Tiempo de expiración de los tokens
// Valor por defecto 8 horas si no está definido en .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// ---------------------------------------------------------------
// 🔹 Función para generar un token JWT
// ---------------------------------------------------------------
// payload: objeto con la información que queremos guardar en el token
// Ejemplo: { id: "usuario123", rol: "admin" }
export const signToken = (payload) => {
  // 🔹 jwt.sign() crea el token, lo firma con JWT_SECRET y le asigna expiración
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  // Devuelve un string que es el token JWT listo para enviar al cliente
};

// ---------------------------------------------------------------
// 🔹 Función para verificar y decodificar un token JWT
// ---------------------------------------------------------------
export const verifyToken = (token) => {
  // 🔹 jwt.verify() valida que el token sea correcto y no haya expirado
  // Si es válido, devuelve el payload (información del usuario)
  // Si no es válido o ha expirado, lanza un error
  return jwt.verify(token, JWT_SECRET);
};

/*
RESUMEN:
1. signToken(payload)
   - Crea un JWT firmado.
   - Incluye la información del usuario (payload) y el tiempo de expiración.
   - Se usa al hacer login o crear un token de sesión.

2. verifyToken(token)
   - Valida que el token JWT recibido sea válido y no haya expirado.
   - Devuelve los datos del usuario decodificados.
   - Se usa en middlewares de autenticación para proteger rutas.
*/
