// Importamos todas las funciones del modelo de vallas
import * as model from '../models/vallas.model.js';

//////////////////////////////////////////////////////////////
/// OBTENER TODAS LAS VALLAS
//////////////////////////////////////////////////////////////

export const getAllVallas = (req, res) => {
  const vallas = model.getAllVallas(); // Llamamos al modelo
  res.json(vallas);                    // Enviamos la respuesta al cliente
  console.log(vallas);                 // Mostramos en consola
};

//////////////////////////////////////////////////////////////
/// BUSCAR VALLA POR UBICACIÓN
//////////////////////////////////////////////////////////////

export const searchValla = (req, res) => {
  console.log("search valla");
  const { ubicacion } = req.query; // Leemos el query param ?ubicacion=

  const vallas = model.getAllVallas(); // Traemos todas las vallas
  // Filtramos por coincidencia parcial (no distingue mayúsculas/minúsculas)


  // --- DEBUG TEMPORAL ---
  console.log("Query recibido:", req.query);                // muestra lo que llega desde Postman
  console.log("Ubicaciones disponibles:", vallas.map(v => v.ubicacion)); // lista todas las ubicaciones que hay en el JSON
  // ----------------------



  const filtered = vallas.filter((v) =>
    v.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())
  );

  res.json(filtered); // Enviamos la respuesta filtrada
  console.log(req.query);
};



//////////////////////////////////////////////////////////////
/// OBTENER VALLA POR ID
//////////////////////////////////////////////////////////////

export const getVallaById = (req, res) => {
  const { id } = req.params;              // Capturamos el ID desde la URL
  const valla = model.getVallaById(id);   // Buscamos en el modelo

  if (!valla) {
    // Si no se encuentra, devolvemos un error 404
    return res.status(404).json({ error: 'Valla no encontrada' });
  }

  res.json(valla); // Enviamos la valla encontrada
};

//////////////////////////////////////////////////////////////
/// CREAR NUEVA VALLA
//////////////////////////////////////////////////////////////

export const createValla = (req, res) => {
  // Obtenemos los datos del cuerpo de la solicitud
  const { ubicacion, cantidad, estado, fecha_actualizacion } = req.body;

  // Creamos una nueva valla
  const nuevaValla = model.createValla({
    ubicacion,
    cantidad,
    estado,
    fecha_actualizacion
  });

  // Respondemos con código 201 (creado)
  res.status(201).json(nuevaValla);

  console.log('Valla creada:', nuevaValla);
};

//////////////////////////////////////////////////////////////
/// ELIMINAR VALLA POR ID
//////////////////////////////////////////////////////////////

export const deleteValla = (req, res) => {
  const id = parseInt(req.params.id, 10); // Convertimos el ID a número
  const eliminada = model.deleteValla(id); // Llamamos al modelo

  if (!eliminada) {
    // Si no se encuentra la valla
    return res.status(404).json({ error: 'Valla no encontrada' });
  }

  res.status(204).send(); // Enviamos respuesta sin contenido
  console.log(`Valla con id ${id} eliminada`);
};

//////////////////////////////////////////////////////////////
/// ACTUALIZAR VALLA EXISTENTE
//////////////////////////////////////////////////////////////

export const updateValla = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { ubicacion, cantidad, estado, fecha_actualizacion } = req.body;

  const valla = model.getVallaById(id); // Buscamos la valla
  if (!valla) {
    return res.status(404).json({ error: 'Valla no encontrada' });
  }

  // Actualizamos solo los campos recibidos (si no vienen, se mantienen)
  valla.ubicacion = ubicacion ?? valla.ubicacion;
  valla.cantidad = cantidad ?? valla.cantidad;
  valla.estado = estado ?? valla.estado;
  valla.fecha_actualizacion = fecha_actualizacion ?? valla.fecha_actualizacion;

  // Guardamos cambios en el modelo
  const actualizada = model.updateValla(id, valla);

  res.json(actualizada);
  console.log(`Valla con id ${id} actualizada`);
};











// // Importamos todas las funciones del modelo de vallas
// import * as model from '../models/vallas.model.js';

// //////////////////////////////////////////////////////////////
// // OBTENER TODAS LAS VALLAS
// //////////////////////////////////////////////////////////////
// export const getAllVallas = (req, res) => {
//   console.log('getAllVallas ejecutada'); // Debug: función llamada
//   const vallas = model.getAllVallas();   // Traemos todas las vallas desde el modelo
//   console.log('Vallas:', vallas);        // Mostramos en consola
//   res.json(vallas);                       // Respondemos con el array completo
// };

// //////////////////////////////////////////////////////////////
// // BUSCAR VALLA POR UBICACIÓN
// //////////////////////////////////////////////////////////////
// export const searchValla = (req, res) => {
//   console.log('searchValla ejecutada');  // Debug: función llamada

//   const { ubicacion } = req.query;       // Desestructuramos el query param ?ubicacion=
//   console.log('Query param ubicacion:', ubicacion); // Mostramos qué llegó

//   if (!ubicacion) {
//     // Si no viene el parámetro, devolvemos error
//     return res.status(400).json({ error: 'Se requiere el parámetro "ubicacion"' });
//   }

//   const vallas = model.getAllVallas();   // Traemos todas las vallas
//   const filtered = vallas.filter((v) =>
//     v.ubicacion.toLowerCase().includes(ubicacion.toLowerCase()) // Busqueda case-insensitive
//   );

//   console.log('Resultado búsqueda:', filtered); // Mostramos coincidencias
//   res.json(filtered);                            // Respondemos con el resultado
// };

// //////////////////////////////////////////////////////////////
// // OBTENER VALLA POR ID
// //////////////////////////////////////////////////////////////
// export const getVallaById = (req, res) => {
//   console.log('getVallaById ejecutada'); // Debug
//   const { id } = req.params;             // Capturamos el ID desde la URL
//   console.log('ID recibido:', id);

//   const valla = model.getVallaById(id);  // Buscamos en el modelo
//   if (!valla) {
//     console.log('Valla no encontrada');
//     return res.status(404).json({ error: 'Valla no encontrada' });
//   }

//   console.log('Valla encontrada:', valla);
//   res.json(valla);
// };

// //////////////////////////////////////////////////////////////
// // CREAR NUEVA VALLA
// //////////////////////////////////////////////////////////////
// export const createValla = (req, res) => {
//   console.log('createValla ejecutada');
//   const { ubicacion, cantidad, estado, fecha_actualizacion } = req.body;
//   console.log('Datos recibidos:', req.body);

//   if (!ubicacion || cantidad === undefined || !estado) {
//     return res.status(400).json({ error: 'Faltan datos obligatorios' });
//   }

//   const nuevaValla = model.createValla({ ubicacion, cantidad, estado, fecha_actualizacion });
//   console.log('Valla creada:', nuevaValla);
//   res.status(201).json(nuevaValla); // Código 201 = creado
// };

// //////////////////////////////////////////////////////////////
// // ELIMINAR VALLA POR ID
// //////////////////////////////////////////////////////////////
// export const deleteValla = (req, res) => {
//   console.log('deleteValla ejecutada');
//   const id = parseInt(req.params.id, 10);
//   console.log('ID recibido para eliminar:', id);

//   const eliminada = model.deleteValla(id);
//   if (!eliminada) {
//     console.log('Valla no encontrada para eliminar');
//     return res.status(404).json({ error: 'Valla no encontrada' });
//   }

//   console.log(`Valla con id ${id} eliminada:`, eliminada);
//   res.status(204).send(); // 204 = sin contenido
// };

// //////////////////////////////////////////////////////////////
// // ACTUALIZAR VALLA EXISTENTE
// //////////////////////////////////////////////////////////////
// export const updateValla = (req, res) => {
//   console.log('updateValla ejecutada');
//   const id = parseInt(req.params.id, 10);
//   const { ubicacion, cantidad, estado, fecha_actualizacion } = req.body;

//   console.log('ID recibido para actualizar:', id);
//   console.log('Datos recibidos:', req.body);

//   const valla = model.getVallaById(id);
//   if (!valla) {
//     console.log('Valla no encontrada para actualizar');
//     return res.status(404).json({ error: 'Valla no encontrada' });
//   }

//   // Actualizamos solo los campos que llegaron, los demás se mantienen
//   valla.ubicacion = ubicacion ?? valla.ubicacion;
//   valla.cantidad = cantidad ?? valla.cantidad;
//   valla.estado = estado ?? valla.estado;
//   valla.fecha_actualizacion = fecha_actualizacion ?? valla.fecha_actualizacion;

//   const actualizada = model.updateValla(id, valla);
//   console.log('Valla actualizada:', actualizada);
//   res.json(actualizada);
// };
