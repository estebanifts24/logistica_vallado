import { getEmpleadosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarEmpleados = async () => {
  const data = await getEmpleadosRequest(getToken());

  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>👷 Empleados</h2>

    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>DNI</th>
          <th>Legajo</th>
        </tr>
      </thead>

      <tbody>
        ${data.data.map(e => `
          <tr>
            <td>${e.nombre}</td>
            <td>${e.apellido}</td>
            <td>${e.dni}</td>
            <td>${e.legajo}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};