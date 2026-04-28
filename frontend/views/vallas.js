import { getVallasRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarVallas = async () => {
  const res = await getVallasRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "🚧 Vallas",
    columns: ["codigo", "descripcion"],
    data: data.map(v => ({
      codigo: v.codigo || "-",
      descripcion: v.descripcion || "-"
    }))
  });
};