import {
  getCamionesRequest,
  createCamionRequest,
  updateCamionRequest,
  deleteCamionRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ------------------------
// LISTAR
// ------------------------
export const cargarCamiones = async () => {
  const res = await getCamionesRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚚 Camiones",
    columns: ["patente", "modelo"],
    data: data.map(c => ({
      id: c.id, // 🔥 IMPORTANTE: ID REAL
      patente: c.patente || "-",
      modelo: c.modelo || "-"
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
          await deleteCamionRequest(getToken(), row.id);
          cargarCamiones();
        }
      }
    ]
  });

  renderCreateButton();
};

// ------------------------
// CREAR BOTÓN
// ------------------------
const renderCreateButton = () => {
  if (document.getElementById("btnCreateCamion")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateCamion";
  btn.innerText = "➕ Crear Camión";

  btn.onclick = async () => {
    const patente = prompt("Patente");
    const modelo = prompt("Modelo");

    if (!patente || !modelo) return;

    await createCamionRequest(getToken(), {
      patente,
      modelo
    });

    cargarCamiones();
  };

  document.getElementById("content").prepend(btn);
};

// ------------------------
// EDITAR
// ------------------------
const openEdit = (row) => {
  editId = row.id;

  const patente = prompt("Patente:", row.patente);
  const modelo = prompt("Modelo:", row.modelo);

  if (!patente || !modelo) return;

  updateCamionRequest(getToken(), editId, {
    patente,
    modelo
  }).then(() => cargarCamiones());
};