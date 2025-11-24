// ---------------------------------------------------------------
// Modelo Movimientos - Firestore Web SDK
// ---------------------------------------------------------------
// Esta capa interactúa directamente con Firestore.
// Cada función realiza operaciones CRUD sobre la colección "movimientos".
// Incluye búsqueda parcial en campos clave.
// ---------------------------------------------------------------

import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// Referencia a la colección "movimientos"
const col = collection(db, "movimientos");

// -------------------------
// Obtener todos los movimientos
// -------------------------
export const getAllMovimientos = async () => {
  // Traemos todos los documentos de la colección
  const snap = await getDocs(col);

  // Convertimos cada doc a objeto e incluimos el ID
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener un movimiento por ID
// -------------------------
export const getMovimientoById = async (id) => {
  // Referencia al documento por ID
  const ref = doc(db, "movimientos", id);

  // Traemos el documento
  const snap = await getDoc(ref);

  // Si existe, retornamos objeto con ID y datos; si no, null
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear un nuevo movimiento
// -------------------------
export const createMovimiento = async (data) => {
  // Añadimos un nuevo documento en la colección
  const docRef = await addDoc(col, data);

  // Retornamos objeto con ID generado y los datos enviados
  return { id: docRef.id, ...data };
};

// -------------------------
// Actualizar un movimiento existente
// -------------------------
export const updateMovimiento = async (id, data) => {
  // Referencia al documento
  const ref = doc(db, "movimientos", id);

  // Actualizamos los campos del documento
  await updateDoc(ref, data);

  // Recuperamos nuevamente el documento actualizado
  const snap = await getDoc(ref);

  // Retornamos el objeto actualizado con su ID
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar un movimiento por ID
// -------------------------
export const deleteMovimiento = async (id) => {
  // Referencia al documento
  const ref = doc(db, "movimientos", id);

  // Obtenemos el documento para verificar si existe
  const snap = await getDoc(ref);
  if (!snap.exists()) return { deleted: false, message: "Movimiento no encontrado." };

  // Si existe, eliminamos el documento
  await deleteDoc(ref);

  // Retornamos confirmación de eliminación y datos del movimiento eliminado
  return { deleted: true, data: { id: snap.id, ...snap.data() } };
};

// -------------------------
// Buscar movimientos por término parcial
// -------------------------
export const searchMovimientos = async (term) => {
  // Traemos todos los documentos de la colección
  const snap = await getDocs(col);

  // Convertimos cada doc en objeto con su ID
  const movimientos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Normalizamos el término de búsqueda (minusculas + trim)
  const lowerTerm = term.toLowerCase().trim();

  // Filtramos por coincidencias parciales en campos "vallaCodigo" o "empleadoLegajo"
  return movimientos.filter(m =>
    (typeof m.vallaCodigo === "string" && m.vallaCodigo.toLowerCase().includes(lowerTerm)) ||
    (typeof m.empleadoLegajo === "string" && m.empleadoLegajo.toLowerCase().includes(lowerTerm))
  );
};
