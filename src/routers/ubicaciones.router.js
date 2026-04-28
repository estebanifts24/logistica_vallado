import { Router } from "express";
import {
  listarUbicaciones,
  obtenerUbicacion,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion
} from "../controllers/ubicaciones.controller.js";

const router = Router();

router.get("/", listarUbicaciones);
router.get("/:id", obtenerUbicacion);
router.post("/", crearUbicacion);
router.put("/:id", actualizarUbicacion);
router.delete("/:id", eliminarUbicacion);

export default router;