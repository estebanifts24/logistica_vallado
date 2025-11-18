// ---------------------------------------------------------------
// Modelo Vallas - Firestore Web SDK
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

// Referencia a la colección "vallas"
const col = collection(db, "vallas");

// -------------------------
// Obtener todas las vallas
// -------------------------
export const getAllVallas = async () => {
  const snap = await getDocs(col); // Trae todos los documentos de la colección
  return snap.docs.map(d => ({ id: d.id, ...d.data() })); // Devuelve un array de objetos con id + datos
};

// -------------------------
// Obtener una valla por ID
// -------------------------
export const getVallaById = async (id) => {
  const ref = doc(db, "vallas", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear una nueva valla
// -------------------------
export const createValla = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar una valla
// -------------------------
export const updateValla = async (id, data) => {
  const ref = doc(db, "vallas", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar una valla
// -------------------------
export const deleteValla = async (id) => {
  const ref = doc(db, "vallas", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false, message: "Valla no encontrada." };

  await deleteDoc(ref);
  return { deleted: true };
};

// -------------------------
// BUSCAR POR CÓDIGO (campo interno, no el ID)
// Ahora permite búsqueda parcial y no distingue mayúsculas/minúsculas
// -------------------------
export const searchVallas = async (codigo) => {
  const snap = await getDocs(col); // Traemos todos los documentos
  // Filtramos en memoria usando includes() y toLowerCase()
  const results = snap.docs
    .map(d => ({ id: d.id, ...d.data() })) // Convertimos cada doc en objeto
    .filter(d => d.codigo.toLowerCase().includes(codigo.toLowerCase())); // Búsqueda parcial

  return results; // Devuelve solo los documentos que coinciden
};
