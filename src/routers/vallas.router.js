// ---------------------------------------------------------------
// Router de Vallas
// ---------------------------------------------------------------

import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

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
router.post("/", authenticate, crearValla);
router.put("/:id", authenticate, actualizarValla);
router.delete("/:id", authenticate, authorizeRoles("admin"), eliminarValla);

export default router;
