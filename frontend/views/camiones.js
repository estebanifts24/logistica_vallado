import { getCamionesRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarCamiones = async () => {
  const res = await getCamionesRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚚 Camiones",
    columns: ["patente", "modelo"],
    data: data.map(c => ({
      patente: c.patente || "-",
      modelo: c.modelo || "-"
    }))
  });
};