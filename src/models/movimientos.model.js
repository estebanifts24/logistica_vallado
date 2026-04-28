// ---------------------------------------------------------------
// Modelo Movimientos - Firestore Web SDK (NORMALIZADO)
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

const col = collection(db, "movimientos");

// -------------------------
// NORMALIZADOR (CLAVE)
// -------------------------
const normalizeMovimiento = (data) => {
  return {
    ...data,
    vallaCodigo: data.vallaCodigo || data.tipoVallaCodigo || data.codigoValla || null,
  };
};

// -------------------------
// GET ALL
// -------------------------
export const getAllMovimientos = async () => {
  const snap = await getDocs(col);

  return snap.docs.map(d => ({
    id: d.id,
    ...normalizeMovimiento(d.data())
  }));
};

// -------------------------
// GET BY ID
// -------------------------
export const getMovimientoById = async (id) => {
  const ref = doc(db, "movimientos", id);
  const snap = await getDoc(ref);

  return snap.exists()
    ? { id: snap.id, ...normalizeMovimiento(snap.data()) }
    : null;
};

// -------------------------
// CREATE
// -------------------------
export const createMovimiento = async (data) => {
  const normalized = normalizeMovimiento(data);

  const docRef = await addDoc(col, normalized);

  return { id: docRef.id, ...normalized };
};

// -------------------------
// UPDATE
// -------------------------
export const updateMovimiento = async (id, data) => {
  const ref = doc(db, "movimientos", id);

  const normalized = normalizeMovimiento(data);

  await updateDoc(ref, normalized);

  const snap = await getDoc(ref);

  return { id: snap.id, ...normalizeMovimiento(snap.data()) };
};

// -------------------------
// DELETE
// -------------------------
export const deleteMovimiento = async (id) => {
  const ref = doc(db, "movimientos", id);

  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { deleted: false, message: "Movimiento no encontrado." };
  }

  await deleteDoc(ref);

  return {
    deleted: true,
    data: { id: snap.id, ...normalizeMovimiento(snap.data()) }
  };
};

// -------------------------
// SEARCH
// -------------------------
export const searchMovimientos = async (term) => {
  const snap = await getDocs(col);

  const movimientos = snap.docs.map(d => ({
    id: d.id,
    ...normalizeMovimiento(d.data())
  }));

  const lowerTerm = term.toLowerCase().trim();

  return movimientos.filter(m =>
    (m.vallaCodigo && m.vallaCodigo.toLowerCase().includes(lowerTerm)) ||
    (m.empleadoLegajo && m.empleadoLegajo.toLowerCase().includes(lowerTerm))
  );
};