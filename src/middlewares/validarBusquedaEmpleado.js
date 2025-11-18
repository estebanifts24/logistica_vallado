// ---------------------------------------------------------------
// Middleware: validarBusquedaEmpleado
// Valida que al menos un parámetro de búsqueda exista
// ---------------------------------------------------------------

export const validarBusquedaEmpleado = (req, res, next) => {
  // Extraemos los parámetros de la query
  const { nombre, apellido, dni } = req.query;

  // Normalizamos los parámetros: eliminamos espacios en blanco
  req.query.nombre = nombre?.trim();
  req.query.apellido = apellido?.trim();
  req.query.dni = dni?.trim();

  // Si no hay ningún parámetro, devolvemos error 400
  if (!req.query.nombre && !req.query.apellido && !req.query.dni) {
    return res.status(400).json({
      success: false,
      error: "Debe enviar al menos un parámetro de búsqueda: nombre, apellido o dni"
    });
  }

  // Si todo bien, seguimos al controller
  next();
};
