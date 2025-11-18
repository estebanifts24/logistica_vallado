// ---------------------------------------------------------------
// Modelo Empleados - Firestore Web SDK
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

const col = collection(db, "empleados");

// Obtener todos
export const getAllEmpleados = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Obtener uno por ID
export const getEmpleadoById = async (id) => {
  const ref = doc(db, "empleados", id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() }) : null;
};

// Crear
export const createEmpleado = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// Actualizar
export const updateEmpleado = async (id, data) => {
  const ref = doc(db, "empleados", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// Eliminar
export const deleteEmpleado = async (id) => {
  const ref = doc(db, "empleados", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "Empleado no existe." };

  await deleteDoc(ref);
  return { deleted: true };
};

// BUSCAR EMPLEADOS por nombre, apellido o dni (parcial, insensible a mayúsculas)
export const searchEmpleados = async (nombre, apellido, dni) => {
  const snap = await getDocs(col); // Traemos todos los documentos de la colección

  const results = snap.docs
    .map(d => ({ id: d.id, ...d.data() })) // Convertimos cada doc en objeto
    .filter(d => {
      // Convertimos a minúsculas para búsqueda insensible
      const n = nombre?.toLowerCase() || "";
      const a = apellido?.toLowerCase() || "";
      const idni = dni?.toLowerCase() || "";

      return (
        (n && d.nombre?.toLowerCase().includes(n)) ||       // Filtra por nombre si se pasó
        (a && d.apellido?.toLowerCase().includes(a)) ||    // Filtra por apellido si se pasó
        (idni && d.dni?.toLowerCase().includes(idni))      // Filtra por DNI si se pasó
      );
    });

  return results; // Devuelve todos los empleados que coinciden con alguno de los parámetros
};

