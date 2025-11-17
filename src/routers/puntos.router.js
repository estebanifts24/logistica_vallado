import { Router } from "express";

import {
  listarPuntos,
  obtenerPunto,
  crearPunto,
  actualizarPunto,
  eliminarPunto,
  buscarPuntos
} from "../controllers/puntos.controller.js";

const router = Router();

router.get("/", listarPuntos);
router.get("/search", buscarPuntos);
router.get("/:id", obtenerPunto);
router.post("/", crearPunto);
router.put("/:id", actualizarPunto);
router.delete("/:id", eliminarPunto);

export default router;
