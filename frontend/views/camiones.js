// ===============================================================
// 1. IMPORTACIONES
// ===============================================================

// ---------------------------------------------------------------
// 1.1 API Requests
// ---------------------------------------------------------------
import {
  getCamionesRequest,
  createCamionRequest,
  updateCamionRequest,
  deleteCamionRequest
} from "../js/api.js";

// ---------------------------------------------------------------
// 1.2 Auth y UI
// ---------------------------------------------------------------
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";


// ===============================================================
// 2. VARIABLES GLOBALES
// ===============================================================

// ---------------------------------------------------------------
// 2.1 ID de edición actual
// ---------------------------------------------------------------
let editId = null;


// ===============================================================
// 3. MODAL (UI PRINCIPAL)
// ===============================================================

// ---------------------------------------------------------------
// 3.1 Crear e inicializar modal
// ---------------------------------------------------------------
const renderModal = () => {
  if (document.getElementById("modalCamion")) return;

  const modal = document.createElement("div");
  modal.id = "modalCamion";

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

      <h3 id="modalTitleCamion">Camión</h3>

      <div>
        <label>Patente</label>
        <input id="camionPatente" type="text">
      </div>

      <div>
        <label>Modelo</label>
        <input id="camionModelo" type="text">
      </div>

      <p
        id="camionError" style="color:red;margin:0;min-height:20px;"> </p>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarCamion">Guardar</button>
        <button id="btnCerrarCamion">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // -----------------------------------------------------------
  // 3.1.1 Cerrar modal
  // -----------------------------------------------------------
  document.getElementById("btnCerrarCamion").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  // -----------------------------------------------------------
  // 3.1.2 Guardar (crear o editar)
  // -----------------------------------------------------------
  document.getElementById("btnGuardarCamion").onclick = async () => {
    const patente = document.getElementById("camionPatente").value.trim();
    const modelo = document.getElementById("camionModelo").value.trim();

    if (!patente || !modelo) {

    document.getElementById("camionError").innerText =
    "Completá todos los campos";

    return;
    }

document.getElementById("camionError").innerText = "";

    const token = getToken();

    try {
      if (editId) {
        await updateCamionRequest(token, editId, { patente, modelo });
      } else {
        await createCamionRequest(token, { patente, modelo });
      }

      modal.style.display = "none";
      resetForm();
      await cargarCamiones();

    } catch (err) {
     console.error(err);

  showMessageModal(
    "Error",
    err.message || "Error al guardar camión"
  );
    }
  };
};

// -----------------------------------------------------------
// 3.1.3 MODAL CONFIRMACIÓN ELIMINAR
// -----------------------------------------------------------

const confirmModal = document.createElement("div");

confirmModal.id = "confirmCamion";

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

    <p id="confirmTextCamion"></p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="btnConfirmYesCamion">Eliminar</button>
      <button id="btnConfirmNoCamion">Cancelar</button>
    </div>
  </div>
`;

document.body.appendChild(confirmModal);

// ===============================================================
// 4. MODAL MENSAJES
// ===============================================================

// ---------------------------------------------------------------
// 4.1 Modal reutilizable de información
// ---------------------------------------------------------------
const showMessageModal = (title, message) => {

  const modal = document.createElement("div");

  modal.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.6);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:3000;
  `;

  modal.innerHTML = `
    <div style="
      background:#fff;
      padding:20px;
      border-radius:10px;
      width:320px;
      text-align:center;
      display:flex;
      flex-direction:column;
      gap:10px;
    ">
      <h3>${title}</h3>

      <p>${message}</p>

      <button id="closeMessageModal">Aceptar</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeMessageModal").onclick = () => {
    modal.remove();
  };
};


// ===============================================================
// 5. HELPERS
// ===============================================================

// ---------------------------------------------------------------
// 5.1 Reset de formulario
// ---------------------------------------------------------------
const resetForm = () => {
  editId = null;

  document.getElementById("camionPatente").value = "";
  document.getElementById("camionModelo").value = "";

  document.getElementById("camionPatente").disabled = false;
  document.getElementById("camionModelo").disabled = false;
  document.getElementById("camionError").innerText = "";
  document.getElementById("btnGuardarCamion").style.display = "block";
};


// ===============================================================
// 6. ACCIONES (CRUD UI)
// ===============================================================

// ---------------------------------------------------------------
// 6.1 Ver camión
// ---------------------------------------------------------------
const handleView = (row) => {
  editId = null;

  const modal = document.getElementById("modalCamion");
  modal.style.display = "flex";

  document.getElementById("modalTitleCamion").innerText = "Ver Camión";

  document.getElementById("camionPatente").value = row.patente || "";
  document.getElementById("camionModelo").value = row.modelo || "";

  document.getElementById("camionPatente").disabled = true;
  document.getElementById("camionModelo").disabled = true;

  document.getElementById("btnGuardarCamion").style.display = "none";
};


// ---------------------------------------------------------------
// 6.2 Editar camión
// ---------------------------------------------------------------
const handleEdit = (row) => {
  editId = row.id;

  const modal = document.getElementById("modalCamion");
  modal.style.display = "flex";

  document.getElementById("modalTitleCamion").innerText = "Editar Camión";

  document.getElementById("camionPatente").value = row.patente || "";
  document.getElementById("camionModelo").value = row.modelo || "";

  document.getElementById("camionPatente").disabled = false;
  document.getElementById("camionModelo").disabled = false;

  document.getElementById("btnGuardarCamion").style.display = "block";
};


// ---------------------------------------------------------------
// 6.3 Eliminar camión
// ---------------------------------------------------------------
const handleDelete = (row) => {
  const modal = document.getElementById("confirmCamion");

  document.getElementById("confirmTextCamion").innerText =
    `¿Seguro que querés eliminar el camión ${row.patente}?`;

  modal.style.display = "flex";

  const btnYes = document.getElementById("btnConfirmYesCamion");
  const btnNo = document.getElementById("btnConfirmNoCamion");

  btnYes.onclick = async () => {
    try {
      await deleteCamionRequest(getToken(), row.id);

      modal.style.display = "none";

      await cargarCamiones();

    } catch (err) {
      console.error(err);

  showMessageModal(
    "Error",
    err.message || "Error al eliminar camión"
  );
    }
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
  };
};


// ===============================================================
// 7. LISTADO PRINCIPAL
// ===============================================================

// ---------------------------------------------------------------
// 7.1 Cargar camiones
// ---------------------------------------------------------------
export const cargarCamiones = async () => {
  renderModal();

  const res = await getCamionesRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚚 Camiones",
    columns: ["patente", "modelo"],
    data: data.map(c => ({
      id: c.id,
      patente: c.patente || "-",
      modelo: c.modelo || "-"
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
// 8. BOTÓN CREAR
// ===============================================================

// ---------------------------------------------------------------
// 8.1 Render botón "Crear camión"
// ---------------------------------------------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateCamion")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateCamion";
  btn.innerText = "➕ Crear Camión";

  btn.onclick = () => {
    editId = null;

    resetForm();

    document.getElementById("modalTitleCamion").innerText = "Nuevo Camión";
    document.getElementById("modalCamion").style.display = "flex";
  };

  document.getElementById("tableActions").appendChild(btn);
};