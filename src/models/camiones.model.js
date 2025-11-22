// src/models/camiones.model.js
import { db } from "../config/data.js";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const col = collection(db, "camiones");

// Obtener todos los camiones
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
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Eliminar
export const deleteCamion = async (id) => {
  const ref = doc(db, "camiones", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "No existe." };
  await deleteDoc(ref);
  return { deleted: true };
};
