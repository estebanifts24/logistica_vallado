import {
  getUbicacionesRequest,
  createUbicacionRequest,
  updateUbicacionRequest,
  deleteUbicacionRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ------------------------
// LISTAR
// ------------------------
export const cargarUbicaciones = async () => {
  const res = await getUbicacionesRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📍 Ubicaciones",
    columns: ["codigo", "nombre", "tipo"],
    data: data.map(u => ({
      codigo: u.codigo || "-",
      nombre: u.nombre || "-",
      tipo: u.tipo || "-",
      id: u.id
    })),
    actions: [
      {
        name: "edit",
        label: "Editar",
        handler: editarUbicacion
      },
      {
        name: "delete",
        label: "Eliminar",
        handler: eliminarUbicacion
      }
    ]
  });

  renderCreateButton();
};

// ------------------------
// CREAR
// ------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateUbicacion")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateUbicacion";
  btn.innerText = "➕ Crear Ubicación";

  btn.onclick = async () => {
    const codigo = prompt("Código");
    const nombre = prompt("Nombre");
    const tipo = prompt("Tipo");

    if (!codigo || !nombre || !tipo) return;

    await createUbicacionRequest(getToken(), {
      codigo,
      nombre,
      tipo
    });

    cargarUbicaciones();
  };

  document.getElementById("content").prepend(btn);
};

// ------------------------
// EDITAR
// ------------------------
const editarUbicacion = async (row) => {
  editId = row.id;

  const codigo = prompt("Código:", row.codigo);
  const nombre = prompt("Nombre:", row.nombre);
  const tipo = prompt("Tipo:", row.tipo);

  if (!codigo || !nombre || !tipo) return;

  await updateUbicacionRequest(getToken(), editId, {
    codigo,
    nombre,
    tipo
  });

  cargarUbicaciones();
};

// ------------------------
// ELIMINAR
// ------------------------
const eliminarUbicacion = async (row) => {
  if (!confirm("¿Eliminar ubicación?")) return;

  await deleteUbicacionRequest(getToken(), row.id);
  cargarUbicaciones();
};