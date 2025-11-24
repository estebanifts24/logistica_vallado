// ---------------------------------------------------------------
// Script para crear un usuario administrador en la base de datos
// Ejecutar con: node createAdmin.js
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1️⃣ Cargar variables de entorno
// ---------------------------------------------------------------
import dotenv from "dotenv";
dotenv.config(); 
// Esto lee el archivo .env y pone las variables de entorno en process.env.
// Útil si la conexión a Firestore o configuraciones dependen de variables de entorno.

// ---------------------------------------------------------------
// 2️⃣ Importar servicios de usuarios
// ---------------------------------------------------------------
import * as usuariosService from "./src/services/usuarios.service.js";
// Importamos todas las funciones del servicio de usuarios, 
// en particular `createUsuario` que se encargará de crear el admin con lógica de negocio:
//   - encriptar la contraseña
//   - agregar timestamps
//   - validar campos obligatorios

// ---------------------------------------------------------------
// 3️⃣ Función principal que se ejecuta
// ---------------------------------------------------------------
const run = async () => {
  try {
    // ---------------------------------------------------------------
    // 3a️ Definir los datos del admin
    // ---------------------------------------------------------------
    const adminData = {
      username: "admin",        // Nombre de usuario visible
      email: "admin@admin.com", // Email para login
      password: "123456",       // Contraseña inicial (será encriptada por el servicio)
      rol: "admin"              // Rol especial para permisos
    };

    // ---------------------------------------------------------------
    // 3b️ Crear el admin en Firestore usando el servicio
    // ---------------------------------------------------------------
    const newAdmin = await usuariosService.createUsuario(adminData);
    // `createUsuario` hace internamente:
    //  - bcrypt.hash para encriptar la contraseña
    //  - Timestamp.now() para createdAt
    //  - llama al modelo `usuarios.model.js` para persistir el usuario
    //  - devuelve el usuario creado con id y datos limpios (sin exponer password)
    
    // ---------------------------------------------------------------
    // 3c️ Mostrar resultado en consola
    // ---------------------------------------------------------------
    console.log("✅ ADMIN CREADO:");
    console.log(newAdmin);
    // Esto imprime un objeto similar a:
    // { id: "...", username: "admin", email: "admin@admin.com", rol: "admin", createdAt: Timestamp }

    console.log("\nAhora podés loguearte con:");
    console.log("email: admin@admin.com");
    console.log("password: 123456\n");
    // Mensaje instructivo para el desarrollador indicando cómo probar el login

    // ---------------------------------------------------------------
    // 3d️ Terminar el proceso exitosamente
    // ---------------------------------------------------------------
    process.exit(0); // 0 indica éxito
  } catch (err) {
    // ---------------------------------------------------------------
    // 3e️ Manejo de errores
    // ---------------------------------------------------------------
    console.error("❌ Error creando admin:", err);
    // Si ocurre cualquier error (conexión Firestore, validación, etc.), se imprime aquí
    process.exit(1); // 1 indica error
  }
};

// ---------------------------------------------------------------
// 4️⃣ Ejecutar la función principal
// ---------------------------------------------------------------
run();
// run() llama a la función asíncrona que crea el admin y maneja resultados
