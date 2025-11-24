// ---------------------------------------------------------------
// Script interactivo para crear o resetear la contraseña de un admin
// ---------------------------------------------------------------

// 🔹 Importamos readline para interacción por consola
import readline from "readline";

// 🔹 Importamos el servicio de usuarios para interactuar con Firestore
import * as usuariosService from "./src/services/usuarios.service.js";

// 🔹 Configuramos readline para leer desde stdin y escribir en stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 🔹 Función helper que devuelve una promesa para usar await con rl.question
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// ---------------------------------------------------------------
// Función principal asincrónica
// ---------------------------------------------------------------
const run = async () => {
  try {
    console.log("🔐 RESET O CREACIÓN DE ADMIN");

    // ---------------------------------------------------------------
    // 1️⃣ Solicitar email al usuario hasta que sea válido (no vacío)
    // ---------------------------------------------------------------
    let email = "";
    while (!email) {
      email = (await ask("Email del admin: ")).trim(); // Trim para quitar espacios
      if (!email) console.log("❌ El email no puede estar vacío.");
    }

    // ---------------------------------------------------------------
    // 2️⃣ Solicitar contraseña hasta que sea válida (no vacía)
    // ---------------------------------------------------------------
    let password = "";
    while (!password) {
      password = (await ask("Contraseña para admin: ")).trim();
      if (!password) console.log("❌ La contraseña no puede estar vacía.");
    }

    // ---------------------------------------------------------------
    // 3️⃣ Solicitar nombre de usuario hasta que sea válido (no vacío)
    // ---------------------------------------------------------------
    let username = "";
    while (!username) {
      username = (await ask("Nombre de usuario para admin: ")).trim();
      if (!username) console.log("❌ El nombre de usuario no puede estar vacío.");
    }

    // ---------------------------------------------------------------
    // 4️⃣ Buscar si ya existe un usuario con ese email
    // ---------------------------------------------------------------
    console.log("⏳ Buscando usuario admin...");
    const adminUser = await usuariosService.getUsuarioByEmailService(email);

    // ---------------------------------------------------------------
    // 5️⃣ Si no existe, crearlo
    // ---------------------------------------------------------------
    if (!adminUser) {
      console.log("⚠️ Usuario no existe. Creando uno nuevo...");
      const nuevoAdmin = await usuariosService.createUsuario({
        email,
        username,
        password,
        rol: "admin",
      });
      console.log("✅ Usuario admin creado correctamente:", nuevoAdmin.id);
      rl.close(); // Cerramos la interfaz de consola
      return;
    }

    // ---------------------------------------------------------------
    // 6️⃣ Si existe, actualizar su contraseña
    // ---------------------------------------------------------------
    console.log(`✔ Admin encontrado (ID: ${adminUser.id})`);
    console.log("⏳ Actualizando contraseña...");
    await usuariosService.updatePasswordAdminService(adminUser.id, password);
    console.log("✅ CONTRASEÑA ACTUALIZADA CORRECTAMENTE!");
    rl.close();

  } catch (err) {
    // ---------------------------------------------------------------
    // 7️⃣ Manejo de errores inesperados
    // ---------------------------------------------------------------
    console.error("❌ ERROR inesperado:", err);
    rl.close();
  }
};

// ---------------------------------------------------------------
// 8️⃣ Ejecutar la función principal
// ---------------------------------------------------------------
run();

// ---------------------------------------------------------------
// 🔹 Explicación integrada:
// 1. Se solicita al operador email, password y username mediante consola.
// 2. Se valida que ningún campo esté vacío.
// 3. Se busca en la DB si el usuario admin ya existe usando el email.
// 4. Si no existe, se crea con createUsuario (incluye hash de contraseña).
// 5. Si ya existe, se actualiza la contraseña con updatePasswordAdminService.
// 6. Mensajes en consola muestran el progreso y resultado.
// 7. rl.close() cierra la interfaz de consola para terminar el script.
// 8. Permite crear o resetear un admin de forma segura y controlada.
