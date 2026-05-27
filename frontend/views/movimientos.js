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

// ------------------------
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

// ------------------------
const resetForm = () => {
  ["origen", "destino", "valla", "empleado", "camion", "cantidad"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

  editId = null;
};

// ------------------------
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
  `;

  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:10px;min-width:320px;">
      <h3>Movimiento</h3>

      <div id="origenContainer">
        <select id="origen"></select>
      </div>

      <div id="destinoContainer">
        <select id="destino"></select>
      </div>

      <select id="valla"></select>
      <select id="empleado"></select>
      <select id="camion"></select>

      <input id="cantidad" type="number" placeholder="Cantidad">

      <br><br>

      <button id="btnGuardar">Guardar</button>
      <button id="btnCerrar">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);

  // cerrar
  document.getElementById("btnCerrar").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  // guardar
  document.getElementById("btnGuardar").onclick = async () => {
    const token = getToken();

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
      empleadoLegajo: document.getElementById("empleado").value,
      camionPatente: document.getElementById("camion").value,
      cantidad: Number(document.getElementById("cantidad").value)
    };

    if (!data.tipoVallaCodigo || !data.cantidad || data.cantidad <= 0) {
      alert("Datos inválidos");
      return;
    }

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
      alert(err.message);
    }
  };
};

// ------------------------
const handleEdit = (mov) => {
  editId = mov.id;
  tipoMovimiento = mov.tipo;

  document.getElementById("modalMovimiento").style.display = "flex";

  const show = tipoMovimiento !== "ingreso";

  document.getElementById("origenContainer").style.display = show ? "block" : "none";
  document.getElementById("destinoContainer").style.display = show ? "block" : "none";

  document.getElementById("origen").value = mov.origenCodigo || "";
  document.getElementById("destino").value = mov.destinoCodigo || "";
  document.getElementById("valla").value = mov.tipoVallaCodigo || "";
  document.getElementById("empleado").value = mov.empleadoLegajo || "";
  document.getElementById("camion").value = mov.camionPatente || "";
  document.getElementById("cantidad").value = mov.cantidad || "";
};

// ------------------------
const handleDelete = async (mov) => {
  const token = getToken();

  if (!confirm("¿Eliminar movimiento?")) return;

  await deleteMovimientoRequest(token, mov.id);
  await cargarMovimientos();
};

// ------------------------
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
      "empleadoLegajo",
      "camionPatente",
      "cantidad",
      "fecha"
    ],
    data,
    actions: [
      { name: "edit", label: "Editar", handler: handleEdit },
      { name: "delete", label: "Eliminar", handler: handleDelete }
    ]
  });

  llenarSelects();

  if (!document.getElementById("btnOpenMovimiento")) {
    const btn = document.createElement("button");
    btn.innerText = "➕ Movimiento";

    btn.onclick = () => {
      tipoMovimiento = "traslado";
      resetForm();

      document.getElementById("origenContainer").style.display = "block";
      document.getElementById("destinoContainer").style.display = "block";

      document.getElementById("modalMovimiento").style.display = "flex";
    };

    document.getElementById("content").prepend(btn);
  }

  if (!document.getElementById("btnIngresoStock")) {
    const btn2 = document.createElement("button");
    btn2.innerText = "📥 Ingreso";

    btn2.onclick = () => {
      tipoMovimiento = "ingreso";
      resetForm();

      document.getElementById("origenContainer").style.display = "none";
      document.getElementById("destinoContainer").style.display = "none";

      document.getElementById("modalMovimiento").style.display = "flex";
    };

    document.getElementById("content").prepend(btn2);
  }
};

// ------------------------
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