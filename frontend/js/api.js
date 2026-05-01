const BASE_URL = "http://localhost:3000";

// ------------------------
// helper base request
// ------------------------
const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "Error en request");
  }

  return data;
};

// ------------------------
// AUTH
// ------------------------
export const loginRequest = (email, password) =>
  request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

// ------------------------
// USUARIOS
// ------------------------
export const getUsuariosRequest = (token) =>
  request("/api/usuarios", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ------------------------
// CAMIONES
// ------------------------
export const getCamionesRequest = (token) =>
  request("/api/camiones", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ------------------------
// VALLAS
// ------------------------
export const getVallasRequest = (token) =>
  request("/api/vallas", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ------------------------
// EMPLEADOS
// ------------------------
export const getEmpleadosRequest = (token) =>
  request("/api/empleados", {
    headers: { Authorization: `Bearer ${token}` }
  });

// 🟢 ESTO TE FALTABA (CREAR / EDITAR / BORRAR EMPLEADOS)
export const createEmpleadoRequest = (token, data) =>
  request("/api/empleados", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateEmpleadoRequest = (token, id, data) =>
  request(`/api/empleados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteEmpleadoRequest = (token, id) =>
  request(`/api/empleados/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// ------------------------
// MOVIMIENTOS
// ------------------------
export const getMovimientosRequest = (token) =>
  request("/api/movimientos", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createMovimientoRequest = (token, data) =>
  request("/api/movimientos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateMovimientoRequest = (token, id, data) =>
  request(`/api/movimientos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteMovimientoRequest = (token, id) =>
  request(`/api/movimientos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// ------------------------
// STOCK
// ------------------------
export const getStockRequest = (token) =>
  request("/api/stock", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ------------------------
// UBICACIONES
// ------------------------
export const getUbicacionesRequest = (token) =>
  request("/api/ubicaciones", {
    headers: { Authorization: `Bearer ${token}` }
  });