import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar entorno
const isProduction = process.env.NODE_ENV === "production";

// ------------------------
// Storage según el entorno
// ------------------------
let storage;

if (!isProduction) {
  // Desarrollo → guardar en /uploads
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "uploads")); // Carpeta donde se guardan archivos
    },
    filename: (req, file, cb) => {
      // Crear nombre único para evitar sobrescribir
      const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      cb(null, uniqueName);
    },
  });
} else {
  // Producción → Vercel → memoria
  storage = multer.memoryStorage();
}

// ------------------------
// Filtro de archivos
// ------------------------
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPEG o PNG"));
  }
};

// ------------------------
// Exportar middleware Multer
// ------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // límite 5MB por archivo
});

export default upload;
