// -------------------------------------------------------
// Script CLI para resetear la contraseña del ADMIN
// Funciona directamente usando tus servicios de backend
// 🔹 No requiere token JWT
// 🔹 Node v22 compatible
// -------------------------------------------------------

import readline from "readline";
import * as usuariosService from "../src/services/usuarios.service.js";

// Configuración readline para entrada por terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función helper para pedir input en CLI
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// Función principal
const run = async () => {
  try {
    console.log("🔐 RESET DE CONTRASEÑA DEL ADMIN");

    // Pedimos la nueva contraseña
    const newPass = await ask("👉 Nueva contraseña para admin: ");
    rl.close();

    if (!newPass.trim()) {
      console.log("❌ Contraseña inválida. No puede estar vacía.");
      return;
    }

    console.log("⏳ Buscando usuario admin...");

    // Buscamos admin por email
    const adminUser = await usuariosService.getUsuarioByEmailService("admin@admin.com");

    if (!adminUser) {
      console.log("⚠️ Usuario admin@admin.com NO EXISTE. Creando uno nuevo...");
      // Si no existe, lo creamos con la nueva contraseña
      const nuevoAdmin = await usuariosService.createUsuario({
        email: "admin@admin.com",
        username: "admin",
        password: newPass,
        rol: "admin",
      });
      console.log("✅ Usuario admin creado correctamente:", nuevoAdmin.id);
      console.log("👉 Contraseña en texto plano:", newPass);
      return;
    }

    console.log(`✔ Admin encontrado (ID: ${adminUser.id})`);
    console.log("⏳ Actualizando contraseña...");

    // Actualizamos la contraseña usando el service (bcrypt incluido)
    const result = await usuariosService.updatePasswordAdminService(adminUser.id, newPass);

    console.log("✅ CONTRASEÑA ACTUALIZADA CORRECTAMENTE!");
    console.log("👉 Nueva contraseña (texto plano):", newPass);
    console.log("👉 Guardada en Firestore hasheada automáticamente.");

  } catch (err) {
    console.error("❌ ERROR inesperado:", err);
  }
};

// Ejecutamos
run();
