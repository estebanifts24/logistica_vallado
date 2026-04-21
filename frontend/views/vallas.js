import { getVallasRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarVallas = async () => {
  const res = await getVallasRequest(getToken());

  renderTable({
    title: "🚧 Vallas",
    columns: ["Código", "Descripción"],
    data: res.data.map(v => ({
      codigo: v.codigo,
      descripcion: v.descripcion
    }))
  });
};