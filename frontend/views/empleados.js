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

// ---------------------------------------------------------------
// 1.1 Crear modal empleado
// ---------------------------------------------------------------
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
        <input id="empleadoDni" type="text">
      </div>

      <div>
        <label>Legajo</label>
        <input id="empleadoLegajo" type="text">
      </div>

      <div id="errorEmpleado"
        style="
        color:red;
        font-size:14px;
        min-height:18px; ">
      </div>

  <div style="display:flex; gap:10px; margin-top:10px;">

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarEmpleado">Guardar</button>
        <button id="btnCerrarEmpleado">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // -----------------------------------------------------------
  // 1.1.1 Cerrar modal
  // -----------------------------------------------------------
  document.getElementById("btnCerrarEmpleado").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  // -----------------------------------------------------------
  // 1.1.2 Guardar (crear / editar)
  // -----------------------------------------------------------
  document.getElementById("btnGuardarEmpleado").onclick = async () => {
    const nombre = document.getElementById("empleadoNombre").value.trim();
    const apellido = document.getElementById("empleadoApellido").value.trim();
    const dni = document.getElementById("empleadoDni").value.trim();
    const legajo = document.getElementById("empleadoLegajo").value.trim();

    const error = document.getElementById("errorEmpleado");

    if (!nombre || !apellido || !dni || !legajo) {
      error.innerText = "Completá todos los campos";
      return;
      }

error.innerText = "";

    const token = getToken();

    try {
      if (editId) {
        await updateEmpleadoRequest(token, editId, {
          nombre,
          apellido,
          dni,
          legajo
        });
      } else {
        await createEmpleadoRequest(token, {
          nombre,
          apellido,
          dni,
          legajo
        });
      }

      modal.style.display = "none";
      resetForm();
      await cargarEmpleados();

    } catch (err) {
      console.error(err);
      showMessageModal(
      "Error",
      err.message || "Error al guardar empleado"
      );
    }
  };
};


// ===============================================================
// 2. MODAL CONFIRMACIÓN ELIMINAR
// ===============================================================

// ---------------------------------------------------------------
// 2.1 Confirmación eliminar empleado
// ---------------------------------------------------------------
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
  <div style="
    background:#fff;
    padding:20px;
    border-radius:10px;
    width:320px;
    text-align:center;
    display:flex;
    flex-direction:column;
    gap:12px;
  ">
    <h3>Confirmar eliminación</h3>

    <p id="confirmTextEmpleado"></p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="btnConfirmYesEmpleado">Eliminar</button>
      <button id="btnConfirmNoEmpleado">Cancelar</button>
    </div>
  </div>
`;

document.body.appendChild(confirmModal);


// ===============================================================
// 3. HELPERS
// ===============================================================

// ---------------------------------------------------------------
// 3.1 Reset form
// ---------------------------------------------------------------
const resetForm = () => {
  editId = null;

  document.getElementById("empleadoNombre").value = "";
  document.getElementById("empleadoApellido").value = "";
  document.getElementById("empleadoDni").value = "";
  document.getElementById("empleadoLegajo").value = "";

  document.getElementById("empleadoNombre").disabled = false;
  document.getElementById("empleadoApellido").disabled = false;
  document.getElementById("empleadoDni").disabled = false;
  document.getElementById("empleadoLegajo").disabled = false;

  document.getElementById("btnGuardarEmpleado").style.display = "block";
  document.getElementById("errorEmpleado").innerText = "";
};


// ===============================================================
// 4. ACCIONES CRUD
// ===============================================================

// ---------------------------------------------------------------
// 4.1 Ver empleado
// ---------------------------------------------------------------
const handleView = (row) => {
  editId = null;

  const modal = document.getElementById("modalEmpleado");
  modal.style.display = "flex";

  document.getElementById("modalTitleEmpleado").innerText = "Ver Empleado";

  document.getElementById("empleadoNombre").value = row.nombre || "";
  document.getElementById("empleadoApellido").value = row.apellido || "";
  document.getElementById("empleadoDni").value = row.dni || "";
  document.getElementById("empleadoLegajo").value = row.legajo || "";

  document.getElementById("empleadoNombre").disabled = true;
  document.getElementById("empleadoApellido").disabled = true;
  document.getElementById("empleadoDni").disabled = true;
  document.getElementById("empleadoLegajo").disabled = true;

  document.getElementById("btnGuardarEmpleado").style.display = "none";
};


// ---------------------------------------------------------------
// 4.2 Editar empleado
// ---------------------------------------------------------------
const handleEdit = (row) => {
  editId = row.id;

  const modal = document.getElementById("modalEmpleado");
  modal.style.display = "flex";

  document.getElementById("modalTitleEmpleado").innerText = "Editar Empleado";

  document.getElementById("empleadoNombre").value = row.nombre || "";
  document.getElementById("empleadoApellido").value = row.apellido || "";
  document.getElementById("empleadoDni").value = row.dni || "";
  document.getElementById("empleadoLegajo").value = row.legajo || "";

  document.getElementById("empleadoNombre").disabled = false;
  document.getElementById("empleadoApellido").disabled = false;
  document.getElementById("empleadoDni").disabled = false;
  document.getElementById("empleadoLegajo").disabled = false;

  document.getElementById("btnGuardarEmpleado").style.display = "block";
};


// ---------------------------------------------------------------
// 4.3 Eliminar empleado (MODAL CONFIRMACIÓN)
// ---------------------------------------------------------------
const handleDelete = (row) => {
  const modal = document.getElementById("confirmEmpleado");

  document.getElementById("confirmTextEmpleado").innerText =
    `¿Seguro que querés eliminar a ${row.nombre} ${row.apellido}?`;

  modal.style.display = "flex";

  const btnYes = document.getElementById("btnConfirmYesEmpleado");
  const btnNo = document.getElementById("btnConfirmNoEmpleado");

  btnYes.onclick = async () => {
    try {
      await deleteEmpleadoRequest(getToken(), row.id);

      modal.style.display = "none";
      await cargarEmpleados();

    } catch (err) {
      console.error(err);
      showMessageModal(
      "Error",
      err.message || "Error al eliminar empleado"
      );
    }
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
  };
};


// ===============================================================
// 5. LISTADO PRINCIPAL
// ===============================================================

// ---------------------------------------------------------------
// 5.1 Cargar empleados
// ---------------------------------------------------------------
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
// 6. BOTÓN CREAR
// ===============================================================

// ---------------------------------------------------------------
// 6.1 Crear empleado
// ---------------------------------------------------------------
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