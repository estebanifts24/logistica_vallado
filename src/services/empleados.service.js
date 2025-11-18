// ---------------------------------------------------------------
// Service de Empleados - Firestore Web SDK (Búsqueda parcial y exacta)
// ---------------------------------------------------------------

import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

// Colección
const col = collection(db, "empleados");

// ---------------------------------------------------------------
// LISTAR TODOS
// ---------------------------------------------------------------
export const listarEmpleadosService = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ---------------------------------------------------------------
// OBTENER UNO
// ---------------------------------------------------------------
export const obtenerEmpleadoService = async (id) => {
  const ref = doc(db, "empleados", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ---------------------------------------------------------------
// CREAR
// ---------------------------------------------------------------
export const crearEmpleadoService = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// ---------------------------------------------------------------
// ACTUALIZAR
// ---------------------------------------------------------------
export const actualizarEmpleadoService = async (id, data) => {
  const ref = doc(db, "empleados", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// ---------------------------------------------------------------
// ELIMINAR
// ---------------------------------------------------------------
export const eliminarEmpleadoService = async (id) => {
  const ref = doc(db, "empleados", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false, message: "No encontrado" };

  await deleteDoc(ref);
  return { deleted: true };
};

// ---------------------------------------------------------------
// BUSCAR POR DNI, LEGADO, NOMBRE, APELLIDO, CODIGO
// ---------------------------------------------------------------
export const buscarEmpleadosService = async (params) => {
  const { dni, legajo, nombre, apellido, codigo } = params;

  const snap = await getDocs(col);
  const empleados = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const filtrados = empleados.filter(e => {
    let match = true;

    if (dni) match = match && e.dni === dni;
    if (legajo) match = match && e.legajo === legajo;
    if (nombre) match = match && e.nombre.toLowerCase().includes(nombre.toLowerCase());
    if (apellido) match = match && e.apellido.toLowerCase().includes(apellido.toLowerCase());
    if (codigo) match = match && e.codigo.toLowerCase().includes(codigo.toLowerCase());

    return match;
  });

  return filtrados;
};
