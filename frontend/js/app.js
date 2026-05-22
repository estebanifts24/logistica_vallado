import { initLogin } from "./login.js";

import { cargarUsuarios } from "../views/usuarios.js";
import { cargarCamiones } from "../views/camiones.js";
import { cargarVallas } from "../views/vallas.js";
import { cargarEmpleados } from "../views/empleados.js";
import { cargarMovimientos } from "../views/movimientos.js";
import { cargarStock } from "../views/stock.js";
import { cargarUbicaciones } from "../views/ubicaciones.js";

const applyRoleUI = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  // 🔥 SOLO ADMIN VE USUARIOS
  if (user.rol !== "admin") {
    const btn = document.getElementById("btnUsuarios");
    if (btn) btn.style.display = "none";
  }
};

// 🔐 LOGIN
initLogin();

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  document.getElementById("loginView").style.display = "none";
  document.getElementById("app").style.display = "block";
  applyRoleUI();
}

// helper seguro (evita que un null rompa todo)
const bind = (id, fn) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", fn);
  } else {
    console.warn(`⚠️ Botón ${id} no encontrado`);
  }
};

// 📊 SISTEMA
bind("btnUsuarios", cargarUsuarios);
bind("btnCamiones", cargarCamiones);
bind("btnVallas", cargarVallas);
bind("btnEmpleados", cargarEmpleados);
bind("btnMovimientos", cargarMovimientos);
bind("btnStock", cargarStock);
bind("btnUbicaciones", cargarUbicaciones);