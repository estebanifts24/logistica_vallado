// src/routes/movimientos.router.js

import { Router } from "express";
// Middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

// Controladores que manejan la lógica de cada ruta
import {
  listarMovimientos,
  obtenerMovimiento,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  buscarMovimientos
} from "../controllers/movimientos.controller.js";

const router = Router(); // Creamos el router específico para movimientos

// ------------------------
// Rutas de Movimientos
// ------------------------

// GET /api/movimientos → Listar todos los movimientos
router.get("/", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/movimientos -> listarMovimientos");
  listarMovimientos(req, res, next);
});

// GET /api/movimientos/search → Buscar movimientos por término
// Ej: vallaCodigo, empleadoLegajo, camiónPatente, etc.
router.get("/search", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/movimientos/search -> buscarMovimientos, query:", req.query);
  buscarMovimientos(req, res, next);
});

// GET /api/movimientos/:id → Obtener un movimiento por ID
router.get("/:id", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/movimientos/${req.params.id} -> obtenerMovimiento`);
  obtenerMovimiento(req, res, next);
});

// POST /api/movimientos → Crear un nuevo movimiento (requiere autenticación)
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/movimientos -> crearMovimiento, body:", req.body);
  crearMovimiento(req, res, next);
});

// PUT /api/movimientos/:id → Actualizar un movimiento existente (requiere autenticación)
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/movimientos/${req.params.id} -> actualizarMovimiento, body:`, req.body);
  actualizarMovimiento(req, res, next);
});

// DELETE /api/movimientos/:id → Eliminar un movimiento (requiere autenticación y rol admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/movimientos/${req.params.id} -> eliminarMovimiento`);
  eliminarMovimiento(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
