// ---------------------------------------------------------------
// Router de Operativos
// ---------------------------------------------------------------

import { Router } from "express";

import {
  listarOperativos,
  obtenerOperativo,
  crearOperativo,
  actualizarOperativo,
  eliminarOperativo,
  buscarOperativos
} from "../controllers/operativos.controller.js";

const router = Router();

router.get("/", listarOperativos);
router.get("/search", buscarOperativos);  // ← TERCER GET
router.get("/:id", obtenerOperativo);
router.post("/", crearOperativo);
router.put("/:id", actualizarOperativo);
router.delete("/:id", eliminarOperativo);

export default router;
