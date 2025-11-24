// src/routes/auth.router.js

import { Router } from 'express';           // Importamos Router de Express para manejar rutas
import bcrypt from 'bcryptjs';              // Librería para encriptar y comparar passwords
import * as usuariosService from '../services/usuarios.service.js'; // Servicios para manejar usuarios
import { signToken } from '../middlewares/jwt.js'; // Función para generar JWT

const router = Router(); // Creamos el router específico para auth

// ------------------------
// POST /api/auth/login
// ------------------------
// Endpoint para login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Obtenemos email y password del body

    // Validamos que se hayan enviado ambos campos
    if (!email || !password) {
      if (process.env.NODE_ENV === "development") console.log("Login attempt con datos incompletos");
      return res.status(400).json({ error: "Email y password son requeridos" });
    }

    // Buscar usuario por email usando el servicio
    const user = await usuariosService.getUsuarioByEmailService(email);
    if (!user) {
      if (process.env.NODE_ENV === "development") console.log(`Login fallido: usuario no encontrado (${email})`);
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Comparar password enviado con el password encriptado en DB
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      if (process.env.NODE_ENV === "development") console.log(`Login fallido: password incorrecto para ${email}`);
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Generar JWT con información del usuario
    const payload = { id: user.id, email: user.email, rol: user.rol };
    const token = signToken(payload);

    // Excluir password antes de enviar la respuesta
    const { password: pw, ...userData } = user;

    // Log exitoso en desarrollo
    if (process.env.NODE_ENV === "development") console.log(`Login exitoso: ${email}`);

    // Enviamos usuario sin password + token
    return res.json({ user: userData, token });
  } catch (err) {
    console.error("Login error:", err); // Siempre log de error
    return res.status(500).json({ error: "Error interno del servidor", mensaje: err.message });
  }
});

export default router; // Exportamos el router para usarlo en server.js
