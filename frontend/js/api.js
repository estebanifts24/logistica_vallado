const BASE_URL = "http://localhost:3000";

// ------------------------
// AUTH
// ------------------------
export const loginRequest = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

// ------------------------
// USUARIOS
// ------------------------
export const getUsuariosRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// CAMIONES
// ------------------------
export const getCamionesRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/camiones`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// VALLAS
// ------------------------
export const getVallasRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/vallas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// EMPLEADOS
// ------------------------
export const getEmpleadosRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/empleados`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// MOVIMIENTOS
// ------------------------
export const getMovimientosRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/movimientos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// STOCK (FALTABA EN FRONT)
// ------------------------
export const getStockRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/stock`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// ------------------------
// UBICACIONES (FALTABA EN FRONT)
// ------------------------
export const getUbicacionesRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/ubicaciones`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};


//--------------------------
// AGREGAR  CREATE MOVIMIENTO
//--------------------------

export const createMovimientoRequest = async (token, data) => {
  const res = await fetch(`${BASE_URL}/api/movimientos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};