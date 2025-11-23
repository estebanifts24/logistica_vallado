// ---------------------------------------------------------------
// Servidor Principal - Express + Firestore Web SDK
// ---------------------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";


// Routers
import authRouter from "./src/routers/auth.router.js";
import vallasRouter from "./src/routers/vallas.router.js";
import operativosRouter from "./src/routers/operativos.router.js";
import movimientosRouter from "./src/routers/movimientos.router.js";
import camionesRouter from "./src/routers/camiones.router.js";
import empleadosRouter from "./src/routers/empleados.router.js";
import usuariosRouter from "./src/routers/usuarios.router.js";
import upload from "./src/multer.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------
// Middlewares globales
// ------------------------
app.use(cors());
app.use(express.json());

// Logging de cada request
app.use((req, res, next) => {
  console.log("\n========= NUEVA PETICIÓN =========");
  console.log("Fecha:", new Date().toISOString());
  console.log("Método:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Content-Type:", req.headers["content-type"] || "No especificado");
  console.log("==================================\n");
  next();
});

// ------------------------
// Rutas base
// ------------------------
app.get("/", (req, res) => {
  res.json({ mensaje: "API REST funcionando correctamente en /" });
});

// ------------------------
// Endpoint de prueba para subida de archivos (Multer)
// ------------------------
app.post("/api/upload", upload.single("file"), (req, res) => {
  // En desarrollo
  if (req.file?.path) {
    return res.json({
      success: true,
      message: "Archivo guardado LOCALMENTE",
      path: req.file.path,
    });
  }
  // En producción (Vercel)
  if (req.file?.buffer) {
    return res.json({
      success: true,
      message: "Archivo recibido en MEMORIA (VERCEL)",
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  }

  res.status(400).json({ success: false, error: "No se recibió archivo" });
});



// ------------------------
// Routers
// ------------------------
app.use("/api/auth", authRouter);
app.use("/api/vallas", vallasRouter);
app.use("/api/operativos", operativosRouter);
app.use("/api/movimientos", movimientosRouter);
app.use("/api/camiones", camionesRouter);
app.use("/api/empleados", empleadosRouter);
app.use("/api/usuarios", usuariosRouter);


// ------------------------
// 404
// ------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Ruta NO encontrada", ruta: req.originalUrl });
});

// ------------------------
// Manejo global de errores
// ------------------------
app.use((err, req, res, next) => {
  console.error("Error global:", err.message);
  const respuesta = { error: "Error interno del servidor", mensaje: err.message };
  if (process.env.NODE_ENV !== "production") respuesta.stack = err.stack;
  res.status(500).json(respuesta);
});

// ------------------------
// Inicializar servidor
// ------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
