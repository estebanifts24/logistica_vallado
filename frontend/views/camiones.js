import { getCamionesRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarCamiones = async () => {
  const data = await getCamionesRequest(getToken());

  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Camiones</h2>
    <ul>
      ${data.data.map(c => `
        <li>${c.patente} - ${c.modelo}</li>
      `).join("")}
    </ul>
  `;
};