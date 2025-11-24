// src/middlewares/multer.js
import multer from "multer";        // Librería para manejar subida de archivos
import path from "path";            // Módulo de Node para manejar rutas de archivos
import { fileURLToPath } from "url"; // Para obtener __dirname en ES Modules

// ---------------------------------------------------------------
// Obtener la ruta del archivo actual y la carpeta del proyecto
// ---------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------
// Función auxiliar: formatear fecha a "YYYY-MM-DD_HH-MM-SS"
// ---------------------------------------------------------------
const formatDateForFilename = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
};

// ---------------------------------------------------------------
// Middleware de almacenamiento de Multer
// ---------------------------------------------------------------
const storage = multer.diskStorage({
  // Carpeta donde se guardarán los archivos
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Ahora apunta a /src/uploads
    if (process.env.NODE_ENV === "development") {
      console.log("Archivo se guardará en:", uploadPath);
    }
    cb(null, uploadPath);
  },
  // Nombre único legible del archivo
  filename: (req, file, cb) => {
    const formattedDate = formatDateForFilename(); // Fecha legible
    const cleanOriginalName = file.originalname.replace(/\s+/g, "_");
    const finalName = `${formattedDate}-${cleanOriginalName}`; // Ej: 2025-11-23_14-05-33-river.jpg
    if (process.env.NODE_ENV === "development") {
      console.log("Nombre del archivo guardado:", finalName);
    }
    cb(null, finalName);
  },
});

// ---------------------------------------------------------------
// Filtro de archivos permitidos
// ---------------------------------------------------------------
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Solo imágenes
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    if (process.env.NODE_ENV === "development") console.log("Archivo aceptado:", file.originalname);
    cb(null, true);
  } else {
    if (process.env.NODE_ENV === "development") console.log("Archivo rechazado:", file.originalname);
    cb(new Error("Solo se permiten imágenes JPEG o PNG"));
  }
};

// ---------------------------------------------------------------
// Exportar la instancia de multer lista para usar en routers
// ---------------------------------------------------------------
const upload = multer({ storage, fileFilter });
export default upload;
