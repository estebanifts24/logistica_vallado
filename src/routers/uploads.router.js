// src/routers/uploads.router.js
import { Router } from "express";
import upload from "../middlewares/multer.js";

const router = Router();

// ---------------------------------------------------------------
// POST /api/upload → Subir archivo
// ---------------------------------------------------------------
router.post("/", upload.single("file"), (req, res) => {
  // ❌ Si Multer no recibió el archivo
  if (!req.file) return res.status(400).json({ error: "Archivo no recibido" });

  // 🔹 Logging en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log("POST /api/upload -> Archivo recibido correctamente");
    console.log("Nombre del archivo:", req.file.filename);
    console.log("Ruta completa en proyecto:", req.file.path);
    console.log("Tamaño:", req.file.size, "bytes");
    console.log("Mimetype:", req.file.mimetype);
  }

  // ✅ Respuesta JSON al cliente
  res.json({
    success: true,
    message: "Archivo guardado LOCALMENTE",
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

export default router;
