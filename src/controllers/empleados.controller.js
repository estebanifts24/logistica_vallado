// ---------------------------------------------------------------
// Controller de Empleados
// ---------------------------------------------------------------
// Controla las respuestas a las rutas REST y gestiona errores.
// Respuestas limpias y unificadas para toda la API.
// ---------------------------------------------------------------

// Importamos los servicios que contienen la lógica de negocio de empleados
import {
  listarEmpleadosService,
  obtenerEmpleadoService,
  crearEmpleadoService,
  actualizarEmpleadoService,
  eliminarEmpleadoService,
  buscarEmpleadosService
} from "../services/empleados.service.js";

// ------------------------
// GET - Listar todos los empleados
// ------------------------
export const listarEmpleados = async (req, res) => {
  try {
    // Llamamos al servicio que obtiene todos los empleados
    const data = await listarEmpleadosService();

    // Log en desarrollo para seguimiento de la petición GET /empleados
    if (process.env.NODE_ENV !== "production") {
      console.log("[EmpleadosController.listarEmpleados] Petición GET /api/empleados recibida");
      console.log("[EmpleadosController.listarEmpleados] Cantidad de empleados:", data.length);
    }

    // Respondemos al cliente con éxito y los datos
    res.json({ success: true, data });
  } catch (error) {
    // Error inesperado, devolvemos 500 Internal Server Error
    res.status(500).json({ success: false, error: error.message });
  }
};

// ------------------------
// GET - Obtener un empleado por ID
// ------------------------
export const obtenerEmpleado = async (req, res) => {
  try {
    // Tomamos el ID de los parámetros de la URL
    const data = await obtenerEmpleadoService(req.params.id);

    // Si no existe el empleado, devolvemos 404 Not Found
    if (!data) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[EmpleadosController.obtenerEmpleado] Petición GET /api/empleados/${req.params.id} recibida`);
        console.log("[EmpleadosController.obtenerEmpleado] Empleado no encontrado");
      }
      return res.status(404).json({ success: false, message: "Empleado no encontrado." });
    }

    // Log en desarrollo con información del empleado encontrado
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EmpleadosController.obtenerEmpleado] Petición GET /api/empleados/${req.params.id} recibida`);
      console.log("[EmpleadosController.obtenerEmpleado] Empleado encontrado:", data);
    }

    // Respondemos con éxito y los datos
    res.json({ success: true, data });

  } catch (error) {
    // Error en la petición, por ejemplo ID inválido
    res.status(400).json({ success: false, error: error.message });
  }
};

// ------------------------
// POST - Crear un nuevo empleado
// ------------------------
export const crearEmpleado = async (req, res) => {
  try {
    // Llamamos al servicio que crea un empleado con los datos enviados
    const data = await crearEmpleadoService(req.body);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log("[EmpleadosController.crearEmpleado] Petición POST /api/empleados recibida");
      console.log("[EmpleadosController.crearEmpleado] Empleado creado:", data);
    }

    // Respondemos 201 Created con los datos del empleado
    res.status(201).json({ success: true, data });
  } catch (error) {
    // Error de validación (DNI o legajo duplicado, datos faltantes)
    res.status(400).json({ success: false, error: error.message });
  }
};

// ------------------------
// PUT - Actualizar un empleado existente
// ------------------------
export const actualizarEmpleado = async (req, res) => {
  try {
    // Llamamos al servicio para actualizar el empleado usando ID y datos del body
    const data = await actualizarEmpleadoService(req.params.id, req.body);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EmpleadosController.actualizarEmpleado] Petición PUT /api/empleados/${req.params.id} recibida`);
      console.log("[EmpleadosController.actualizarEmpleado] Empleado actualizado:", data);
    }

    // Respondemos con éxito y los datos actualizados
    res.json({ success: true, data });
  } catch (error) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: error.message });
  }
};

// ------------------------
// DELETE - Eliminar un empleado
// ------------------------
export const eliminarEmpleado = async (req, res) => {
  try {
    // Llamamos al servicio para eliminar el empleado por ID
    const data = await eliminarEmpleadoService(req.params.id);

    // Log en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EmpleadosController.eliminarEmpleado] Petición DELETE /api/empleados/${req.params.id} recibida`);
      console.log("[EmpleadosController.eliminarEmpleado] Resultado eliminación:", data);
    }

    // Respondemos con éxito y los datos de eliminación
    res.json({ success: true, data });
  } catch (error) {
    // Error de validación o ID no encontrado
    res.status(400).json({ success: false, error: error.message });
  }
};

// ------------------------
// GET - Buscar empleados por filtros
// (dni, legajo, nombre, apellido, etc.)
// ------------------------
export const buscarEmpleados = async (req, res) => {
  try {
    // Tomamos todos los filtros enviados por query params
    const filtros = req.query;

    // Si no se envió ningún filtro, devolvemos 400 Bad Request
    if (Object.keys(filtros).length === 0) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[EmpleadosController.buscarEmpleados] Petición GET /api/empleados/search recibida sin filtros");
      }
      return res.status(400).json({ success: false, message: "Debe enviar al menos un parámetro de búsqueda" });
    }

    // Llamamos al servicio que busca empleados según los filtros
    const data = await buscarEmpleadosService(filtros);

    // Log en desarrollo con la cantidad de resultados encontrados
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EmpleadosController.buscarEmpleados] Petición GET /api/empleados/search recibida con filtros:`, filtros);
      console.log("[EmpleadosController.buscarEmpleados] Empleados encontrados:", data.length);
    }

    // Respondemos con éxito y los datos encontrados
    res.json({ success: true, data });
  } catch (error) {
    // Error si ocurre algún problema con los filtros o el servicio
    res.status(400).json({ success: false, error: error.message });
  }
};
