import {
  getEmpleadosRequest,
  createEmpleadoRequest,
  updateEmpleadoRequest,
  deleteEmpleadoRequest
} from "../js/api.js";

import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

let editId = null;

// ------------------------
// LISTAR
// ------------------------
export const cargarEmpleados = async () => {
  const res = await getEmpleadosRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "👷 Empleados",
    columns: ["nombre", "apellido", "dni", "legajo"],
    data: data.map(e => ({
      id: e.id, // ✅ CLAVE: ID UNIFICADO
      nombre: e.nombre || "-",
      apellido: e.apellido || "-",
      dni: e.dni || "-",
      legajo: e.legajo || "-"
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
          await deleteEmpleadoRequest(getToken(), row.id); // ✅ FIX
          cargarEmpleados();
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
  if (document.getElementById("btnCreateEmpleado")) return;

  const btn = document.createElement("button");
  btn.id = "btnCreateEmpleado";
  btn.innerText = "➕ Crear Empleado";

  btn.onclick = async () => {
    const nombre = prompt("Nombre");
    const apellido = prompt("Apellido");
    const dni = prompt("DNI");
    const legajo = prompt("Legajo");

    if (!nombre || !apellido || !dni || !legajo) return;

    await createEmpleadoRequest(getToken(), {
      nombre,
      apellido,
      dni,
      legajo
    });

    cargarEmpleados();
  };

  document.getElementById("content").prepend(btn);
};

// ------------------------
// EDITAR
// ------------------------
const openEdit = (row) => {
  editId = row.id; // ✅ FIX

  const nombre = prompt("Nombre:", row.nombre);
  const apellido = prompt("Apellido:", row.apellido);
  const dni = prompt("DNI:", row.dni);
  const legajo = prompt("Legajo:", row.legajo);

  if (!nombre || !apellido || !dni || !legajo) return;

  updateEmpleadoRequest(getToken(), editId, {
    nombre,
    apellido,
    dni,
    legajo
  }).then(() => cargarEmpleados());
};