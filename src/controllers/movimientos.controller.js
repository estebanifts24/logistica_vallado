// ---------------------------------------------------------------
// Controller de Movimientos
// ---------------------------------------------------------------
// Controla las respuestas de la API para las rutas de movimientos.
// Gestiona errores y unifica respuestas JSON.
// ---------------------------------------------------------------

import {
  listarMovimientosService,
  obtenerMovimientoService,
  crearMovimientoService,
  actualizarMovimientoService,
  eliminarMovimientoService,
  buscarMovimientosService
} from "../services/movimientos.service.js";

// Detectamos si estamos en modo desarrollo para mostrar logs
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// GET - Listar todos los movimientos
// ------------------------
export const listarMovimientos = async (req, res) => {
  try {
    // Llamamos al servicio que obtiene todos los movimientos
    const data = await listarMovimientosService();

    // Log en desarrollo con la cantidad de movimientos obtenidos
    if (isDevelopment) {
      console.log("[MovimientosController.listarMovimientos] Petición GET /api/movimientos recibida");
      console.log("[MovimientosController.listarMovimientos] Cantidad de movimientos:", data.length);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });
  } catch (e) {
    // Error inesperado, devolvemos 500 Internal Server Error
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET - Obtener un movimiento por ID
// ------------------------
export const obtenerMovimiento = async (req, res) => {
  try {
    // Obtenemos el movimiento por ID usando el servicio
    const data = await obtenerMovimientoService(req.params.id);

    // Si no se encuentra, devolvemos 404 Not Found
    if (!data) {
      if (isDevelopment) {
        console.log(`[MovimientosController.obtenerMovimiento] Petición GET /api/movimientos/${req.params.id} recibida`);
        console.log("[MovimientosController.obtenerMovimiento] Movimiento no encontrado");
      }
      return res.status(404).json({
        success: false,
        message: "Movimiento no encontrado."
      });
    }

    // Log en desarrollo con la información del movimiento encontrado
    if (isDevelopment) {
      console.log(`[MovimientosController.obtenerMovimiento] Petición GET /api/movimientos/${req.params.id} recibida`);
      console.log("[MovimientosController.obtenerMovimiento] Movimiento encontrado:", data);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });
  } catch (e) {
    // Error en la petición, por ejemplo ID inválido
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// POST - Crear un nuevo movimiento
// ------------------------
export const crearMovimiento = async (req, res) => {
  try {
    // Creamos el movimiento con los datos enviados en el body
    const data = await crearMovimientoService(req.body);

    // Log en desarrollo con información del movimiento creado
    if (isDevelopment) {
      console.log("[MovimientosController.crearMovimiento] Petición POST /api/movimientos recibida");
      console.log("[MovimientosController.crearMovimiento] Movimiento creado:", data);
    }

    // Respondemos 201 Created con los datos del movimiento
    res.status(201).json({ success: true, data });
  } catch (e) {
    // Error de validación o datos incompletos
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// PUT - Actualizar un movimiento existente
// ------------------------
export const actualizarMovimiento = async (req, res) => {
  try {
    // Actualizamos el movimiento usando ID y datos del body
    const data = await actualizarMovimientoService(req.params.id, req.body);

    // Log en desarrollo
    if (isDevelopment) {
      console.log(`[MovimientosController.actualizarMovimiento] Petición PUT /api/movimientos/${req.params.id} recibida`);
      console.log("[MovimientosController.actualizarMovimiento] Movimiento actualizado:", data);
    }

    // Respondemos con éxito y los datos actualizados
    res.json({ success: true, data });
  } catch (e) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// DELETE - Eliminar un movimiento
// ------------------------
export const eliminarMovimiento = async (req, res) => {
  try {
    // Llamamos al servicio para eliminar el movimiento por ID
    const deleted = await eliminarMovimientoService(req.params.id);

    // Determinamos el mensaje según si se eliminó o no
    const message = deleted.deleted ? "Movimiento eliminado." : "Movimiento no encontrado.";

    // Log en desarrollo con información de eliminación
    if (isDevelopment) {
      console.log(`[MovimientosController.eliminarMovimiento] Petición DELETE /api/movimientos/${req.params.id} recibida`);
      console.log("[MovimientosController.eliminarMovimiento] Resultado de eliminación:", deleted);
    }

    // Respondemos con éxito, estado de eliminación y datos
    res.json({ success: deleted.deleted, data: deleted.data || null, message });
  } catch (e) {
    // Error de validación o ID inválido
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET SEARCH - Buscar movimientos por término
// (vallaCodigo, empleadoLegajo, camiónPatente, etc.)
// ------------------------
export const buscarMovimientos = async (req, res) => {
  try {
    // Tomamos el parámetro genérico "term" de query params
    const { term } = req.query;

    // Llamamos al servicio que busca movimientos que coincidan con el término
    const data = await buscarMovimientosService(term);

    // Log en desarrollo con la búsqueda realizada
    if (isDevelopment) {
      console.log(`[MovimientosController.buscarMovimientos] Petición GET /api/movimientos/search recibida con term="${term}"`);
      console.log("[MovimientosController.buscarMovimientos] Movimientos encontrados:", data.length);
    }

    // Respondemos con éxito y los datos encontrados
    res.json({ success: true, data });
  } catch (e) {
    // Error si no se envía término o falla el servicio
    res.status(400).json({ success: false, error: e.message });
  }
};
