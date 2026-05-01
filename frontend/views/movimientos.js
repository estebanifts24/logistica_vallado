import {
  getMovimientosRequest,
  createMovimientoRequest,
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

// ------------------------
// LOAD SELECT DATA
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
// RESET FORM
// ------------------------
const resetForm = () => {
  ["origen","destino","valla","empleado","camion","cantidad"]
    .forEach(id => document.getElementById(id).value = "");

  editId = null;
};

// ------------------------
// MODAL
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

      <select id="origen"></select>
      <select id="destino"></select>
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

  document.getElementById("btnCerrar").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  document.getElementById("btnGuardar").onclick = async () => {
    const token = getToken();

    const data = {
      origenCodigo: document.getElementById("origen").value,
      destinoCodigo: document.getElementById("destino").value,
      tipoVallaCodigo: document.getElementById("valla").value,
      empleadoLegajo: document.getElementById("empleado").value,
      camionPatente: document.getElementById("camion").value,
      cantidad: Number(document.getElementById("cantidad").value)
    };

    if (
      !data.origenCodigo ||
      !data.destinoCodigo ||
      !data.tipoVallaCodigo ||
      !data.cantidad
    ) return;

    await createMovimientoRequest(token, data);

    modal.style.display = "none";
    resetForm();
    await cargarMovimientos();
  };
};

// ------------------------
// SELECTS
// ------------------------
const llenarSelects = () => {
  const setOptions = (id, data, value, label) => {
    document.getElementById(id).innerHTML = `
      <option value="">Seleccionar</option>
      ${data.map(d => `<option value="${d[value]}">${d[label] || d[value]}</option>`).join("")}
    `;
  };

  setOptions("origen", ubicaciones, "codigo", "nombre");
  setOptions("destino", ubicaciones, "codigo", "nombre");
  setOptions("empleado", empleados, "legajo", "legajo");
  setOptions("camion", camiones, "patente", "patente");
  setOptions("valla", vallas, "codigo", "descripcion");
};

// ------------------------
// EDIT
// ------------------------
const handleEdit = (mov) => {
  editId = mov.id;

  document.getElementById("origen").value = mov.origenCodigo || "";
  document.getElementById("destino").value = mov.destinoCodigo || "";
  document.getElementById("valla").value = mov.tipoVallaCodigo || "";
  document.getElementById("empleado").value = mov.empleadoLegajo || "";
  document.getElementById("camion").value = mov.camionPatente || "";
  document.getElementById("cantidad").value = mov.cantidad || "";

  document.getElementById("modalMovimiento").style.display = "flex";
};

// ------------------------
// DELETE
// ------------------------
const handleDelete = async (mov) => {
  const token = getToken();

  await deleteMovimientoRequest(token, mov.id);

  await cargarMovimientos();
};

// ------------------------
// LISTADO
// ------------------------
export const cargarMovimientos = async () => {
  const token = getToken();

  await cargarDatosSelects();
  renderModal();

  const res = await getMovimientosRequest(token);
  const raw = res.data || [];

  const data = raw.map(m => ({
    id: m.id,
    valla: m.tipoVallaCodigo || "-",
    empleado: m.empleadoLegajo || "-",
    camion: m.camionPatente || "-",
    cantidad: m.cantidad ?? 0,
    fecha: m.fecha || "-"
  }));

  renderTable({
    title: "Movimientos",
    columns: ["valla", "empleado", "camion", "cantidad", "fecha"],
    data,
    actions: [
      { name: "edit", label: "Editar", handler: handleEdit },
      { name: "delete", label: "Eliminar", handler: handleDelete }
    ]
  });

  llenarSelects();

  if (!document.getElementById("btnOpenMovimiento")) {
    const btn = document.createElement("button");
    btn.id = "btnOpenMovimiento";
    btn.innerText = "Crear Movimiento";

    btn.onclick = async () => {
      await cargarDatosSelects();
      llenarSelects();
      resetForm();
      document.getElementById("modalMovimiento").style.display = "flex";
    };

    document.getElementById("content").prepend(btn);
  }
};