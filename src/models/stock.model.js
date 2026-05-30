/* ===============================================================
   1. STOCK MODEL (ACCESO A FIREBASE / DATA LAYER)
   =============================================================== */

/*
   1.1 Responsabilidad general:
   - Conecta con Firestore
   - Ejecuta consultas directas a la DB
   - No contiene lógica de negocio
   - Solo CRUD + queries
*/

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

/* ===============================================================
   2. REFERENCIA A COLECCIÓN
   =============================================================== */

/*
   2.1 Colección principal:
   - stock (Firestore)
*/

const col = collection(db, "stock");

/* ===============================================================
   3. OBTENER TODO EL STOCK
   =============================================================== */

/*
   3.1 Función:
   - Lee todos los documentos de la colección stock
*/

export const getAllStock = async () => {
  const snap = await getDocs(col);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
};

/* ===============================================================
   4. OBTENER STOCK POR UBICACIÓN + VALLA (FIX ERP CONSISTENTE)
   =============================================================== */

/*
   4.1 Función:
   - Query filtrada por ubicación + valla
   - Retorna estado REAL de Firebase
   - Evita uso de snapshots viejos en lógica de stock
*/

export const getStockByUbicacionAndValla = async (ubicacion, valla) => {
  if (!ubicacion || !valla) {
    throw new Error("Ubicación y tipo de valla requeridos");
  }

  const q = query(
    col,
    where("codigoUbicacion", "==", ubicacion),
    where("codigoValla", "==", valla)
  );

  const snap = await getDocs(q);

  /* 4.2 No existe stock */
  if (snap.empty) return null;

  /* 4.3 Retornar estado real DB */
  const docData = snap.docs[0];

  return {
    id: docData.id,
    ...docData.data()
  };
};

/* ===============================================================
   5. CREAR STOCK
   =============================================================== */

/*
   5.1 Función:
   - Crea nuevo documento en Firestore
   - ID automático generado por Firebase
*/

export const createStock = async (data) => {
  const docRef = await addDoc(col, data);

  return {
    id: docRef.id,
    ...data
  };
};

/* ===============================================================
   6. ACTUALIZAR STOCK (FIX ERP CONSISTENTE)
   =============================================================== */

/*
   6.1 Función:
   - Actualiza stock existente por ID
   - Primero valida existencia real en DB
   - Evita sobrescritura con datos stale
   - Devuelve estado actualizado
*/

export const updateStock = async (id, data) => {
  if (!id) throw new Error("ID requerido");
  if (!data) throw new Error("Datos inválidos");

  /* 6.2 Referencia documento */
  const ref = doc(db, "stock", id);

  /* 6.3 Leer estado actual desde Firebase */
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Stock no existe");
  }

  const actual = snap.data();

  /* 6.4 Merge seguro (evita pérdida de datos) */
  const updatedData = {
    ...actual,
    ...data
  };

  /* 6.5 Aplicar update */
  await updateDoc(ref, updatedData);

  /* 6.6 Leer estado final actualizado */
  const newSnap = await getDoc(ref);

  return newSnap.exists()
    ? { id: newSnap.id, ...newSnap.data() }
    : null;
};