import {
  getUsuariosRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deleteUsuarioRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ------------------------
// LISTAR
// ------------------------
export const cargarUsuarios = async () => {
  const res = await getUsuariosRequest(getToken());

  // por si backend devuelve array directo o {data}
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
      {
        name: "edit",
        label: "Editar",
        handler: openEdit
      },

      {
        name: "delete",
        label: "Eliminar",
        handler: async (row) => {

          // 🔥 evitar auto eliminación
          const currentUser = JSON.parse(
            localStorage.getItem("user")
          );

          if (row.id === currentUser.id) {
            alert("No podés eliminar tu propio usuario");
            return;
          }

          const ok = confirm(
            `¿Eliminar usuario ${row.username}?`
          );

          if (!ok) return;

          await deleteUsuarioRequest(
            getToken(),
            row.id
          );

          cargarUsuarios();
        }
      }
    ]
  });

  renderCreateButton();
};

// ------------------------
// CREAR USUARIO
// ------------------------
const renderCreateButton = () => {

  if (document.getElementById("btnCreateUsuario")) return;

  const btn = document.createElement("button");

  btn.id = "btnCreateUsuario";
  btn.innerText = "➕ Crear Usuario";

  btn.onclick = async () => {

    const username = prompt("Username");
    if (!username) return;

    const email = prompt("Email");
    if (!email) return;

    const password = prompt("Password");
    if (!password) return;

    const rol = prompt("Rol (admin/user)", "user");

    if (!rol) return;

    await createUsuarioRequest(
      getToken(),
      {
        username,
        email,
        password,
        rol
      }
    );

    cargarUsuarios();
  };

  document.getElementById("content").prepend(btn);
};

// ------------------------
// EDITAR USUARIO
// ------------------------
const openEdit = async (row) => {

  editId = row.id;

  const username = prompt(
    "Username:",
    row.username
  );

  if (!username) return;

  const email = prompt(
    "Email:",
    row.email
  );

  if (!email) return;

  const rol = prompt(
    "Rol:",
    row.rol
  );

  if (!rol) return;

  await updateUsuarioRequest(
    getToken(),
    editId,
    {
      username,
      email,
      rol
    }
  );

  cargarUsuarios();
};