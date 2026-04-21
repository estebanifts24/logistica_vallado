const BASE_URL = "http://localhost:3000";

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

export const getUsuariosRequest = async (token) => {
  const res = await fetch(`${BASE_URL}/api/usuarios`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};

//camiones

export const getCamionesRequest = async (token) => {
  const res = await fetch("http://localhost:3000/api/camiones", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
};

//VALLAS

export const getVallasRequest = async (token) => {
  const res = await fetch("http://localhost:3000/api/vallas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
};

//EMPLEADOS

export const getEmpleadosRequest = async (token) => {
  const res = await fetch("http://localhost:3000/api/empleados", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
};

//MOVIMIENTOS

export const getMovimientosRequest = async (token) => {
  const res = await fetch("http://localhost:3000/api/movimientos", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};