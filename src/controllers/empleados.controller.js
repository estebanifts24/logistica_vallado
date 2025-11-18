// ---------------------------------------------------------------
// Controller de Empleados
// ---------------------------------------------------------------
// Controla las respuestas a las rutas REST y gestiona errores.
// Respuestas limpias y unificadas para toda la API.
// ---------------------------------------------------------------

import {
  listarEmpleadosService,
  obtenerEmpleadoService,
  crearEmpleadoService,
  actualizarEmpleadoService,
  eliminarEmpleadoService,
   buscarEmpleadosService
} from "../services/empleados.service.js";

// GET - Listar todos
export const listarEmpleados = async (req, res) => {
  try {
    const data = await listarEmpleadosService();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET - Uno solo
export const obtenerEmpleado = async (req, res) => {
  try {
    const data = await obtenerEmpleadoService(req.params.id);

    if (!data)
      return res.status(404).json({ success: false, message: "Empleado no encontrado." });

    res.json({ success: true, data });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// POST - Crear
export const crearEmpleado = async (req, res) => {
  try {
    const data = await crearEmpleadoService(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT - Actualizar
export const actualizarEmpleado = async (req, res) => {
  try {
    const data = await actualizarEmpleadoService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE - Eliminar
export const eliminarEmpleado = async (req, res) => {
  try {
    const data = await eliminarEmpleadoService(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET - Buscar empleados por filtros (dni, nombre, apellido, etc.)
export const buscarEmpleados = async (req, res) => {
  try {
    // Pasamos todo lo que venga en query como filtros
    const filtros = req.query;

    if (Object.keys(filtros).length === 0) {
      return res.status(400).json({ success: false, message: "Debe enviar al menos un parámetro de búsqueda" });
    }

    const data = await buscarEmpleadosService(filtros);

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


