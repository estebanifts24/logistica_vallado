import { loginRequest } from "./api.js";

export const login = async (email, password) => {

  const data = await loginRequest(email, password);

  // GUARDAR PERSISTENTE
  localStorage.setItem("token", data.token);

  // 🔥 GUARDAR USUARIO
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {

  // 🔥 LIMPIAR SESIÓN COMPLETA
  localStorage.removeItem("token");

  localStorage.removeItem("user");
};