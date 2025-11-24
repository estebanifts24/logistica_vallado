// ---------------------------------------------------------------
// Modelo Empleados - Firestore Web SDK
// ---------------------------------------------------------------
// Esta capa interactúa directamente con Firestore
// Cada función realiza una operación CRUD sobre la colección "empleados"
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

// Definimos la referencia a la colección "empleados"
const col = collection(db, "empleados");

// -------------------------
// Obtener todos los empleados
// -------------------------
export const getAllEmpleados = async () => {
  // Traemos todos los documentos de la colección
  const snap = await getDocs(col);

  // Mapear cada documento para incluir su ID junto con los datos
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener un empleado por ID
// -------------------------
export const getEmpleadoById = async (id) => {
  // Referencia al documento específico por ID
  const ref = doc(db, "empleados", id);

  // Traemos el documento de Firestore
  const snap = await getDoc(ref);

  // Si existe, retornamos objeto con ID + datos, si no retornamos null
  return snap.exists() ? ({ id: snap.id, ...snap.data() }) : null;
};

// -------------------------
// Crear un nuevo empleado
// -------------------------
export const createEmpleado = async (data) => {
  // Añadimos el nuevo documento a la colección
  const docRef = await addDoc(col, data);

  // Retornamos el objeto con el ID generado por Firestore y los datos
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar un empleado existente
// -------------------------
export const updateEmpleado = async (id, data) => {
  // Referencia al documento que queremos actualizar
  const ref = doc(db, "empleados", id);

  // Actualizamos los campos del documento
  await updateDoc(ref, data);

  // Recuperamos nuevamente el documento actualizado
  const snap = await getDoc(ref);

  // Retornamos el objeto actualizado con su ID
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar un empleado por ID
// -------------------------
export const deleteEmpleado = async (id) => {
  // Referencia al documento
  const ref = doc(db, "empleados", id);

  // Obtenemos el documento para verificar si existe
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "Empleado no existe." };

  // Si existe, eliminamos el documento
  await deleteDoc(ref);

  // Retornamos confirmación de eliminación
  return { deleted: true };
};

// -------------------------
// Buscar empleados por nombre, apellido o DNI (parcial e insensible a mayúsculas)
// -------------------------
export const searchEmpleados = async (nombre, apellido, dni) => {
  // Traemos todos los documentos de la colección (Firestore no soporta búsqueda parcial con where)
  const snap = await getDocs(col);

  // Convertimos cada doc en objeto y filtramos según parámetros recibidos
  const results = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d => {
      // Convertimos parámetros a minúsculas para búsqueda insensible
      const n = nombre?.toLowerCase() || "";
      const a = apellido?.toLowerCase() || "";
      const idni = dni?.toLowerCase() || "";

      // Retorna true si alguno de los campos coincide parcialmente
      return (
        (n && d.nombre?.toLowerCase().includes(n)) ||       // Filtra por nombre si se pasó
        (a && d.apellido?.toLowerCase().includes(a)) ||    // Filtra por apellido si se pasó
        (idni && d.dni?.toLowerCase().includes(idni))      // Filtra por DNI si se pasó
      );
    });

  // Devuelve todos los empleados que coinciden con alguno de los filtros
  return results;
};
