// ---------------------------------------------------------------
// Controller de Camiones
// ---------------------------------------------------------------

// Importamos los servicios que contienen la lógica de negocio para los camiones
import {
  listarCamionesService,
  obtenerCamionService,
  crearCamionService,
  actualizarCamionService,
  eliminarCamionService,
  buscarCamionesService
} from "../services/camiones.service.js";

// ------------------------
// GET TODOS - Listar todos los camiones
// ------------------------
export const listarCamiones = async (req, res) => {
  try {
    // Llamamos al servicio que retorna todos los camiones
    const data = await listarCamionesService();

    // Log en desarrollo para seguimiento de la petición GET /camiones
    if (process.env.NODE_ENV !== "production") {
      console.log("[CamionesController.listarCamiones] Petición GET /api/camiones recibida");
      console.log("[CamionesController.listarCamiones] Cantidad de camiones:", data.length);
    }

    // Respondemos al cliente con éxito y los datos
    res.json({ success: true, data });

  } catch (e) {
    // Si ocurre un error, devolvemos 500 Internal Server Error
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET UNO - Obtener un camión por ID
// ------------------------
export const obtenerCamion = async (req, res) => {
  try {
    // Tomamos el ID de los parámetros de la URL
    const data = await obtenerCamionService(req.params.id);

    // Si no existe el camión, devolvemos 404
    if (!data) return res.status(404).json({ success: false, message: "No encontrado" });

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[CamionesController.obtenerCamion] Petición GET /api/camiones/${req.params.id} recibida`);
      console.log("[CamionesController.obtenerCamion] Camión encontrado:", data);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });

  } catch (e) {
    // Error en la petición (ej: ID inválido)
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// POST - Crear un nuevo camión
// ------------------------
export const crearCamion = async (req, res) => {
  try {
    // Llamamos al servicio que crea un camión con los datos enviados en el body
    const data = await crearCamionService(req.body);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log("[CamionesController.crearCamion] Petición POST /api/camiones recibida");
      console.log("[CamionesController.crearCamion] Camión creado:", data);
    }

    // Respondemos 201 Created con los datos del camión
    res.status(201).json({ success: true, data });

  } catch (e) {
    // Error de validación de datos
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// PUT - Actualizar un camión existente
// ------------------------
export const actualizarCamion = async (req, res) => {
  try {
    // Llamamos al servicio para actualizar el camión usando ID y datos del body
    const data = await actualizarCamionService(req.params.id, req.body);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[CamionesController.actualizarCamion] Petición PUT /api/camiones/${req.params.id} recibida`);
      console.log("[CamionesController.actualizarCamion] Camión actualizado:", data);
    }

    // Respondemos con éxito y los datos actualizados
    res.json({ success: true, data });

  } catch (e) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// DELETE - Eliminar un camión
// ------------------------
export const eliminarCamion = async (req, res) => {
  try {
    // Llamamos al servicio para eliminar el camión por ID
    const data = await eliminarCamionService(req.params.id);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[CamionesController.eliminarCamion] Petición DELETE /api/camiones/${req.params.id} recibida`);
      console.log("[CamionesController.eliminarCamion] Resultado eliminación:", data);
    }

    // Respondemos con éxito y los datos de eliminación
    res.json({ success: true, data });

  } catch (e) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: e.message });
  }
};

// ------------------------
// GET SEARCH - Buscar camiones por patente
// ------------------------
export const buscarCamiones = async (req, res) => {
  try {
    // Tomamos la patente desde query params
    const { patente } = req.query;

    // Llamamos al servicio para buscar camiones que coincidan con la patente
    const data = await buscarCamionesService(patente);

    // Log en desarrollo con información de la búsqueda
    if (process.env.NODE_ENV !== "production") {
      console.log(`[CamionesController.buscarCamiones] Petición GET /api/camiones/search?patente=${patente} recibida`);
      console.log("[CamionesController.buscarCamiones] Resultados encontrados:", data.length);
    }

    // Respondemos con éxito y los datos encontrados
    res.json({ success: true, data });

  } catch (e) {
    // Error si la patente no se envió o no se encontró
    res.status(400).json({ success: false, error: e.message });
  }
};
