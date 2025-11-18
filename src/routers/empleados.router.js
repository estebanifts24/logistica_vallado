// ---------------------------------------------------------------
// Router completo de Empleados
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

import { validarBusquedaEmpleado } from "../middlewares/validarBusquedaEmpleado.js";

const router = Router();

// ---------------------------------------------------------------
// Rutas CRUD
// ---------------------------------------------------------------

// Listar todos los empleados
router.get("/", listarEmpleados);

// ---------------------------------------------------------------
// Ruta de búsqueda
// Debe ir antes de /:id para que Express no confunda la ruta
// Middleware validarBusquedaEmpleado asegura que se envíe al menos
// un parámetro: nombre, apellido o dni
// ---------------------------------------------------------------
router.get("/search", validarBusquedaEmpleado, buscarEmpleados);

// Obtener empleado por ID
router.get("/:id", obtenerEmpleado);

// Crear nuevo empleado
router.post("/", crearEmpleado);

// Actualizar empleado existente
router.put("/:id", actualizarEmpleado);

// Eliminar empleado
router.delete("/:id", eliminarEmpleado);

export default router;
