import {
  getVallasRequest,
  createVallaRequest,
  updateVallaRequest,
  deleteVallaRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

/* =========================================================
   1. MODAL PRINCIPAL
========================================================= */

const renderModal = () => {
  if (document.getElementById("modalValla")) return;

  const modal = document.createElement("div");
  modal.id = "modalValla";

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

      <h3 id="modalTitleValla">Valla</h3>

      <div>
        <label>Código</label>
        <input id="vallaCodigo" type="text">
      </div>

      <div>
        <label>Descripción</label>
        <input id="vallaDescripcion" type="text">
      </div>

      <div id="errorValla" style=" color:red;font-size:14px;min-height:18px;">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarValla">Guardar</button>
        <button id="btnCerrarValla">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btnCerrarValla").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  document.getElementById("btnGuardarValla").onclick = async () => {
    const codigo = document.getElementById("vallaCodigo").value.trim();
    const descripcion = document.getElementById("vallaDescripcion").value.trim();

    const error = document.getElementById("errorValla");

  if (!codigo || !descripcion) {
      error.innerText = "Completá todos los campos";
      return;
  }   

  error.innerText = "";

    const token = getToken();

    try {
      if (editId) {
        await updateVallaRequest(token, editId, { codigo, descripcion });
      } else {
        await createVallaRequest(token, { codigo, descripcion });
      }

      modal.style.display = "none";
      resetForm();

      await cargarVallas();

    } catch (err) {
      console.error(err);
      showMessageModal(
      "Error",
       err.message || "Error al guardar valla"
      );
    }
  };
};


/* =========================================================
   2. MODAL CONFIRMACIÓN ELIMINAR
========================================================= */

const confirmModal = document.createElement("div");

confirmModal.id = "confirmValla";

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

    <p id="confirmTextValla"></p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="btnConfirmYesValla">Eliminar</button>
      <button id="btnConfirmNoValla">Cancelar</button>
    </div>
  </div>
`;

document.body.appendChild(confirmModal);


/* =========================================================
   3. HELPERS
========================================================= */

const resetForm = () => {
  editId = null;

  document.getElementById("vallaCodigo").value = "";
  document.getElementById("vallaDescripcion").value = "";

  document.getElementById("vallaCodigo").disabled = false;
  document.getElementById("vallaDescripcion").disabled = false;

  document.getElementById("btnGuardarValla").style.display = "block";
  document.getElementById("errorValla").innerText = "";
};


/* =========================================================
   4. ACCIONES CRUD
========================================================= */

const handleView = (row) => {
  editId = null;

  const modal = document.getElementById("modalValla");
  modal.style.display = "flex";

  document.getElementById("modalTitleValla").innerText = "Ver Valla";

  document.getElementById("vallaCodigo").value = row.codigo || "";
  document.getElementById("vallaDescripcion").value = row.descripcion || "";

  document.getElementById("vallaCodigo").disabled = true;
  document.getElementById("vallaDescripcion").disabled = true;

  document.getElementById("btnGuardarValla").style.display = "none";
};


const handleEdit = (row) => {
  editId = row._id;

  const modal = document.getElementById("modalValla");
  modal.style.display = "flex";

  document.getElementById("modalTitleValla").innerText = "Editar Valla";

  document.getElementById("vallaCodigo").value = row.codigo || "";
  document.getElementById("vallaDescripcion").value = row.descripcion || "";

  document.getElementById("vallaCodigo").disabled = false;
  document.getElementById("vallaDescripcion").disabled = false;

  document.getElementById("btnGuardarValla").style.display = "block";
};


const handleDelete = (row) => {
  const modal = document.getElementById("confirmValla");

  document.getElementById("confirmTextValla").innerText =
    `¿Seguro que querés eliminar la valla ${row.codigo}?`;

  modal.style.display = "flex";

  const btnYes = document.getElementById("btnConfirmYesValla");
  const btnNo = document.getElementById("btnConfirmNoValla");

  btnYes.onclick = async () => {
    try {
      await deleteVallaRequest(getToken(), row._id);

      modal.style.display = "none";

      await cargarVallas();

    } catch (err) {
      console.error(err);
      showMessageModal(
      "Error",
      err.message || "Error al eliminar valla"
      );
    }
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
  };
};


/* =========================================================
   5. LISTADO PRINCIPAL
========================================================= */

export const cargarVallas = async () => {
  renderModal();

  const res = await getVallasRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚧 Vallas",
    columns: ["codigo", "descripcion"],
    data: data.map(v => ({
      _id: v.id,
      codigo: v.codigo || "-",
      descripcion: v.descripcion || "-"
    })),
    actions: [
      { name: "view", label: "👁 Ver", handler: handleView },
      { name: "edit", label: "Editar", handler: handleEdit },
      { name: "delete", label: "Eliminar", handler: handleDelete }
    ]
  });

  renderCreateButton();
};


/* =========================================================
   6. BOTÓN CREAR
========================================================= */

const renderCreateButton = () => {
  if (document.getElementById("btnCreateValla")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateValla";
  btn.innerText = "➕ Crear Valla";

  btn.onclick = () => {
    editId = null;

    resetForm();

    document.getElementById("modalTitleValla").innerText = "Nueva Valla";
    document.getElementById("modalValla").style.display = "flex";
  };

  document.getElementById("tableActions").appendChild(btn);
};