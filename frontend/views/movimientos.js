import { getMovimientosRequest, createMovimientoRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

const renderForm = () => {
  const content = document.getElementById("content");

  const formHTML = `
    <h3>➕ Crear Movimiento</h3>

    <input id="origen" placeholder="Origen codigo">
    <input id="destino" placeholder="Destino codigo">
    <input id="valla" placeholder="Valla codigo">
    <input id="empleado" placeholder="Empleado legajo">
    <input id="camion" placeholder="Camión patente">
    <input id="cantidad" type="number" placeholder="Cantidad">

    <button id="btnCrearMovimiento">Crear</button>

    <hr>
  `;

  content.innerHTML = formHTML + content.innerHTML;

  document.getElementById("btnCrearMovimiento").onclick = async () => {
    const data = {
      origenCodigo: document.getElementById("origen").value,
      destinoCodigo: document.getElementById("destino").value,
      tipoVallaCodigo: document.getElementById("valla").value,
      empleadoLegajo: document.getElementById("empleado").value,
      camionPatente: document.getElementById("camion").value,
      cantidad: Number(document.getElementById("cantidad").value)
    };

    await createMovimientoRequest(getToken(), data);

    cargarMovimientos(); // recarga tabla
  };
};

// ------------------------
// LISTADO
// ------------------------
export const cargarMovimientos = async () => {
  const res = await getMovimientosRequest(getToken());
  const data = res.data || [];

  renderTable({
    title: "📦 Movimientos",
    columns: ["valla", "empleado", "camion", "cantidad", "fecha"],
    data: data.map(m => ({
      valla: m.vallaCodigo || "-",
      empleado: m.empleadoLegajo || "-",
      camion: m.camionPatente || m["camiónPatente"] || "-",
      cantidad: m.cantidad ?? 0,
      fecha: m.fecha || "-"
    }))
  });

  renderForm();
};