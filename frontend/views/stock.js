import { getStockRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarStock = async () => {
  const res = await getStockRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📦 Stock",
    columns: ["codigoUbicacion", "codigoValla", "cantidad"],
    data: data.map(s => ({
      codigoUbicacion: s.codigoUbicacion || "-",
      codigoValla: s.codigoValla || "-",
      cantidad: s.cantidad ?? 0
    }))
  });
};