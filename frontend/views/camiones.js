import { getCamionesRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarCamiones = async () => {
  const res = await getCamionesRequest(getToken());

  renderTable({
    title: "🚚 Camiones",
    columns: ["Patente", "Modelo"],
    data: res.data.map(c => ({
      patente: c.patente,
      modelo: c.modelo
    }))
  });
};