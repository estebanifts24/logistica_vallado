// ---------------------------------------------------------------
// Controller de Vallas
// ---------------------------------------------------------------
// Gestiona todas las rutas REST relacionadas con vallas
// Llama a los servicios correspondientes, maneja errores y responde JSON
// También formatea mensajes y logs de desarrollo
// ---------------------------------------------------------------

import {
  listarVallasService,
  obtenerVallaService,
  crearVallaService,
  actualizarVallaService,
  eliminarVallaService,
  buscarVallasService
} from "../services/vallas.service.js";

// Detectamos si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV !== "production";

// -------------------------
// GET ALL - Listar todas las vallas
// -------------------------
export const listarVallas = async (req, res) => {
  try {
    // Llamamos al servicio que obtiene todas las vallas
    const data = await listarVallasService();

    // Log en desarrollo para seguimiento
    if (isDevelopment) {
      console.log("[VallasController.listarVallas] Petición GET /vallas recibida");
      console.log("[VallasController.listarVallas] Cantidad de vallas:", data.length);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });
  } catch (e) {
    // Error inesperado
    res.status(500).json({ success: false, error: e.message });
  }
};

// -------------------------
// GET ONE - Obtener una valla por ID
// -------------------------
export const obtenerValla = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que obtiene la valla por ID
    const data = await obtenerVallaService(id);

    if (!data) {
      if (isDevelopment) console.log(`[VallasController.obtenerValla] Valla ${id} no encontrada`);
      return res.status(404).json({ success: false, message: "Valla no encontrada." });
    }

    if (isDevelopment) console.log(`[VallasController.obtenerValla] Valla ${id} encontrada`);

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// -------------------------
// POST - Crear una nueva valla
// -------------------------
export const crearValla = async (req, res) => {
  try {
    // Llamamos al servicio que crea la valla
    const data = await crearVallaService(req.body);

    if (isDevelopment) console.log("[VallasController.crearValla] Nueva valla creada:", data);

    // Respondemos 201 Created
    res.status(201).json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// -------------------------
// PUT - Actualizar una valla existente
// -------------------------
export const actualizarValla = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que actualiza la valla
    const data = await actualizarVallaService(id, req.body);

    if (isDevelopment) console.log(`[izarVallaVallasController.actual] Valla ${id} actualizada:`, data);

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// -------------------------
// DELETE - Eliminar una valla
// -------------------------
export const eliminarValla = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al servicio que elimina la valla
    const data = await eliminarVallaService(id);

    if (isDevelopment) console.log(`[VallasController.eliminarValla] Valla ${id} eliminada`);

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

// -------------------------
// GET /search - Buscar vallas por código
// -------------------------
export const buscarVallas = async (req, res) => {
  try {
    const { codigo } = req.query;

    // Llamamos al servicio que busca vallas por código
    const data = await buscarVallasService(codigo);

    if (isDevelopment) {
      console.log(`[VallasController.buscarVallas] Petición GET /vallas/search?codigo=${codigo} recibida`);
      console.log("[VallasController.buscarVallas] Vallas encontradas:", data.length);
    }

    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};
