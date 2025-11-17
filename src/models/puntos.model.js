// ---------------------------------------------------------------
// Modelo Puntos - Firestore Web SDK
// ---------------------------------------------------------------

import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

const col = collection(db, "puntos");

// Obtener todos
export const getAllPuntos = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener uno por ID
export const getPuntoById = async (id) => {
  const ref = doc(db, "puntos", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Crear
export const createPunto = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// Actualizar
export const updatePunto = async (id, data) => {
  const ref = doc(db, "puntos", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// Eliminar
export const deletePunto = async (id) => {
  const ref = doc(db, "puntos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false, message: "Punto no encontrado." };

  await deleteDoc(ref);
  return { deleted: true };
};

// BUSCAR POR NOMBRE
export const searchPuntos = async (nombre) => {
  const q = query(col, where("nombre", "==", nombre));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
