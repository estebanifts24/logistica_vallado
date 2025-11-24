// ---------------------------------------------------------------
// Modelo Vallas - Firestore Web SDK
// ---------------------------------------------------------------
// Esta capa interactúa directamente con Firestore.
// Cada función realiza operaciones CRUD sobre la colección "vallas".
// Incluye búsqueda parcial por código.
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
  // Trae todos los documentos de la colección
  const snap = await getDocs(col);

  // Mapear cada doc a objeto con su ID
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener una valla por ID
// -------------------------
export const getVallaById = async (id) => {
  const ref = doc(db, "vallas", id);
  const snap = await getDoc(ref);

  // Si existe, retornamos objeto con ID y datos; si no, null
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear una nueva valla
// -------------------------
export const createValla = async (data) => {
  // Añade un nuevo documento a la colección
  const docRef = await addDoc(col, data);

  // Retorna objeto con ID generado y datos
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar una valla existente
// -------------------------
export const updateValla = async (id, data) => {
  const ref = doc(db, "vallas", id);

  // Actualiza los campos del documento
  await updateDoc(ref, data);

  // Recuperamos nuevamente el documento actualizado
  const snap = await getDoc(ref);

  // Retornamos objeto con ID y datos actualizados
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar una valla por ID
// -------------------------
export const deleteValla = async (id) => {
  const ref = doc(db, "vallas", id);

  // Verificamos si existe antes de borrar
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "Valla no encontrada." };

  // Eliminamos documento
  await deleteDoc(ref);

  // Retornamos confirmación
  return { deleted: true };
};

// -------------------------
// Buscar vallas por código parcial (case-insensitive)
// -------------------------
export const searchVallas = async (codigo) => {
  // Traemos todos los documentos
  const snap = await getDocs(col);

  // Mapear cada doc a objeto y filtrar por coincidencia parcial en 'codigo'
  const results = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d => d.codigo.toLowerCase().includes(codigo.toLowerCase()));

  // Retornamos solo los documentos que coinciden
  return results;
};
