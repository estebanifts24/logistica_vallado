import { loginRequest } from "./api.js";

export const login = async (email, password) => {
  const data = await loginRequest(email, password);

  // GUARDAR PERSISTENTE
  localStorage.setItem("token", data.token);

  return data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};