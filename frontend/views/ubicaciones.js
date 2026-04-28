import { getUbicacionesRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarUbicaciones = async () => {
  const res = await getUbicacionesRequest(getToken());
  console.log("UBICACIONES RESPONSE: ",res)
  const data = res.data || [];

  renderTable({
    title: "📍 Ubicaciones",
    columns: ["codigo", "nombre","tipo"],
    data: data.map(u => ({
      codigo: u.codigo || "-",
      nombre: u.nombre || "-",
      tipo: u.tipo || "-"
    }))
  });
};