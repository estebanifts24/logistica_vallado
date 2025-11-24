// ---------------------------------------------------------------
// Modelo Camiones - Firestore Web SDK
// ---------------------------------------------------------------
// Esta capa interactúa directamente con Firestore
// Cada función realiza una operación CRUD sobre la colección "camiones"
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

// Definimos la referencia a la colección "camiones"
const col = collection(db, "camiones");

// -------------------------
// Obtener todos los camiones
// -------------------------
export const getAllCamiones = async () => {
  // Traemos todos los documentos de la colección
  const snap = await getDocs(col);

  // Mapear cada documento para incluir su ID junto con los datos
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener un camión por ID
// -------------------------
export const getCamionById = async (id) => {
  // Referencia al documento específico por ID
  const ref = doc(db, "camiones", id);

  // Traemos el documento de Firestore
  const snap = await getDoc(ref);

  // Si existe, retornamos objeto con ID + datos, si no retornamos null
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear un nuevo camión
// -------------------------
export const createCamion = async (data) => {
  // Añadimos el nuevo documento a la colección
  const docRef = await addDoc(col, data);

  // Retornamos el objeto con el ID generado por Firestore y los datos
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar un camión existente
// -------------------------
export const updateCamion = async (id, data) => {
  // Referencia al documento que queremos actualizar
  const ref = doc(db, "camiones", id);

  // Actualizamos los campos del documento
  await updateDoc(ref, data);

  // Recuperamos nuevamente el documento actualizado
  const snap = await getDoc(ref);

  // Retornamos el objeto actualizado con su ID
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar un camión por ID
// -------------------------
export const deleteCamion = async (id) => {
  // Referencia al documento
  const ref = doc(db, "camiones", id);

  // Obtenemos el documento para verificar si existe
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "No existe." };

  // Si existe, eliminamos el documento
  await deleteDoc(ref);

  // Retornamos confirmación de eliminación
  return { deleted: true };
};

// -------------------------
// Buscar camiones por patente
// -------------------------
export const searchCamiones = async (patente) => {
  // Creamos una query que filtre por campo "patente" igual al valor recibido
  const q = query(col, where("patente", "==", patente));

  // Ejecutamos la query
  const snap = await getDocs(q);

  // Mapear resultados para incluir ID + datos
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
