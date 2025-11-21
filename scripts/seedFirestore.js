// seedFirestore.js
// Script para poblar Firestore con datos de ejemplo (seed)
// Borra colecciones antes de insertar y hashea contraseñas de usuarios

import { db } from "../src/config/data.js"; // tu config de Firestore
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from "firebase/firestore";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------
// Datos de ejemplo
// ---------------------------------------------------------------

// Usuarios (contraseñas visibles para logueo, se hashéan antes de guardar)
const usuarios = [
  { username: "admin", email: "admin@admin.com", password: "123456", rol: "admin" },
  { username: "jlopez", email: "jlopez@empresa.com", password: "123456", rol: "user" },
  { username: "mgarcia", email: "mgarcia@empresa.com", password: "123456", rol: "user" },
  { username: "sfernandez", email: "sfernandez@empresa.com", password: "123456", rol: "user" },
  { username: "pquiroz", email: "pquiroz@empresa.com", password: "123456", rol: "user" },
];

// Empleados
const empleados = [
  { nombre: "Juan", apellido: "Pérez", dni: "12345678", legajo: "EMP001" },
  { nombre: "María", apellido: "Gómez", dni: "23456789", legajo: "EMP002" },
  { nombre: "Luis", apellido: "Fernández", dni: "34567890", legajo: "EMP003" },
  { nombre: "Ana", apellido: "Rodríguez", dni: "45678901", legajo: "EMP004" },
  { nombre: "Pedro", apellido: "Sánchez", dni: "56789012", legajo: "EMP005" },
];

// Camiones
const camiones = [
  { patente: "ABC123", modelo: "Volvo FH", capacidad: 1000 },
  { patente: "DEF456", modelo: "Mercedes Actros", capacidad: 1200 },
  { patente: "GHI789", modelo: "Scania R500", capacidad: 1100 },
  { patente: "JKL012", modelo: "Volvo FMX", capacidad: 900 },
  { patente: "MNO345", modelo: "MAN TGX", capacidad: 950 },
];

// Vallas
const vallas = [
  { codigo: "EstadioRiver-Puerta1", cantidad: 20, estado: "disponible" },
  { codigo: "EstadioRiver-Puerta2", cantidad: 15, estado: "instalada" },
  { codigo: "EstadioBoca-Puerta1", cantidad: 30, estado: "disponible" },
  { codigo: "EstadioBoca-Puerta2", cantidad: 25, estado: "transito" },
  { codigo: "EstadioIndependiente-Puerta1", cantidad: 10, estado: "disponible" },
];

// Operativos (solo fecha como string)
const operativos = [
  { nombre: "Operativo River vs Boca", fecha: "2025-11-20", lugar: "Estadio River" },
  { nombre: "Operativo Boca vs Independiente", fecha: "2025-11-22", lugar: "Estadio Boca" },
  { nombre: "Operativo Racing vs River", fecha: "2025-11-25", lugar: "Estadio Racing" },
  { nombre: "Operativo Independiente vs Boca", fecha: "2025-11-28", lugar: "Estadio Independiente" },
  { nombre: "Operativo San Lorenzo vs River", fecha: "2025-12-01", lugar: "Estadio San Lorenzo" },
];

// Movimientos
const movimientos = [
  { vallaCodigo: "EstadioRiver-Puerta1", empleadoLegajo: "EMP001", camionPatente: "ABC123", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: "2025-11-20T12:00:00" },
  { vallaCodigo: "EstadioBoca-Puerta2", empleadoLegajo: "EMP002", camionPatente: "DEF456", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: "2025-11-20T12:00:00" },
  { vallaCodigo: "EstadioRiver-Puerta2", empleadoLegajo: "EMP003", camionPatente: "GHI789", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: "2025-11-20T12:00:00" },
  { vallaCodigo: "EstadioIndependiente-Puerta1", empleadoLegajo: "EMP004", camionPatente: "JKL012", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: "2025-11-20T12:00:00" },
  { vallaCodigo: "EstadioBoca-Puerta1", empleadoLegajo: "EMP005", camionPatente: "MNO345", cantidad: 15, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: "2025-11-20T12:00:00" },
];

// ---------------------------------------------------------------
// Funciones de utilidad
// ---------------------------------------------------------------

// Borra todos los documentos de una colección
const clearCollection = async (name) => {
  const colRef = collection(db, name);
  const snapshot = await getDocs(colRef);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, name, docSnap.id));
  }
  console.log(`🗑️  Colección '${name}' vaciada`);
};

// Inserta datos en una colección (usuarios se hashéan)
const seedCollection = async (name, data) => {
  const colRef = collection(db, name);
  for (const item of data) {
    const docData = { ...item, createdAt: Timestamp.now() };
    if (name === "usuarios") {
      const hashed = await bcrypt.hash(item.password, 10);
      docData.password = hashed;
    }
    await addDoc(colRef, docData);
    console.log(`✅ Documento agregado en '${name}':`, name === "usuarios" ? { ...item, password: item.password } : docData);
  }
};

// ---------------------------------------------------------------
// Ejecutar seed
// ---------------------------------------------------------------
const runSeed = async () => {
  console.log("🚀 Iniciando carga de datos de ejemplo...");

  await clearCollection("usuarios");
  await seedCollection("usuarios", usuarios);

  await clearCollection("empleados");
  await seedCollection("empleados", empleados);

  await clearCollection("camiones");
  await seedCollection("camiones", camiones);

  await clearCollection("vallas");
  await seedCollection("vallas", vallas);

  await clearCollection("operativos");
  await seedCollection("operativos", operativos);

  await clearCollection("movimientos");
  await seedCollection("movimientos", movimientos);

  console.log("🎉 Carga completada ✅");
};

runSeed().catch(console.error);