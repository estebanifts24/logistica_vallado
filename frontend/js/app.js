import { initLogin } from "./login.js";

import { cargarUsuarios } from "../views/usuarios.js";
import { cargarCamiones } from "../views/camiones.js";
import { cargarVallas } from "../views/vallas.js";
import { cargarEmpleados } from "../views/empleados.js";
import { cargarMovimientos } from "../views/movimientos.js";
import { cargarStock } from "../views/stock.js";
import { cargarUbicaciones } from "../views/ubicaciones.js";

// ------------------------
// ROLES UI
// ------------------------
const applyRoleUI = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const btn = document.getElementById("btnUsuarios");

  if (!btn) return;

  // 🔥 SIEMPRE DECISIÓN COMPLETA (no estados parciales)
  if (user?.rol === "admin") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

// ------------------------
// LOGIN INIT
// ------------------------
initLogin();

// ------------------------
// SESSION CHECK
// ------------------------
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// ------------------------
// UI HELPERS
// ------------------------
const showLogin = () => {
  const login = document.getElementById("loginView");
  const app = document.getElementById("app");

  if (login) login.style.display = "flex";
  if (app) app.style.display = "none";
};

const showApp = () => {
  const login = document.getElementById("loginView");
  const app = document.getElementById("app");

  if (login) login.style.display = "none";
  if (app) app.style.display = "block";
};

// ------------------------
// INIT SESSION
// ------------------------
if (token && user) {

  showApp();
  applyRoleUI();

  let rolTexto = user.rol;

  if (user.rol === "admin") {
    rolTexto = "Administrador";
  }

  if (user.rol === "user") {
    rolTexto = "Usuario";
  }

  document.getElementById("userInfo").innerHTML = `
    👤 ${user.username}<br>
    🔑 ${rolTexto}
  `;

} else {
  showLogin();
}

// ------------------------
// SAFE BIND
// ------------------------
const bind = (id, fn) => {
  const el = document.getElementById(id);

  if (el) {
    el.addEventListener("click", fn);
  } else {
    console.warn(`⚠️ Botón ${id} no encontrado`);
  }
};

// ------------------------
// MENU ACTIONS
// ------------------------
bind("btnUsuarios", cargarUsuarios);
bind("btnCamiones", cargarCamiones);
bind("btnVallas", cargarVallas);
bind("btnEmpleados", cargarEmpleados);
bind("btnMovimientos", cargarMovimientos);
bind("btnStock", cargarStock);
bind("btnUbicaciones", cargarUbicaciones);