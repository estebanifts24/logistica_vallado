// ---------------------------------------------------------------
// Modelo Camiones - Firestore Web SDK
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

const col = collection(db, "camiones");

// Obtener todos
export const getAllCamiones = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Obtener por ID
export const getCamionById = async (id) => {
  const ref = doc(db, "camiones", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Crear
export const createCamion = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// Actualizar
export const updateCamion = async (id, data) => {
  const ref = doc(db, "camiones", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// Eliminar
export const deleteCamion = async (id) => {
  const ref = doc(db, "camiones", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "No existe." };
  await deleteDoc(ref);
  return { deleted: true };
};

// BUSCAR POR PATENTE
export const searchCamiones = async (patente) => {
  const q = query(col, where("patente", "==", patente));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
