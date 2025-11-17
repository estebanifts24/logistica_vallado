// ---------------------------------------------------------------
// Router de Movimientos
// ---------------------------------------------------------------

import { Router } from "express";

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
router.post("/", crearMovimiento);
router.put("/:id", actualizarMovimiento);
router.delete("/:id", eliminarMovimiento);

export default router;
