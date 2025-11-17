// ---------------------------------------------------------------
// Modelo Movimientos - Firestore Web SDK
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

const col = collection(db, "movimientos");

// Obtener todos
export const getAllMovimientos = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Obtener uno
export const getMovimientoById = async (id) => {
  const ref = doc(db, "movimientos", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Crear
export const createMovimiento = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// Actualizar
export const updateMovimiento = async (id, data) => {
  const ref = doc(db, "movimientos", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// Eliminar
export const deleteMovimiento = async (id) => {
  const ref = doc(db, "movimientos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false, message: "Movimiento no encontrado." };

  await deleteDoc(ref);
  return { deleted: true };
};

// BUSCAR POR FECHA (exacta)
export const searchMovimientos = async (fecha) => {
  const q = query(col, where("fecha", "==", fecha));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
