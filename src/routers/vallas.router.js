// ---------------------------------------------------------------
// Router de Vallas
// ---------------------------------------------------------------

import { Router } from "express";

import {
  listarVallas,
  obtenerValla,
  crearValla,
  actualizarValla,
  eliminarValla,
  buscarVallas
} from "../controllers/vallas.controller.js";

const router = Router();

router.get("/", listarVallas);
router.get("/search", buscarVallas);   // ← TERCER GET
router.get("/:id", obtenerValla);
router.post("/", crearValla);
router.put("/:id", actualizarValla);
router.delete("/:id", eliminarValla);

export default router;
