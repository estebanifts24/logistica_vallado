import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const col = collection(db, "vallas");

// -------------------------
// HELPERS
// -------------------------
const normalize = (data) => ({
  codigo: data.codigo?.trim().toUpperCase(),
  descripcion: data.descripcion?.trim(),
  tipo: data.tipo?.trim()
});

// -------------------------
// Obtener todas
// -------------------------
export const getAllVallas = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// -------------------------
// Obtener por ID
// -------------------------
export const getVallaById = async (id) => {
  const snap = await getDoc(doc(db, "vallas", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// -------------------------
// Crear
// -------------------------
export const createValla = async (data) => {
  const clean = normalize(data);

  if (!clean.codigo) {
    throw new Error("Código requerido");
  }

  // 🔥 validar duplicado
  const all = await getDocs(col);
  const exists = all.docs.some(
    d => d.data().codigo === clean.codigo
  );

  if (exists) {
    throw new Error("Ya existe una valla con ese código");
  }

  const docRef = await addDoc(col, clean);
  return { id: docRef.id, ...clean };
};

// -------------------------
// Actualizar
// -------------------------
export const updateValla = async (id, data) => {
  const clean = normalize(data);

  if (!clean.codigo) {
    throw new Error("Código requerido");
  }

  const ref = doc(db, "vallas", id);

  // 🔥 validar duplicado (excepto mismo doc)
  const all = await getDocs(col);
  const exists = all.docs.some(
    d => d.id !== id && d.data().codigo === clean.codigo
  );

  if (exists) {
    throw new Error("Código duplicado");
  }

  await updateDoc(ref, clean);

  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

// -------------------------
// Eliminar
// -------------------------
export const deleteValla = async (id) => {
  const ref = doc(db, "vallas", id);

  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { deleted: false };
  }

  await deleteDoc(ref);
  return { deleted: true };
};

// -------------------------
// Buscar
// -------------------------
export const searchVallas = async (codigo) => {
  const snap = await getDocs(col);

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d =>
      d.codigo?.toLowerCase().includes(codigo.toLowerCase())
    );
};