// migrateUsuariosHash.js
// Script para migrar contraseñas de usuarios existentes a hash
// Ejecutar con: node migrateUsuariosHash.js

import dotenv from "dotenv";
dotenv.config();

import * as usuariosService from "../src/services/usuarios.service.js";
import bcrypt from "bcryptjs";

const run = async () => {
  try {
    console.log("🔹 Iniciando migración de contraseñas...");

    // Traer todos los usuarios
    const usuarios = await usuariosService.listAllUsuarios();

    for (const user of usuarios) {
      const { id, password } = user;

      // Si la contraseña ya parece hasheada (ej: empieza con $2a$ o $2b$)
      if (!password.startsWith("$2a$") && !password.startsWith("$2b$")) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await usuariosService.updateUsuario(id, { password: hashedPassword });
        console.log(`✅ Contraseña migrada para usuario: ${user.username}`);
      } else {
        console.log(`ℹ️  Usuario ${user.username} ya tiene contraseña hasheada`);
      }
    }

    console.log("🔹 Migración completada!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en la migración:", err);
    process.exit(1);
  }
};

run();
