// ---------------------------------------------------------------
// Script para poblar Firestore con datos de ejemplo (seed) con hash
// ---------------------------------------------------------------

// Importamos la configuración de Firestore
import { db } from "./src/config/data.js"; 
// Funciones de Firestore para crear documentos
import { collection, addDoc, Timestamp } from "firebase/firestore";
// Librería para encriptar contraseñas
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // Número de rondas de hash para bcrypt (seguridad y velocidad)

// ---------------------------------------------------------------
// Datos de ejemplo para poblar las colecciones
// ---------------------------------------------------------------

// Usuarios de ejemplo con contraseña en texto plano
const usuarios = [
  { username: "admin", email: "admin@admin.com", password: "123456", rol: "admin" },
  { username: "jlopez", email: "jlopez@empresa.com", password: "123456", rol: "user" },
  { username: "mgarcia", email: "mgarcia@empresa.com", password: "123456", rol: "user" },
  { username: "sfernandez", email: "sfernandez@empresa.com", password: "123456", rol: "user" },
  { username: "pquiroz", email: "pquiroz@empresa.com", password: "123456", rol: "user" },
];

// Empleados de ejemplo
const empleados = [
  { nombre: "Juan", apellido: "Pérez", dni: "12345678", legajo: "EMP001" },
  { nombre: "María", apellido: "Gómez", dni: "23456789", legajo: "EMP002" },
  { nombre: "Luis", apellido: "Fernández", dni: "34567890", legajo: "EMP003" },
  { nombre: "Ana", apellido: "Rodríguez", dni: "45678901", legajo: "EMP004" },
  { nombre: "Pedro", apellido: "Sánchez", dni: "56789012", legajo: "EMP005" },
];

// Camiones de ejemplo
const camiones = [
  { patente: "ABC123", modelo: "Volvo FH", capacidad: 1000 },
  { patente: "DEF456", modelo: "Mercedes Actros", capacidad: 1200 },
  { patente: "GHI789", modelo: "Scania R500", capacidad: 1100 },
  { patente: "JKL012", modelo: "Volvo FMX", capacidad: 900 },
  { patente: "MNO345", modelo: "MAN TGX", capacidad: 950 },
];

// Vallas de ejemplo
const vallas = [
  { codigo: "EstadioRiver-Puerta1", cantidad: 20, estado: "disponible" },
  { codigo: "EstadioRiver-Puerta2", cantidad: 15, estado: "instalada" },
  { codigo: "EstadioBoca-Puerta1", cantidad: 30, estado: "disponible" },
  { codigo: "EstadioBoca-Puerta2", cantidad: 25, estado: "transito" },
  { codigo: "EstadioIndependiente-Puerta1", cantidad: 10, estado: "disponible" },
];

// Operativos de ejemplo
const operativos = [
  { nombre: "Operativo River vs Boca", fecha: "2025-11-20", lugar: "Estadio River" },
  { nombre: "Operativo Boca vs Independiente", fecha: "2025-11-22", lugar: "Estadio Boca" },
  { nombre: "Operativo Racing vs River", fecha: "2025-11-25", lugar: "Estadio Racing" },
  { nombre: "Operativo Independiente vs Boca", fecha: "2025-11-28", lugar: "Estadio Independiente" },
  { nombre: "Operativo San Lorenzo vs River", fecha: "2025-12-01", lugar: "Estadio San Lorenzo" },
];

// Movimientos de vallas
const movimientos = [
  { vallaCodigo: "EstadioRiver-Puerta1", empleadoLegajo: "EMP001", camiónPatente: "ABC123", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioBoca-Puerta2", empleadoLegajo: "EMP002", camiónPatente: "DEF456", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioRiver-Puerta2", empleadoLegajo: "EMP003", camiónPatente: "GHI789", cantidad: 5, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioIndependiente-Puerta1", empleadoLegajo: "EMP004", camiónPatente: "JKL012", cantidad: 10, estadoOrigen: "disponible", estadoDestino: "transito", fecha: Timestamp.now() },
  { vallaCodigo: "EstadioBoca-Puerta1", empleadoLegajo: "EMP005", camiónPatente: "MNO345", cantidad: 15, estadoOrigen: "disponible", estadoDestino: "instalada", fecha: Timestamp.now() },
];

// ---------------------------------------------------------------
// Función helper para poblar cualquier colección
// ---------------------------------------------------------------
const seedCollection = async (name, data, hashPasswords = false) => {
  const colRef = collection(db, name); // Referencia a la colección en Firestore

  for (let item of data) {
    // Si es usuarios y queremos hashear passwords
    if (hashPasswords && item.password) {
      // 🔹 Aquí es donde bcrypt genera el hash seguro de la contraseña
      item.password = await bcrypt.hash(item.password, SALT_ROUNDS);
    }

    item.createdAt = Timestamp.now(); // Siempre agregamos la fecha de creación

    await addDoc(colRef, item); // Guardamos el documento en Firestore
    console.log(`Documento agregado en ${name}:`, item); // Mensaje de log
  }
};

// ---------------------------------------------------------------
// Ejecutar seed en todas las colecciones
// ---------------------------------------------------------------
const runSeed = async () => {
  console.log("Iniciando carga de datos de ejemplo...");

  // Usuarios se guardan con contraseñas hasheadas
  await seedCollection("usuarios", usuarios, true); // hashPasswords = true
  // El resto de colecciones no necesita hash
  await seedCollection("empleados", empleados);
  await seedCollection("camiones", camiones);
  await seedCollection("vallas", vallas);
  await seedCollection("operativos", operativos);
  await seedCollection("movimientos", movimientos);

  console.log("Carga completada ✅");
};

// Ejecutar el seed y capturar errores
runSeed().catch(console.error);
