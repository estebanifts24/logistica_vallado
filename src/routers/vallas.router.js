// ---------------------------------------------------------------
// Router de Vallas
// ---------------------------------------------------------------

import { Router } from "express";

// Middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

// Controladores que manejan la lógica de cada ruta
import {
  listarVallas,
  obtenerValla,
  crearValla,
  actualizarValla,
  eliminarValla,
  buscarVallas
} from "../controllers/vallas.controller.js";   // 👈 OJO: subirFotoValla eliminado

const router = Router();

// ------------------------
// Rutas de Vallas
// ------------------------

// GET /api/vallas → Listar todas las vallas
router.get("/", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/vallas -> listarVallas");
  listarVallas(req, res, next);
});

// GET /api/vallas/search → Buscar vallas por término
router.get("/search", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("GET /api/vallas/search -> buscarVallas", req.query);
  buscarVallas(req, res, next);
});

// GET /api/vallas/:id → Obtener una valla por ID
router.get("/:id", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/vallas/${req.params.id} -> obtenerValla`);
  obtenerValla(req, res, next);
});

// POST /api/vallas → Crear nueva valla
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/vallas -> crearValla", req.body);
  crearValla(req, res, next);
});

// PUT /api/vallas/:id → Actualizar una valla existente
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/vallas/${req.params.id} -> actualizarValla`, req.body);
  actualizarValla(req, res, next);
});

// DELETE /api/vallas/:id → Eliminar una valla (solo admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/vallas/${req.params.id} -> eliminarValla`);
  eliminarValla(req, res, next);
});

export default router;
