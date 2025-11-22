// ---------------------------------------------------------------
// Router de Movimientos
// ---------------------------------------------------------------

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

router.get("/", listarMovimientos);
router.get("/search", buscarMovimientos);  // ← TERCER GET
router.get("/:id", obtenerMovimiento);
router.post("/", authenticate,crearMovimiento);
router.put("/:id", authenticate,actualizarMovimiento);
router.delete("/:id", authenticate,authorizeRoles("admin"), eliminarMovimiento);

export default router;
