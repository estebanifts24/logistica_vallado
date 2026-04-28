import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";

// colección stock
const col = collection(db, "stock");

// ---------------------------------------------------------------
// OBTENER TODO EL STOCK
// ---------------------------------------------------------------
export const getAllStock = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ---------------------------------------------------------------
// OBTENER STOCK POR ID (codigoUbicacion_codigoValla)
// ---------------------------------------------------------------
export const getStockById = async (id) => {
  if (!id) throw new Error("ID requerido");

  const ref = doc(db, "stock", id);
  const snap = await getDoc(ref);

  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ---------------------------------------------------------------
// CREAR O REEMPLAZAR STOCK (UPSERT)
// IMPORTANTE: el ID se genera en SERVICE
// ---------------------------------------------------------------
export const setStock = async (id, data) => {
  if (!id) throw new Error("ID requerido");

  await setDoc(doc(db, "stock", id), data);

  return {
    id,
    ...data
  };
};

// ---------------------------------------------------------------
// ACTUALIZAR STOCK PARCIALMENTE
// ---------------------------------------------------------------
export const updateStock = async (id, data) => {
  if (!id) throw new Error("ID requerido");

  const ref = doc(db, "stock", id);

  await updateDoc(ref, data);

  const snap = await getDoc(ref);

  return snap.exists()
    ? { id: snap.id, ...snap.data() }
    : null;
};