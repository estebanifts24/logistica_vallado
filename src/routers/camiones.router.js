// ---------------------------------------------------------------
// Router de Camiones
// ---------------------------------------------------------------

// Importamos Router de Express
import { Router } from "express";
// Importamos controladores que manejan la lógica de cada ruta
import {
  listarCamiones,
  obtenerCamion,
  crearCamion,
  actualizarCamion,
  eliminarCamion,
  buscarCamiones
} from "../controllers/camiones.controller.js";
// Importamos middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router(); // Creamos el router específico para camiones

// ------------------------
// Rutas de Camiones
// ------------------------

// GET /api/camiones → Listar todos los camiones
router.get("/", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/camiones -> listarCamiones");
  listarCamiones(req, res, next);
});

// GET /api/camiones/search → Buscar camiones por criterio
router.get("/search", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/camiones/search -> buscarCamiones, query:", req.query);
  buscarCamiones(req, res, next);
});

// GET /api/camiones/:id → Obtener un camión por ID
router.get("/:id", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/camiones/${req.params.id} -> obtenerCamion`);
  obtenerCamion(req, res, next);
});

// POST /api/camiones → Crear un nuevo camión (requiere autenticación)
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/camiones -> crearCamion, body:", req.body);
  crearCamion(req, res, next);
});

// PUT /api/camiones/:id → Actualizar un camión existente (requiere autenticación)
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/camiones/${req.params.id} -> actualizarCamion, body:`, req.body);
  actualizarCamion(req, res, next);
});

// DELETE /api/camiones/:id → Eliminar un camión (requiere autenticación y rol admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/camiones/${req.params.id} -> eliminarCamion`);
  eliminarCamion(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
