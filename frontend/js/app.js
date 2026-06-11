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
// DASHBOARD INICIAL
// ------------------------
const renderDashboard = (user) => {

  const content = document.getElementById("content");

  if (!content) return;

  content.innerHTML = `
    <div class="dashboard">

      <h2>
        Bienvenido, ${user.username}
      </h2>

      <p class="dashboard-subtitle">
       
      </p>

      <div class="dashboard-cards">

        <div class="dashboard-card" data-view="camiones" >
          <div class="dashboard-icon">🚚</div>
          <h3>Camiones</h3>
        </div>

        <div class="dashboard-card" data-view="vallas">
          <div class="dashboard-icon">🏗️</div>
          <h3>Vallas</h3>
        </div>

        <div class="dashboard-card" data-view="empleados" >
          <div class="dashboard-icon">👷</div>
          <h3>Empleados</h3>
        </div>

        <div class="dashboard-card" data-view="stock" >
          <div class="dashboard-icon">📦</div>
          <h3>Stock</h3>
        </div>

        <div class="dashboard-card" data-view="ubicaciones" >
          <div class="dashboard-icon">📍</div>
          <h3>Ubicaciones</h3>
        </div>

        <div class="dashboard-card" data-view="movimientos" >
          <div class="dashboard-icon">📋</div>
          <h3>Movimientos</h3>
        </div>

     
  `;
  setTimeout(() => {

  document.querySelectorAll(".dashboard-card").forEach(card => {

    card.addEventListener("click", () => {

      const view = card.dataset.view;

      if (view === "camiones") cargarCamiones();
      if (view === "vallas") cargarVallas();
      if (view === "empleados") cargarEmpleados();
      if (view === "stock") cargarStock();
      if (view === "ubicaciones") cargarUbicaciones();
      if (view === "movimientos") cargarMovimientos();

    });

  });

}, 0);
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
  renderDashboard(user);

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

const setActiveMenu = (id) => {

  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(id)?.classList.add("active");
};

const clearActiveMenu = () => {

  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.classList.remove("active");
  });

};

bind("btnUsuarios", () => {
  setActiveMenu("btnUsuarios");
  cargarUsuarios();
});
bind("btnCamiones", () => {
  setActiveMenu("btnCamiones");
  cargarCamiones();
});
bind("btnVallas", () => {
  setActiveMenu("btnVallas");
  cargarVallas();
});
bind("btnEmpleados", () => {
  setActiveMenu("btnEmpleados");
  cargarEmpleados();
});
bind("btnMovimientos", () => {
  setActiveMenu("btnMovimientos");
  cargarMovimientos();
});
bind("btnStock", () => {
  setActiveMenu("btnStock");
  cargarStock();
});
bind("btnUbicaciones", () => {
  setActiveMenu("btnUbicaciones");
  cargarUbicaciones();
});
const btnDashboard =
  document.getElementById("btnDashboard");

if (btnDashboard) {

  btnDashboard.addEventListener("click", () => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (user) {
    clearActiveMenu();
    renderDashboard(user);
}

  });

}