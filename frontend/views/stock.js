/* ===============================================================
   1. IMPORTACIONES
   =============================================================== */

import { getStockRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

/* ===============================================================
   2. MODAL STOCK
   =============================================================== */

/*
   2.1 Modal solo lectura
*/

const renderModalStock = () => {
  if (document.getElementById("modalStock")) return;

  const modal = document.createElement("div");

  modal.id = "modalStock";

  modal.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.5);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:999;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff;
      padding:20px;
      border-radius:10px;
      min-width:350px;
      display:flex;
      flex-direction:column;
      gap:10px;
    ">

      <h3>Detalle de Stock</h3>

      <div>
        <label>Ubicación</label>
        <input id="stockUbicacion" disabled>
      </div>

      <div>
        <label>Código Valla</label>
        <input id="stockCodigoValla" disabled>
      </div>

      <div>
        <label>Descripción</label>
        <input id="stockDescripcion" disabled>
      </div>

      <div>
        <label>Cantidad</label>
        <input id="stockCantidad" disabled>
      </div>

      <button id="btnCerrarStock">
        Cerrar
      </button>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btnCerrarStock").onclick = () => {
    modal.style.display = "none";
  };
};

/* ===============================================================
   3. ACCIÓN VER
   =============================================================== */

/*
   3.1 Mostrar detalle de una línea de stock
*/

const handleView = (row) => {
  const modal = document.getElementById("modalStock");

  document.getElementById("stockUbicacion").value =
    row.codigoUbicacion || "";

  document.getElementById("stockCodigoValla").value =
    row.codigoValla || "";

  document.getElementById("stockDescripcion").value =
    row.vallaDescripcion || "";

  document.getElementById("stockCantidad").value =
    row.cantidad ?? 0;

  modal.style.display = "flex";
};

/* ===============================================================
   4. CARGAR STOCK
   =============================================================== */

/*
   4.1 Obtiene stock desde API
   4.2 Muestra descripción de valla
*/

export const cargarStock = async () => {
  renderModalStock();

  const res = await getStockRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📦 Stock",

    /* ===========================================================
       4.3 Columnas visibles
       =========================================================== */
    columns: [
      "codigoUbicacion",
      "codigoValla",
      "vallaDescripcion",
      "cantidad"
    ],

    /* ===========================================================
       4.4 Datos de la tabla
       =========================================================== */
    data: data.map((s) => ({
      codigoUbicacion: s.codigoUbicacion || "-",
      codigoValla: s.codigoValla || "-",
      vallaDescripcion: s.vallaDescripcion || "-",
      cantidad: s.cantidad ?? 0
    })),

    /* ===========================================================
       4.5 Acciones
       =========================================================== */
    actions: [
      {
        name: "view",
        label: "👁 Ver",
        handler: handleView
      }
    ]
  });
};