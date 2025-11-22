// src/routes/camiones.router.js
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
router.get("/search", buscarCamiones);   // 🔹 ruta de búsqueda
router.get("/:id", obtenerCamion);
router.post("/", crearCamion);
router.put("/:id", actualizarCamion);
router.delete("/:id", eliminarCamion);

export default router;
