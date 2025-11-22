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

const col = collection(db, "movimientos");

// Obtener todos
export const getAllMovimientos = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Obtener uno por ID
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
  return { deleted: true, data: { id: snap.id, ...snap.data() } };
};

// Buscar por término parcial
export const searchMovimientos = async (term) => {
  const snap = await getDocs(col);
  const movimientos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const lowerTerm = term.toLowerCase().trim();
  return movimientos.filter(m =>
    (typeof m.vallaCodigo === "string" && m.vallaCodigo.toLowerCase().includes(lowerTerm)) ||
    (typeof m.empleadoLegajo === "string" && m.empleadoLegajo.toLowerCase().includes(lowerTerm))
  );
};
