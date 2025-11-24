// ---------------------------------------------------------------
// Router de Operativos
// ---------------------------------------------------------------

import { Router } from "express";
// Middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

// Controladores que manejan la lógica de cada ruta
import {
  listarOperativos,
  obtenerOperativo,
  crearOperativo,
  actualizarOperativo,
  eliminarOperativo,
  buscarOperativos
} from "../controllers/operativos.controller.js";

const router = Router(); // Creamos el router específico para operativos

// ------------------------
// Rutas de Operativos
// ------------------------

// GET /api/operativos → Listar todos los operativos
router.get("/", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/operativos -> listarOperativos");
  listarOperativos(req, res, next);
});

// GET /api/operativos/search → Buscar operativos por término
router.get("/search", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/operativos/search -> buscarOperativos, query:", req.query);
  buscarOperativos(req, res, next);
});

// GET /api/operativos/:id → Obtener un operativo por ID
router.get("/:id", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/operativos/${req.params.id} -> obtenerOperativo`);
  obtenerOperativo(req, res, next);
});

// POST /api/operativos → Crear un nuevo operativo (requiere autenticación)
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/operativos -> crearOperativo, body:", req.body);
  crearOperativo(req, res, next);
});

// PUT /api/operativos/:id → Actualizar un operativo existente (requiere autenticación)
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/operativos/${req.params.id} -> actualizarOperativo, body:`, req.body);
  actualizarOperativo(req, res, next);
});

// DELETE /api/operativos/:id → Eliminar un operativo (requiere autenticación y rol admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/operativos/${req.params.id} -> eliminarOperativo`);
  eliminarOperativo(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
