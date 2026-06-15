import {
  getEmpleadosRequest,
  createEmpleadoRequest,
  updateEmpleadoRequest,
  deleteEmpleadoRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ===============================================================
// 1. MODAL PRINCIPAL
// ===============================================================

const renderModal = () => {
  if (document.getElementById("modalEmpleado")) return;

  const modal = document.createElement("div");
  modal.id = "modalEmpleado";

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

      <h3 id="modalTitleEmpleado">Empleado</h3>

      <div>
        <label>Nombre</label>
        <input id="empleadoNombre" type="text">
      </div>

      <div>
        <label>Apellido</label>
        <input id="empleadoApellido" type="text">
      </div>

      <div>
        <label>DNI</label>
        <input
          id="empleadoDni"
          type="text"
          maxlength="8"
          inputmode="numeric"
          autocomplete="off"
        >
      </div>

      <div>
        <label>Legajo</label>
        <input id="empleadoLegajo" type="text">
      </div>

      <div id="errorEmpleado"
        style="color:red;font-size:14px;min-height:18px;">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarEmpleado">Guardar</button>
        <button id="btnCerrarEmpleado">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btnCerrarEmpleado").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  document.getElementById("btnGuardarEmpleado").onclick = async () => {

    const error = document.getElementById("errorEmpleado");
    error.innerText = "";

    const nombre = document.getElementById("empleadoNombre").value.trim();
    const apellido = document.getElementById("empleadoApellido").value.trim();
    const dni = document.getElementById("empleadoDni").value.trim();
    const legajoRaw = document.getElementById("empleadoLegajo").value.trim();

    // =========================
    // VALIDACIÓN CAMPOS
    // =========================
    if (!nombre || !apellido || !dni || !legajoRaw) {
      error.innerText = "Completá todos los campos";
      return;
    }

    // =========================
    // VALIDACIÓN DNI (CORREGIDA)
    // =========================

    // ❗ primero detectar letras ANTES de limpiar
    if (!/^\d+$/.test(dni)) {
      error.innerText = "El DNI debe contener solo números";
      return;
    }

    const dniLimpio = dni;

    if (dniLimpio.length < 7 || dniLimpio.length > 8) {
      error.innerText = "El DNI debe tener 7 u 8 dígitos";
      return;
    }

    const dniFinal = dniLimpio.padStart(8, "0");

    try {
      const res = await getEmpleadosRequest(getToken());
      const empleados = res.data || [];

      const legajoNormalizado = legajoRaw.toLowerCase();

      const existeDni = empleados.some(e =>
        e.dni === dniFinal && e.id !== editId
      );

      const existeLegajo = empleados.some(e =>
        (e.legajo || "").toLowerCase() === legajoNormalizado &&
        e.id !== editId
      );

      if (existeDni) {
        error.innerText = "Ya existe un empleado con ese DNI";
        return;
      }

      if (existeLegajo) {
        error.innerText = "Ya existe un empleado con ese legajo";
        return;
      }

      const token = getToken();

      const payload = {
        nombre,
        apellido,
        dni: dniFinal,
        legajo: legajoRaw
      };

      if (editId) {
        await updateEmpleadoRequest(token, editId, payload);
      } else {
        await createEmpleadoRequest(token, payload);
      }

      modal.style.display = "none";
      resetForm();
      await cargarEmpleados();

    } catch (err) {
      console.error(err);
      error.innerText = err.message || "Error al guardar empleado";
    }
  };
};

// ===============================================================
// 2. CONFIRM DELETE
// ===============================================================

const confirmModal = document.createElement("div");

confirmModal.id = "confirmEmpleado";

confirmModal.style = `
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:none;
  align-items:center;
  justify-content:center;
  z-index:2000;
`;

confirmModal.innerHTML = `
  <div style="background:#fff;padding:20px;border-radius:10px;width:320px;text-align:center;">
    <h3>Confirmar eliminación</h3>
    <p id="confirmTextEmpleado"></p>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button id="btnConfirmYesEmpleado">Eliminar</button>
      <button id="btnConfirmNoEmpleado">Cancelar</button>
    </div>
  </div>
`;

document.body.appendChild(confirmModal);

// ===============================================================
// 3. RESET FORM
// ===============================================================

const resetForm = () => {
  editId = null;

  document.getElementById("empleadoNombre").value = "";
  document.getElementById("empleadoApellido").value = "";
  document.getElementById("empleadoDni").value = "";
  document.getElementById("empleadoLegajo").value = "";

  document.getElementById("btnGuardarEmpleado").style.display = "block";
  document.getElementById("errorEmpleado").innerText = "";
};

// ===============================================================
// 4. CRUD ACTIONS
// ===============================================================

const handleView = (row) => {
  editId = null;

  const modal = document.getElementById("modalEmpleado");
  modal.style.display = "flex";

  document.getElementById("modalTitleEmpleado").innerText = "Ver Empleado";

  document.getElementById("empleadoNombre").value = row.nombre || "";
  document.getElementById("empleadoApellido").value = row.apellido || "";
  document.getElementById("empleadoDni").value = row.dni || "";
  document.getElementById("empleadoLegajo").value = row.legajo || "";

  document.getElementById("btnGuardarEmpleado").style.display = "none";
};

const handleEdit = (row) => {
  editId = row.id;

  const modal = document.getElementById("modalEmpleado");
  modal.style.display = "flex";

  document.getElementById("modalTitleEmpleado").innerText = "Editar Empleado";

  document.getElementById("empleadoNombre").value = row.nombre || "";
  document.getElementById("empleadoApellido").value = row.apellido || "";
  document.getElementById("empleadoDni").value = row.dni || "";
  document.getElementById("empleadoLegajo").value = row.legajo || "";

  document.getElementById("btnGuardarEmpleado").style.display = "block";
};

const handleDelete = (row) => {
  const modal = document.getElementById("confirmEmpleado");

  document.getElementById("confirmTextEmpleado").innerText =
    `¿Seguro que querés eliminar a ${row.nombre} ${row.apellido}?`;

  modal.style.display = "flex";

  document.getElementById("btnConfirmYesEmpleado").onclick = async () => {
    await deleteEmpleadoRequest(getToken(), row.id);
    modal.style.display = "none";
    await cargarEmpleados();
  };

  document.getElementById("btnConfirmNoEmpleado").onclick = () => {
    modal.style.display = "none";
  };
};

// ===============================================================
// 5. LISTADO
// ===============================================================

export const cargarEmpleados = async () => {
  renderModal();

  const res = await getEmpleadosRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "👷 Empleados",
    columns: ["nombre", "apellido", "dni", "legajo"],
    data: data.map(e => ({
      id: e.id,
      nombre: e.nombre || "-",
      apellido: e.apellido || "-",
      dni: e.dni || "-",
      legajo: e.legajo || "-"
    })),
    actions: [
      { name: "view", label: "👁 Ver", handler: handleView },
      { name: "edit", label: "Editar", handler: handleEdit },
      { name: "delete", label: "Eliminar", handler: handleDelete }
    ]
  });

  renderCreateButton();
};

// ===============================================================
// 6. CREATE BUTTON
// ===============================================================

const renderCreateButton = () => {
  if (document.getElementById("btnCreateEmpleado")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateEmpleado";
  btn.innerText = "➕ Crear Empleado";

  btn.onclick = () => {
    editId = null;
    resetForm();

    document.getElementById("modalTitleEmpleado").innerText = "Nuevo Empleado";
    document.getElementById("modalEmpleado").style.display = "flex";
  };

  document.getElementById("tableActions").appendChild(btn);
};