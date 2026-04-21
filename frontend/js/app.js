import { initLogin } from "./login.js";

import { cargarUsuarios } from "../views/usuarios.js";
import { cargarCamiones } from "../views/camiones.js";
import { cargarVallas } from "../views/vallas.js";
import { cargarEmpleados } from "../views/empleados.js";
import { cargarMovimientos } from "../views/movimientos.js";

// 🔐 LOGIN
initLogin();

// 📊 SISTEMA
document.getElementById("btnUsuarios").addEventListener("click", cargarUsuarios);

document.getElementById("btnCamiones").addEventListener("click", cargarCamiones);

document.getElementById("btnVallas").addEventListener("click", cargarVallas);

document.getElementById("btnEmpleados").addEventListener("click", cargarEmpleados);

document.getElementById("btnMovimientos").addEventListener("click", cargarMovimientos);