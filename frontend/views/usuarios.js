import { getUsuariosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarUsuarios = async () => {
  const token = getToken();

  const data = await getUsuariosRequest(token);

  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>👤 Usuarios</h2>

    <table class="table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
        </tr>
      </thead>

      <tbody>
        ${data.map(u => `
          <tr>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};