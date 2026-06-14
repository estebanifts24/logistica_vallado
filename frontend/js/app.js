import { initLogin, logout } from "./login.js";

import { cargarUsuarios } from "../views/usuarios.js";
import { cargarCamiones } from "../views/camiones.js";
import { cargarVallas } from "../views/vallas.js";
import { cargarEmpleados } from "../views/empleados.js";
import { cargarMovimientos } from "../views/movimientos.js";
import { cargarStock } from "../views/stock.js";
import { cargarUbicaciones } from "../views/ubicaciones.js";
import {
  getCamionesRequest,
  getEmpleadosRequest,
  getMovimientosRequest,
  getUbicacionesRequest,
  getStockRequest
} from "./api.js";




const setLayout = (mode) => {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  sidebar.style.display = (mode === "dashboard") ? "none" : "flex";
};
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
// DASHBOARD STATS
// ------------------------

const getDashboardStats = async () => {

  const token = localStorage.getItem("token");

  const [
    camiones,
    empleados,
    movimientos,
    ubicaciones,
    stock
  ] = await Promise.all([
    getCamionesRequest(token),
    getEmpleadosRequest(token),
    getMovimientosRequest(token),
    getUbicacionesRequest(token),
    getStockRequest(token)
  ]);

  const resumenVallas = {};
  let totalVallas = 0;

  stock.data.forEach(item => {

    const descripcion = item.vallaDescripcion;
    const cantidad = Number(item.cantidad) || 0;

    resumenVallas[descripcion] =
      (resumenVallas[descripcion] || 0) + cantidad;

    totalVallas += cantidad;

  });

  return {
    camiones: camiones.data.length,
    empleados: empleados.data.length,
    movimientos: movimientos.data.length,
    ubicaciones: ubicaciones.data.length,
    totalVallas,
    resumenVallas
  };
};


// ------------------------
// DASHBOARD INICIAL
// ------------------------
const renderDashboard = async(user) => {
  const stats = await getDashboardStats();
  setLayout("dashboard");
  const content = document.getElementById("content");

  if (!content) return;

  content.innerHTML = `
    <div class="dashboard">

        <div class="dashboard-header">

        <h2>
        Bienvenido, ${user.username}
        </h2>

        <button id="btnDashboardLogout" class="dashboard-logout">
        Cerrar sesión
        </button>

</div>

        <div class="dashboard-layout">

        <div class="dashboard-cards">          

        <div class="dashboard-card" data-view="camiones" >
          <div class="dashboard-icon">🚚</div>
          <h3>Camiones</h3>
        </div>

        <div class="dashboard-card" data-view="vallas">
          <div class="dashboard-icon">🚧</div>
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
        ${user.rol === "admin" ? `
        <div class="dashboard-card" data-view="usuarios">
        <div class="dashboard-icon">👤</div>
        <h3>Usuarios</h3>
        </div>
        ` : ""}
        
      </div>

    <div class="dashboard-stats">

  <h3>Inventario de Vallas</h3>

  <div class="dashboard-stat-card">
    <span>Total General</span>
    <strong>${stats.totalVallas.toLocaleString("es-AR")}</strong>
  </div>

  ${Object.entries(stats.resumenVallas)
    .map(([descripcion, cantidad]) => `
      <div class="dashboard-stat-card">
        <span>${descripcion}</span>
        <strong>${cantidad.toLocaleString("es-AR")}</strong>
      </div>
    `)
    .join("")}

</div>
  </div>

     
  `;
  setTimeout(() => {

  document.querySelectorAll(".dashboard-card").forEach(card => {

    card.addEventListener("click", () => {

      const view = card.dataset.view;
      
      if (view === "camiones") {setLayout("app"); setActiveMenu("btnCamiones");cargarCamiones();};
      if (view === "vallas") {setLayout("app");setActiveMenu("btnVallas"); cargarVallas();};
      if (view === "empleados") {setLayout("app");setActiveMenu("btnEmpleados");cargarEmpleados();}
      if (view === "stock") {setLayout("app");setActiveMenu("btnStock");cargarStock();}
      if (view === "ubicaciones"){setLayout("app");setActiveMenu("btnUbicaciones");cargarUbicaciones();} 
      if (view === "movimientos") {setLayout("app");setActiveMenu("btnMovimientos"); cargarMovimientos();}
      if (view === "usuarios") {setLayout("app"); setActiveMenu("btnUsuarios");cargarUsuarios();};

    });

  });
  const btnLogout =
  document.getElementById("btnDashboardLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

}, 0);
};

// ------------------------
// INIT SESSION
// ------------------------
if (token && user) {

  showApp();
  applyRoleUI();
  setLayout("app");

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
  setLayout("app");
  setActiveMenu("btnUsuarios");
  cargarUsuarios();
});
bind("btnCamiones", () => {
  setLayout("app");
  setActiveMenu("btnCamiones");
  cargarCamiones();
});
bind("btnVallas", () => {
  setLayout("app");
  setActiveMenu("btnVallas");
  cargarVallas();
});
bind("btnEmpleados", () => {
  setLayout("app");
  setActiveMenu("btnEmpleados");
  cargarEmpleados();
});
bind("btnMovimientos", () => {
  setLayout("app");
  setActiveMenu("btnMovimientos");
  cargarMovimientos();
});
bind("btnStock", () => {
  setLayout("app");
  setActiveMenu("btnStock");
  cargarStock();
});
bind("btnUbicaciones", () => {
  setLayout("app");
  setActiveMenu("btnUbicaciones");
  cargarUbicaciones();
});
const btnDashboard =
  document.getElementById("btnDashboard");

if (btnDashboard) {

  btnDashboard.addEventListener("click", () => {

    setLayout("dashboard");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      clearActiveMenu();

      // 🔥 LIMPIA VISTA ANTERIOR
      document.getElementById("content").innerHTML = "";

      renderDashboard(user);
    }

  });

}