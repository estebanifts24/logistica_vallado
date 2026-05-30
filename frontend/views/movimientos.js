import {
  getMovimientosRequest,
  createMovimientoRequest,
  updateMovimientoRequest,
  getEmpleadosRequest,
  getCamionesRequest,
  getVallasRequest,
  getUbicacionesRequest,
  deleteMovimientoRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let empleados = [];
let camiones = [];
let vallas = [];
let ubicaciones = [];

let editId = null;
let tipoMovimiento = "traslado";

const BASE_CODIGO = "base";
const INGRESO_CODIGO = "ingreso";

/* =========================================================
   1. UI MODE CONTROL
   ========================================================= */

/* 1.1 Oculta o muestra campos según tipo de movimiento */
const applyModalMode = () => {
  const origenWrap = document.getElementById("origen")?.parentElement;
  const destinoWrap = document.getElementById("destino")?.parentElement;
  const empleadoWrap = document.getElementById("empleado")?.parentElement;
  const camionWrap = document.getElementById("camion")?.parentElement;

  const isIngreso = tipoMovimiento === "ingreso";

  if (origenWrap) origenWrap.style.display = isIngreso ? "none" : "block";
  if (destinoWrap) destinoWrap.style.display = isIngreso ? "none" : "block";
  if (empleadoWrap) empleadoWrap.style.display = isIngreso ? "none" : "block";
  if (camionWrap) camionWrap.style.display = isIngreso ? "none" : "block";
};

/* =========================================================
   2. ERROR HANDLING UI
   ========================================================= */

/* 2.1 Mostrar error en modal */
const showError = (msg) => {
  const el = document.getElementById("modalError");
  if (!el) return;
  el.innerText = msg;
  el.style.display = "block";
};

/* 2.2 Limpiar error */
const clearError = () => {
  const el = document.getElementById("modalError");
  if (el) el.style.display = "none";
};

/* =========================================================
   3. CONFIRM MODAL
   ========================================================= */

/* 3.1 Mostrar confirmación reutilizable */
const showConfirm = (msg, onConfirm) => {
  let el = document.getElementById("confirmModal");

  if (!el) {
    el = document.createElement("div");
    el.id = "confirmModal";
    el.style = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.6);
      display:none;
      align-items:center;
      justify-content:center;
      z-index:2000;
    `;

    el.innerHTML = `
      <div style="
        background:#fff;
        padding:20px;
        border-radius:10px;
        min-width:280px;
        text-align:center;
        display:flex;
        flex-direction:column;
        gap:10px;
      ">
        <p id="confirmText"></p>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button id="confirmYes">Confirmar</button>
          <button id="confirmNo">Cancelar</button>
        </div>
      </div>
    `;

    document.body.appendChild(el);
  }

  document.getElementById("confirmText").innerText = msg;
  el.style.display = "flex";

  document.getElementById("confirmYes").onclick = () => {
    el.style.display = "none";
    onConfirm();
  };

  document.getElementById("confirmNo").onclick = () => {
    el.style.display = "none";
  };
};

/* =========================================================
   4. VALIDACIÓN
   ========================================================= */

/* 4.1 Validación de formulario manual */
const validarFormulario = () => {
  const valla = document.getElementById("valla").value;
  const cantidad = Number(document.getElementById("cantidad").value);

  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;

  const empleado = document.getElementById("empleado").value;
  const camion = document.getElementById("camion").value;

  if (!valla) return "Seleccioná una valla";

  if (tipoMovimiento !== "ingreso") {
    if (!origen) return "Seleccioná el origen";
    if (!destino) return "Seleccioná el destino";
    if (!empleado) return "Seleccioná el empleado";
    if (!camion) return "Seleccioná el camión";
  }

  if (!cantidad || cantidad <= 0) {
    return "La cantidad debe ser mayor a 0";
  }

  return null;
};

/* =========================================================
   5. DATA (API + SELECTS)
   ========================================================= */

/* 5.1 Cargar datos de selects */
const cargarDatosSelects = async () => {
  const token = getToken();

  const [empRes, camRes, valRes, ubiRes] = await Promise.all([
    getEmpleadosRequest(token),
    getCamionesRequest(token),
    getVallasRequest(token),
    getUbicacionesRequest(token)
  ]);

  empleados = empRes.data || [];
  camiones = camRes.data || [];
  vallas = valRes.data || [];
  ubicaciones = ubiRes.data || [];
};

/* =========================================================
   6. FORM RESET
   ========================================================= */

/* 6.1 Reset del formulario */
const resetForm = () => {
  ["origen", "destino", "valla", "empleado", "camion", "cantidad"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

  editId = null;  
  clearError();
};

/* =========================================================
   7. MODAL PRINCIPAL
   ========================================================= */

/* 7.1 Crear modal dinámico */
const renderModal = () => {
  if (document.getElementById("modalMovimiento")) return;

  const modal = document.createElement("div");
  modal.id = "modalMovimiento";

  modal.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff;
      padding:20px;
      border-radius:10px;
      min-width:340px;
      display:flex;
      flex-direction:column;
      gap:10px;
    ">

      <h3 id="modalTitle">Movimiento</h3>

      <div id="modalError" style="
        display:none;
        background:#fee2e2;
        color:#b91c1c;
        padding:8px;
        border-radius:6px;
        font-size:13px;
      "></div>

      <div>
        <label>Origen</label>
        <select id="origen"></select>
      </div>

      <div>
        <label>Destino</label>
        <select id="destino"></select>
      </div>

      <div>
        <label>Valla</label>
        <select id="valla"></select>
      </div>

      <div>
        <label>Empleado</label>
        <select id="empleado"></select>
      </div>

      <div>
        <label>Camión</label>
        <select id="camion"></select>
      </div>

      <div>
        <label>Cantidad</label>
        <input id="cantidad" type="number" min="1" step="1">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardar">Guardar</button>
        <button id="btnCerrar">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  applyModalMode();

  document.getElementById("btnCerrar").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  document.getElementById("btnGuardar").onclick = async () => {
    const token = getToken();
    clearError();

    const error = validarFormulario();

    if (error) {
      showError(error);
      return;
    }

    const cantidad = Number(document.getElementById("cantidad").value);

    const data = {
      tipo: tipoMovimiento,

      origenCodigo:
        tipoMovimiento === "ingreso"
          ? INGRESO_CODIGO
          : document.getElementById("origen").value,

      destinoCodigo:
        tipoMovimiento === "ingreso"
          ? BASE_CODIGO
          : document.getElementById("destino").value,

      tipoVallaCodigo: document.getElementById("valla").value,

      empleadoLegajo:
        tipoMovimiento === "ingreso"
          ? null
          : document.getElementById("empleado").value,

      camionPatente:
        tipoMovimiento === "ingreso"
          ? null
          : document.getElementById("camion").value,

      cantidad
    };

    const accion = editId ? "actualizar" : "crear";

    const tipoTexto =
      tipoMovimiento === "ingreso"
        ? "ingreso de stock"
        : "movimiento";

    showConfirm(
      `¿Confirmás ${accion} este ${tipoTexto}?`,
      async () => {
        try {
          if (editId) {
            await updateMovimientoRequest(token, editId, data);
          } else {
            await createMovimientoRequest(token, data);
          }

          modal.style.display = "none";
          resetForm();

          await cargarMovimientos();

        } catch (err) {
          console.log(err?.response?.data);

          const backendMsg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "";

          let msgFinal = "Error inesperado";

          if (
            backendMsg.toLowerCase().includes("stock") ||
            backendMsg.toLowerCase().includes("insuficiente") ||
            backendMsg.toLowerCase().includes("no hay")
          ) {
            msgFinal = "No hay stock suficiente en el origen";

          } else if (backendMsg.toLowerCase().includes("origen")) {
            msgFinal = "Problema con el stock del origen seleccionado";

          } else if (backendMsg.toLowerCase().includes("destino")) {
            msgFinal = "Problema con el destino seleccionado";

          } else if (backendMsg.toLowerCase().includes("bad request")) {
            msgFinal = "No se pudo realizar el movimiento";

          } else if (backendMsg) {
            msgFinal = backendMsg;
          }

          showError(msgFinal);
        }
      }
    );
  };
};

 /* =========================================================
   8. ACCIONES CRUD
   ========================================================= */

const handleView = (mov) => {
  editId = null;
  tipoMovimiento = mov.tipo;

  const modal = document.getElementById("modalMovimiento");

  modal.style.display = "flex";

  document.getElementById("modalTitle").innerText = "Detalle Movimiento";

  // 🔥 cargar datos
  document.getElementById("origen").value = mov.origenCodigo || "";
  document.getElementById("destino").value = mov.destinoCodigo || "";
  document.getElementById("valla").value = mov.tipoVallaCodigo || "";
  document.getElementById("empleado").value = mov.empleadoLegajo || "";
  document.getElementById("camion").value = mov.camionPatente || "";
  document.getElementById("cantidad").value = mov.cantidad || "";

  applyModalMode();

  // 🔥 SOLO LECTURA REAL
  const inputs = ["origen","destino","valla","empleado","camion","cantidad"];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });

  // 🔥 ocultar guardar
  const btn = document.getElementById("btnGuardar");
  if (btn) btn.style.display = "none";
};
/* 8.2 Editar */
const handleEdit = (mov) => {
  editId = mov.id;
  tipoMovimiento = mov.tipo;

  const modal = document.getElementById("modalMovimiento");

  modal.style.display = "flex";
  document.getElementById("modalTitle").innerText = "Editar Movimiento";

  // 🔥 cargar datos
  document.getElementById("origen").value = mov.origenCodigo || "";
  document.getElementById("destino").value = mov.destinoCodigo || "";
  document.getElementById("valla").value = mov.tipoVallaCodigo || "";
  document.getElementById("empleado").value = mov.empleadoLegajo || "";
  document.getElementById("camion").value = mov.camionPatente || "";
  document.getElementById("cantidad").value = mov.cantidad || "";

  applyModalMode();

  // 🔥 IMPORTANTE: habilitar edición sí o sí
  const inputs = ["origen","destino","valla","empleado","camion","cantidad"];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = false;
  });

  // 🔥 mostrar botón guardar
  const btn = document.getElementById("btnGuardar");
  if (btn) btn.style.display = "block";
};

/* 8.3 Eliminar */
const handleDelete = async (mov) => {
  const token = getToken();

  // 🔥 modal ERP de confirmación
  const modal = document.createElement("div");

  modal.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 10px;
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    ">
      <h3 style="margin:0;">Confirmar eliminación</h3>

      <p>¿Estás seguro que querés eliminar este movimiento?</p>

      <small style="color:#64748b">
        ID: ${mov.id}
      </small>

      <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
        <button id="confirmDel"
          style="background:#ef4444;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;">
          Eliminar
        </button>

        <button id="cancelDel"
          style="background:#64748b;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;">
          Cancelar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 🔥 confirmar eliminación
  document.getElementById("confirmDel").onclick = async () => {
    await deleteMovimientoRequest(token, mov.id);
    modal.remove();
    await cargarMovimientos();
  };

  // 🔥 cancelar
  document.getElementById("cancelDel").onclick = () => {
    modal.remove();
  };
};

/* =========================================================
   9. CARGA PRINCIPAL
   ========================================================= */

/* 9.1 Cargar movimientos + UI */
export const cargarMovimientos = async () => {
  const token = getToken();

  await cargarDatosSelects();
  renderModal();

  const res = await getMovimientosRequest(token);
  const raw = res.data || [];

  const data = raw.map(m => ({
    id: m.id,
    tipo: m.tipo,
    origenCodigo: m.origenCodigo || "-",
    destinoCodigo: m.destinoCodigo || "-",
    tipoVallaCodigo: m.tipoVallaCodigo || "-",
    empleadoLegajo: m.empleadoLegajo || "-",
    camionPatente: m.camionPatente || "-",
    cantidad: m.cantidad ?? 0,
    fecha: m.fecha || "-"
  }));

  renderTable({
    title: "Movimientos",
   columns: [
  "tipo",
  "origenCodigo",
  "destinoCodigo",
  "tipoVallaCodigo",
  "cantidad",
  "fecha"
  ],
    data,
    actions: [
  { name: "view", label: "👁 Ver", handler: handleView },
  { name: "edit", label: "Editar", handler: handleEdit },
  { name: "delete", label: "Eliminar", handler: handleDelete }
    ]
  });

  llenarSelects();

  /* 9.2 Botón crear movimiento */
  if (!document.getElementById("btnOpenMovimiento")) {
    const btn = document.createElement("button");
    btn.id = "btnOpenMovimiento";
    btn.innerText = "➕ Movimiento";

    btn.onclick = () => {
      tipoMovimiento = "traslado";
      resetForm();

      document.getElementById("modalTitle").innerText =
        "Nuevo Movimiento";

      document.getElementById("modalMovimiento").style.display = "flex";
      applyModalMode();
    };

    document.getElementById("content").prepend(btn);
  }

  /* 9.3 Botón ingreso stock */
  if (!document.getElementById("btnIngresoStock")) {
    const btn2 = document.createElement("button");
    btn2.id = "btnIngresoStock";
    btn2.innerText = "📥 Ingreso";

    btn2.onclick = () => {
      tipoMovimiento = "ingreso";
      resetForm();

      document.getElementById("modalTitle").innerText =
        "Ingreso de Stock";

      document.getElementById("modalMovimiento").style.display = "flex";
      applyModalMode();
    };

    document.getElementById("content").prepend(btn2);
  }
};

/* =========================================================
   10. HELPERS (SELECTS)
   ========================================================= */

/* 10.1 Cargar opciones en selects */
const llenarSelects = () => {
  const setOptions = (id, data, value, label) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = `
      <option value="">Seleccionar</option>
      ${data.map(d =>
        `<option value="${d[value]}">${d[label] || d[value]}</option>`
      ).join("")}
    `;
  };

  setOptions("origen", ubicaciones, "codigo", "nombre");
  setOptions("destino", ubicaciones, "codigo", "nombre");
  setOptions("empleado", empleados, "legajo", "legajo");
  setOptions("camion", camiones, "patente", "patente");
  setOptions("valla", vallas, "codigo", "descripcion");
};