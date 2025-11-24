// ---------------------------------------------------------------
// Modelo Operativos - Firestore Web SDK
// ---------------------------------------------------------------
// Esta capa interactúa directamente con Firestore.
// Cada función realiza operaciones CRUD sobre la colección "operativos".
// Incluye búsqueda por nombre exacto.
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

// Referencia a la colección "operativos"
const col = collection(db, "operativos");

// -------------------------
// Obtener todos los operativos
// -------------------------
export const getAllOperativos = async () => {
  // Traemos todos los documentos de la colección
  const snap = await getDocs(col);

  // Convertimos cada doc en objeto con su ID
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener un operativo por ID
// -------------------------
export const getOperativoById = async (id) => {
  // Referencia al documento por ID
  const ref = doc(db, "operativos", id);

  // Traemos el documento
  const snap = await getDoc(ref);

  // Si existe, retornamos objeto con ID y datos; si no, null
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear un nuevo operativo
// -------------------------
export const createOperativo = async (data) => {
  // Añadimos un nuevo documento en la colección
  const docRef = await addDoc(col, data);

  // Retornamos objeto con ID generado y datos enviados
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar un operativo existente
// -------------------------
export const updateOperativo = async (id, data) => {
  // Referencia al documento
  const ref = doc(db, "operativos", id);

  // Actualizamos los campos del documento
  await updateDoc(ref, data);

  // Recuperamos nuevamente el documento actualizado
  const snap = await getDoc(ref);

  // Retornamos objeto actualizado con su ID
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar un operativo por ID
// -------------------------
export const deleteOperativo = async (id) => {
  // Referencia al documento
  const ref = doc(db, "operativos", id);

  // Obtenemos el documento para verificar existencia
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "Operativo no encontrado." };

  // Si existe, eliminamos el documento
  await deleteDoc(ref);

  // Retornamos confirmación de eliminación
  return { deleted: true };
};

// -------------------------
// Buscar operativos por nombre exacto
// -------------------------
export const searchOperativos = async (nombre) => {
  // Creamos query para buscar documentos donde "nombre" sea exactamente igual
  const q = query(col, where("nombre", "==", nombre));

  // Ejecutamos la query
  const snap = await getDocs(q);

  // Convertimos cada doc en objeto con su ID
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
