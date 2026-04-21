import { getMovimientosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarMovimientos = async () => {
  const res = await getMovimientosRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📦 Movimientos",
    columns: ["Valla", "Empleado", "Camión", "Cantidad", "Fecha"],
    data: data.map(m => ({
      valla: m.vallaCodigo,
      empleado: m.empleadoLegajo,
      camion: m.camionPatente || m["camiónPatente"] || "-",
      cantidad: m.cantidad,
      fecha: m.fecha
    }))
  });
};