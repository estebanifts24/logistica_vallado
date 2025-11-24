// ---------------------------------------------------------------
// Script para migrar contraseñas existentes a hash seguro
// Ejecutar con: node migrateUsuariosHash.js
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1️⃣ Cargar variables de entorno
// ---------------------------------------------------------------
import dotenv from "dotenv";
dotenv.config(); 
// Carga variables de entorno desde .env, necesarias para conectarse a Firestore.

// ---------------------------------------------------------------
// 2️⃣ Importar servicios y librerías
// ---------------------------------------------------------------
import * as usuariosService from "./src/services/usuarios.service.js";
// Servicio de usuarios que centraliza la lógica de creación/actualización de usuarios
import bcrypt from "bcryptjs"; 
// Librería para generar hashes seguros de contraseñas

// ---------------------------------------------------------------
// 3️⃣ Función principal que ejecuta la migración
// ---------------------------------------------------------------
const run = async () => {
  try {
    console.log("🔹 Iniciando migración de contraseñas...");

    // ---------------------------------------------------------------
    // 3a️⃣ Obtener todos los usuarios existentes
    // ---------------------------------------------------------------
    const usuarios = await usuariosService.listAllUsuarios();
    // Devuelve un array de usuarios con todos los campos, incluyendo password

    // ---------------------------------------------------------------
    // 3b️⃣ Iterar sobre cada usuario
    // ---------------------------------------------------------------
    for (const user of usuarios) {
      const { id, password } = user;

      // ---------------------------------------------------------------
      // 3c️⃣ Verificar si la contraseña ya está hasheada
      // bcrypt produce hashes que comienzan con "$2a$" o "$2b$"
      // ---------------------------------------------------------------
      if (!password.startsWith("$2a$") && !password.startsWith("$2b$")) {
        // Si no está hasheada, la migramos
        const hashedPassword = await bcrypt.hash(password, 10);
        // 10 es el número de salt rounds, suficiente para seguridad y rapidez

        // Guardamos la contraseña hasheada usando el servicio
        await usuariosService.updateUsuario(id, { password: hashedPassword });

        console.log(`✅ Contraseña migrada para usuario: ${user.username}`);
      } else {
        // Ya estaba hasheada
        console.log(`ℹ️  Usuario ${user.username} ya tiene contraseña hasheada`);
      }
    }

    // ---------------------------------------------------------------
    // 3d️⃣ Finalización del proceso
    // ---------------------------------------------------------------
    console.log("🔹 Migración completada!");
    process.exit(0); // Salida exitosa
  } catch (err) {
    // ---------------------------------------------------------------
    // 3e️⃣ Manejo de errores
    // ---------------------------------------------------------------
    console.error("❌ Error en la migración:", err);
    process.exit(1); // Salida con error
  }
};

// ---------------------------------------------------------------
// 4️⃣ Ejecutar la función principal
// ---------------------------------------------------------------
run();
// Llama a la función asíncrona que migra todas las contraseñas
