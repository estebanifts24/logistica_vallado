import {
  getVallasRequest,
  createVallaRequest,
  updateVallaRequest,
  deleteVallaRequest,
  uploadVallaImageRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;


//SUBIR IMAGEN




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

      <div>
        <label>Tipo</label>
        <input id="vallaTipo" type="text">
      </div>

      <div>
        <label>Imagen</label>
        <input id="vallaImagen" type="file" accept="image/*">
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
    const tipo = document.getElementById("vallaTipo").value.trim();
    const file = document.getElementById("vallaImagen").files[0];  
    const error = document.getElementById("errorValla");

  if (!codigo || !descripcion || !tipo) {
      error.innerText = "Completá todos los campos";
      return;
  }   

  error.innerText = "";

    const token = getToken();
    //
    try {
  let imageUrl = null;

  console.log("LOG 1 -> entró al try");

  if (file) {
    console.log("LOG 2 -> antes upload");

    const uploadRes = await uploadVallaImageRequest(token, file, codigo);

    console.log("LOG 3 JSON:", JSON.stringify(uploadRes, null, 2));

    imageUrl = uploadRes.url;

    console.log("LOG 4 -> imageUrl:", imageUrl);
  }

  const payload = {
    codigo,
    descripcion,
    tipo,
    imagen: imageUrl
  };

  console.log("LOG 5 -> payload:", payload);

  if (editId) {
    console.log("LOG 6 -> update");
    await updateVallaRequest(token, editId, payload);
  } else {
    console.log("LOG 6 -> create");
    debugger;
    await createVallaRequest(token, payload);
    console.log("LOG 6 bis-> create");
    debugger;
  }

  console.log("LOG 7 -> create/update OK");

  modal.style.display = "none";
  resetForm();

  await cargarVallas();

} catch (err) {
  console.error("CATCH REAL:", err);
  console.error("MESSAGE:", err.message);

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
  document.getElementById("vallaTipo").value = "";
  document.getElementById("vallaImagen").value = "";

  document.getElementById("vallaCodigo").disabled = false;
  document.getElementById("vallaDescripcion").disabled = false;
   document.getElementById("vallaTipo").disabled = false;

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
  document.getElementById("vallaTipo").value = row.tipo || "";
  

  document.getElementById("vallaCodigo").disabled = true;
  document.getElementById("vallaDescripcion").disabled = true;
  document.getElementById("vallaTipo").disabled = true;
  document.getElementById("nombreImagenEsperada").innerText =
  `${row.codigo}.jpg`;
  document.getElementById("btnGuardarValla").style.display = "none";
};


const handleEdit = (row) => {
  editId = row._id;

  const modal = document.getElementById("modalValla");
  modal.style.display = "flex";

  document.getElementById("modalTitleValla").innerText = "Editar Valla";

  document.getElementById("vallaCodigo").value = row.codigo || "";
  document.getElementById("vallaDescripcion").value = row.descripcion || "";
  document.getElementById("vallaTipo").value = row.tipo || "";
 

  document.getElementById("vallaCodigo").disabled = false;
  document.getElementById("vallaDescripcion").disabled = false;
  document.getElementById("vallaTipo").disabled = false;
  document.getElementById("nombreImagenEsperada").innerText =
  `${row.codigo}.jpg`;

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
    columns: ["codigo", "descripcion", "tipo"],
    data: data.map(v => ({
      _id: v.id,
      codigo: v.codigo || "-",
      descripcion: v.descripcion || "-",
      tipo: v.tipo || "-",
      
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

//showMessageModal error

/* =========================================================
   MODAL MENSAJE ERROR / INFO
========================================================= */
const showMessageModal = (title, message) => {
  let modal = document.getElementById("messageModalValla");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "messageModalValla";

    modal.style = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
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
        min-width: 320px;
        max-width: 500px;
      ">
        <h3 id="messageModalTitle"></h3>
        <p id="messageModalText"></p>
        <button id="messageModalClose">Cerrar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("messageModalClose").onclick = () => {
      modal.remove();
    };
  }

  document.getElementById("messageModalTitle").innerText = title;
  document.getElementById("messageModalText").innerText = message;
};