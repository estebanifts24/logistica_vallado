import { getVallasRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarVallas = async () => {
  const data = await getVallasRequest(getToken());

  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>🚧 Vallas</h2>

    <table class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
        </tr>
      </thead>

      <tbody>
        ${data.data.map(v => `
          <tr>
            <td>${v.codigo}</td>
            <td>${v.descripcion}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};