import { getMovimientosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarMovimientos = async () => {
  try {
    const res = await getMovimientosRequest(getToken());

    const data = res.data || [];

    const app = document.getElementById("app");

    app.innerHTML = `
      <h2>Movimientos</h2>

      <ul>
        ${data.map(m => `
          <li>
            📦 Valla: ${m.vallaCodigo} |
            👷 Empleado: ${m.empleadoLegajo} |
            🚚 Camión: ${m.camionPatente || m["camiónPatente"] || "-"} |
            🔢 Cantidad: ${m.cantidad} |
            📅 Fecha: ${m.fecha}
          </li>
        `).join("")}
      </ul>
    `;

  } catch (err) {
    console.error(err);
    alert("Error cargando movimientos");
  }
};