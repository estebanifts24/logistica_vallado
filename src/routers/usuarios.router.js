// src/routes/usuarios.router.js
import { Router } from "express";
import * as controller from "../controllers/usuarios.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Sólo admin gestiona usuarios
router.get("/", authenticate, authorizeRoles("admin"), controller.getAllUsuarios);
router.get("/:id", authenticate, authorizeRoles("admin"), controller.getUsuarioById);
router.post("/", authenticate, authorizeRoles("admin"), controller.createUsuario);
router.put("/:id", authenticate, authorizeRoles("admin"), controller.updateUsuario);
router.delete("/:id", authenticate, authorizeRoles("admin"), controller.deleteUsuario);

// 🔹 Cambiar contraseña de un usuario
router.put(
  "/:id/password",
  authenticate,
  authorizeRoles("admin"),
  controller.updatePasswordAdmin
);

export default router;

