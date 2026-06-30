// src/routers/uploads.router.js
import { Router } from "express";
import upload from "../middlewares/multer.js";
// Middlewares de autenticación y autorización
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

// ---------------------------------------------------------------
// POST /api/upload → Subir archivo
// ---------------------------------------------------------------
  router.post("/", authenticate, upload.single("file"), async (req, res) => {
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
  try {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "vallas",
    public_id: req.body.codigo || req.file.filename.split(".")[0],
    overwrite: true
  });

  console.log("Cloudinary URL:", result.secure_url);

  res.json({
  success: true,
  url: result.secure_url
});

} catch (error) {
  console.error("Cloudinary error:", error);

  res.status(500).json({
    success: false,
    error: error.message
  });
}
});

export default router;
