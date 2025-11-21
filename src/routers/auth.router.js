// src/routes/auth.router.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import * as usuariosService from '../services/usuarios.service.js';
import { signToken } from '../middlewares/jwt.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }

    // Buscar usuario por email
    const user = await usuariosService.getUsuarioByEmailService(email);
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Comparar password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Generar JWT
    const payload = { id: user.id, email: user.email, rol: user.rol };
    const token = signToken(payload);

    const { password: pw, ...userData } = user;
    return res.json({ user: userData, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Error interno del servidor", mensaje: err.message });
  }
});

export default router;
