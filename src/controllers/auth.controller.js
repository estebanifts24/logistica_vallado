// src/controllers/auth.controller.js
import * as authService from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return res.json(result);
  } catch (err) {
    console.error("auth.login:", err);
    const status = err.code === 400 ? 400 : err.code === 401 ? 401 : 500;
    return res.status(status).json({ error: err.message });
  }
};


export const updatePasswordAdmin = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  return await model.updateUsuario(id, { password: hashed });
};

