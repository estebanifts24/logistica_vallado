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

// ------------------------------------------------------------
// ⭐ Mapper seguro → evita errores con Timestamp / strings
// ------------------------------------------------------------
const mapUsuario = (id, data) => {
  return {
    id,
    ...data,

    // createdAt seguro
    createdAt: data.createdAt?.toDate
      ? data.createdAt.toDate()
      : data.createdAt || null,

    // updatedAt seguro
    updatedAt: data.updatedAt?.toDate
      ? data.updatedAt.toDate()
      : data.updatedAt || null,
  };
};

// ------------------------------------------------------------
// 🔹 Obtener todos los usuarios
// ------------------------------------------------------------
export const getAllUsuarios = async () => {
  const snap = await getDocs(usuariosCollection);
  return snap.docs.map((d) => mapUsuario(d.id, d.data()));
};

// ------------------------------------------------------------
// 🔹 Obtener usuario por ID
// ------------------------------------------------------------
export const getUsuarioById = async (id) => {
  const ref = doc(usuariosCollection, id);
  const snap = await getDoc(ref);
  return snap.exists() ? mapUsuario(snap.id, snap.data()) : null;
};

// ------------------------------------------------------------
// 🔹 Obtener usuario por email
// ------------------------------------------------------------
export const getUsuarioByEmail = async (email) => {
  const q = query(usuariosCollection, where("email", "==", email));
  const snap = await getDocs(q);
  const found = snap.docs[0];
  return found ? mapUsuario(found.id, found.data()) : null;
};

// ------------------------------------------------------------
// 🔹 Crear usuario
// ------------------------------------------------------------
export const createUsuario = async (data) => {
  const docRef = await addDoc(usuariosCollection, {
    ...data,
    createdAt: new Date(),
  });
  return mapUsuario(docRef.id, { ...data, createdAt: new Date() });
};

// ------------------------------------------------------------
// 🔹 Actualizar usuario
// ------------------------------------------------------------
export const updateUsuario = async (id, data) => {
  const ref = doc(usuariosCollection, id);

  await updateDoc(ref, {
    ...data,
    //updatedAt: new Date(),
  });

  const snap = await getDoc(ref);
  return snap.exists() ? mapUsuario(snap.id, snap.data()) : null;
};

// ------------------------------------------------------------
// 🔹 Borrar usuario
// ------------------------------------------------------------
export const deleteUsuario = async (id) => {
  const ref = doc(usuariosCollection, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  await deleteDoc(ref);

  return { deleted: true, data: mapUsuario(snap.id, snap.data()) };
};

// ------------------------------------------------------------
// 🔹 Buscar usuarios por email o username
// ------------------------------------------------------------
export const searchUsuarios = async (queryStr) => {
  try {
    const snap = await getDocs(usuariosCollection);
    const usuarios = snap.docs.map((d) => mapUsuario(d.id, d.data()));

    const filtered = usuarios.filter((u) => {
      const term = queryStr.toLowerCase();
      return (
        u.email?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term)
      );
    });

    return filtered;
  } catch (error) {
    console.error("usuarios.model.searchUsuarios error:", error);
    return [];
  }
};

// ------------------------------------------------------------
// 🔹 Actualizar contraseña
// ------------------------------------------------------------
export const updateUsuarioPassword = async (id, password) => {
  const ref = doc(usuariosCollection, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  await updateDoc(ref, {
    password,
    updatedAt: new Date(),
  });

  return { id, message: "Password updated" };
};
