// src/models/usuarios.model.js
import { db } from "../config/data.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const usuariosCollection = collection(db, "usuarios");

export const getAllUsuarios = async () => {
  const snap = await getDocs(usuariosCollection);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getUsuarioById = async (id) => {
  const ref = doc(usuariosCollection, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getUsuarioByEmail = async (email) => {
  const q = query(usuariosCollection, where("email", "==", email));
  const snap = await getDocs(q);
  const found = snap.docs[0];
  return found ? { id: found.id, ...found.data() } : null;
};

export const createUsuario = async (data) => {
  const docRef = await addDoc(usuariosCollection, data);
  return { id: docRef.id, ...data };
};

export const updateUsuario = async (id, data) => {
  const ref = doc(usuariosCollection, id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const deleteUsuario = async (id) => {
  const ref = doc(usuariosCollection, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return { deleted: true, data: snap.data() };
};

// -----------------------------------------------------
// 🔹 NUEVA FUNCION: searchUsuarios (por email o username)
// -----------------------------------------------------
export const searchUsuarios = async (queryStr) => {
  try {
    const snap = await getDocs(usuariosCollection);
    const usuarios = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const filtered = usuarios.filter(u => {
      const emailMatch = u.email?.toLowerCase().includes(queryStr.toLowerCase());
      const usernameMatch = u.username?.toLowerCase().includes(queryStr.toLowerCase());
      return emailMatch || usernameMatch;
    });

    return filtered;
  } catch (error) {
    console.error("usuarios.model.searchUsuarios error:", error);
    return [];
  }
};
