import {
  getUsuariosRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deleteUsuarioRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;


// ===============================================================
// 1. MODAL PRINCIPAL
// ===============================================================

// ---------------------------------------------------------------
// 1.1 Crear modal usuario
// ---------------------------------------------------------------
const renderModal = () => {
  if (document.getElementById("modalUsuario")) return;

  const modal = document.createElement("div");
  modal.id = "modalUsuario";

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

      <h3 id="modalTitleUsuario">Usuario</h3>

      <div>
        <label>Username</label>
        <input id="usuarioUsername" type="text">
      </div>

      <div>
        <label>Email</label>
        <input id="usuarioEmail" type="text">
      </div>

      <div>
        <label>Password</label>
        <input id="usuarioPassword" type="password">
      </div>

      <div>
        <label>Rol</label>
        <input id="usuarioRol" type="text">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="btnGuardarUsuario">Guardar</button>
        <button id="btnCerrarUsuario">Cerrar</button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // -----------------------------------------------------------
  // 1.1.1 Cerrar modal
  // -----------------------------------------------------------
  document.getElementById("btnCerrarUsuario").onclick = () => {
    modal.style.display = "none";
    resetForm();
  };

  // -----------------------------------------------------------
  // 1.1.2 Guardar (crear / editar)
  // -----------------------------------------------------------
  document.getElementById("btnGuardarUsuario").onclick = async () => {
    const username = document.getElementById("usuarioUsername").value.trim();
    const email = document.getElementById("usuarioEmail").value.trim();
    const password = document.getElementById("usuarioPassword").value.trim();
    const rol = document.getElementById("usuarioRol").value.trim();

    if (!username || !email || (!editId && !password) || !rol) {
      alert("Completá todos los campos");
      return;
    }

    const token = getToken();

    try {
      if (editId) {
        await updateUsuarioRequest(token, editId, {
          username,
          email,
          rol
        });
      } else {
        await createUsuarioRequest(token, {
          username,
          email,
          password,
          rol
        });
      }

      modal.style.display = "none";
      resetForm();
      await cargarUsuarios();

    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    }
  };
};


// ===============================================================
// 2. MODAL CONFIRMACIÓN ELIMINAR
// ===============================================================

// ---------------------------------------------------------------
// 2.1 Confirmación eliminar usuario
// ---------------------------------------------------------------
const confirmModal = document.createElement("div");

confirmModal.id = "confirmUsuario";

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

    <p id="confirmTextUsuario"></p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="btnConfirmYesUsuario">Eliminar</button>
      <button id="btnConfirmNoUsuario">Cancelar</button>
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

  document.getElementById("usuarioUsername").value = "";
  document.getElementById("usuarioEmail").value = "";
  document.getElementById("usuarioPassword").value = "";
  document.getElementById("usuarioRol").value = "";

  document.getElementById("usuarioPassword").disabled = false;

  document.getElementById("btnGuardarUsuario").style.display = "block";
};


// ===============================================================
// 4. ACCIONES CRUD
// ===============================================================

// ---------------------------------------------------------------
// 4.1 Editar usuario
// ---------------------------------------------------------------
const handleEdit = (row) => {
  editId = row.id;

  const modal = document.getElementById("modalUsuario");
  modal.style.display = "flex";

  document.getElementById("modalTitleUsuario").innerText = "Editar Usuario";

  document.getElementById("usuarioUsername").value = row.username || "";
  document.getElementById("usuarioEmail").value = row.email || "";
  document.getElementById("usuarioRol").value = row.rol || "";

  // password no se edita directamente
  document.getElementById("usuarioPassword").value = "";
  document.getElementById("usuarioPassword").disabled = true;
};


const handleDelete = (row) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // -----------------------------------------------------------
  // 4.2.1 Bloqueo de auto-eliminación (MODAL en vez de alert)
  // -----------------------------------------------------------
  if (row.id === currentUser.id) {

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
        <h3>⚠️ No permitido</h3>
        <p>No podés eliminar el usuario en el que estás logueado.</p>
        <button id="closeSelfDelete">OK</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeSelfDelete").onclick = () => {
      modal.remove();
    };

    return;
  }

  // -----------------------------------------------------------
  // 4.2.2 Confirmación de eliminación (MODAL)
  // -----------------------------------------------------------
  const modal = document.getElementById("confirmUsuario");

  document.getElementById("confirmTextUsuario").innerText =
    `¿Seguro que querés eliminar el usuario ${row.username}?`;

  modal.style.display = "flex";

  const btnYes = document.getElementById("btnConfirmYesUsuario");
  const btnNo = document.getElementById("btnConfirmNoUsuario");

  btnYes.onclick = async () => {
    try {
      await deleteUsuarioRequest(getToken(), row.id);

      modal.style.display = "none";
      await cargarUsuarios();

    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
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
// 5.1 Cargar usuarios
// ---------------------------------------------------------------
export const cargarUsuarios = async () => {
  renderModal();

  const res = await getUsuariosRequest(getToken());
  const data = res.data || res || [];

  renderTable({
    title: "👤 Usuarios",
    columns: ["username", "email", "rol"],
    data: data.map(u => ({
      id: u.id,
      username: u.username || "-",
      email: u.email || "-",
      rol: u.rol || "-"
    })),
    actions: [
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
// 6.1 Crear usuario
// ---------------------------------------------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateUsuario")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateUsuario";
  btn.innerText = "➕ Crear Usuario";

  btn.onclick = () => {
    editId = null;

    resetForm();

    document.getElementById("modalTitleUsuario").innerText = "Nuevo Usuario";
    document.getElementById("usuarioPassword").disabled = false;

    document.getElementById("modalUsuario").style.display = "flex";
  };
  document.getElementById("tableActions").appendChild(btn);
};