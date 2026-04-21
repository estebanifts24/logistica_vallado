import { getEmpleadosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarEmpleados = async () => {
  const res = await getEmpleadosRequest(getToken());

  renderTable({
    title: "👷 Empleados",
    columns: ["Nombre", "Apellido", "DNI", "Legajo"],
    data: res.data.map(e => ({
      nombre: e.nombre,
      apellido: e.apellido,
      dni: e.dni,
      legajo: e.legajo
    }))
  });
};