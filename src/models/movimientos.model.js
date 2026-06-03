/* ===============================================================
   1. MOVIMIENTOS MODEL (ACCESO A FIRESTORE)
   =============================================================== */

/*
   1.1 Responsabilidad general:
   - Acceso directo a Firestore
   - CRUD de movimientos
   - Normalización de datos
   - Sin lógica de negocio
*/

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

/* ===============================================================
   2. CONFIGURACIÓN GENERAL
   =============================================================== */

/*
   2.1 Referencia colección movimientos
*/

const col = collection(db, "movimientos");

/* ===============================================================
   3. HELPERS INTERNOS
   =============================================================== */

/*
   3.1 Normalización de movimientos
   - Unifica nombres de campos para valla
   - Evita inconsistencias entre módulos
*/

const normalizeMovimiento = (data) => {
  return {
    ...data,
    vallaCodigo:
      data.vallaCodigo ||
      data.tipoVallaCodigo ||
      data.codigoValla ||
      null
  };
};

/* ===============================================================
   4. OBTENER TODOS LOS MOVIMIENTOS
   =============================================================== */

/*
   4.1 Leer colección completa
*/

export const getAllMovimientos = async () => {
  const snap = await getDocs(col);

  return snap.docs.map(d => ({
    id: d.id,
    ...normalizeMovimiento(d.data())
  }));
};

/* ===============================================================
   5. OBTENER MOVIMIENTO POR ID
   =============================================================== */

/*
   5.1 Buscar movimiento específico
*/

export const getMovimientoById = async (id) => {
  const ref = doc(db, "movimientos", id);
  const snap = await getDoc(ref);

  return snap.exists()
    ? {
        id: snap.id,
        ...normalizeMovimiento(snap.data())
      }
    : null;
};

/* ===============================================================
   6. CREAR MOVIMIENTO
   =============================================================== */

/*
   6.1 Crear nuevo movimiento
   - Normaliza datos
   - Genera fecha automática
   - Guarda en Firestore
*/

export const createMovimiento = async (data) => {
  const normalized = normalizeMovimiento({
    ...data,
    fecha: new Date().toISOString()
  });

  const docRef = await addDoc(col, normalized);

  return {
    id: docRef.id,
    ...normalized
  };
};
/* ===============================================================
   7. ACTUALIZAR MOVIMIENTO
   =============================================================== */

/*
   7.1 Actualizar movimiento existente
   - Normaliza datos
   - Actualiza documento
   - Retorna estado final
*/

export const updateMovimiento = async (id, data) => {
  const ref = doc(db, "movimientos", id);

  const normalized = normalizeMovimiento(data);

  await updateDoc(ref, normalized);

  const snap = await getDoc(ref);

  return {
    id: snap.id,
    ...normalizeMovimiento(snap.data())
  };
};

/* ===============================================================
   8. ELIMINAR MOVIMIENTO
   =============================================================== */

/*
   8.1 Eliminar movimiento por ID
   - Verifica existencia
   - Elimina documento
   - Retorna resultado
*/

export const deleteMovimiento = async (id) => {
  const ref = doc(db, "movimientos", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      deleted: false,
      message: "Movimiento no encontrado."
    };
  }

  await deleteDoc(ref);

  return {
    deleted: true,
    data: {
      id: snap.id,
      ...normalizeMovimiento(snap.data())
    }
  };
};

/* ===============================================================
   9. BUSCAR MOVIMIENTOS
   =============================================================== */

/*
   9.1 Buscar por código de valla o legajo
*/

export const searchMovimientos = async (term) => {
  const snap = await getDocs(col);

  const movimientos = snap.docs.map(d => ({
    id: d.id,
    ...normalizeMovimiento(d.data())
  }));

  const lowerTerm = term.toLowerCase().trim();

  return movimientos.filter(m =>
    (m.vallaCodigo &&
      m.vallaCodigo.toLowerCase().includes(lowerTerm)) ||
    (m.empleadoLegajo &&
      m.empleadoLegajo.toLowerCase().includes(lowerTerm))
  );
};