import { getEmpleadosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarEmpleados = async () => {
  const data = await getEmpleadosRequest(getToken());

  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Empleados</h2>
    <ul>
      ${data.data.map(e => `
        <li>${e.nombre} ${e.apellido} - DNI: ${e.dni} - Legajo: ${e.legajo}</li>
      `).join("")}
    </ul>
  `;
};