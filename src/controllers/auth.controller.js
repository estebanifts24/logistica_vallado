// ---------------------------------------------------------------
// Controlador de Auth
// ---------------------------------------------------------------

// Importamos el servicio de autenticación donde está la lógica de login
import * as authService from "../services/auth.service.js";

// ------------------------
// Función de login
// ------------------------
export const login = async (req, res) => {
  try {
    // Extraemos email y password desde el cuerpo de la petición POST
    const { email, password } = req.body;

    // Llamamos al servicio de login que valida credenciales y genera JWT
    const result = await authService.loginUser({ email, password });

    // En modo desarrollo, imprimimos log con la petición recibida y resultado
    if (process.env.NODE_ENV !== "production") {
      console.log("[AuthController.login] Petición POST /api/auth/login recibida");
      console.log("[AuthController.login] Email:", email);
      console.log("[AuthController.login] Resultado:", result);
    }

    // Devolvemos el resultado al cliente (usuario y token JWT)
    return res.json(result);

  } catch (err) {
    // En caso de error, mostramos en consola para debugging
    console.error("[AuthController.login] Error:", err);

    // Determinamos el código HTTP según el tipo de error
    const status = err.code === 400 ? 400 : err.code === 401 ? 401 : 500;

    // Devolvemos al cliente un JSON con el mensaje de error
    return res.status(status).json({ error: err.message });
  }
};

// ------------------------
// Función para actualizar la contraseña de un usuario por admin
// ------------------------
export const updatePasswordAdmin = async (id, newPassword) => {
  // Creamos un hash seguro con bcrypt de la nueva contraseña
  const hashed = await bcrypt.hash(newPassword, 10);

  // Actualizamos la contraseña del usuario en el modelo
  return await model.updateUsuario(id, { password: hashed });
  // Nota: esta función se podría integrar con logs de desarrollo
  // en caso de que la llamemos desde una ruta POST/PUT
};
