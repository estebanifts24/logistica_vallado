import { getUsuariosRequest } from "../js/api.js";
import { getToken } from "../js/auth.js";
import { renderTable } from "../js/ui.js";

export const cargarUsuarios = async () => {
  const data = await getUsuariosRequest(getToken());

  renderTable({
    title: "👤 Usuarios",
    columns: ["Usuario", "Email", "Rol"],
    data: data.map(u => ({
      username: u.username,
      email: u.email,
      rol: u.rol
    }))
  });
};