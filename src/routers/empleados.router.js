// ---------------------------------------------------------------
// Router de Empleados
// ---------------------------------------------------------------

import { Router } from "express";

import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  buscarEmpleados
} from "../controllers/empleados.controller.js";

const router = Router();

router.get("/", listarEmpleados);
router.get("/search", buscarEmpleados);  // ← TERCER GET
router.get("/:id", obtenerEmpleado);
router.post("/", crearEmpleado);
router.put("/:id", actualizarEmpleado);
router.delete("/:id", eliminarEmpleado);

export default router;
