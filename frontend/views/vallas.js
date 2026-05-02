import {
  getVallasRequest,
  createVallaRequest,
  updateVallaRequest,
  deleteVallaRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ------------------------
// LISTAR
// ------------------------
export const cargarVallas = async () => {
  const res = await getVallasRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚧 Vallas",
    columns: ["codigo", "descripcion"],
    data: data.map(v => ({
      codigo: v.codigo || "-",
      descripcion: v.descripcion || "-",
      _id: v.id || v.codigo // 🔥 fallback si no usás id
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
          await deleteVallaRequest(getToken(), row._id);
          cargarVallas();
        }
      }
    ]
  });

  renderCreateButton();
};

// ------------------------
// BOTÓN CREAR
// ------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateValla")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateValla";
  btn.innerText = "➕ Crear Valla";

  btn.onclick = async () => {
    const codigo = prompt("Código");
    const descripcion = prompt("Descripción");

    if (!codigo || !descripcion) return;

    await createVallaRequest(getToken(), {
      codigo,
      descripcion
    });

    cargarVallas();
  };

  document.getElementById("content").prepend(btn);
};

// ------------------------
// EDITAR
// ------------------------
const openEdit = (row) => {
  editId = row._id;

  const codigo = prompt("Código:", row.codigo);
  const descripcion = prompt("Descripción:", row.descripcion);

  if (!codigo || !descripcion) return;

  updateVallaRequest(getToken(), editId, {
    codigo,
    descripcion
  }).then(() => cargarVallas());
};