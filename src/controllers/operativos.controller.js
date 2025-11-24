// ---------------------------------------------------------------
// Controller de Operativos
// ---------------------------------------------------------------
// Gestiona las respuestas de la API para las rutas de operativos.
// Maneja errores y unifica la estructura de respuesta JSON.
// ---------------------------------------------------------------

import {
  listarOperativosService,
  obtenerOperativoService,
  crearOperativoService,
  actualizarOperativoService,
  eliminarOperativoService,
  buscarOperativosService
} from "../services/operativos.service.js";

// Detectamos si estamos en modo desarrollo para mostrar logs
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// GET - Listar todos los operativos
// ------------------------
export const listarOperativos = async (req, res) => {
  try {
    // Llamamos al servicio que obtiene todos los operativos
    const data = await listarOperativosService();

    // Log en desarrollo con la cantidad de operativos obtenidos
    if (isDevelopment) {
      console.log("[OperativosController.listarOperativos] Petición GET /api/operativos recibida");
      console.log("[OperativosController.listarOperativos] Cantidad de operativos:", data.length);
    }

    // Respondemos con éxito y los datos obtenidos
    res.json({ success: true, data });
  } catch (e) {
    // Error inesperado
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET - Obtener un operativo por ID
// ------------------------
export const obtenerOperativo = async (req, res) => {
  try {
    // Obtenemos el operativo por ID usando el servicio
    const data = await obtenerOperativoService(req.params.id);

    // Si no se encuentra, devolvemos 404 Not Found
    if (!data) {
      if (isDevelopment) {
        console.log(`[OperativosController.obtenerOperativo] Petición GET /api/operativos/${req.params.id} recibida`);
        console.log("[OperativosController.obtenerOperativo] Operativo no encontrado");
      }
      return res.status(404).json({ success: false, message: "Operativo no encontrado." });
    }

    // Log en desarrollo con la información del operativo encontrado
    if (isDevelopment) {
      console.log(`[OperativosController.obtenerOperativo] Petición GET /api/operativos/${req.params.id} recibida`);
      console.log("[OperativosController.obtenerOperativo] Operativo encontrado:", data);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });
  } catch (e) {
    // Error de validación o ID inválido
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// POST - Crear un nuevo operativo
// ------------------------
export const crearOperativo = async (req, res) => {
  try {
    // Creamos el operativo con los datos enviados en el body
    const data = await crearOperativoService(req.body);

    // Log en desarrollo con información del operativo creado
    if (isDevelopment) {
      console.log("[OperativosController.crearOperativo] Petición POST /api/operativos recibida");
      console.log("[OperativosController.crearOperativo] Operativo creado:", data);
    }

    // Respondemos 201 Created con los datos del operativo
    res.status(201).json({ success: true, data });
  } catch (e) {
    // Error de validación o datos incompletos
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// PUT - Actualizar un operativo existente
// ------------------------
export const actualizarOperativo = async (req, res) => {
  try {
    // Actualizamos el operativo usando ID y datos del body
    const data = await actualizarOperativoService(req.params.id, req.body);

    // Log en desarrollo con los datos actualizados
    if (isDevelopment) {
      console.log(`[OperativosController.actualizarOperativo] Petición PUT /api/operativos/${req.params.id} recibida`);
      console.log("[OperativosController.actualizarOperativo] Operativo actualizado:", data);
    }

    // Respondemos con éxito y los datos actualizados
    res.json({ success: true, data });
  } catch (e) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// DELETE - Eliminar un operativo
// ------------------------
export const eliminarOperativo = async (req, res) => {
  try {
    // Llamamos al servicio para eliminar el operativo por ID
    const data = await eliminarOperativoService(req.params.id);

    // Log en desarrollo con información de eliminación
    if (isDevelopment) {
      console.log(`[OperativosController.eliminarOperativo] Petición DELETE /api/operativos/${req.params.id} recibida`);
      console.log("[OperativosController.eliminarOperativo] Resultado de eliminación:", data);
    }

    // Respondemos con éxito y los datos eliminados
    res.json({ success: true, data });
  } catch (e) {
    // Error de validación o ID inválido
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET SEARCH - Buscar operativos por nombre
// ------------------------
export const buscarOperativos = async (req, res) => {
  try {
    // Tomamos el parámetro "nombre" de query params
    const { nombre } = req.query;

    // Llamamos al servicio que busca operativos por nombre
    const data = await buscarOperativosService(nombre);

    // Log en desarrollo con la búsqueda realizada
    if (isDevelopment) {
      console.log(`[OperativosController.buscarOperativos] Petición GET /api/operativos/search recibida con nombre="${nombre}"`);
      console.log("[OperativosController.buscarOperativos] Operativos encontrados:", data.length);
    }

    // Respondemos con éxito y los datos encontrados
    res.json({ success: true, data });
  } catch (e) {
    // Error si no se envía nombre o falla el servicio
    res.status(400).json({ success: false, error: e.message });
  }
};
