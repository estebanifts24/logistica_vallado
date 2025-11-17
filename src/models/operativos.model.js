// ---------------------------------------------------------------
// Modelo Operativos - Firestore Web SDK
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

const col = collection(db, "operativos");

// Obtener todos
export const getAllOperativos = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Obtener uno
export const getOperativoById = async (id) => {
  const ref = doc(db, "operativos", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Crear
export const createOperativo = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// Actualizar
export const updateOperativo = async (id, data) => {
  const ref = doc(db, "operativos", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// Eliminar
export const deleteOperativo = async (id) => {
  const ref = doc(db, "operativos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false, message: "Operativo no encontrado." };

  await deleteDoc(ref);
  return { deleted: true };
};

// BUSCAR POR NOMBRE (exacto)
export const searchOperativos = async (nombre) => {
  const q = query(col, where("nombre", "==", nombre));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
