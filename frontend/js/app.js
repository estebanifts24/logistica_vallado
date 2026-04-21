import { login } from "./auth.js";
import { cargarUsuarios } from "../views/usuarios.js";
import { cargarCamiones } from "../views/camiones.js";
import { cargarVallas } from "../views/vallas.js";
import { cargarEmpleados } from "../views/empleados.js";
import { cargarMovimientos } from "../views/movimientos.js";

// LOGIN
document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await login(email, password);

  console.log(res);
  alert("Login OK");
});

// USUARIOS
document.getElementById("btnUsuarios").addEventListener("click", cargarUsuarios);

// CAMIONES
document.getElementById("btnCamiones").addEventListener("click", cargarCamiones);

// VALLAS
document.getElementById("btnVallas").addEventListener("click", cargarVallas);

// EMPLEADOS
document.getElementById("btnEmpleados").addEventListener("click", cargarEmpleados);

//MOVIMIENTOS



document.getElementById("btnMovimientos").addEventListener("click", () => {
  cargarMovimientos();
});