// src/routes/movimientos.router.js

import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

import {
  listarMovimientos,
  obtenerMovimiento,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  buscarMovimientos
} from "../controllers/movimientos.controller.js";

const router = Router();

// 🔹 Listar todos los movimientos
router.get("/", listarMovimientos);

// 🔹 Buscar movimientos por término (vallaCodigo, empleadoLegajo, camiónPatente, etc.)
router.get("/search", buscarMovimientos);

// 🔹 Obtener un movimiento por ID
router.get("/:id", obtenerMovimiento);

// 🔹 Crear un nuevo movimiento
router.post("/", authenticate, crearMovimiento);

// 🔹 Actualizar un movimiento por ID
router.put("/:id", authenticate, actualizarMovimiento);

// 🔹 Eliminar un movimiento por ID (solo admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), eliminarMovimiento);

export default router;
