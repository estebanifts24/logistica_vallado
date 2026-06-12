
import { login } from "./auth.js";

/* =========================================================
   SECCIÓN 1 - INICIALIZACIÓN DEL MÓDULO DE AUTENTICACIÓN
   ========================================================= */

   export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  location.reload();

};

export const initLogin = () => {

  /* ---------------------------------------------------------
     SUBSECCIÓN 1.1 - CONFIGURACIÓN DEL EVENTO DE LOGIN
     --------------------------------------------------------- */

  document.getElementById("btnLogin").addEventListener("click", async () => {

    /* -------------------------------------------------------
       SUBSECCIÓN 1.1.1 - OBTENCIÓN DE CREDENCIALES
       ------------------------------------------------------- */

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    
       /* -------------------------------------------------------
   SUBSECCIÓN 1.1.2 - VALIDACIÓN DE CAMPOS
   ------------------------------------------------------- */

let errorDiv = document.getElementById("errorLogin");

if (!errorDiv) {

  errorDiv = document.createElement("div");

  errorDiv.id = "errorLogin";

  errorDiv.style.color = "red";
  errorDiv.style.fontWeight = "bold";
  errorDiv.style.marginTop = "10px";

  
  document
    .getElementById("btnLogin")
    .after(errorDiv);
}

errorDiv.innerText = "";

if (!email || !password) {

  errorDiv.innerText =
    "Completá email y contraseña";

  return;
}
/* -------------------------------------------------------
   SUBSECCIÓN 1.1.3 - SOLICITUD DE AUTENTICACIÓN
   ------------------------------------------------------- */
    try {

  const res = await login(email, password);

  errorDiv.innerText = "";

  if (res.token) {

    localStorage.setItem("token", res.token);

    localStorage.setItem(
      "user",
      JSON.stringify(res.user)
    );

    location.reload();
  }

} catch (err) {

  errorDiv.innerText =
    err.message || "Error al iniciar sesión";

  return;
}
    
 });  

 /* -------------------------------------------------------
   SUBSECCIÓN 1.1.4 - LOGIN CON TECLA ENTER
   ------------------------------------------------------- */

document.getElementById("password").addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    document.getElementById("btnLogin").click();

  }

});

  /* =========================================================
     SECCIÓN 2 - CONFIGURACIÓN DEL CIERRE DE SESIÓN
     ========================================================= */

  const logoutBtn = document.querySelector(".logout");

  /* ---------------------------------------------------------
     SUBSECCIÓN 2.1 - VALIDACIÓN DEL BOTÓN LOGOUT
     --------------------------------------------------------- */

  if (logoutBtn) {

    /* -------------------------------------------------------
       SUBSECCIÓN 2.2 - EVENTO DE CIERRE DE SESIÓN
       ------------------------------------------------------- */

      logoutBtn.addEventListener("click", logout);
       
  }
};

