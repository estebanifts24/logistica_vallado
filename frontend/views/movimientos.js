import { getMovimientosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";

export const cargarMovimientos = async () => {
  try {
    const res = await getMovimientosRequest(getToken());

    const data = res.data || [];

    const content = document.getElementById("content");

    content.innerHTML = `
      <h2>📦 Movimientos</h2>

      <table class="table">
        <thead>
          <tr>
            <th>Valla</th>
            <th>Empleado</th>
            <th>Camión</th>
            <th>Cantidad</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          ${data.map(m => `
            <tr>
              <td>${m.vallaCodigo}</td>
              <td>${m.empleadoLegajo}</td>
              <td>${m.camionPatente || m["camiónPatente"] || "-"}</td>
              <td>${m.cantidad}</td>
              <td>${m.fecha}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

  } catch (err) {
    console.error(err);
    alert("Error cargando movimientos");
  }
};