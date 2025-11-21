// Ejecutar con: node createAdmin.js

import dotenv from "dotenv";
dotenv.config();

import * as usuariosService from "./src/services/usuarios.service.js";

const run = async () => {
  try {
    const adminData = {
      username: "admin",
      email: "admin@admin.com",
      password: "123456",
      rol: "admin"
    };

    const newAdmin = await usuariosService.createUsuario(adminData);

    console.log("✅ ADMIN CREADO:");
    console.log(newAdmin);

    console.log("\nAhora podés loguearte con:");
    console.log("email: admin@admin.com");
    console.log("password: 123456\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando admin:", err);
    process.exit(1);
  }
};

run();
