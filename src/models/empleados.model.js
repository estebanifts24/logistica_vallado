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

// BUSCAR POR DNI
export const searchEmpleados = async (dni) => {
  const q = query(col, where("dni", "==", dni));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
