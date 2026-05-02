import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where
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
// 🔥 NUEVO: BUSCAR STOCK POR UBICACION + VALLA (CLAVE REAL)
// ---------------------------------------------------------------
export const getStockByUbicacionAndValla = async (ubicacion, valla) => {
  const q = query(
    col,
    where("codigoUbicacion", "==", ubicacion),
    where("codigoValla", "==", valla)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docData = snap.docs[0];
  return { id: docData.id, ...docData.data() };
};

// ---------------------------------------------------------------
// 🔥 CREAR STOCK (usa ID automático)
// ---------------------------------------------------------------
export const createStock = async (data) => {
  const docRef = await addDoc(col, data);

  return {
    id: docRef.id,
    ...data
  };
};

// ---------------------------------------------------------------
// ACTUALIZAR STOCK
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