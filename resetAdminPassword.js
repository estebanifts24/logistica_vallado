import readline from "readline";
import * as usuariosService from "./src/services/usuarios.service.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const run = async () => {
  try {
    console.log("🔐 RESET O CREACIÓN DE ADMIN");

    let email = "";
    while (!email) {
      email = (await ask("Email del admin: ")).trim();
      if (!email) console.log("❌ El email no puede estar vacío.");
    }

    let password = "";
    while (!password) {
      password = (await ask("Contraseña para admin: ")).trim();
      if (!password) console.log("❌ La contraseña no puede estar vacía.");
    }

    let username = "";
    while (!username) {
      username = (await ask("Nombre de usuario para admin: ")).trim();
      if (!username) console.log("❌ El nombre de usuario no puede estar vacío.");
    }

    console.log("⏳ Buscando usuario admin...");

    const adminUser = await usuariosService.getUsuarioByEmailService(email);

    if (!adminUser) {
      console.log("⚠️ Usuario no existe. Creando uno nuevo...");
      const nuevoAdmin = await usuariosService.createUsuario({
        email,
        username,
        password,
        rol: "admin",
      });
      console.log("✅ Usuario admin creado correctamente:", nuevoAdmin.id);
      rl.close();
      return;
    }

    console.log(`✔ Admin encontrado (ID: ${adminUser.id})`);
    console.log("⏳ Actualizando contraseña...");

    await usuariosService.updatePasswordAdminService(adminUser.id, password);
    console.log("✅ CONTRASEÑA ACTUALIZADA CORRECTAMENTE!");
    rl.close();

  } catch (err) {
    console.error("❌ ERROR inesperado:", err);
    rl.close();
  }
};

run();
