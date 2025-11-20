// seedFirestore.js
// Script para poblar Firestore con datos de ejemplo (seed)

// ---------------------------------------------------------------
import { db } from "./src/config/data.js"; // tu config actual de Firestore
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ---------------------------------------------------------------
// Datos de ejemplo
// ---------------------------------------------------------------

// Usuarios
const usuarios = [
  { username: "admin", email: "admin@empresa.com", password: "1234", rol: "admin", createdAt: Timestamp.now() },
  { username: "jlopez", email: "jlopez@empresa.com", password: "1234", rol: "user", createdAt: Timestamp.now() },
  { username: "mgarcia", email: "mgarcia@empresa.com", password: "1234", rol: "user", createdAt: Timestamp.now() },
  { username: "sfernandez", email: "sfernandez@empresa.com", password: "1234", rol: "user", createdAt: Timestamp.now() },
  { username: "pquiroz", email: "pquiroz@empresa.com", password: "1234", rol: "user", createdAt: Timestamp.now() },
];

// Empleados
const empleados = [
  { nombre: "Juan", apellido: "Pérez", dni: "12345678", legajo: "EMP001", createdAt: Timestamp.now() },
  { nombre: "María", apellido: "Gómez", dni: "23456789", legajo: "EMP002",  createdAt: Timestamp.now() },
  { nombre: "Luis", apellido: "Fernández", dni: "34567890", legajo: "EMP003", createdAt: Timestamp.now() },
  { nombre: "Ana", apellido: "Rodríguez", dni: "45678901", legajo: "EMP004", createdAt: Timestamp.now() },
  { nombre: "Pedro", apellido: "Sánchez", dni: "56789012", legajo: "EMP005", createdAt: Timestamp.now() },
];

// Camiones
const camiones = [
  { patente: "ABC123", modelo: "Volvo FH", capacidad: 1000, createdAt: Timestamp.now() },
  { patente: "DEF456", modelo: "Mercedes Actros", capacidad: 1200, createdAt: Timestamp.now() },
  { patente: "GHI789", modelo: "Scania R500", capacidad: 1100, createdAt: Timestamp.now() },
  { patente: "JKL012", modelo: "Volvo FMX", capacidad: 900, createdAt: Timestamp.now() },
  { patente: "MNO345", modelo: "MAN TGX", capacidad: 950, createdAt: Timestamp.now() },
];

// Vallas
const vallas = [
  { codigo: "EstadioRiver-Puerta1", cantidad: 20, estado: "disponible", createdAt: Timestamp.now() },
  { codigo: "EstadioRiver-Puerta2", cantidad: 15, estado: "instalada", createdAt: Timestamp.now() },
  { codigo: "EstadioBoca-Puerta1", cantidad: 30, estado: "disponible", createdAt: Timestamp.now() },
  { codigo: "EstadioBoca-Puerta2", cantidad: 25, estado: "transito", createdAt: Timestamp.now() },
  { codigo: "EstadioIndependiente-Puerta1", cantidad: 10, estado: "disponible", createdAt: Timestamp.now() },
];

// Operativos
const operativos = [
  { nombre: "Operativo River vs Boca", fecha: "2025-11-20", lugar: "Estadio River", createdAt: Timestamp.now() },
  { nombre: "Operativo Boca vs Independiente", fecha: "2025-11-22", lugar: "Estadio Boca", createdAt: Timestamp.now() },
  { nombre: "Operativo Racing vs River", fecha: "2025-11-25", lugar: "Estadio Racing", createdAt: Timestamp.now() },
  { nombre: "Operativo Independiente vs Boca", fecha: "2025-11-28", lugar: "Estadio Independiente", createdAt: Timestamp.now() },
  { nombre: "Operativo San Lorenzo vs River", fecha: "2025-12-01", lugar: "Estadio San Lorenzo", createdAt: Timestamp.now() },
];

// Movimientos
const movimientos = [
  { vallaCodigo: "EstadioRiver-Puerta1", empleadoLegajo: "EMP001", camiónPatente: "ABC123", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioBoca-Puerta2", empleadoLegajo: "EMP002", camiónPatente: "DEF456", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioRiver-Puerta2", empleadoLegajo: "EMP003", camiónPatente: "GHI789", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioIndependiente-Puerta1", empleadoLegajo: "EMP004", camiónPatente: "JKL012", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioBoca-Puerta1", empleadoLegajo: "EMP005", camiónPatente: "MNO345", cantidad: 15, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
];

// ---------------------------------------------------------------
// Función para poblar cada colección
// ---------------------------------------------------------------
const seedCollection = async (name, data) => {
  const colRef = collection(db, name);
  for (const item of data) {
    await addDoc(colRef, item);
    console.log(`Documento agregado en ${name}:`, item);
  }
};

// ---------------------------------------------------------------
// Ejecutar seed
// ---------------------------------------------------------------
const runSeed = async () => {
  console.log("Iniciando carga de datos de ejemplo...");
  await seedCollection("usuarios", usuarios);
  await seedCollection("empleados", empleados);
  await seedCollection("camiones", camiones);
  await seedCollection("vallas", vallas);
  await seedCollection("operativos", operativos);
  await seedCollection("movimientos", movimientos);
  console.log("Carga completada ✅");
};

// Ejecutar
runSeed().catch(console.error);
