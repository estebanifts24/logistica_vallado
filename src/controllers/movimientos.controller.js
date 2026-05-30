/* ===============================================================
   1. CONTROLLER DE MOVIMIENTOS
   =============================================================== */

/*
   1.1 Responsabilidad general:
   - Este controller recibe requests HTTP
   - Llama a los services (lógica de negocio)
   - Devuelve respuestas JSON al frontend
   - Maneja errores HTTP
*/

import {
  listarMovimientosService,
  obtenerMovimientoService,
  crearMovimientoService,
  actualizarMovimientoService,
  eliminarMovimientoService,
  buscarMovimientosService
} from "../services/movimientos.service.js";

/* ===============================================================
   2. CONFIGURACIÓN GENERAL
   =============================================================== */

/*
   2.1 Modo desarrollo:
   - Permite logs detallados en consola
   - Se desactiva en producción
*/

const isDevelopment = process.env.NODE_ENV !== "production";

/* ===============================================================
   3. GET - LISTAR MOVIMIENTOS
   =============================================================== */

/*
   3.1 Función:
   - Devuelve todos los movimientos
   - Usa service listarMovimientosService
*/

export const listarMovimientos = async (req, res) => {
  try {
    const data = await listarMovimientosService();

    /* 3.2 Logs en desarrollo */
    if (isDevelopment) {
      console.log("[listarMovimientos] GET /api/movimientos");
      console.log("[listarMovimientos] cantidad:", data.length);
    }

    /* 3.3 Respuesta exitosa */
    res.json({ success: true, data });

  } catch (e) {
    /* 3.4 Error interno */
    res.status(500).json({ success: false, error: e.message });
  }
};

/* ===============================================================
   4. GET - OBTENER POR ID
   =============================================================== */

/*
   4.1 Función:
   - Devuelve un movimiento específico por ID
*/

export const obtenerMovimiento = async (req, res) => {
  try {
    const data = await obtenerMovimientoService(req.params.id);

    /* 4.2 No encontrado */
    if (!data) {
      if (isDevelopment) {
        console.log("[obtenerMovimiento] no encontrado:", req.params.id);
      }

      return res.status(404).json({
        success: false,
        message: "Movimiento no encontrado."
      });
    }

    /* 4.3 Log desarrollo */
    if (isDevelopment) {
      console.log("[obtenerMovimiento] encontrado:", data);
    }

    /* 4.4 Respuesta exitosa */
    res.json({ success: true, data });

  } catch (e) {
    /* 4.5 Error de request (ej: id inválido) */
    res.status(400).json({ success: false, error: e.message });
  }
};

/* ===============================================================
   5. POST - CREAR MOVIMIENTO
   =============================================================== */

/*
   5.1 Función:
   - Crea un nuevo movimiento con req.body
*/

export const crearMovimiento = async (req, res) => {
  try {
    const data = await crearMovimientoService(req.body);

    /* 5.2 Log desarrollo */
    if (isDevelopment) {
      console.log("[crearMovimiento] creado:", data);
    }

    /* 5.3 Respuesta creada */
    res.status(201).json({ success: true, data });

  } catch (e) {
    /* 5.4 Error de validación */
    res.status(400).json({ success: false, error: e.message });
  }
};

/* ===============================================================
   6. PUT - ACTUALIZAR MOVIMIENTO
   =============================================================== */

/*
   6.1 Función:
   - Actualiza movimiento existente por ID
*/

export const actualizarMovimiento = async (req, res) => {
  try {
    const data = await actualizarMovimientoService(req.params.id, req.body);

    /* 6.2 Log desarrollo */
    if (isDevelopment) {
      console.log("[actualizarMovimiento] actualizado:", data);
    }

    /* 6.3 Respuesta exitosa */
    res.json({ success: true, data });

  } catch (e) {
    /* 6.4 Error actualización */
    res.status(400).json({ success: false, error: e.message });
  }
};

/* ===============================================================
   7. DELETE - ELIMINAR MOVIMIENTO
   =============================================================== */

/*
   7.1 Función:
   - Elimina movimiento por ID
*/

export const eliminarMovimiento = async (req, res) => {
  try {
    const deleted = await eliminarMovimientoService(req.params.id);

    /* 7.2 Mensaje según resultado */
    const message = deleted.deleted
      ? "Movimiento eliminado."
      : "Movimiento no encontrado.";

    /* 7.3 Log desarrollo */
    if (isDevelopment) {
      console.log("[eliminarMovimiento] resultado:", deleted);
    }

    /* 7.4 Respuesta */
    res.json({
      success: deleted.deleted,
      data: deleted.data || null,
      message
    });

  } catch (e) {
    /* 7.5 Error request */
    res.status(400).json({ success: false, error: e.message });
  }
};

/* ===============================================================
   8. SEARCH - BUSCAR MOVIMIENTOS
   =============================================================== */

/*
   8.1 Función:
   - Busca movimientos por término genérico
   - Ej: valla, empleado, camión, etc.
*/

export const buscarMovimientos = async (req, res) => {
  try {
    const { term } = req.query;

    const data = await buscarMovimientosService(term);

    /* 8.2 Log búsqueda */
    if (isDevelopment) {
      console.log(`[buscarMovimientos] term="${term}"`);
      console.log("[buscarMovimientos] resultados:", data.length);
    }

    /* 8.3 Respuesta */
    res.json({ success: true, data });

  } catch (e) {
    /* 8.4 Error búsqueda */
    res.status(400).json({ success: false, error: e.message });
  }
};