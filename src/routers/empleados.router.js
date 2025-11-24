// ---------------------------------------------------------------
// Router completo de Empleados
// ---------------------------------------------------------------

import { Router } from "express";

// Importamos controladores para manejar la lógica de cada ruta
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  buscarEmpleados
} from "../controllers/empleados.controller.js";

// Middlewares adicionales
import { validarBusquedaEmpleado } from "../middlewares/validarBusquedaEmpleado.js"; // Valida query de búsqueda
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js"; // Autenticación y autorización

const router = Router(); // Creamos el router específico para empleados

// ---------------------------------------------------------------
// Rutas CRUD
// ---------------------------------------------------------------

// GET /api/empleados → Listar todos los empleados (requiere autenticación)
router.get("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/empleados -> listarEmpleados");
  listarEmpleados(req, res, next);
});

// ---------------------------------------------------------------
// Ruta de búsqueda
// Debe ir antes de /:id para que Express no confunda la ruta
// Middleware validarBusquedaEmpleado asegura que se envíe al menos
// un parámetro: nombre, apellido o dni
// ---------------------------------------------------------------

// GET /api/empleados/search → Buscar empleados según parámetros (nombre, apellido, dni)
router.get("/search", authenticate, validarBusquedaEmpleado, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/empleados/search -> buscarEmpleados, query:", req.query);
  buscarEmpleados(req, res, next);
});

// GET /api/empleados/:id → Obtener empleado por ID
router.get("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/empleados/${req.params.id} -> obtenerEmpleado`);
  obtenerEmpleado(req, res, next);
});

// POST /api/empleados → Crear nuevo empleado (requiere autenticación)
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/empleados -> crearEmpleado, body:", req.body);
  crearEmpleado(req, res, next);
});

// PUT /api/empleados/:id → Actualizar empleado existente (requiere autenticación)
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/empleados/${req.params.id} -> actualizarEmpleado, body:`, req.body);
  actualizarEmpleado(req, res, next);
});

// DELETE /api/empleados/:id → Eliminar empleado (requiere autenticación y rol admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/empleados/${req.params.id} -> eliminarEmpleado`);
  eliminarEmpleado(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
