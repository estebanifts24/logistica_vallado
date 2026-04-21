import { login } from "./auth.js";

export const initLogin = () => {
  document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await login(email, password);

    if (res.token) {
      alert("Login OK");

      document.getElementById("loginView").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      alert("Error login");
    }
  });
};

document.querySelector(".logout").addEventListener("click", () => {
  localStorage.removeItem("token");

  // volver a login
  document.getElementById("app").style.display = "none";
  document.getElementById("loginView").style.display = "flex";

  // limpiar contenido
  document.getElementById("content").innerHTML =
    "<p>Seleccioná una opción del menú</p>";
});