// ---------------------------------------------------------------
// Router de Camiones
// ---------------------------------------------------------------

import { Router } from "express";
import {
  listarCamiones,
  obtenerCamion,
  crearCamion,
  actualizarCamion,
  eliminarCamion,
  buscarCamiones
} from "../controllers/camiones.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listarCamiones);
router.get("/search", buscarCamiones);   // ← TERCER GET
router.get("/:id", obtenerCamion);
router.post("/", authenticate, crearCamion);
router.put("/:id", authenticate, actualizarCamion);
router.delete("/:id", authenticate, authorizeRoles("admin"), eliminarCamion);

export default router;
