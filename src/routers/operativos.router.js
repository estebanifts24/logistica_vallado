// ---------------------------------------------------------------
// Router de Operativos
// ---------------------------------------------------------------

import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

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
router.post("/", authenticate, crearOperativo);
router.put("/:id", authenticate, actualizarOperativo);
router.delete("/:id", authenticate, authorizeRoles("admin"), eliminarOperativo);

export default router;
