import { getEmpleadosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarEmpleados = async () => {
  const res = await getEmpleadosRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "👷 Empleados",
    columns: ["nombre", "apellido", "dni", "legajo"],
    data: data.map(e => ({
      nombre: e.nombre || "-",
      apellido: e.apellido || "-",
      dni: e.dni || "-",
      legajo: e.legajo || "-"
    }))
  });
};