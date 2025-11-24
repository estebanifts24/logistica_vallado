// ---------------------------------------------------------------
// Service de Empleados - Firestore Web SDK (Validación de DNI y Legajo)
// ---------------------------------------------------------------

import {
  getAllEmpleados,    // Trae todos los empleados de la base de datos
  getEmpleadoById,    // Trae un empleado específico por ID
  createEmpleado,     // Crea un nuevo empleado
  updateEmpleado,     // Actualiza un empleado existente
  deleteEmpleado      // Elimina un empleado por ID
} from "../models/empleados.model.js";

// Detecta si estamos en modo desarrollo para imprimir logs
const isDevelopment = process.env.NODE_ENV !== "production";

// ------------------------
// Listar todos los empleados
// ------------------------
export const listarEmpleadosService = async () => {
  const result = await getAllEmpleados(); // Llama al modelo para traer todos los empleados

  if (isDevelopment) {
    console.log("[listarEmpleadosService] Petición GET /empleados recibida"); // Log de petición
    console.log("[listarEmpleadosService] Cantidad de empleados listados:", result.length); // Log del resultado
  }

  return result; // Retorna la lista de empleados al controlador
};

// ------------------------
// Obtener un empleado por ID
// ------------------------
export const obtenerEmpleadoService = async (id) => {
  if (!id) {
    if (isDevelopment) console.log("[obtenerEmpleadoService] Error: ID requerido"); // Log si falta ID
    throw new Error("ID requerido."); // Arroja error si no hay ID
  }

  const result = await getEmpleadoById(id); // Llama al modelo para traer un empleado por ID

  if (isDevelopment) {
    console.log(`[obtenerEmpleadoService] Petición GET /empleados/${id} recibida`); // Log de petición
    console.log("[obtenerEmpleadoService] Resultado:", result || "No encontrado"); // Log del resultado
  }

  return result; // Retorna el empleado encontrado
};

// ------------------------
// Crear un nuevo empleado con validación de DNI y Legajo únicos
// ------------------------
export const crearEmpleadoService = async (data) => {
  if (!data) {
    if (isDevelopment) console.log("[crearEmpleadoService] Error: Datos inválidos"); // Log si no hay datos
    throw new Error("Datos inválidos."); // Arroja error si no hay datos
  }

  const empleados = await getAllEmpleados(); // Trae todos los empleados para validar duplicados

  if (empleados.some(e => e.dni === data.dni)) { // Verifica si el DNI ya existe
    if (isDevelopment) console.log("[crearEmpleadoService] Error: DNI duplicado", data.dni); // Log de error
    throw new Error("DNI ya registrado para otro empleado");
  }

  if (empleados.some(e => e.legajo === data.legajo)) { // Verifica si el legajo ya existe
    if (isDevelopment) console.log("[crearEmpleadoService] Error: Legajo duplicado", data.legajo); // Log de error
    throw new Error("Legajo ya registrado para otro empleado");
  }

  const result = await createEmpleado(data); // Crea el nuevo empleado en la base de datos

  if (isDevelopment) {
    console.log("[crearEmpleadoService] Petición POST /empleados recibida"); // Log de petición
    console.log("[crearEmpleadoService] Empleado creado:", result); // Log del empleado creado
  }

  return result; // Retorna el nuevo empleado
};

// ------------------------
// Actualizar un empleado existente con validación de DNI y Legajo únicos
// ------------------------
export const actualizarEmpleadoService = async (id, data) => {
  if (!id) {
    if (isDevelopment) console.log("[actualizarEmpleadoService] Error: ID requerido"); // Log si falta ID
    throw new Error("ID requerido."); // Arroja error si no hay ID
  }

  const empleados = await getAllEmpleados(); // Trae todos los empleados para validar duplicados

  if (empleados.some(e => e.dni === data.dni && e.id !== id)) { // Verifica si el DNI ya existe en otro empleado
    if (isDevelopment) console.log("[actualizarEmpleadoService] Error: DNI duplicado", data.dni); // Log de error
    throw new Error("DNI ya registrado para otro empleado");
  }

  if (empleados.some(e => e.legajo === data.legajo && e.id !== id)) { // Verifica si el legajo ya existe en otro empleado
    if (isDevelopment) console.log("[actualizarEmpleadoService] Error: Legajo duplicado", data.legajo); // Log de error
    throw new Error("Legajo ya registrado para otro empleado");
  }

  const result = await updateEmpleado(id, data); // Actualiza los datos del empleado

  if (isDevelopment) {
    console.log(`[actualizarEmpleadoService] Petición PUT /empleados/${id} recibida`); // Log de petición
    console.log("[actualizarEmpleadoService] Empleado actualizado:", result); // Log del resultado
  }

  return result; // Retorna el empleado actualizado
};

// ------------------------
// Eliminar un empleado por ID
// ------------------------
export const eliminarEmpleadoService = async (id) => {
  if (!id) {
    if (isDevelopment) console.log("[eliminarEmpleadoService] Error: ID requerido"); // Log si falta ID
    throw new Error("ID requerido."); // Arroja error si no hay ID
  }

  const result = await deleteEmpleado(id); // Llama al modelo para eliminar el empleado

  if (isDevelopment) {
    console.log(`[eliminarEmpleadoService] Petición DELETE /empleados/${id} recibida`); // Log de petición
    console.log("[eliminarEmpleadoService] Resultado de eliminación:", result); // Log del resultado
  }

  return result; // Retorna el resultado de eliminación
};

// ------------------------
// Buscar empleados por DNI, Legajo, Nombre o Apellido (parcial)
// ------------------------
export const buscarEmpleadosService = async (params) => {
  const { dni, legajo, nombre, apellido } = params; // Extrae parámetros de búsqueda

  const empleados = await getAllEmpleados(); // Trae todos los empleados

  // Filtra empleados según los parámetros recibidos
  const filtrados = empleados.filter(e => {
    let match = true;

    if (dni) match = match && e.dni === dni; // Filtra por DNI exacto
    if (legajo) match = match && e.legajo === legajo; // Filtra por legajo exacto
    if (nombre) match = match && e.nombre.toLowerCase().includes(nombre.toLowerCase()); // Filtra por nombre parcial
    if (apellido) match = match && e.apellido.toLowerCase().includes(apellido.toLowerCase()); // Filtra por apellido parcial
    
    return match; // Devuelve true si coincide con todos los filtros
  });

  if (isDevelopment) {
    console.log("[buscarEmpleadosService] Petición GET /empleados/search recibida con params:", params); // Log de petición
    console.log("[buscarEmpleadosService] Empleados encontrados:", filtrados.length); // Log de cantidad de resultados
  }

  return filtrados; // Retorna los empleados filtrados
};
