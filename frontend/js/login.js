import { login } from "./auth.js";

export const initLogin = () => {
  document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await login(email, password);

    if (res.token) {
    

    // guardamos sesión completa
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    location.reload();
    } else {
      alert("Error login");
    }
  });

  // 🔥 mover logout DENTRO del initLogin (CLAVE)
  const logoutBtn = document.querySelector(".logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");

      document.getElementById("app").style.display = "none";
      document.getElementById("loginView").style.display = "flex";

      document.getElementById("content").innerHTML =
        "<p>Seleccioná una opción del menú</p>";
    });
  }
};