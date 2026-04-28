import { getUsuariosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarUsuarios = async () => {
  const res = await getUsuariosRequest(getToken());
  const data = res.data || [];

  console.log("USUARIOS RESPONSE:", res); // 👈 debug clave

  renderTable({
    title: "👤 Usuarios",
    columns: ["username", "email", "rol"],
    data: data.map(u => ({
      username: u.username || "-",
      email: u.email || "-",
      rol: u.rol || "-"
    }))
  });
};