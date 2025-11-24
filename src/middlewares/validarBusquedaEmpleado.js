// ---------------------------------------------------------------
// Middleware: validarBusquedaEmpleado
// ---------------------------------------------------------------
// Propósito: asegurar que al menos un parámetro de búsqueda válido
// esté presente antes de que la petición llegue al controlador.
// ---------------------------------------------------------------

export const validarBusquedaEmpleado = (req, res, next) => {
  // 🔹 Extraemos los parámetros de búsqueda de la query string
  // Ej: /empleados/search?nombre=Juan&apellido=Pérez&dni=12345678
  const { nombre, apellido, dni } = req.query;

  // 🔹 Normalizamos los valores: eliminamos espacios al inicio/final
  // Esto evita errores por cadenas vacías o espacios innecesarios
  req.query.nombre = nombre?.trim();
  req.query.apellido = apellido?.trim();
  req.query.dni = dni?.trim();

  // 🔹 Validación: si todos los parámetros están vacíos o no existen
  if (!req.query.nombre && !req.query.apellido && !req.query.dni) {
    // Retornamos un error HTTP 400 (Bad Request) indicando que falta info
    return res.status(400).json({
      success: false,
      error: "Debe enviar al menos un parámetro de búsqueda: nombre, apellido o dni"
    });
  }

  // 🔹 Si al menos uno de los parámetros es válido, seguimos al siguiente middleware/controller
  next();
};
