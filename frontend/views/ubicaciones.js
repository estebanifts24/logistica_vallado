import {
  getUbicacionesRequest,
  createUbicacionRequest,
  updateUbicacionRequest,
  deleteUbicacionRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;


// ===============================================================
// 1. MODAL PRINCIPAL
// ===============================================================

// ---------------------------------------------------------------
// 1.1 Crear modal ubicación
// ---------------------------------------------------------------
const renderModal = () => {
  if (document.getElementById("modalUbicacion")) return;

  const modal = document.createElement("div");
  modal.id = "modalUbicacion";

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

      <h3 id="modalTitleUbicacion">Ubicación</h3>

      <div>
        <label>Código</label>
        <input id="ubicacionCodigo" type="text">
      </div>

      <div>
        <label>Nombre</label>
        <input id="ubicacionNombre" type="text">
      </div>

      <div>
        <label>Tipo</label>
        <input id="ubicacionTipo" type="text">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarUbicacion">Guardar</button>
        <button id="btnCerrarUbicacion">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // -----------------------------------------------------------
  // 1.1.1 Cerrar modal
  // -----------------------------------------------------------
  document.getElementById("btnCerrarUbicacion").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  // -----------------------------------------------------------
  // 1.1.2 Guardar (crear / editar)
  // -----------------------------------------------------------
  document.getElementById("btnGuardarUbicacion").onclick = async () => {
    const codigo = document.getElementById("ubicacionCodigo").value.trim();
    const nombre = document.getElementById("ubicacionNombre").value.trim();
    const tipo = document.getElementById("ubicacionTipo").value.trim();

    if (!codigo || !nombre || !tipo) {

  let errorDiv = document.getElementById("errorUbicacion");

  if (!errorDiv) {
    errorDiv = document.createElement("div");

    errorDiv.id = "errorUbicacion";

    errorDiv.style.color = "red";
    errorDiv.style.fontWeight = "bold";
    errorDiv.style.marginTop = "10px";

    document
      .getElementById("btnGuardarUbicacion")
      .parentElement
      .before(errorDiv);
  }

  errorDiv.innerText = "Completá todos los campos";

  return;
}

    const token = getToken();

    try {
      if (editId) {
        await updateUbicacionRequest(token, editId, {
          codigo,
          nombre,
          tipo
        });
      } else {
        await createUbicacionRequest(token, {
          codigo,
          nombre,
          tipo
        });
      }

      const errorDiv = document.getElementById("errorUbicacion");

if (errorDiv) {
  errorDiv.innerText = "";
}

      modal.style.display = "none";
      resetForm();
      await cargarUbicaciones();

    } catch (err) {
      console.error(err);
      alert("Error al guardar ubicación");
    }
  };
};


// ===============================================================
// 2. MODAL CONFIRMACIÓN ELIMINAR
// ===============================================================

// ---------------------------------------------------------------
// 2.1 Confirmación eliminar ubicación
// ---------------------------------------------------------------
const confirmModal = document.createElement("div");

confirmModal.id = "confirmUbicacion";

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

    <p id="confirmTextUbicacion"></p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="btnConfirmYesUbicacion">Eliminar</button>
      <button id="btnConfirmNoUbicacion">Cancelar</button>
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

  document.getElementById("ubicacionCodigo").value = "";
  document.getElementById("ubicacionNombre").value = "";
  document.getElementById("ubicacionTipo").value = "";

  document.getElementById("ubicacionCodigo").disabled = false;
  document.getElementById("ubicacionNombre").disabled = false;
  document.getElementById("ubicacionTipo").disabled = false;

  document.getElementById("btnGuardarUbicacion").style.display = "block";
  const errorDiv = document.getElementById("errorUbicacion");

if (errorDiv) {
  errorDiv.innerText = "";
}
};


// ===============================================================
// 4. ACCIONES CRUD
// ===============================================================

// ---------------------------------------------------------------
// 4.1 Ver ubicación
// ---------------------------------------------------------------
const handleView = (row) => {
  editId = null;

  const modal = document.getElementById("modalUbicacion");
  modal.style.display = "flex";

  document.getElementById("modalTitleUbicacion").innerText = "Ver Ubicación";

  document.getElementById("ubicacionCodigo").value = row.codigo || "";
  document.getElementById("ubicacionNombre").value = row.nombre || "";
  document.getElementById("ubicacionTipo").value = row.tipo || "";

  document.getElementById("ubicacionCodigo").disabled = true;
  document.getElementById("ubicacionNombre").disabled = true;
  document.getElementById("ubicacionTipo").disabled = true;

  document.getElementById("btnGuardarUbicacion").style.display = "none";
};


// ---------------------------------------------------------------
// 4.2 Editar ubicación
// ---------------------------------------------------------------
const handleEdit = (row) => {
  editId = row.id;

  const modal = document.getElementById("modalUbicacion");
  modal.style.display = "flex";

  document.getElementById("modalTitleUbicacion").innerText = "Editar Ubicación";

  document.getElementById("ubicacionCodigo").value = row.codigo || "";
  document.getElementById("ubicacionNombre").value = row.nombre || "";
  document.getElementById("ubicacionTipo").value = row.tipo || "";

  document.getElementById("ubicacionCodigo").disabled = false;
  document.getElementById("ubicacionNombre").disabled = false;
  document.getElementById("ubicacionTipo").disabled = false;

  document.getElementById("btnGuardarUbicacion").style.display = "block";
};


// ---------------------------------------------------------------
// 4.3 Eliminar ubicación (MODAL CONFIRMACIÓN)
// ---------------------------------------------------------------
const handleDelete = (row) => {
  const modal = document.getElementById("confirmUbicacion");

  document.getElementById("confirmTextUbicacion").innerText =
    `¿Seguro que querés eliminar la ubicación ${row.codigo}?`;

  modal.style.display = "flex";

  const btnYes = document.getElementById("btnConfirmYesUbicacion");
  const btnNo = document.getElementById("btnConfirmNoUbicacion");

  btnYes.onclick = async () => {
    try {
      await deleteUbicacionRequest(getToken(), row.id);

      modal.style.display = "none";
      await cargarUbicaciones();

    } catch (err) {
      console.error(err);
      showMessageModal("Error al eliminar ubicación");;
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
// 5.1 Cargar ubicaciones
// ---------------------------------------------------------------
export const cargarUbicaciones = async () => {
  renderModal();

  const res = await getUbicacionesRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📍 Ubicaciones",
    columns: ["codigo", "nombre", "tipo"],
    data: data.map(u => ({
      id: u.id,
      codigo: u.codigo || "-",
      nombre: u.nombre || "-",
      tipo: u.tipo || "-"
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
// 6.1 Crear ubicación
// ---------------------------------------------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateUbicacion")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateUbicacion";
  btn.innerText = "➕ Crear Ubicación";

  btn.onclick = () => {
    editId = null;

    resetForm();

    document.getElementById("modalTitleUbicacion").innerText = "Nueva Ubicación";
    document.getElementById("modalUbicacion").style.display = "flex";
  };

  document.getElementById("tableActions").appendChild(btn);
};