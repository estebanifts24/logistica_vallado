// ---------------------------------------------------------------
// Service de Empleados - Firestore Web SDK (Validación de DNI y Legajo)
// ---------------------------------------------------------------

import {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from "../models/empleados.model.js";

// ---------------------------------------------------------------
// LISTAR TODOS
// ---------------------------------------------------------------
export const listarEmpleadosService = async () => {
  return getAllEmpleados();
};

// ---------------------------------------------------------------
// OBTENER UNO
// ---------------------------------------------------------------
export const obtenerEmpleadoService = async (id) => {
  return getEmpleadoById(id);
};

// ---------------------------------------------------------------
// CREAR con validación de DNI y Legajo únicos
// ---------------------------------------------------------------
export const crearEmpleadoService = async (data) => {
  const empleados = await getAllEmpleados();

  if (empleados.some(e => e.dni === data.dni)) {
    throw new Error("DNI ya registrado para otro empleado");
  }
  if (empleados.some(e => e.legajo === data.legajo)) {
    throw new Error("Legajo ya registrado para otro empleado");
  }

  return createEmpleado(data);
};

// ---------------------------------------------------------------
// ACTUALIZAR con validación de DNI y Legajo únicos
// ---------------------------------------------------------------
export const actualizarEmpleadoService = async (id, data) => {
  const empleados = await getAllEmpleados();

  if (empleados.some(e => e.dni === data.dni && e.id !== id)) {
    throw new Error("DNI ya registrado para otro empleado");
  }
  if (empleados.some(e => e.legajo === data.legajo && e.id !== id)) {
    throw new Error("Legajo ya registrado para otro empleado");
  }

  return updateEmpleado(id, data);
};

// ---------------------------------------------------------------
// ELIMINAR
// ---------------------------------------------------------------
export const eliminarEmpleadoService = async (id) => {
  return deleteEmpleado(id);
};

// ---------------------------------------------------------------
// BUSCAR POR NOMBRE, APELLIDO, DNI, LEGADO (parcial)
// ---------------------------------------------------------------
export const buscarEmpleadosService = async (params) => {
  const { dni, legajo, nombre, apellido} = params;

  const empleados = await getAllEmpleados();

  const filtrados = empleados.filter(e => {
    let match = true;

    if (dni) match = match && e.dni === dni;
    if (legajo) match = match && e.legajo === legajo;
    if (nombre) match = match && e.nombre.toLowerCase().includes(nombre.toLowerCase());
    if (apellido) match = match && e.apellido.toLowerCase().includes(apellido.toLowerCase());
    
    return match;
  });

  return filtrados;
};
