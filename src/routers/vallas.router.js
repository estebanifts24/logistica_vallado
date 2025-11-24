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
  buscarVallas,
  subirFotoValla
} from "../controllers/vallas.controller.js";
// Middleware para subir archivos
import upload from "../middlewares/multer.js";

const router = Router(); // Creamos el router específico para vallas

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
  if (process.env.NODE_ENV === "development") console.log("GET /api/vallas/search -> buscarVallas, query:", req.query);
  buscarVallas(req, res, next);
});

// GET /api/vallas/:id → Obtener una valla por ID
router.get("/:id", (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`GET /api/vallas/${req.params.id} -> obtenerValla`);
  obtenerValla(req, res, next);
});

// POST /api/vallas/foto/:id → Subir foto de una valla (requiere autenticación)
// Multer maneja el archivo enviado en el campo "file"
router.post("/foto/:id", authenticate, upload.single("file"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`POST /api/vallas/foto/${req.params.id} -> subirFotoValla, file:`, req.file?.originalname);
  subirFotoValla(req, res, next);
});

// POST /api/vallas → Crear nueva valla (requiere autenticación)
router.post("/", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log("POST /api/vallas -> crearValla, body:", req.body);
  crearValla(req, res, next);
});

// PUT /api/vallas/:id → Actualizar una valla existente (requiere autenticación)
router.put("/:id", authenticate, (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`PUT /api/vallas/${req.params.id} -> actualizarValla, body:`, req.body);
  actualizarValla(req, res, next);
});

// DELETE /api/vallas/:id → Eliminar una valla (requiere autenticación y rol admin)
router.delete("/:id", authenticate, authorizeRoles("admin"), (req, res, next) => {
  if (process.env.NODE_ENV === "development") console.log(`DELETE /api/vallas/${req.params.id} -> eliminarValla`);
  eliminarValla(req, res, next);
});

export default router; // Exportamos el router para usarlo en server.js
