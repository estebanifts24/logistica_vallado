const BASE_URL = "http://localhost:3000";

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, options);

  // 🔥 CAMBIO CLAVE: leer como texto primero
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  // 🔥 LOG REAL DEL ERROR (IMPORTANTE PARA DEBUG)
  console.log("➡️ API RESPONSE:", {
    url,
    status: res.status,
    data
  });

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      `Error HTTP ${res.status}`;

    throw new Error(message);
  }

  return data;
};

// ======================================================
// AUTH
// ======================================================
export const loginRequest = (email, password) =>
  request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

// ======================================================
// USUARIOS (CRUD COMPLETO)  ← SOLO UNA VEZ
// ======================================================
export const getUsuariosRequest = (token) =>
  request("/api/usuarios", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createUsuarioRequest = (token, data) =>
  request("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateUsuarioRequest = (token, id, data) =>
  request(`/api/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteUsuarioRequest = (token, id) =>
  request(`/api/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// ======================================================
// CAMIONES
// ======================================================
export const getCamionesRequest = (token) =>
  request("/api/camiones", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createCamionRequest = (token, data) =>
  request("/api/camiones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateCamionRequest = (token, id, data) =>
  request(`/api/camiones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteCamionRequest = (token, id) =>
  request(`/api/camiones/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// ======================================================
// VALLAS
// ======================================================
export const getVallasRequest = (token) =>
  request("/api/vallas", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createVallaRequest = (token, data) =>
  request("/api/vallas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateVallaRequest = (token, id, data) =>
  request(`/api/vallas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteVallaRequest = (token, id) =>
  request(`/api/vallas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

// ======================================================
// EMPLEADOS
// ======================================================
export const getEmpleadosRequest = (token) =>
  request("/api/empleados", {
    headers: { Authorization: `Bearer ${token}` }
  });

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

// ======================================================
// MOVIMIENTOS
// ======================================================
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

// ======================================================
// STOCK
// ======================================================
export const getStockRequest = (token) =>
  request("/api/stock", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ======================================================
// UBICACIONES
// ======================================================
export const getUbicacionesRequest = (token) =>
  request("/api/ubicaciones", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createUbicacionRequest = (token, data) =>
  request("/api/ubicaciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const updateUbicacionRequest = (token, id, data) =>
  request(`/api/ubicaciones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

export const deleteUbicacionRequest = (token, id) =>
  request(`/api/ubicaciones/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });