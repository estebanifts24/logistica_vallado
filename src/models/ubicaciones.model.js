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

const col = collection(db, "ubicaciones");

export const getAllUbicaciones = async () => {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getUbicacionById = async (id) => {
  const ref = doc(db, "ubicaciones", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createUbicacion = async (data) => {
  const docRef = await addDoc(col, data);
  return { id: docRef.id, ...data };
};

export const updateUbicacion = async (id, data) => {
  const ref = doc(db, "ubicaciones", id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

export const deleteUbicacion = async (id) => {
  const ref = doc(db, "ubicaciones", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { deleted: false };

  await deleteDoc(ref);
  return { deleted: true, data: { id: snap.id, ...snap.data() } };
};