import { getVallasRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarVallas = async () => {
  const data = await getVallasRequest(getToken());

  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Vallas</h2>
    <ul>
      ${data.data.map(v => `<li>${v.codigo} - ${v.descripcion}</li>`).join("")}
    </ul>
  `;
};