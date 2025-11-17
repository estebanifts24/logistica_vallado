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

const router = Router();

router.get("/", listarCamiones);
router.get("/search", buscarCamiones);   // ← TERCER GET
router.get("/:id", obtenerCamion);
router.post("/", crearCamion);
router.put("/:id", actualizarCamion);
router.delete("/:id", eliminarCamion);

export default router;
