// ---------------------------------------------------------------
// Service de Empleados - Firestore Web SDK
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
// BUSCAR POR DNI (limpia espacios y saltos de línea)
// ---------------------------------------------------------------
export const buscarEmpleadosService = async (dni) => {
  if (!dni) return [];
  
  const dniQuery = dni.trim(); // <-- LIMPIA ESPACIOS y SALTOS DE LÍNEA
  const q = query(col, where("dni", "==", dniQuery));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
