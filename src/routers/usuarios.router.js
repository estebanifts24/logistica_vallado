// src/routes/usuarios.router.js

import { Router } from "express";
// Importamos todos los controladores de usuarios
import * as controller from "../controllers/usuarios.controller.js";
// Middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router(); // Creamos el router específico para usuarios

// ------------------------
// Rutas de Usuarios (solo accesibles por admin)
// ------------------------

// GET /api/usuarios → Listar todos los usuarios
router.get("/", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/usuarios -> getAllUsuarios");
  controller.getAllUsuarios(req, res, next);
});

// GET /api/usuarios/search → Buscar usuarios por criterios
router.get("/search", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/usuarios/search -> searchUsuarios, query:", req.query);
  controller.searchUsuarios(req, res, next);
});

// GET /api/usuarios/:id → Obtener un usuario por ID
router.get("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/usuarios/${req.params.id} -> getUsuarioById`);
  controller.getUsuarioById(req, res, next);
});

// POST /api/usuarios → Crear un nuevo usuario (solo admin)
router.post("/", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/usuarios -> createUsuario, body:", req.body);
  controller.createUsuario(req, res, next);
});

// PUT /api/usuarios/password/:id → Cambiar contraseña de un usuario (admin)
router.put("/password/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/usuarios/password/${req.params.id} -> updatePasswordAdmin, body:`, req.body);
  controller.updatePasswordAdmin(req, res, next);
});

// PUT /api/usuarios/:id → Actualizar datos de un usuario (solo admin)
router.put("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/usuarios/${req.params.id} -> updateUsuario, body:`, req.body);
  controller.updateUsuario(req, res, next);
});

// DELETE /api/usuarios/:id → Eliminar un usuario (solo admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/usuarios/${req.params.id} -> deleteUsuario`);
  controller.deleteUsuario(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
