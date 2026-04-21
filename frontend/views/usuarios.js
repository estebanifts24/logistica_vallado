import { getUsuariosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarUsuarios = async () => {
  const token = getToken();

  const data = await getUsuariosRequest(token);

  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Usuarios</h2>
    <ul>
      ${data.map(u => `
        <li>${u.username} - ${u.email} (${u.rol})</li>
      `).join("")}
    </ul>
  `;
};